import { useState } from 'react';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { DatePicker } from '@/components/shared/DatePicker';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { downloadCalstartReport } from '@/services/report.service';
import { toast } from 'sonner';
import { Loader2, Download, Calendar } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStationIds: string[];
  stationCount: number;
}

export function ExportReportModal({
  isOpen,
  onClose,
  selectedStationIds,
  stationCount,
}: ExportReportModalProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [timeSeparator, setTimeSeparator] = useState<'colon' | 'slash'>('colon');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (selectedStationIds.length === 0) {
      toast.error('No stations selected for export.');
      return;
    }

    setIsDownloading(true);
    const toastId = toast.loading('Generating CALSTART report...');

    try {
      await downloadCalstartReport({
        stationIds: selectedStationIds,
        startDate: dateRange.from,
        endDate: dateRange.to,
        timeSeparator,
      });

      toast.success('CALSTART interval report downloaded successfully!', {
        id: toastId,
      });
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to generate CALSTART report.', {
        id: toastId,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Export CALSTART 15-Min Interval Report"
      description={`Generate a station-wise usage report for the ${stationCount} selected station${
        stationCount > 1 ? 's' : ''
      }.`}
      size="md"
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={onClose} disabled={isDownloading}>
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 rounded-xl flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download CSV
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-4">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Reporting Date Range (Optional)
          </Label>
          <DatePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            className="w-full"
          />
          <p className="text-[11px] text-muted-foreground opacity-80 mt-1">
            Leave blank to export the entire history of the selected station(s).
          </p>
        </div>

        {/* Format Preference */}
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            CSV Time Separator
          </Label>
          <Select
            value={timeSeparator}
            onValueChange={(val) => setTimeSeparator(val as 'colon' | 'slash')}
          >
            <SelectTrigger className="bg-background/50 border-border/40 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="colon">Colons (HH:MM:SS) - Default</SelectItem>
              <SelectItem value="slash">Slashes (HH/MM/SS) - CALSTART Spec</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </AnimatedModal>
  );
}
