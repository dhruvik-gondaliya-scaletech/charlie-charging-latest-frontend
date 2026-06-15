/**
 * Reporting types — mirrors the backend interval-report DTOs.
 * Used by reporting.service.ts and the IntervalReportsModal UI.
 */

export interface IntervalReportQuery {
  startFrom?: string;
  startTo?: string;
  stationId?: string;
  stationIds?: string;
  locationId?: string;
  locationIds?: string;
  env?: string;
  /** Clock-aligned interval size in minutes. Default: 15. Range: 1–60. */
  intervalMinutes?: number;
  /** Target timezone for boundary alignment and labeling (e.g. "Asia/Kolkata"). */
  timezone?: string;
}

/** One clock-aligned block for a single charging session. */
export interface IntervalSlice {
  intervalStart: string;
  intervalEnd: string;
  intervalLabel: string;
  sessionId: string;
  transactionId?: string;
  stationId: string;
  stationName: string;
  locationId?: string;
  locationName?: string;
  energyKwh: number;
  peakKw: number;
  avgKw: number;
  overlapMinutes: number;
  dataSource: 'interpolated' | 'proportional';
}

/** Aggregated interval across all sessions (one row per clock block). */
export interface AggregatedInterval {
  intervalStart: string;
  intervalEnd: string;
  intervalLabel: string;
  totalEnergyKwh: number;
  peakKw: number;
  avgKw: number;
  sessionCount: number;
  totalOverlapMinutes: number;
}

/** Full interval breakdown for a single session. */
export interface SessionIntervalReport {
  sessionId: string;
  transactionId?: string;
  stationId: string;
  stationName: string;
  locationId?: string;
  locationName?: string;
  startTime: string;
  endTime?: string;
  totalEnergyKwh: number;
  totalDurationMinutes: number;
  intervalMinutes: number;
  intervals: IntervalSlice[];
}

/** Top-level response for GET /reporting/intervals */
export interface IntervalReportResponse {
  totalSessions: number;
  totalIntervals: number;
  rangeStart: string;
  rangeEnd: string;
  intervalMinutes: number;
  slices: IntervalSlice[];
}
