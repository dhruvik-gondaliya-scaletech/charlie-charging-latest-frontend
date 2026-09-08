'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useDriver } from '@/hooks/get/useDrivers';
import { useDriverSessions } from '@/hooks/get/useDriverSessions';
import { useDriverSessionStats } from '@/hooks/get/useDriverSessionStats';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Calendar,
  History,
  ShieldAlert,
  Clock,
  Banknote,
  Leaf,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { Table } from '@/components/shared/Table';
import { DriverSession } from '@/types';
import { formatDate, formatTime } from '@/lib/date';
import { StatCard } from '../../dashboard/components/StatCard';
import { BackButton } from '@/components/shared/BackButton';
import { FRONTEND_ROUTES, DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { Skeleton } from '@/components/ui/skeleton';

export function DriverSessionsContainer() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromPage = searchParams.get('from');

  const backLabel = fromPage === 'id-tags' ? 'Return to ID Tags' : 'Return to Driver Registry';
  const backHref = fromPage === 'id-tags' ? FRONTEND_ROUTES.ID_TAGS : FRONTEND_ROUTES.DRIVERS;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedSearch = useDebounce(search, 400);

  const { data: driver, isLoading: isLoadingDriver } = useDriver(id as string);
  const {
    data: sessionsResponse,
    isLoading: isLoadingSessions,
    error,
  } = useDriverSessions(id as string, { search: debouncedSearch, page, limit: pageSize });

  const isPaginated = sessionsResponse && typeof sessionsResponse === 'object' && ('data' in sessionsResponse || 'items' in sessionsResponse || 'meta' in sessionsResponse);
  const sessions: DriverSession[] = useMemo(() => {
    if (!sessionsResponse) return [];
    if (isPaginated) return (sessionsResponse as any).items || (sessionsResponse as any).data || [];
    if (Array.isArray(sessionsResponse)) return sessionsResponse;
    return [];
  }, [sessionsResponse, isPaginated]);

  const totalCount = useMemo(() => {
    if (!sessionsResponse) return 0;
    if (isPaginated) return (sessionsResponse as any).meta?.totalItems ?? (sessionsResponse as any).total ?? 0;
    if (Array.isArray(sessionsResponse)) return sessionsResponse.length;
    return 0;
  }, [sessionsResponse, isPaginated]);

  const { data: sessionStats } = useDriverSessionStats(id as string);

  const stats = useMemo(() => {
    return {
      totalEnergy: sessionStats?.totalEnergyKwh ?? sessions.reduce((acc, s) => acc + (s.energyDeliveredKwh || 0), 0),
      totalDuration: sessionStats?.totalDurationMinutes ?? sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0),
      totalCost: sessionStats?.totalCost ?? sessions.reduce((acc, s) => acc + (s.totalCost || 0), 0),
      count: sessionStats?.sessionCount ?? (totalCount || sessions.length),
      currency: sessionStats?.currency || sessions?.[0]?.currency || 'USD',
    };
  }, [sessionStats, sessions, totalCount]);

  const columns: ColumnDef<DriverSession>[] = useMemo(
    () => [
      {
        accessorKey: 'stationName',
        header: 'Station & Connector',
        minSize: 180,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex flex-col min-w-0">
              <span className="font-bold tracking-tight text-foreground truncate" title={row.original.stationName}>
                {row.original.stationName}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mt-0.5">
                <span>{row.original.connectorType || 'Type 2'}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'idTag',
        header: 'ID Tag',
        minSize: 180,
        cell: ({ row }) => {
          const val = row.original.idTag;
          if (!val) return <span className="text-muted-foreground text-xs font-bold">-</span>;
          return (
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground max-w-[200px]" title={val}>
              <Tag className="h-3.5 w-3.5 text-sky-500 shrink-0" />
              <span className="truncate">{val}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'remoteStartTime',
        header: 'Remote Start',
        minSize: 135,
        cell: ({ row }) => {
          const val = row.original.remoteStartTime;
          if (!val) return <span className="text-muted-foreground text-xs font-bold">-</span>;
          return (
            <div className="flex items-center gap-3 opacity-80">
              <Clock className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase text-foreground tracking-tight whitespace-nowrap">
                  {formatDate(val, 'MMM dd, yyyy')}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground opacity-60 whitespace-nowrap">
                  {formatTime(val)}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'startTime',
        header: 'Start Time',
        minSize: 140,
        cell: ({ row }) => {
          const val = row.original.startTime;
          if (!val) return <span className="text-muted-foreground text-xs font-bold">-</span>;
          return (
            <div className="flex items-center gap-3">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase text-foreground tracking-tight whitespace-nowrap">
                  {formatDate(val, 'MMM dd, yyyy')}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground opacity-60 whitespace-nowrap">
                  {formatTime(val)}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'remoteStopTime',
        header: 'Remote Stop',
        minSize: 135,
        cell: ({ row }) => {
          const val = row.original.remoteStopTime;
          if (!val) return <span className="text-muted-foreground text-xs font-bold">-</span>;
          return (
            <div className="flex items-center gap-3 opacity-80">
              <Clock className="h-3.5 w-3.5 text-pink-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase text-foreground tracking-tight whitespace-nowrap">
                  {formatDate(val, 'MMM dd, yyyy')}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground opacity-60 whitespace-nowrap">
                  {formatTime(val)}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'energyDeliveredKwh',
        header: 'Energy Yield',
        minSize: 125,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 font-black text-sm tracking-tight text-foreground whitespace-nowrap">
            <Zap className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>{row.original.energyDeliveredKwh.toFixed(2)}</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest opacity-40 italic">kWh</span>
          </div>
        ),
      },
      {
        id: 'co2Emitted',
        header: 'CO2 Emitted',
        minSize: 125,
        cell: ({ row }) => {
          const energy = row.original.energyDeliveredKwh || 0;
          const co2Emitted = energy * 0.273;
          return (
            <div className="flex items-center gap-2 font-black text-sm tracking-tight text-foreground whitespace-nowrap">
              <Leaf className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{co2Emitted.toFixed(2)}</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest opacity-40 italic">kg</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'durationMinutes',
        header: 'Duration',
        minSize: 110,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-xs font-bold tracking-tight whitespace-nowrap">
            <Clock className="h-4 w-4 text-blue-500 shrink-0" />
            <span>{row.original.durationMinutes}</span>
            <span className="text-[9px] uppercase tracking-widest opacity-40">Min</span>
          </div>
        ),
      },
      {
        accessorKey: 'totalCost',
        header: 'Financials',
        minSize: 115,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 font-black text-sm text-primary tracking-tight whitespace-nowrap">
            <Banknote className="h-4 w-4 text-amber-500 shrink-0" />
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: row.original.currency || 'USD',
            }).format(row.original.totalCost)}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'State',
        minSize: 115,
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge
              variant="outline"
              className={cn(
                'font-black uppercase tracking-widest text-[9px] px-2.5 py-0.5 rounded-full border-2 transition-all',
                (status === 'completed' || status === 'COMPLETED')
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : (status === 'in_progress' || status === 'IN_PROGRESS')
                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
              )}
            >
              {status}
            </Badge>
          );
        },
      },
    ],
    []
  );

  if (isLoadingDriver || (isLoadingSessions && !sessions)) {
    return (
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-[500px] w-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px] p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 rounded-full bg-destructive/10 text-destructive inline-block">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black">History Extraction Failed</h2>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed uppercase tracking-wider opacity-60">
            Unable to synchronize with the driver&apos;s transaction matrix. Connection integrity may be compromised.
          </p>
          <BackButton href={FRONTEND_ROUTES.DRIVERS} label="Return to Registry" className="mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto"
    >
      <motion.div variants={fadeInUp} className="space-y-1">
        <BackButton
          href={backHref}
          label={backLabel}
          onClick={() => {
            if (fromPage === 'id-tags') {
              router.push(FRONTEND_ROUTES.ID_TAGS);
            } else if (typeof window !== 'undefined' && window.history.length > 1) {
              router.back();
            } else {
              router.push(FRONTEND_ROUTES.DRIVERS);
            }
          }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {driver?.firstName} {driver?.lastName}
          </h1>
          <div className="h-2 w-2 rounded-full bg-border" />
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground opacity-60 mt-2 tracking-tight">
          <span className="flex items-center gap-1.5">
            <Badge variant="outline" className="rounded-md border-border/40 font-mono text-[10px]">
              {driver?.email}
            </Badge>
          </span>
          <span className="flex items-center gap-1.5 italic">
            Joined {driver?.createdAt ? formatDate(driver.createdAt) : 'N/A'}
          </span>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Session Count"
          value={stats.count}
          icon={History}
          color="text-primary"
          bottomRightGlobe="bg-primary"
          description="Total charging encounters"
        />
        <StatCard
          title="Energy Throughput"
          value={`${stats.totalEnergy.toFixed(2)} kWh`}
          icon={Zap}
          color="text-emerald-500"
          bottomRightGlobe="bg-emerald-500"
          description="Total power delivered"
        />
        <StatCard
          title="Time Engaged"
          value={`${stats.totalDuration.toFixed(2)} Min`}
          icon={Clock}
          color="text-blue-500"
          bottomRightGlobe="bg-blue-500"
          description="Total cumulative duration"
        />
        <StatCard
          title="Resource Allocation"
          value={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: stats.currency,
            maximumFractionDigits: 0
          }).format(stats.totalCost)}
          icon={Banknote}
          color="text-amber-500"
          bottomRightGlobe="bg-amber-500"
          description="Total financial volume"
        />
      </motion.div>

      <motion.div variants={fadeInUp} className="relative">
        <div className="absolute -inset-4 bg-card/5 backdrop-blur-3xl rounded-[2.5rem] -z-10 border border-white/5" />
        <Table<DriverSession>
          data={sessions || []}
          columns={columns}
          isLoading={isLoadingSessions}
          showSearch
          searchPosition="end"
          manualPagination={true}
          manualSearching={true}
          totalCount={totalCount}
          pageIndex={page - 1}
          pageSize={pageSize}
          onPageChange={(newPage: number) => setPage(newPage + 1)}
          onPageSizeChange={(newSize: number) => {
            setPageSize(newSize);
            setPage(1);
          }}
          onSearch={(val: string) => {
            setSearch(val);
            setPage(1);
          }}
          maxHeight="800px"
          className="border-none shadow-none"
          renderMobileCard={(session) => (
            <div className="bg-card/50 backdrop-blur-md border border-border/40 rounded-[2rem] p-6 space-y-5 shadow-sm group">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h4 className="text-base font-black tracking-tight text-foreground">{session.stationName}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{session.connectorType || 'Type 2'}</span>
                    {session.idTag && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-md">
                        <Tag className="h-2.5 w-2.5" />
                        {session.idTag}
                      </span>
                    )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'font-black uppercase tracking-widest text-[8px] px-2 py-0.5 rounded-full border shadow-xs',
                    (session.status === 'completed' || session.status === 'COMPLETED')
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : (session.status === 'in_progress' || session.status === 'IN_PROGRESS')
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                  )}
                >
                  {session.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-4 pt-2 border-t border-border/10">
                {session.remoteStartTime && (
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Remote Start
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-foreground">{formatDate(session.remoteStartTime, 'MMM dd, yyyy')}</span>
                      <span className="text-[10px] font-medium text-muted-foreground/60">{formatTime(session.remoteStartTime)}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Start Time
                  </span>
                  {session.startTime ? (
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-foreground">{formatDate(session.startTime, 'MMM dd, yyyy')}</span>
                      <span className="text-[10px] font-medium text-muted-foreground/60">{formatTime(session.startTime)}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs font-bold">-</span>
                  )}
                </div>

                {session.remoteStopTime && (
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[9px] font-black uppercase text-pink-500 tracking-widest flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Remote Stop
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-foreground">{formatDate(session.remoteStopTime, 'MMM dd, yyyy')}</span>
                      <span className="text-[10px] font-medium text-muted-foreground/60">{formatTime(session.remoteStopTime)}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest flex items-center gap-1.5">
                    <Zap className="h-3 w-3" /> Energy Yield
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-foreground">{session.energyDeliveredKwh.toFixed(2)}</span>
                    <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">kWh</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest flex items-center gap-1.5">
                    <Leaf className="h-3 w-3 text-emerald-500" /> CO2 Emitted
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-foreground">{(session.energyDeliveredKwh * 0.273).toFixed(2)}</span>
                    <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">kg</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Duration
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-foreground">{session.durationMinutes}</span>
                    <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">MIN</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-widest flex items-center gap-1.5">
                    <Banknote className="h-3 w-3" /> Financials
                  </span>
                  <div className="text-sm font-black text-primary">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: session.currency || 'INR',
                    }).format(session.totalCost)}
                  </div>
                </div>
              </div>
            </div>
          )}
          emptyState={
            <div className="py-32 flex flex-col items-center justify-center text-center gap-6">
              <div className="p-8 rounded-full bg-primary/5 text-primary/30 ring-1 ring-primary/10 animate-pulse">
                <Zap className="h-16 w-16" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight text-foreground">No Historical Data</h3>
                <p className="max-w-xs text-muted-foreground font-medium text-xs leading-relaxed mx-auto uppercase tracking-wider opacity-60">
                  This driver hasn&apos;t initiated any charging protocols yet.
                </p>
              </div>
            </div>
          }
        />
      </motion.div>
    </motion.div>
  );
}
