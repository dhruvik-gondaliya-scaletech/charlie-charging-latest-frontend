'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStats, useRecentActivity } from '@/hooks/get/useDashboard';
import { Card } from '@/components/ui/card';
import { Battery, Zap, Activity, Users, RefreshCw, Download, Calendar, Terminal, History } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { StatCard } from '../components/StatCard';
import { StatCardSkeleton } from '../components/StatCardSkeleton';
import { ActivityList } from '../components/ActivityList';
import { ActivityListSkeleton } from '../components/ActivityListSkeleton';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DownloadReportsModal } from '../components/DownloadReportsModal';
import { useQueryClient } from '@tanstack/react-query';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useWebSocketConnection, useRealTimeEvent } from '@/hooks/useRealTime';
import { invalidateQueriesDebounced } from '@/lib/query-utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/shared/DatePicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StationLogs } from '@/features/stations/components/StationLogs';

export function DashboardContainer() {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [viewLogsSession, setViewLogsSession] = useState<{ stationId: string; sessionId: string } | null>(null);
  const [eventsLimit, setEventsLimit] = useState<number>(10);
  const queryClient = useQueryClient();
  const { environment } = useEnvironment();

  const [selectedRange, setSelectedRange] = useState<string>('Today');
  const [customRange, setCustomRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const dateParams = useMemo(() => {
    const now = new Date();
    switch (selectedRange) {
      case 'Today': {
        const from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        return { fromDate: from.toISOString(), toDate: to.toISOString() };
      }
      case '48hrs': {
        const from = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        return { fromDate: from.toISOString(), toDate: now.toISOString() };
      }
      case 'This Month': {
        const from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { fromDate: from.toISOString(), toDate: to.toISOString() };
      }
      case 'Last Month': {
        const from = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return { fromDate: from.toISOString(), toDate: to.toISOString() };
      }
      case 'Custom': {
        if (customRange.from) {
          const from = new Date(customRange.from.getFullYear(), customRange.from.getMonth(), customRange.from.getDate(), 0, 0, 0, 0);
          const to = customRange.to
            ? new Date(customRange.to.getFullYear(), customRange.to.getMonth(), customRange.to.getDate(), 23, 59, 59, 999)
            : new Date(customRange.from.getFullYear(), customRange.from.getMonth(), customRange.from.getDate(), 23, 59, 59, 999);
          return { fromDate: from.toISOString(), toDate: to.toISOString() };
        }
        return {};
      }
      case 'All Time':
      default:
        return {};
    }
  }, [selectedRange, customRange]);

  // Establish and track WebSocket connection
  useWebSocketConnection();

  // Subscribe to real-time events and trigger debounced cache invalidation
  useRealTimeEvent('station-status-change', () => {
    invalidateQueriesDebounced(queryClient, ['dashboard-stats', environment, dateParams]);
    invalidateQueriesDebounced(queryClient, ['recent-activity', environment, { ...dateParams, limit: eventsLimit }]);
  }, [environment, dateParams, eventsLimit]);

  useRealTimeEvent('connector-status-change', () => {
    invalidateQueriesDebounced(queryClient, ['dashboard-stats', environment, dateParams]);
    invalidateQueriesDebounced(queryClient, ['recent-activity', environment, { ...dateParams, limit: eventsLimit }]);
  }, [environment, dateParams, eventsLimit]);

  useRealTimeEvent('transaction-start', () => {
    invalidateQueriesDebounced(queryClient, ['dashboard-stats', environment, dateParams]);
    invalidateQueriesDebounced(queryClient, ['recent-activity', environment, { ...dateParams, limit: eventsLimit }]);
  }, [environment, dateParams, eventsLimit]);

  useRealTimeEvent('transaction-stop', () => {
    invalidateQueriesDebounced(queryClient, ['dashboard-stats', environment, dateParams]);
    invalidateQueriesDebounced(queryClient, ['recent-activity', environment, { ...dateParams, limit: eventsLimit }]);
  }, [environment, dateParams, eventsLimit]);

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
    isRefetching: isRefetchingStats
  } = useDashboardStats(dateParams);

  const {
    data: activities,
    isLoading: activitiesLoading,
    refetch: refetchActivities,
    isRefetching: isRefetchingActivities
  } = useRecentActivity({ ...dateParams, limit: eventsLimit });

  const handleRefresh = () => {
    refetchStats();
    refetchActivities();
  };

  const isRefreshing = isRefetchingStats || isRefetchingActivities;

  const statCards = [
    {
      title: 'Stations',
      value: stats?.totalStations ?? 0,
      secondary: {
        value: stats?.availableStations ?? 0,
        label: 'Available',
      },
      icon: Battery,
      color: 'text-emerald-500',
      bottomRightGlobe: 'bg-emerald-500',
      description: 'Network-wide status',
    },
    {
      title: 'Active Sessions',
      value: stats?.activeSessions ?? 0,
      icon: Activity,
      color: 'text-orange-500',
      bottomRightGlobe: 'bg-orange-500',
      description: 'Currently charging',
    },
    {
      title: 'Sessions',
      value: stats?.completedSessions ?? 0,
      secondary: {
        value: stats?.failedSessions ?? 0,
        label: 'Failed',
      },
      primaryLabel: 'Completed',
      hideProgress: true,
      icon: Activity,
      color: 'text-purple-500',
      bottomRightGlobe: 'bg-purple-500',
      description: 'Session status',
    },
    {
      title: 'Energy Delivered',
      value: `${stats?.energyDelivered ?? 0} kWh`,
      icon: Zap,
      color: 'text-blue-500',
      bottomRightGlobe: 'bg-blue-500',
      description: 'Total output',
    },
  ];

  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md p-6 text-center border-destructive/20 bg-destructive/5">
          <p className="text-destructive font-medium mb-4">Failed to load dashboard statistics</p>
          <Button onClick={() => refetchStats()} variant="outline">Retry Loading</Button>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto"
      >
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">System metrics and recent activity</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Select value={selectedRange} onValueChange={(val) => setSelectedRange(val)}>
                <SelectTrigger className="w-[140px] h-9 rounded-xl border-border/40 bg-card/20 font-bold text-xs">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 bg-card/95 backdrop-blur-xl">
                  <SelectItem value="Today" className="text-xs font-semibold">Today</SelectItem>
                  <SelectItem value="48hrs" className="text-xs font-semibold">48hrs</SelectItem>
                  <SelectItem value="This Month" className="text-xs font-semibold">This Month</SelectItem>
                  <SelectItem value="Last Month" className="text-xs font-semibold">Last Month</SelectItem>
                  <SelectItem value="All Time" className="text-xs font-semibold">All Time</SelectItem>
                  <SelectItem value="Custom" className="text-xs font-semibold">Custom</SelectItem>
                </SelectContent>
              </Select>
              {selectedRange === 'Custom' && (
                <DatePicker
                  dateRange={customRange}
                  onDateRangeChange={setCustomRange}
                  className="h-9"
                />
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 rounded-xl"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsReportsModalOpen(true)}
              className="h-9 rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Reports
            </Button>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <motion.div variants={staggerItem} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            : statCards.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                secondary={(stat as any).secondary}
                primaryLabel={(stat as any).primaryLabel}
                hideProgress={(stat as any).hideProgress}
                icon={stat.icon}
                color={stat.color}
                bottomRightGlobe={stat.bottomRightGlobe}
                description={stat.description}
                loading={statsLoading}
              />
            ))}
        </motion.div>

        {/* Main Dashboard Layout */}
        <div className="space-y-8">
          {/* Top Row: Quick Actions & Capacity Side-by-Side */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Quick Actions Card */}
            {/* <motion.div variants={staggerItem}>
              <Card className="relative h-full overflow-hidden border-border/40 shadow-xl min-h-[320px]">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <Zap className="h-4 w-4 text-yellow-500" />
                    </div>
                    <CardTitle className="text-lg font-bold tracking-tight">Quick Actions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pb-6">
                  {quickActions.map((action, idx) => (
                    <Link key={idx} href={action.href} prefetch={false} className="group">
                      <div className="flex flex-col items-center justify-center p-5 rounded-2xl border border-border/10 bg-muted/20 hover:bg-muted/40 transition-all hover:scale-[1.03] hover:shadow-lg h-full group">
                        <div className={`p-3 rounded-xl bg-background/50 mb-3 group-hover:scale-110 transition-transform ring-1 ring-border/5`}>
                          <action.icon className={cn("h-5 w-5", action.color.split(' ').pop())} />
                        </div>
                        <span className="text-[10px] font-bold text-center tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                          {action.title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div> */}

            {/* Capacity Utilization Card */}
            {/* <motion.div variants={staggerItem}>
              <Card className="relative overflow-hidden border-border/40 shadow-xl min-h-[320px]">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Activity className="h-4 w-4 text-orange-500" />
                    </div>
                    <CardTitle className="text-lg font-bold tracking-tight">Capacity Utilization</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-end justify-between">
                      <span className="text-5xl font-black tracking-tighter bg-linear-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
                        {stats?.capacityUtilization || 0}%
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black pb-2 opacity-50">Network Load</span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-muted/40 overflow-hidden ring-1 ring-border/20 shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats?.capacityUtilization || 0}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full bg-linear-to-r from-orange-400 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/10">
                    <div className="space-y-1.5">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold opacity-40">In-Use Power</p>
                      <p className="text-xl font-black tracking-tight">{((statsLoading ? 0 : stats?.energyDelivered || 0) * 0.8).toFixed(1)} <span className="text-[10px] font-bold opacity-40 uppercase">kW</span></p>
                    </div>
                    <div className="space-y-1.5 text-right">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold opacity-40">Total Power</p>
                      <p className="text-xl font-black tracking-tight">{((statsLoading ? 1 : stats?.energyDelivered || 1) * 1.2).toFixed(1)} <span className="text-[10px] font-bold opacity-40 uppercase">kW</span></p>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
              </Card>
            </motion.div> */}
          </div>

          {/* Bottom Row: Recent Activity Full Width (No Card Wrapper) */}
          <motion.div variants={staggerItem} className="w-full space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-60">Real-time event stream</p>
                </div>
              </div>
              <Select value={String(eventsLimit)} onValueChange={(val) => setEventsLimit(Number(val))}>
                <SelectTrigger className="w-[175px] h-9 rounded-full border border-border/40 bg-muted/30 font-bold text-[10px] uppercase tracking-widest px-4 py-2 text-muted-foreground backdrop-blur-md focus:ring-0 focus:ring-offset-0 cursor-pointer flex justify-between items-center gap-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl">
                  <SelectItem value="10" className="text-xs font-semibold uppercase tracking-wider cursor-pointer">Last 10 Events</SelectItem>
                  <SelectItem value="20" className="text-xs font-semibold uppercase tracking-wider cursor-pointer">Last 20 Events</SelectItem>
                  <SelectItem value="50" className="text-xs font-semibold uppercase tracking-wider cursor-pointer">Last 50 Events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/20 backdrop-blur-xl transition-all hover:bg-card/30">
              <div className="p-0">
                {activitiesLoading ? (
                  <div className="p-8"><ActivityListSkeleton /></div>
                ) : (
                  <ActivityList
                    activities={activities || []}
                    isLoading={activitiesLoading}
                    onViewLogs={(stationId, sessionId) => setViewLogsSession({ stationId, sessionId })}
                    limit={eventsLimit}
                  />
                )}
                {/* {(!activitiesLoading && (!activities || activities.length === 0)) && <div className="p-8 text-center"><EmptyActivity /></div>} */}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <DownloadReportsModal isOpen={isReportsModalOpen} onClose={() => setIsReportsModalOpen(false)} />

      <Dialog open={viewLogsSession !== null} onOpenChange={(open) => !open && setViewLogsSession(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] md:w-[calc(100vw-256px-4rem)] max-w-[1550px] sm:max-w-none md:max-w-[1550px] md:left-[calc(50%+128px)] max-h-[96vh] h-[96vh] bg-card border-border/40 text-foreground p-4 md:p-6 rounded-3xl shadow-xl z-50 flex flex-col gap-4 overflow-hidden">
          <DialogHeader className="flex-none">
            <DialogTitle className="text-xl font-black flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              OCPP Session Diagnostic Logs
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            {viewLogsSession && (
              <StationLogs
                stationId={viewLogsSession.stationId}
                sessionId={viewLogsSession.sessionId}
                onClearSessionId={() => setViewLogsSession(null)}
                className="h-full min-h-0 md:h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
