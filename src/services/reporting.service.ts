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

function formatDateTimeForCsv(value: unknown): string {
  if (!value) return '';
  const str = String(value);
  // If it's in the ISO format with offset/Z: e.g. "2024-07-08T12:00:00+05:30"
  if (str.includes('T') && (str.includes('+') || str.slice(10).includes('-') || str.endsWith('Z'))) {
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, year, month, day, hours, minutes, seconds] = match;
      return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    }
  }
  const date = value instanceof Date ? value : new Date(str);
  if (isNaN(date.getTime())) return str;

  const pad = (n: number) => String(n).padStart(2, '0');
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const year = date.getUTCFullYear();
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

function buildIntervalSlicesCsv(slices: IntervalSlice[]): string {
  const header = [
    'Interval ID',
    'Interval start datetime',
    'Interval end datetime',
    'Interval Label',
    'Charge event ID',
    'Transaction ID',
    'EVSE ID',
    'Station ID',
    'Station Name',
    'Location ID',
    'Location Name',
    'Energy (kWh)',
    'Interval peak demand',
    'Interval average demand',
    'Overlap (min)',
    'Data Source',
    'Total Time (sec)',
    'Excluded Time (sec)',
    'Outage Time (sec)',
    'Uptime (%)',
    'Idle Duration',
  ];
  const rows = slices.map((s) =>
    rowToCsv([
      s.intervalId,
      formatDateTimeForCsv(s.intervalStart),
      formatDateTimeForCsv(s.intervalEnd),
      s.intervalLabel,
      s.sessionId,
      s.transactionId ?? '',
      s.evseId ?? '',
      s.stationId,
      s.stationName,
      s.locationId ?? '',
      s.locationName ?? '',
      s.energyKwh,
      s.peakKw,
      s.avgKw,
      s.overlapMinutes,
      s.dataSource,
      s.totalTimeSeconds,
      s.excludedTimeSeconds,
      s.outageTimeSeconds,
      s.uptimePercentage !== null && s.uptimePercentage !== undefined ? s.uptimePercentage : '',
      s.idleDurationSeconds,
    ]),
  );
  return [rowToCsv(header), ...rows].join('\n');
}

function buildAggregatedCsv(rows: AggregatedInterval[]): string {
  const header = [
    'Interval start datetime',
    'Interval end datetime',
    'Interval Label',
    'Total Energy (kWh)',
    'Interval peak demand',
    'Interval average demand',
    'Session Count',
    'Total Overlap (min)',
  ];
  const csvRows = rows.map((r) =>
    rowToCsv([
      formatDateTimeForCsv(r.intervalStart),
      formatDateTimeForCsv(r.intervalEnd),
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

import type { SessionStats } from '@/types';

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

  /** GET /reporting/sessions/stats — get session statistics */
  async getSessionStats(stationId?: string): Promise<SessionStats> {
    return httpService.get<SessionStats>(API_CONFIG.endpoints.reporting.sessionStats, {
      params: { stationId },
    });
  }

  /** GET /reporting/intervals/export — export interval slices as CSV with user-selected columns */
  async exportIntervalsCsv(params?: IntervalReportQuery & { columns?: string[] }): Promise<Blob> {
    const queryParams: Record<string, unknown> = { ...params };
    if (params?.columns) {
      queryParams.columns = params.columns.join(',');
    }
    return httpService.get<Blob>(API_CONFIG.endpoints.reporting.intervalsExport, {
      params: queryParams,
      responseType: 'blob',
    });
  }

  /** GET /reporting/sessions/export — export charging sessions as CSV */
  async exportSessions(params?: {
    startFrom?: string;
    startTo?: string;
    columns?: string[];
    env?: string;
    locationId?: string;
    locationIds?: string;
    stationIds?: string;
  }): Promise<Blob> {
    const queryParams: Record<string, string> = {};
    if (params) {
      if (params.startFrom) queryParams.startFrom = params.startFrom;
      if (params.startTo) queryParams.startTo = params.startTo;
      if (params.env) queryParams.env = params.env;
      if (params.columns) queryParams.columns = params.columns.join(',');
      if (params.locationId) queryParams.locationId = params.locationId;
      if (params.locationIds) queryParams.locationIds = params.locationIds;
      if (params.stationIds) queryParams.stationIds = params.stationIds;
    }
    return httpService.get<Blob>(API_CONFIG.endpoints.reporting.sessionExport, {
      params: queryParams,
      responseType: 'blob',
    });
  }

  /** GET /reporting/downtime/export — export downtime intervals as CSV */
  async exportDowntime(params?: {
    startFrom?: string;
    startTo?: string;
    env?: string;
    locationId?: string;
    locationIds?: string;
    stationIds?: string;
  }): Promise<Blob> {
    const queryParams: Record<string, string> = {};
    if (params) {
      if (params.startFrom) queryParams.startFrom = params.startFrom;
      if (params.startTo) queryParams.startTo = params.startTo;
      if (params.env) queryParams.env = params.env;
      if (params.locationId) queryParams.locationId = params.locationId;
      if (params.locationIds) queryParams.locationIds = params.locationIds;
      if (params.stationIds) queryParams.stationIds = params.stationIds;
      queryParams.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    }
    return httpService.get<Blob>(API_CONFIG.endpoints.reporting.downtimeExport, {
      params: queryParams,
      responseType: 'blob',
    });
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

  async getLocationGroups(env?: string): Promise<Array<{ id: string; name: string; locations: Array<{ id: string; name: string }> }>> {
    return httpService.get(API_CONFIG.endpoints.reporting.getLocationGroups, {
      params: env ? { env } : undefined,
    });
  }

  async getLocationGroup(groupName: string, env?: string): Promise<{ id: string; name: string; locations: Array<{ id: string; name: string }> }> {
    return httpService.get(API_CONFIG.endpoints.reporting.getLocationGroup(groupName), {
      params: env ? { env } : undefined,
    });
  }

  async updateLocationGroupLocations(groupName: string, locationIds: string[], env?: string): Promise<Array<{ id: string; name: string }>> {
    return httpService.put(
      API_CONFIG.endpoints.reporting.updateLocationGroupLocations(groupName),
      { locationIds },
      { params: env ? { env } : undefined },
    );
  }

  async getApiKey(): Promise<{ apiKey: string }> {
    return httpService.get(API_CONFIG.endpoints.reporting.getApiKey);
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
