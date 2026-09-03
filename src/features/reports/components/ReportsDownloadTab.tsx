'use client';

import { useState, useEffect } from 'react';
import { DatePicker } from '@/components/shared/DatePicker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { startOfDay, endOfDay } from 'date-fns';
import {
  Download,
  MapPin,
  Calendar,
  ArrowLeft,
  Clock,
  BarChart2,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useEnvironment, isSiteManagerUser } from '@/contexts/EnvironmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { reportingService } from '@/services/reporting.service';
import { stationService } from '@/services/station.service';
import { locationService } from '@/services/location.service';

import { getDashboardSavedDateRange } from '@/lib/date';

// Import the reusable report selection components
import { ReportTypeSelector, Step as DownloadStep } from '@/features/dashboard/components/reports/ReportTypeSelector';
import { LocationStationTree } from '@/features/dashboard/components/reports/LocationStationTree';
import { ColumnsSelector } from '@/features/dashboard/components/reports/ColumnsSelector';

const SITE_MANAGER_COLUMNS = [
  'id',
  'driverEmail',
  'stationName',
  'startTime',
  'endTime',
  'durationMinutes',
  'energyDeliveredKwh',
  'totalCost',
  'status',
];

const AVAILABLE_COLUMNS = [
  { id: 'id', label: 'Charge event ID' },
  { id: 'transactionId', label: 'Transaction ID' },
  { id: 'evseId', label: 'EVSE ID' },
  { id: 'stationId', label: 'Station ID' },
  { id: 'stationName', label: 'Station Name' },
  { id: 'locationId', label: 'Location ID' },
  { id: 'locationName', label: 'Location Name' },
  { id: 'userFirstName', label: 'User First Name' },
  { id: 'userLastName', label: 'User Last Name' },
  { id: 'driverEmail', label: 'Driver Email' },
  { id: 'connectorId', label: 'Port ID' },
  { id: 'connectorType', label: 'Connector Type' },
  { id: 'connectorMaxPower', label: 'Port Maximum Kw' },
  { id: 'pluggedAt', label: 'Connection start datetime' },
  { id: 'startTime', label: 'Charge sesssion start datetime' },
  { id: 'endTime', label: 'Charge session end datetime' },
  { id: 'unpluggedAt', label: 'Connection end datetime' },
  { id: 'durationMinutes', label: 'Duration (Minutes)' },
  { id: 'energyDeliveredKwh', label: 'Energy consumed' },
  { id: 'totalCost', label: 'Total Cost' },
  { id: 'co2Emitted', label: 'CO2 Emitted (kg)' },
  { id: 'currentSpeed', label: 'Speed (kW)' },
  { id: 'peakKwh', label: 'Peak Power (kW)' },
  { id: 'vehicleMake', label: 'Vehicle make' },
  { id: 'vehicleModel', label: 'Vehicle model' },
  { id: 'vehicleYear', label: 'Vehicle year' },
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

const CALSTART_SESSION_COLUMNS = [
  'id',
  'evseId',
  'connectorId',
  'connectorMaxPower',
  'pluggedAt',
  'unpluggedAt',
  'startTime',
  'endTime',
  'energyDeliveredKwh',
  'vehicleMake',
  'vehicleModel',
  'vehicleYear',
];

const CALSTART_INTERVAL_COLUMNS = [
  'sessionId',
  'intervalId',
  'intervalStart',
  'intervalEnd',
  'peakKw',
  'avgKw',
  'idleDurationSeconds',
];

const AVAILABLE_INTERVAL_COLUMNS = [
  { id: 'intervalId', label: 'Interval ID' },
  { id: 'intervalStart', label: 'Interval start datetime' },
  { id: 'intervalEnd', label: 'Interval end datetime' },
  { id: 'intervalLabel', label: 'Interval Label' },
  { id: 'sessionId', label: 'Charge event ID' },
  { id: 'transactionId', label: 'Transaction ID' },
  { id: 'evseId', label: 'EVSE ID' },
  { id: 'stationId', label: 'Station ID' },
  { id: 'stationName', label: 'Station Name' },
  { id: 'locationId', label: 'Location ID' },
  { id: 'locationName', label: 'Location Name' },
  { id: 'energyKwh', label: 'Energy (kWh)' },
  { id: 'peakKw', label: 'Interval peak demand' },
  { id: 'avgKw', label: 'Interval average demand' },
  { id: 'overlapMinutes', label: 'Overlap (min)' },
  { id: 'dataSource', label: 'Data Source' },
  { id: 'totalTimeSeconds', label: 'Total Time (sec)' },
  { id: 'excludedTimeSeconds', label: 'Excluded Time (sec)' },
  { id: 'outageTimeSeconds', label: 'Outage Time (sec)' },
  { id: 'uptimePercentage', label: 'Uptime (%)' },
  { id: 'idleDurationSeconds', label: 'Idle Duration (sec)' },
];

const DEFAULT_INTERVAL_COLUMNS = [
  'intervalId',
  'intervalStart',
  'intervalEnd',
  'sessionId',
  'stationId',
  'stationName',
  'locationId',
  'locationName',
  'energyKwh',
  'peakKw',
  'avgKw',
  'overlapMinutes',
  'idleDurationSeconds',
];

export function ReportsDownloadTab() {
  const { environment } = useEnvironment();
  const { user } = useAuth();
  const isSiteManager = isSiteManagerUser(user);

  // Tab 1 (Report Downloading) logic states
  const [downloadStep, setDownloadStep] = useState<DownloadStep>('select-type');
  const [isExporting, setIsExporting] = useState(false);

  // Sessions Configuration State
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);

  // Intervals Configuration State
  const [intervalMinutes, setIntervalMinutes] = useState<15 | 30 | 60>(15);
  const [intervalExportType, setIntervalExportType] = useState<'flat' | 'aggregated'>('flat');
  const [selectedIntervalColumns, setSelectedIntervalColumns] = useState<string[]>(DEFAULT_INTERVAL_COLUMNS);

  // Recipient Preset State
  const [exportForRecipient, setExportForRecipient] = useState<boolean>(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>('calstart');

  // Hierarchical Filter State (shared by configuration steps)
  const [treeLocations, setTreeLocations] = useState<any[]>([]);
  const [treeStations, setTreeStations] = useState<any[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(false);
  const [expandedLocationIds, setExpandedLocationIds] = useState<Set<string>>(new Set());
  const [selectedLocationIds, setSelectedLocationIds] = useState<Set<string>>(new Set());
  const [selectedStationIds, setSelectedStationIds] = useState<Set<string>>(new Set());

  // Date range pre-populated from Dashboard filter selection
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>(getDashboardSavedDateRange({ forReports: true }));

  useEffect(() => {
    setDateRange(getDashboardSavedDateRange({ forReports: true }));
  }, []);

  // Fetch locations and stations when entering any configuration step
  useEffect(() => {
    if (downloadStep !== 'select-type') {
      const fetchData = async () => {
        try {
          setIsLoadingTree(true);
          const [rawLocData, rawStaData] = await Promise.all([
            locationService.getAllLocations(environment),
            stationService.getAllStations(environment),
          ]);
          const locList = Array.isArray(rawLocData) ? rawLocData : (rawLocData?.items || []);
          const staList = Array.isArray(rawStaData) ? rawStaData : (rawStaData?.items || []);
          setTreeLocations(locList);
          setTreeStations(staList);

          // Automatically expand all locations
          if (locList.length > 0) {
            setExpandedLocationIds(new Set(locList.map((l: any) => l.id)));
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
  }, [downloadStep, environment]);

  const handleStepReset = () => {
    setDownloadStep('select-type');
    setSelectedColumns(DEFAULT_COLUMNS);
    setIntervalMinutes(15);
    setIntervalExportType('flat');
    setSelectedIntervalColumns(DEFAULT_INTERVAL_COLUMNS);
    setExportForRecipient(false);
    setSelectedRecipient('calstart');
    setDateRange(getDashboardSavedDateRange({ forReports: true }));
    setSelectedLocationIds(new Set());
    setSelectedStationIds(new Set());
    setExpandedLocationIds(new Set());
  };

  const handleExportForRecipientToggle = (checked: boolean) => {
    setExportForRecipient(checked);
    if (checked) {
      if (selectedRecipient === 'calstart') {
        setSelectedColumns(CALSTART_SESSION_COLUMNS);
        setSelectedIntervalColumns(CALSTART_INTERVAL_COLUMNS);
      }
    } else {
      setSelectedColumns(DEFAULT_COLUMNS);
      setSelectedIntervalColumns(DEFAULT_INTERVAL_COLUMNS);
    }
  };

  const handleRecipientChange = (recipient: string) => {
    setSelectedRecipient(recipient);
    if (exportForRecipient) {
      if (recipient === 'calstart') {
        setSelectedColumns(CALSTART_SESSION_COLUMNS);
        setSelectedIntervalColumns(CALSTART_INTERVAL_COLUMNS);
      }
    }
  };

  const handleExportSessions = async () => {
    const columnsToExport = isSiteManager ? SITE_MANAGER_COLUMNS : selectedColumns;

    if (columnsToExport.length === 0) {
      toast.error('Please select at least one column to export.');
      return;
    }

    try {
      setIsExporting(true);
      toast.loading('Generating sessions report...', { id: 'export-csv' });

      const locationIdsParam = Array.from(selectedLocationIds).join(',');
      const stationIdsParam = Array.from(selectedStationIds).join(',');

      const params = {
        startFrom: dateRange.from ? startOfDay(dateRange.from).toISOString() : undefined,
        startTo: dateRange.to ? endOfDay(dateRange.to).toISOString() : undefined,
        columns: columnsToExport,
        env: environment,
        locationIds: locationIdsParam || undefined,
        stationIds: stationIdsParam || undefined,
      };

      const csvBlob = await reportingService.exportSessions(params);

      const url = window.URL.createObjectURL(new Blob([csvBlob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `charging-sessions-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully!', { id: 'export-csv' });
      handleStepReset();
    } catch (error) {
      console.error('Failed to export sessions report:', error);
      toast.error('Failed to generate report. Please try again.', { id: 'export-csv' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportIntervals = async () => {
    if (intervalExportType === 'flat' && selectedIntervalColumns.length === 0) {
      toast.error('Please select at least one column to export.');
      return;
    }

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
        const csvBlob = await reportingService.exportIntervalsCsv({
          ...params,
          columns: selectedIntervalColumns,
        });
        const url = window.URL.createObjectURL(new Blob([csvBlob], { type: 'text/csv' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `interval-slices-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        await reportingService.exportAggregatedCsv(params);
      }

      toast.success('Interval report downloaded!', { id: 'export-intervals' });
      handleStepReset();
    } catch (error) {
      console.error('Failed to export interval report:', error);
      toast.error('Failed to generate interval report. Please try again.', { id: 'export-intervals' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDowntime = async () => {
    try {
      setIsExporting(true);
      toast.loading('Generating downtime report...', { id: 'export-downtime' });

      const stationIdsParam = Array.from(selectedStationIds).join(',') || undefined;
      const locationIdsParam = Array.from(selectedLocationIds).join(',') || undefined;

      const params = {
        startFrom: dateRange.from ? startOfDay(dateRange.from).toISOString() : undefined,
        startTo: dateRange.to ? endOfDay(dateRange.to).toISOString() : undefined,
        env: environment,
        stationIds: stationIdsParam,
        locationIds: locationIdsParam,
      };

      const csvBlob = await reportingService.exportDowntime(params);

      const url = window.URL.createObjectURL(new Blob([csvBlob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `station-downtime-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Downtime report downloaded successfully!', { id: 'export-downtime' });
      handleStepReset();
    } catch (error) {
      console.error('Failed to export downtime report:', error);
      toast.error('Failed to generate downtime report. Please try again.', { id: 'export-downtime' });
    } finally {
      setIsExporting(false);
    }
  };

  // Tree functions
  const handleLocationCheck = (locationId: string, checked: boolean) => {
    const stationIdsInLoc = treeStations.filter((s) => s.locationId === locationId).map((s) => s.id);

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
      const stationIdsInLoc = treeStations.filter((s) => s.locationId === locationId).map((s) => s.id);
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

  return (
    <Card className="bg-card/40 border-border/40 backdrop-blur-md rounded-2xl shadow-md p-4 sm:p-6">
      {/* Step Header */}
      {downloadStep !== 'select-type' && (
        <div className="flex items-start sm:items-center gap-3 border-b border-border/60 pb-4 sm:pb-5 mb-4 sm:mb-5">
          <button
            onClick={handleStepReset}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            {(() => {
              let headerTextColor = 'text-primary';
              let HeaderIcon = FileSpreadsheet;
              let headerDescription = 'Configure parameters, filters, and custom fields for your CSV export.';

              switch (downloadStep) {
                case 'configure-downtime':
                  headerTextColor = 'text-amber-500';
                  HeaderIcon = Clock;
                  headerDescription = 'Configure date range and filters for station downtime CSV export.';
                  break;
                case 'configure-intervals':
                  headerTextColor = 'text-emerald-500';
                  HeaderIcon = BarChart2;
                  headerDescription = 'Configure interval size, type, and date range for your interval export.';
                  break;
                case 'configure-sessions':
                default:
                  headerTextColor = 'text-primary';
                  HeaderIcon = FileSpreadsheet;
                  headerDescription = 'Configure parameters, filters, and custom fields for your CSV export.';
                  break;
              }

              return (
                <>
                  <h2 className={cn("text-lg sm:text-xl font-bold flex items-center gap-2", headerTextColor)}>
                    <HeaderIcon className={cn("h-5 w-5 shrink-0", headerTextColor)} />
                    Configure Export
                  </h2>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                    {headerDescription}
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Step 1: Select Type */}
      {downloadStep === 'select-type' && (
        <div className="space-y-4">
          <div className="pb-3 border-b border-border/40">
            <h2 className="text-base sm:text-lg font-bold">Export Reports</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Select a report type to begin your data export.</p>
          </div>
          <ReportTypeSelector onSelectStep={setDownloadStep} />
        </div>
      )}

      {/* Step 2: Configure Intervals */}
      {downloadStep === 'configure-intervals' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            {/* Left Column */}
            <div className="space-y-5 flex flex-col min-h-0">
              {/* Date Range */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-emerald-500" /> Date Range
                </Label>
                <DatePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  className="w-full"
                  accentColor="emerald"
                />
              </div>

              {/* Interval Size */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-500" /> Interval Size
                </Label>
                <div className="flex gap-2 w-full max-w-md">
                  {([15, 30, 60] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setIntervalMinutes(m)}
                      className={cn(
                        `flex-1 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer`,
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

              <p className="text-xs text-muted-foreground rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 leading-relaxed">
                📊 Flat Slices — one row per session per interval block. Best for per-transaction compliance or billing verification.
              </p>

              {/* Locations & Stations */}
              <div className="space-y-2 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between">
                  <Label className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-500" /> Locations &amp; Stations
                  </Label>
                  {selectedStationIds.size > 0 && (
                    <span className="text-[10px] sm:text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                      {selectedStationIds.size} stations selected
                    </span>
                  )}
                </div>
                <div className="flex-1 min-h-[180px] max-h-[220px] overflow-y-auto custom-scrollbar-emerald border border-border rounded-xl bg-muted/10 p-3 space-y-1">
                  <LocationStationTree
                    locations={treeLocations}
                    stations={treeStations}
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
            </div>

            {/* Right Column */}
            <div className="h-full flex flex-col gap-4">
              {/* Preset Switcher */}
              <div className="rounded-xl border border-border bg-muted/5 p-3 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold text-foreground/90">
                      Export for specific recipient
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Pre-selects required columns for compliance.
                    </p>
                  </div>
                  <Switch
                    checked={exportForRecipient}
                    onCheckedChange={handleExportForRecipientToggle}
                  />
                </div>

                {exportForRecipient && (
                  <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                    <Label className="text-xs text-muted-foreground whitespace-nowrap">
                      Recipient:
                    </Label>
                    <Select
                      value={selectedRecipient}
                      onValueChange={handleRecipientChange}
                    >
                      <SelectTrigger className="w-full h-8 text-xs bg-muted/20 border-border/60 hover:bg-muted/40">
                        <SelectValue placeholder="Select Recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calstart">CALSTART</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex-1 min-h-0">
                <ColumnsSelector
                  availableColumns={AVAILABLE_INTERVAL_COLUMNS}
                  selectedColumns={selectedIntervalColumns}
                  onColumnToggle={(colId, checked) => {
                    if (checked) {
                      setSelectedIntervalColumns((prev) => [...prev, colId]);
                    } else {
                      setSelectedIntervalColumns((prev) => prev.filter((id) => id !== colId));
                    }
                  }}
                  onSelectAll={() => setSelectedIntervalColumns(AVAILABLE_INTERVAL_COLUMNS.map(c => c.id))}
                  onDeselectAll={() => setSelectedIntervalColumns([])}
                  disabled={exportForRecipient}
                  accentColor="emerald"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3 border-t border-border">
            <Button variant="ghost" onClick={handleStepReset} disabled={isExporting} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={handleExportIntervals}
              disabled={isExporting}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Intervals CSV'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Configure Downtime */}
      {downloadStep === 'configure-downtime' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            {/* Left Column */}
            <div className="space-y-5 flex flex-col min-h-0">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-amber-500" /> Date Range
                </Label>
                <DatePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  className="w-full"
                  accentColor="amber"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between">
                  <Label className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-amber-500" /> Locations &amp; Stations
                  </Label>
                  {selectedStationIds.size > 0 && (
                    <span className="text-[10px] sm:text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-full">
                      {selectedStationIds.size} stations
                    </span>
                  )}
                </div>

                <div className="flex-1 min-h-[220px] max-h-[260px] overflow-y-auto custom-scrollbar-amber border border-border rounded-xl bg-muted/10 p-3 space-y-1">
                  <LocationStationTree
                    locations={treeLocations}
                    stations={treeStations}
                    isLoadingTree={isLoadingTree}
                    selectedLocationIds={selectedLocationIds}
                    selectedStationIds={selectedStationIds}
                    expandedLocationIds={expandedLocationIds}
                    onLocationCheck={handleLocationCheck}
                    onStationCheck={handleStationCheck}
                    onToggleExpand={toggleLocationExpand}
                    accentColor="amber"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="h-full flex flex-col gap-4 justify-between">
              <div className="rounded-xl border border-border bg-muted/5 p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-foreground/90 mb-1">
                    Downtime Report Details
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This report compiles downtime intervals across all stations within the selected range and locations, grouped by unique station downtime events.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-foreground/80">
                    Included Columns:
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-foreground/90">EVSE ID</span>
                        <p className="text-[11px] text-muted-foreground">The station's physical hardware serial number.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-foreground/90">Downtime reason</span>
                        <p className="text-[11px] text-muted-foreground">Reason code or category for the downtime event.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-foreground/90">Event start datetime</span>
                        <p className="text-[11px] text-muted-foreground">Start of the downtime event (MM/DD/YYYY HH:MM:SS).</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-foreground/90">Event end datetime</span>
                        <p className="text-[11px] text-muted-foreground">End of the downtime event (MM/DD/YYYY HH:MM:SS).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3 border-t border-border">
            <Button variant="ghost" onClick={handleStepReset} disabled={isExporting} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={handleExportDowntime}
              disabled={isExporting}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Downtime CSV'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Configure Sessions */}
      {downloadStep === 'configure-sessions' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            {/* Left Column */}
            <div className="space-y-5 flex flex-col min-h-0">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" /> Date Range
                </Label>
                <DatePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  className="w-full"
                  accentColor="primary"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between">
                  <Label className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" /> Locations &amp; Stations
                  </Label>
                  {selectedStationIds.size > 0 && (
                    <span className="text-[10px] sm:text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                      {selectedStationIds.size} stations
                    </span>
                  )}
                </div>

                <div className="flex-1 min-h-[220px] max-h-[260px] overflow-y-auto custom-scrollbar border border-border rounded-xl bg-muted/10 p-3 space-y-1">
                  <LocationStationTree
                    locations={treeLocations}
                    stations={treeStations}
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

            {/* Right Column */}
            <div className="h-full flex flex-col gap-4">
              {isSiteManager ? (
                <div className="flex-1 rounded-xl border border-border bg-muted/10 p-4 flex flex-col gap-3 min-h-[300px]">
                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <Label className="text-xs font-semibold text-foreground/90 flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-primary" /> Included Export Fields ({SITE_MANAGER_COLUMNS.length})
                    </Label>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Standard Export
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The following fixed fields will be included in your CSV export:
                  </p>
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[320px] custom-scrollbar">
                    {SITE_MANAGER_COLUMNS.map((colId) => {
                      const colDef = AVAILABLE_COLUMNS.find((c) => c.id === colId);
                      return (
                        <div key={colId} className="flex items-center gap-2 text-xs py-1.5 px-2.5 rounded-lg bg-card border border-border/60">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="font-medium text-foreground">{colDef?.label || colId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <>
                  {/* Preset Switcher */}
                  <div className="rounded-xl border border-border bg-muted/5 p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-semibold text-foreground/90">
                          Export for specific recipient
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          Pre-selects required columns for compliance.
                        </p>
                      </div>
                      <Switch
                        checked={exportForRecipient}
                        onCheckedChange={handleExportForRecipientToggle}
                      />
                    </div>

                    {exportForRecipient && (
                      <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                        <Label className="text-xs text-muted-foreground whitespace-nowrap">
                          Recipient:
                        </Label>
                        <Select
                          value={selectedRecipient}
                          onValueChange={handleRecipientChange}
                        >
                          <SelectTrigger className="w-full h-8 text-xs bg-muted/20 border-border/60 hover:bg-muted/40">
                            <SelectValue placeholder="Select Recipient" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="calstart">CALSTART</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-h-0">
                    <ColumnsSelector
                      availableColumns={AVAILABLE_COLUMNS}
                      selectedColumns={selectedColumns}
                      onColumnToggle={(colId, checked) => {
                        if (checked) {
                          setSelectedColumns((prev) => [...prev, colId]);
                        } else {
                          setSelectedColumns((prev) => prev.filter((id) => id !== colId));
                        }
                      }}
                      onSelectAll={() => setSelectedColumns(AVAILABLE_COLUMNS.map(c => c.id))}
                      onDeselectAll={() => setSelectedColumns([])}
                      disabled={exportForRecipient}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3 border-t border-border">
            <Button variant="ghost" onClick={handleStepReset} disabled={isExporting} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={handleExportSessions}
              disabled={isExporting}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
