'use client';

import React, { useState, useEffect } from 'react';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { sessionService } from '@/services/session.service';
import { reportingService } from '@/services/reporting.service';
import { locationService } from '@/services/location.service';
import { stationService } from '@/services/station.service';
import {
  Calendar,
  Download,
  FileSpreadsheet,
  ArrowLeft,
  X,
  Zap,
  Clock,
  MapPin,
} from 'lucide-react';
import { DatePicker } from '@/components/shared/DatePicker';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { startOfDay, endOfDay } from 'date-fns';
import { ReportTypeSelector } from './reports/ReportTypeSelector';
import { LocationStationTree } from './reports/LocationStationTree';
import { ColumnsSelector } from './reports/ColumnsSelector';
import { cn } from '@/lib/utils';

interface DownloadReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'select-type' | 'configure-sessions' | 'configure-intervals';
type IntervalExportType = 'flat' | 'aggregated';

const AVAILABLE_COLUMNS = [
  { id: 'id', label: 'Session ID' },
  { id: 'transactionId', label: 'Transaction ID' },
  { id: 'evseId', label: 'EVSE ID' },
  { id: 'stationId', label: 'Station ID' },
  { id: 'stationName', label: 'Station Name' },
  { id: 'locationId', label: 'Location ID' },
  { id: 'locationName', label: 'Location Name' },
  { id: 'userFirstName', label: 'User First Name' },
  { id: 'userLastName', label: 'User Last Name' },
  { id: 'connectorId', label: 'Connector ID' },
  { id: 'connectorType', label: 'Connector Type' },
  { id: 'connectorMaxPower', label: 'Connector Max Power' },
  { id: 'pluggedAt', label: 'Plugged At' },
  { id: 'startTime', label: 'Start Time' },
  { id: 'endTime', label: 'End Time' },
  { id: 'unpluggedAt', label: 'Unplugged At' },
  { id: 'durationMinutes', label: 'Duration (Minutes)' },
  { id: 'energyDeliveredKwh', label: 'Energy Delivered (kWh)' },
  { id: 'co2Emitted', label: 'CO2 Emitted (kg)' },
  { id: 'currentSpeed', label: 'Speed (kW)' },
  { id: 'peakKwh', label: 'Peak Power (kW)' },
  { id: 'status', label: 'Status' },
];

const DEFAULT_COLUMNS = [
  'id',
  'transactionId',
  'evseId',
  'stationId',
  'stationName',
  'locationId',
  'locationName',
  'userFirstName',
  'userLastName',
  'connectorId',
  'connectorType',
  'connectorMaxPower',
  'startTime',
  'endTime',
  'durationMinutes',
  'energyDeliveredKwh',
  'status',
];

