'use client';

import { motion } from 'framer-motion';
import { useDashboardStats, useRecentActivity } from '@/hooks/get/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Zap, Activity, Users, RefreshCw, LayoutDashboard, Plus, MapPin, Bell } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { StatCard } from '../components/StatCard';
import { StatCardSkeleton } from '../components/StatCardSkeleton';
import { ActivityList } from '../components/ActivityList';
import { ActivityListSkeleton } from '../components/ActivityListSkeleton';
import { EmptyActivity } from '../components/EmptyActivity';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function DashboardContainer() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
    isRefetching: isRefetchingStats
  } = useDashboardStats();

  const {
    data: activities,
    isLoading: activitiesLoading,
    refetch: refetchActivities,
    isRefetching: isRefetchingActivities
  } = useRecentActivity({ limit: 10 });

  const handleRefresh = () => {
    refetchStats();
    refetchActivities();
  };

  const isRefreshing = isRefetchingStats || isRefetchingActivities;

  const quickActions = [
    { title: 'Add Station', icon: Plus, href: FRONTEND_ROUTES.STATIONS, color: 'bg-blue-500/10 text-blue-500' },
    { title: 'New Location', icon: MapPin, href: FRONTEND_ROUTES.LOCATIONS, color: 'bg-emerald-500/10 text-emerald-500' },
    { title: 'Manage Users', icon: Users, href: FRONTEND_ROUTES.USERS, color: 'bg-purple-500/10 text-purple-500' },
    { title: 'Config Webhooks', icon: Bell, href: FRONTEND_ROUTES.WEBHOOKS, color: 'bg-orange-500/10 text-orange-500' },
  ];

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
      title: 'Active Users',
      value: stats?.activeUsers ?? 0,
      icon: Users,
      color: 'text-purple-500',
      bottomRightGlobe: 'bg-purple-500',
      description: 'Users today',
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

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-card/40 backdrop-blur-md border-border/40 hover:bg-muted/50 transition-all ring-1 ring-border/5"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
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
                    <Link key={idx} href={action.href} className="group">
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
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold bg-muted/30 px-4 py-2 rounded-full border border-border/40 backdrop-blur-md">
                Last 10 Events
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/20 backdrop-blur-xl transition-all hover:bg-card/30">
              <div className="p-0">
                {activitiesLoading ? (
                  <div className="p-8"><ActivityListSkeleton /></div>
                ) : (
                  <ActivityList activities={activities || []} isLoading={activitiesLoading} />
                )}
                {/* {(!activitiesLoading && (!activities || activities.length === 0)) && <div className="p-8 text-center"><EmptyActivity /></div>} */}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
