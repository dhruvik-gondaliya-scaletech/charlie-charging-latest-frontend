'use client';

import React, { useState, useMemo } from 'react';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatePicker } from '@/components/shared/DatePicker';
import { toast } from 'sonner';
import { stationService } from '@/services/station.service';
import {
  Calendar,
  Download,
  Filter,
  X,
  Search,
  Terminal,
} from 'lucide-react';
import { startOfDay, endOfDay, format } from 'date-fns';

const OCPP_MESSAGE_TYPES = [
  'BootNotification',
  'StatusNotification',
  'Heartbeat',
  'Authorize',
  'StartTransaction',
  'StopTransaction',
  'MeterValues',
  'DataTransfer',
  'FirmwareStatusNotification',
  'Reset',
  'ChangeConfiguration',
  'ChangeAvailability',
  'RemoteStartTransaction',
  'RemoteStopTransaction',
  'SetChargingProfile',
  'ClearChargingProfile',
  'GetConfiguration',
  'GetCompositeSchedule',
  'TriggerMessage',
  'GetDiagnostics',
  'UpdateFirmware',
  'AuthorizeRemoteTxStop',
];

interface ExportLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationId: string;
  sessionId?: string;
}

export function ExportLogsModal({ isOpen, onClose, stationId, sessionId }: ExportLogsModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Default date range: Last 7 days to now
  const getInitialDateRange = () => {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    from.setHours(0, 0, 0, 0);
    const to = new Date();
    return { from, to };
  };

  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>(getInitialDateRange());
  const [selectedEvents, setSelectedEvents] = useState<string[]>([...OCPP_MESSAGE_TYPES]);

  const filteredTypes = useMemo(() => {
    return OCPP_MESSAGE_TYPES.filter(type =>
      type.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort();
  }, [searchQuery]);

  const handleSelectAll = () => {
    setSelectedEvents([...OCPP_MESSAGE_TYPES]);
  };

  const handleClearAll = () => {
    setSelectedEvents([]);
  };

  const handleEventToggle = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedEvents(prev => [...prev, type]);
    } else {
      setSelectedEvents(prev => prev.filter(t => t !== type));
    }
  };

  const handleExport = async () => {
    // Validation
    if (!sessionId && (!dateRange.from || !dateRange.to)) {
      toast.error('Please select a date range to export the station logs.');
      return;
    }

    if (selectedEvents.length === 0) {
      toast.error('Please select at least one event type to export.');
      return;
    }

    try {
      setIsExporting(true);
      toast.loading('Generating OCPP logs export...', { id: 'export-ocpp-logs' });

      const params = {
        stationId,
        sessionId,
        startDate: !sessionId && dateRange.from ? format(startOfDay(dateRange.from), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : undefined,
        endDate: !sessionId && dateRange.to ? format(endOfDay(dateRange.to), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : undefined,
        messageType: selectedEvents.length < OCPP_MESSAGE_TYPES.length ? selectedEvents.join(',') : undefined,
      };

      const csvBlob = await stationService.exportOcppLogs(params);

      const url = window.URL.createObjectURL(new Blob([csvBlob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      const filename = sessionId 
        ? `ocpp-logs-session-${sessionId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.csv`
        : `ocpp-logs-station-${stationId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.csv`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('OCPP logs exported successfully!', { id: 'export-ocpp-logs' });
      onClose();
    } catch (error) {
      console.error('Failed to export OCPP logs:', error);
      toast.error('Failed to export OCPP logs. Please try again.', { id: 'export-ocpp-logs' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="2xl"
    >
      <div className="flex items-start justify-between border-b border-border/60 pb-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/20 text-primary">
            <Terminal className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
              Export OCPP logs (CSV)
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {sessionId 
                ? 'Export logs for the selected charging session.' 
                : 'Select a date range and message type filters to export station logs.'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Date Range Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" /> Date Range
              </Label>
              {sessionId ? (
                <div className="p-4 rounded-xl border border-border/40 bg-muted/20 text-xs font-semibold text-muted-foreground">
                  Date range is automatically determined by the session window.
                </div>
              ) : (
                <DatePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  className="w-full h-10"
                />
              )}
            </div>

            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Export Details</span>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p><span className="font-bold text-foreground">Target:</span> {sessionId ? 'Session Wise' : 'Station Wise'}</p>
                {sessionId && <p className="truncate"><span className="font-bold text-foreground">Session ID:</span> {sessionId}</p>}
                <p><span className="font-bold text-foreground">Format:</span> CSV Spreadsheet</p>
              </div>
            </div>
          </div>

          {/* Right Column: Event Type Filter */}
          <div className="space-y-3 flex flex-col min-h-0">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-foreground/90 flex items-center gap-1.5">
                <Filter className="h-4 w-4 text-primary" /> OCPP Event Types
              </Label>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-border text-xs">|</span>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-muted-foreground hover:text-muted-foreground/80 font-medium transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Search filter for events */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 rounded-lg border-border/25 bg-muted/20 text-xs focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>

            {/* Checkbox scroll list */}
            <div className="flex-1 min-h-[200px] max-h-[220px] overflow-y-auto pr-1 custom-scrollbar border border-border rounded-xl bg-muted/10 p-3 space-y-2">
              {filteredTypes.map((type) => {
                const isChecked = selectedEvents.includes(type);
                return (
                  <div
                    key={type}
                    className="flex items-center space-x-2.5 p-1 rounded hover:bg-muted/30 transition-colors"
                  >
                    <Checkbox
                      id={`event-${type}`}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleEventToggle(type, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`event-${type}`}
                      className="text-xs text-foreground/85 font-semibold cursor-pointer select-none truncate"
                    >
                      {type}
                    </Label>
                  </div>
                );
              })}
              {filteredTypes.length === 0 && (
                <div className="text-center py-6 text-xs text-muted-foreground/60 font-medium">
                  No matching events found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialog Footer Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-border mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
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
    </AnimatedModal>
  );
}
