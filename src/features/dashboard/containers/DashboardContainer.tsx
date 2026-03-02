'use client';

import { motion } from 'framer-motion';
import { useDashboardStats, useRecentActivity } from '@/hooks/get/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Zap, Activity, Users } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { StatCard } from '../components/StatCard';
import { StatCardSkeleton } from '../components/StatCardSkeleton';
import { ActivityList } from '../components/ActivityList';
import { ActivityListSkeleton } from '../components/ActivityListSkeleton';
import { EmptyActivity } from '../components/EmptyActivity';

export function DashboardContainer() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity({ limit: 10 });

  const statCards = [
    {
      title: 'Total Stations',
      value: stats?.totalStations || 0,
      icon: Zap,
      color: 'text-blue-500',
    },
    {
      title: 'Available Stations',
      value: stats?.availableStations || 0,
      icon: Battery,
      color: 'text-green-500',
    },
    {
      title: 'Active Sessions',
      value: stats?.activeSessions || 0,
      icon: Activity,
      color: 'text-orange-500',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: Users,
      color: 'text-purple-500',
    },
  ];

  if (statsError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6">
          <p className="text-destructive">Failed to load dashboard data</p>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your charging infrastructure</p>
      </div>

      <motion.div variants={staggerItem} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <ActivityListSkeleton />
            ) : activities && activities.length > 0 ? (
              <ActivityList activities={activities} />
            ) : (
              <EmptyActivity />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