export function DownloadReportsModal({ isOpen, onClose }: DownloadReportsModalProps) {
  const [step, setStep] = useState<Step>('select-type');
  const [isExporting, setIsExporting] = useState(false);
  const { environment } = useEnvironment();

  // Sessions Configuration State
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);

  // Intervals Configuration State
  const [intervalMinutes, setIntervalMinutes] = useState<15 | 30 | 60>(15);
  const [intervalExportType, setIntervalExportType] = useState<IntervalExportType>('flat');

  // Hierarchical Filter State (shared by both steps)
  const [locations, setLocations] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(false);
  const [expandedLocationIds, setExpandedLocationIds] = useState<Set<string>>(new Set());
  const [selectedLocationIds, setSelectedLocationIds] = useState<Set<string>>(new Set());
  const [selectedStationIds, setSelectedStationIds] = useState<Set<string>>(new Set());

  // Default date range: Last 7 days to now
  const getInitialDateRange = () => {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    from.setHours(0, 0, 0, 0);
    const to = new Date();
    return { from, to };
  };

  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>(getInitialDateRange());

  // Fetch locations and stations when entering any configure step
  useEffect(() => {
    if (isOpen && (step === 'configure-sessions' || step === 'configure-intervals')) {
      const fetchData = async () => {
        try {
          setIsLoadingTree(true);
          const [locData, staData] = await Promise.all([
            locationService.getAllLocations(environment),
            stationService.getAllStations(environment),
          ]);
          setLocations(locData || []);
          setStations(staData || []);

          // Automatically expand all locations for convenient browsing
          if (locData) {
            setExpandedLocationIds(new Set(locData.map((l: any) => l.id)));
          }
        } catch (err) {
          console.error('Failed to load locations/stations for CSV export:', err);
          toast.error('Failed to load locations or stations.');
        } finally {
          setIsLoadingTree(false);
        }
      };
      fetchData();
    }
  }, [isOpen, step, environment]);

  const handleClose = () => {
    setStep('select-type');
    setSelectedColumns(DEFAULT_COLUMNS);
    setIntervalMinutes(15);
    setIntervalExportType('flat');
    setDateRange(getInitialDateRange());
    setSelectedLocationIds(new Set());
    setSelectedStationIds(new Set());
    setExpandedLocationIds(new Set());
    onClose();
  };

  const handleExportIntervals = async () => {
    try {
      setIsExporting(true);
      toast.loading('Generating interval report...', { id: 'export-intervals' });

      const stationIdsParam = Array.from(selectedStationIds).join(',') || undefined;
      const locationIdsParam = Array.from(selectedLocationIds).join(',') || undefined;

      const params = {
        startFrom: dateRange.from ? startOfDay(dateRange.from).toISOString() : undefined,
        startTo: dateRange.to ? endOfDay(dateRange.to).toISOString() : undefined,
        intervalMinutes,
        env: environment,
        stationIds: stationIdsParam,
        locationIds: locationIdsParam,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };

      if (intervalExportType === 'flat') {
        await reportingService.exportIntervalSlicesCsv(params);
      } else {
        await reportingService.exportAggregatedCsv(params);
      }

      toast.success('Interval report downloaded!', { id: 'export-intervals' });
      handleClose();
    } catch (error) {
      console.error('Failed to export interval report:', error);
      toast.error('Failed to generate interval report. Please try again.', { id: 'export-intervals' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectAllColumns = () => {
    setSelectedColumns(AVAILABLE_COLUMNS.map((col) => col.id));
  };

  const handleDeselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleColumnToggle = (columnId: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns((prev) => [...prev, columnId]);
    } else {
      setSelectedColumns((prev) => prev.filter((id) => id !== columnId));
    }
  };

  const handleLocationCheck = (locationId: string, checked: boolean) => {
    const stationIdsInLoc = stations.filter((s) => s.locationId === locationId).map((s) => s.id);

    setSelectedLocationIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(locationId);
      } else {
        next.delete(locationId);
      }
      return next;
    });

    setSelectedStationIds((prev) => {
      const next = new Set(prev);
      stationIdsInLoc.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  };

  const handleStationCheck = (stationId: string, locationId: string, checked: boolean) => {
    setSelectedStationIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(stationId);
      } else {
        next.delete(stationId);
      }

      // Check if all stations of this location are selected
      const stationIdsInLoc = stations.filter((s) => s.locationId === locationId).map((s) => s.id);
      const allChecked = stationIdsInLoc.length > 0 && stationIdsInLoc.every((id) => next.has(id));

      setSelectedLocationIds((locPrev) => {
        const locNext = new Set(locPrev);
        if (allChecked) {
          locNext.add(locationId);
        } else {
          locNext.delete(locationId);
        }
        return locNext;
      });

      return next;
    });
  };

  const toggleLocationExpand = (locationId: string) => {
    setExpandedLocationIds((prev) => {
      const next = new Set(prev);
      if (next.has(locationId)) {
        next.delete(locationId);
      } else {
        next.add(locationId);
      }
      return next;
    });
  };

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast.error('Please select at least one column to export.');
      return;
    }

    try {
      setIsExporting(true);
      toast.loading('Generating report and fetching data...', { id: 'export-csv' });

      const locationIdsParam = Array.from(selectedLocationIds).join(',');
      const stationIdsParam = Array.from(selectedStationIds).join(',');

      // Convert Date objects to ISO strings
      const params = {
        startFrom: dateRange.from ? startOfDay(dateRange.from).toISOString() : undefined,
        startTo: dateRange.to ? endOfDay(dateRange.to).toISOString() : undefined,
        columns: selectedColumns,
        env: environment,
        locationIds: locationIdsParam || undefined,
        stationIds: stationIdsParam || undefined,
      };

      const csvBlob = await reportingService.exportSessions(params);

      // Axios response handles returning the blob
      const url = window.URL.createObjectURL(new Blob([csvBlob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `charging-sessions-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully!', { id: 'export-csv' });
      handleClose();
    } catch (error) {
      console.error('Failed to export report:', error);
      toast.error('Failed to generate report. Please try again.', { id: 'export-csv' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={false}
      size="3xl"
    >
      <div className="flex items-start justify-between border-b border-border/60 pb-5 mb-5">
        <div className="flex items-center gap-3">
          {(step === 'configure-sessions' || step === 'configure-intervals') && (
            <button
              onClick={() => setStep('select-type')}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" /> Export Reports
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {step === 'select-type'
                ? 'Select a report type to begin your data export.'
                : step === 'configure-intervals'
                  ? 'Configure interval size, type, and date range for your interval export.'
                  : 'Configure parameters, filters, and custom fields for your CSV export.'}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {step === 'select-type' && (
        <ReportTypeSelector onSelectStep={setStep} />
      )}

      {step === 'configure-intervals' && (
        <div className="space-y-5 py-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-emerald-500" /> Date Range
            </Label>
            <DatePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="w-full"
            />
          </div>

          {/* Interval Size */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-500" /> Interval Size
            </Label>
            <div className="flex gap-2 max-w-md">
              {([15, 30, 60] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setIntervalMinutes(m)}
                  className={cn(
                    `flex-1 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer`,
                    intervalMinutes === m
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                      : 'border-border bg-muted/20 text-muted-foreground hover:bg-muted/40',
                  )}
                >
                  {m}min
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground rounded-xl border border-border bg-muted/20 px-4 py-2.5 leading-relaxed">
            📊 Flat Slices — one row per session per interval block. Best for per-transaction compliance or billing verification.
          </p>

          {/* Location / Station filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-500" /> Locations &amp; Stations
              </Label>
              {selectedStationIds.size > 0 && (
                <span className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                  {selectedStationIds.size} stations selected
                </span>
              )}
            </div>
            <div className="min-h-[160px] max-h-[200px] overflow-y-auto custom-scrollbar border border-border rounded-xl bg-muted/10 p-3 space-y-1">
              <LocationStationTree
                locations={locations}
                stations={stations}
                isLoadingTree={isLoadingTree}
                selectedLocationIds={selectedLocationIds}
                selectedStationIds={selectedStationIds}
                expandedLocationIds={expandedLocationIds}
                onLocationCheck={handleLocationCheck}
                onStationCheck={handleStationCheck}
                onToggleExpand={toggleLocationExpand}
                accentColor="emerald"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <Button variant="ghost" onClick={handleClose} disabled={isExporting}>
              Cancel
            </Button>
            <Button
              onClick={handleExportIntervals}
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Intervals CSV'}
            </Button>
          </div>
        </div>
      )}

      {step === 'configure-sessions' && (
        <div className="space-y-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
            {/* Left Column: Date range and Location Tree browser */}
            <div className="space-y-5 flex flex-col min-h-0">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" /> Date Range
                </Label>
                <DatePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  className="w-full"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" /> Locations & Stations
                  </Label>
                  {selectedStationIds.size > 0 && (
                    <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                      {selectedStationIds.size} stations
                    </span>
                  )}
                </div>

                <div className="flex-1 min-h-[220px] max-h-[260px] overflow-y-auto custom-scrollbar border border-border rounded-xl bg-muted/10 p-3 space-y-1">
                  <LocationStationTree
                    locations={locations}
                    stations={stations}
                    isLoadingTree={isLoadingTree}
                    selectedLocationIds={selectedLocationIds}
                    selectedStationIds={selectedStationIds}
                    expandedLocationIds={expandedLocationIds}
                    onLocationCheck={handleLocationCheck}
                    onStationCheck={handleStationCheck}
                    onToggleExpand={toggleLocationExpand}
                    accentColor="primary"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Column Fields Selector */}
            <div className="h-full">
              <ColumnsSelector
                availableColumns={AVAILABLE_COLUMNS}
                selectedColumns={selectedColumns}
                onColumnToggle={handleColumnToggle}
                onSelectAll={handleSelectAllColumns}
                onDeselectAll={handleDeselectAllColumns}
              />
            </div>
          </div>

          {/* Dialog Footer Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
        </div>
      )}
    </AnimatedModal>
  );
}
