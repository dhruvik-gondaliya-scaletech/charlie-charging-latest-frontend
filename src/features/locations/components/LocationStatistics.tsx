'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocationStatistics } from '@/hooks/get/useLocations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Zap,
  BatteryCharging,
  CheckCircle2,
  Activity,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DayStat } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { subMonths, format } from 'date-fns';

// ─── Period Options ────────────────────────────────────────────────────────────

function buildPeriodOptions() {
  const fixed = [
    { label: 'This week', value: 'this_week' },
    { label: 'Last week', value: 'last_week' },
    { label: 'This month', value: 'this_month' },
    { label: 'Last month', value: 'last_month' },
  ];
  const now = new Date();
  const historical = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, i + 2);
    return { label: format(d, 'MMM yyyy'), value: format(d, 'yyyy-MM') };
  });
  return [...fixed, ...historical];
}

const PERIOD_OPTIONS = buildPeriodOptions();

// ─── Main Component ────────────────────────────────────────────────────────────

interface LocationStatisticsProps {
  locationId: string;
}

export function LocationStatistics({ locationId }: LocationStatisticsProps) {
  const [period, setPeriod] = useState('last_week');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<{ index: number; x: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Width of the tooltip popup in px — keep in sync with min-w below
  const TOOLTIP_W = 160;

  const handleBarEnter = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current) return;
    const chartRect = chartRef.current.getBoundingClientRect();
    const barRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const barCenterX = barRect.left - chartRect.left + barRect.width / 2;
    setHoveredBar({ index: idx, x: barCenterX });
  };

  const getTooltipLeft = (): number => {
    if (!hoveredBar || !chartRef.current) return 0;
    const containerW = chartRef.current.offsetWidth;
    const raw = hoveredBar.x - TOOLTIP_W / 2;
    return Math.max(0, Math.min(raw, containerW - TOOLTIP_W));
  };

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data, isLoading, error, refetch, isFetching } = useLocationStatistics(locationId, {
    period,
    timezone,
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedLabel = PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? period;
  const totalBars = data?.dailyStats?.length ?? 0;

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
          <Skeleton className="h-56 w-full rounded-2xl" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl">
        <CardContent className="p-8 text-center space-y-3">
          <p className="text-sm font-bold text-destructive">Failed to load statistics</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const stats = data;
  const hoveredDay: DayStat | null =
    hoveredBar !== null && stats ? (stats.dailyStats[hoveredBar.index] ?? null) : null;

  return (
    <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-visible">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Title */}
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-black">Statistics</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground/60 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  Performance metrics for all stations at this location during the selected period.
                  Timezone: {timezone}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isFetching && !isLoading && (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary/60" />
            )}
          </div>

          {/* Period dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              onClick={() => setDropdownOpen((v) => !v)}
              className="h-10 min-w-[160px] justify-between font-bold text-sm border-border/40 bg-background rounded-xl pr-3"
            >
              {selectedLabel}
              {dropdownOpen
                ? <ChevronUp className="h-4 w-4 ml-2 text-muted-foreground" />
                : <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
              }
            </Button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 z-50 min-w-[180px] bg-card/95 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl py-1.5 overflow-hidden">
                {PERIOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setPeriod(opt.value); setDropdownOpen(false); }}
                    className={cn(
                      'w-full text-left px-4 py-2 text-sm transition-colors hover:bg-muted/60',
                      period === opt.value ? 'font-black text-foreground' : 'font-medium text-muted-foreground',
                    )}
                  >
                    {opt.label}
                    {period === opt.value && (
                      <span className="float-right text-primary">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* ── Key Metric Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard
            icon={Zap} iconColor="text-emerald-500" iconBg="bg-emerald-500/10"
            label="Total kWh"
            value={stats ? stats.totalKwh.toFixed(2) : '—'}
          />
          <MetricCard
            icon={BatteryCharging} iconColor="text-blue-500" iconBg="bg-blue-500/10"
            label="Charging sessions"
            value={stats ? String(stats.chargingSessions) : '—'}
          />
          <MetricCard
            icon={CheckCircle2} iconColor="text-violet-500" iconBg="bg-violet-500/10"
            label="Successful charges"
            value={stats ? `${stats.successfulSessionsPercent}%` : '—'}
          />
          <MetricCard
            icon={Activity} iconColor="text-amber-500" iconBg="bg-amber-500/10"
            label={
              <span className="flex items-center gap-1">
                Uptime
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[260px] text-xs leading-relaxed space-y-1.5 p-3">
                      <p>
                        Uptime is a key measure of charging reliability and is calculated as the
                        percentage of time a charger is in a reliable status out of the total time
                        it is in scope.
                      </p>
                      <p className="font-bold">
                        &ldquo;Uptime data is only calculated from Jul 14, 2026, onwards&rdquo;
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            }
            value={stats ? `${stats.uptimePercent}%` : '—'}
          />
        </div>

        {/* ── Stacked Bar Chart ─────────────────────────────────────────── */}
        {stats && stats.dailyStats.length > 0 ? (
          <div className="space-y-3">

            {/* Chart with relative container for pixel-accurate tooltip */}
            <div
              ref={chartRef}
              className="relative"
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* ── Hover Tooltip — centred above hovered bar, clamped to chart bounds */}
              {hoveredDay && hoveredBar !== null && (
                <div
                  className="absolute top-0 z-20 pointer-events-none"
                  style={{ left: getTooltipLeft() }}
                >
                  <div
                    className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-3 text-xs"
                    style={{ width: TOOLTIP_W }}
                  >
                    <p className="font-black text-foreground mb-2 border-b border-border/30 pb-1.5">
                      {hoveredDay.date}
                    </p>
                    <div className="space-y-1.5">
                      <TooltipRow dot="bg-emerald-500" label="Available" pct={hoveredDay.availablePercent} />
                      <TooltipRow dot="bg-destructive"  label="Error"     pct={hoveredDay.errorPercent} />
                      <TooltipRow dot="bg-amber-500"    label="Busy"      pct={hoveredDay.busyPercent} />
                    </div>
                  </div>
                </div>
              )}

              {/* Bars */}
              <div className="flex items-end gap-1 sm:gap-1.5 h-52 overflow-x-auto pb-1 pt-16">
                {stats.dailyStats.map((day, idx) => (
                  <div
                    key={day.date}
                    className={cn(
                      'flex flex-col-reverse items-center flex-1 min-w-[28px] max-w-[52px] cursor-pointer',
                      hoveredBar?.index === idx && 'opacity-90',
                    )}
                    onMouseEnter={(e) => handleBarEnter(idx, e)}
                  >
                    {/* Stacked bar */}
                    <div
                      className="w-full rounded-md overflow-hidden flex flex-col-reverse"
                      style={{ height: '148px' }}
                    >
                      <div
                        className="w-full bg-emerald-500 transition-all"
                        style={{ height: `${day.availablePercent}%` }}
                      />
                      <div
                        className="w-full bg-amber-500 transition-all"
                        style={{ height: `${day.busyPercent}%` }}
                      />
                      <div
                        className="w-full bg-destructive transition-all"
                        style={{ height: `${day.errorPercent}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground mt-1.5 text-center leading-tight whitespace-nowrap">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <LegendItem color="bg-emerald-500" label="Available" pct={stats.overallAvailablePercent} />
              <LegendItem color="bg-destructive"  label="Error"     pct={stats.overallErrorPercent} />
              <LegendItem color="bg-amber-500"    label="Busy"      pct={stats.overallBusyPercent} />
            </div>
          </div>
        ) : (
          <div className="h-52 flex items-center justify-center border-2 border-dashed border-border/30 rounded-2xl">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              No data for selected period
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: React.ReactNode;
  value: string;
}

function MetricCard({ icon: Icon, iconColor, iconBg, label, value }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4 rounded-2xl border border-border/40 bg-background/60 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-2">
        <div className={cn('p-1.5 rounded-lg flex-shrink-0', iconBg)}>
          <Icon className={cn('h-3.5 w-3.5', iconColor)} />
        </div>
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">
          {label}
        </span>
      </div>
      <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground">{value}</span>
    </div>
  );
}

function LegendItem({ color, label, pct }: { color: string; label: string; pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-3 w-3 rounded-sm flex-shrink-0', color)} />
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <span className="text-xs font-black text-foreground">{pct}%</span>
    </div>
  );
}

function TooltipRow({ dot, label, pct }: { dot: string; label: string; pct: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5">
        <span className={cn('h-2 w-2 rounded-full flex-shrink-0', dot)} />
        <span className="font-semibold text-muted-foreground">{label}</span>
      </span>
      <span className="font-black text-foreground">{pct}%</span>
    </div>
  );
}
