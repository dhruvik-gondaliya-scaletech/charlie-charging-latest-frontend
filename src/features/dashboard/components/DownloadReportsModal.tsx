'use client';

import React, { useState } from 'react';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { sessionService } from '@/services/session.service';
import { Calendar, Download, FileSpreadsheet, Hourglass, ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { DatePicker } from '@/components/shared/DatePicker';
import { useEnvironment } from '@/contexts/EnvironmentContext';

interface DownloadReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'select-type' | 'configure-sessions';

const AVAILABLE_COLUMNS = [
  { id: 'id', label: 'Session ID' },
  { id: 'transactionId', label: 'Transaction ID' },
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

  // Configuration State
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);

  // Default date range: Last 7 days to now
  const getInitialDateRange = () => {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    from.setHours(0, 0, 0, 0);
    const to = new Date();
    return { from, to };
  };

  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>(getInitialDateRange());

  const handleClose = () => {
    setStep('select-type');
    setSelectedColumns(DEFAULT_COLUMNS);
    setDateRange(getInitialDateRange());
    onClose();
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

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast.error('Please select at least one column to export.');
      return;
    }

    try {
      setIsExporting(true);
      toast.loading('Generating report and fetching data...', { id: 'export-csv' });

      // Convert Date objects to ISO strings
      const params = {
        startFrom: dateRange.from ? dateRange.from.toISOString() : undefined,
        startTo: dateRange.to ? dateRange.to.toISOString() : undefined,
        columns: selectedColumns,
        env: environment,
      };

      const csvBlob = await sessionService.exportSessions(params);

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
      size="lg"
    >
      <div className="flex items-start justify-between border-b border-border/60 pb-5 mb-5">
        <div className="flex items-center gap-3">
          {step === 'configure-sessions' && (
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
                : 'Configure date range and custom fields for your CSV export.'}
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
        <div className="grid grid-cols-1 gap-4 py-4">
          {/* Sessions Option */}
          <Card
            onClick={() => setStep('configure-sessions')}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform duration-300">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-primary group-hover:text-primary/80 transition-colors">
                    Charging Sessions
                  </h3>
                  <CheckCircle2 className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                  Export granular list of raw charging sessions, including energy consumption, duration, and user details.
                </p>
              </div>
            </div>
          </Card>

          {/* Intervals Option - Coming Soon */}
          <Card className="relative overflow-hidden rounded-xl border border-border/60 bg-muted/20 p-5 opacity-60">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-muted text-muted-foreground/60">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-muted-foreground">
                    Interval Meter Values
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground flex items-center gap-1">
                    <Hourglass className="h-3 w-3" /> Coming Soon
                  </span>
                </div>
                <p className="text-muted-foreground/60 text-sm mt-1 leading-relaxed">
                  Export interval-based power measurements and meter reading history for grid demand planning.
                </p>
              </div>
            </div>
          </Card>

          {/* Revenue Summary Option - Coming Soon */}
          <Card className="relative overflow-hidden rounded-xl border border-border/60 bg-muted/20 p-5 opacity-60">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-muted text-muted-foreground/60">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-muted-foreground">
                    Revenue & Tariff Summary
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground flex items-center gap-1">
                    <Hourglass className="h-3 w-3" /> Coming Soon
                  </span>
                </div>
                <p className="text-muted-foreground/60 text-sm mt-1 leading-relaxed">
                  Export financial transaction summaries, applied tariffs, tax items, and billing details.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {step === 'configure-sessions' && (
        <div className="space-y-5 py-4">
          {/* Date Range Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground/90">Date Range</h3>
            <DatePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="w-full"
            />
          </div>

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground/90">Export Fields</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAllColumns}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-border text-xs">|</span>
                <button
                  onClick={handleDeselectAllColumns}
                  className="text-xs text-muted-foreground hover:text-muted-foreground/80 font-medium transition-colors cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar border border-border rounded-xl bg-muted/10 p-3">
              {AVAILABLE_COLUMNS.map((col) => {
                const isChecked = selectedColumns.includes(col.id);
                return (
                  <div
                    key={col.id}
                    className="flex items-center space-x-2.5 p-1 rounded hover:bg-muted/30 transition-colors"
                  >
                    <Checkbox
                      id={`col-${col.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleColumnToggle(col.id, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`col-${col.id}`}
                      className="text-sm text-foreground/80 font-normal cursor-pointer select-none"
                    >
                      {col.label}
                    </Label>
                  </div>
                );
              })}
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
