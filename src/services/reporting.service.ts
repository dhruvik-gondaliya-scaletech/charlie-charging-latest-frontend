import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import type {
  AggregatedInterval,
  IntervalReportQuery,
  IntervalReportResponse,
  IntervalSlice,
  SessionIntervalReport,
} from '@/types/reporting.types';

// ──────────────────────────────────────────────────────────────
// CSV helpers
// ──────────────────────────────────────────────────────────────

function escapeCsvCell(value: unknown): string {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowToCsv(fields: unknown[]): string {
  return fields.map(escapeCsvCell).join(',');
}

function buildIntervalSlicesCsv(slices: IntervalSlice[]): string {
  const header = [
    'Interval Start',
    'Interval End',
    'Interval Label',
    'Session ID',
    'Transaction ID',
    'Station ID',
    'Station Name',
    'Location ID',
    'Location Name',
    'Energy (kWh)',
    'Peak (kW)',
    'Avg (kW)',
    'Overlap (min)',
    'Data Source',
  ];
  const rows = slices.map((s) =>
    rowToCsv([
      s.intervalStart,
      s.intervalEnd,
      s.intervalLabel,
      s.sessionId,
      s.transactionId ?? '',
      s.stationId,
      s.stationName,
      s.locationId ?? '',
      s.locationName ?? '',
      s.energyKwh,
      s.peakKw,
      s.avgKw,
      s.overlapMinutes,
      s.dataSource,
    ]),
  );
  return [rowToCsv(header), ...rows].join('\n');
}

function buildAggregatedCsv(rows: AggregatedInterval[]): string {
  const header = [
    'Interval Start',
    'Interval End',
    'Interval Label',
    'Total Energy (kWh)',
    'Peak (kW)',
    'Avg (kW)',
    'Session Count',
    'Total Overlap (min)',
  ];
  const csvRows = rows.map((r) =>
    rowToCsv([
      r.intervalStart,
      r.intervalEnd,
      r.intervalLabel,
      r.totalEnergyKwh,
      r.peakKw,
      r.avgKw,
      r.sessionCount,
      r.totalOverlapMinutes,
    ]),
  );
  return [rowToCsv(header), ...csvRows].join('\n');
}

// ──────────────────────────────────────────────────────────────
// Service class
// ──────────────────────────────────────────────────────────────

class ReportingService {
  /** GET /reporting/intervals — flat list of per-session interval slices */
  async getIntervalReport(params?: IntervalReportQuery): Promise<IntervalReportResponse> {
    return httpService.get<IntervalReportResponse>(API_CONFIG.endpoints.reporting.intervals, {
      params,
    });
  }

  /** GET /reporting/intervals/aggregated — demand aggregated per clock block */
  async getAggregatedIntervalReport(params?: IntervalReportQuery): Promise<AggregatedInterval[]> {
    return httpService.get<AggregatedInterval[]>(API_CONFIG.endpoints.reporting.aggregated, {
      params,
    });
  }

  /** GET /reporting/sessions/:id/intervals — full breakdown for a single session */
  async getSessionIntervalReport(
    sessionId: string,
    intervalMinutes = 15,
  ): Promise<SessionIntervalReport> {
    return httpService.get<SessionIntervalReport>(
      API_CONFIG.endpoints.reporting.sessionIntervals(sessionId),
      { params: { intervalMinutes } },
    );
  }

  // ── Client-side CSV export ─────────────────────────────────

  /**
   * Fetches flat interval slices and downloads them as a CSV file.
   * Returns the filename used.
   */
  async exportIntervalSlicesCsv(params?: IntervalReportQuery): Promise<string> {
    const response = await this.getIntervalReport(params);
    const csv = buildIntervalSlicesCsv(response.slices);
    const filename = `interval-slices-${new Date().toISOString().slice(0, 10)}.csv`;
    triggerCsvDownload(csv, filename);
    return filename;
  }

  /**
   * Fetches aggregated demand data and downloads it as a CSV file.
   * Returns the filename used.
   */
  async exportAggregatedCsv(params?: IntervalReportQuery): Promise<string> {
    const rows = await this.getAggregatedIntervalReport(params);
    const csv = buildAggregatedCsv(rows);
    const filename = `interval-demand-${new Date().toISOString().slice(0, 10)}.csv`;
    triggerCsvDownload(csv, filename);
    return filename;
  }
}

function triggerCsvDownload(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  URL.revokeObjectURL(url);
}

export const reportingService = new ReportingService();
