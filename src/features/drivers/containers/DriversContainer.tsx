'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useDrivers } from '@/hooks/get/useDrivers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users as UsersIcon,
  UserPlus,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Calendar,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Table } from '@/components/shared/Table';
import { Driver } from '@/types';
import { formatDate } from '@/lib/date';
import { StatCard } from '../../dashboard/components/StatCard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { DriverFormModal } from '../components/DriverFormModal';

import { Settings, Users as UsersListIcon, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DriverAppConfig } from '../components/DriverAppConfig';
import { ActionIconButton } from '@/components/shared/ActionIconButton';

export function DriversContainer() {

  const router = useRouter();
  const { data: drivers, isLoading, error } = useDrivers();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const stats = useMemo(() => {
    if (!drivers) return { total: 0, active: 0, inactive: 0 };
    return {
      total: drivers.length,
      active: drivers.filter(d => d.isActive).length,
      inactive: drivers.filter(d => !d.isActive).length,
    };
  }, [drivers]);

  const columns: ColumnDef<Driver>[] = useMemo(
    // ... columns logic ...
    () => [
      {
        accessorKey: 'firstName',
        header: 'Driver Identity',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-foreground">
                {`${row.original.firstName} ${row.original.lastName}`.trim()}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Mail className="h-2.5 w-2.5 opacity-60" />
                {row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Contact',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/80 tracking-tight">
            <Phone className="h-3.5 w-3.5 opacity-40" />
            {row.getValue('phoneNumber') || 'N/A'}
          </div>
        ),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
          const isActive = row.original.isActive;

          if (!isActive) return (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-1 w-fit">
              <XCircle className="h-3 w-3" />
              Inactive
            </Badge>
          );

          return (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-1 w-fit">
              <CheckCircle2 className="h-3 w-3" />
              Active
            </Badge>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Registration',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/80 tracking-tight">
            <Calendar className="h-3.5 w-3.5 opacity-40" />
            {formatDate(row.getValue('createdAt'))}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Sessions',
        cell: ({ row }) => (
          <ActionIconButton
            tooltip="View Sessions"
            tone="primary"
            onClick={() =>
              router.push(
                `${FRONTEND_ROUTES.DRIVER_DETAILS(row.original.id)}?name=${encodeURIComponent(
                  `${row.original.firstName} ${row.original.lastName}`
                )}`
              )
            }
            icon={<History className="h-3 w-3" />}
          />
        ),
      },
    ],
    []
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px] p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 rounded-full bg-destructive/10 text-destructive inline-block">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black">Driver Registry Error</h2>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed uppercase tracking-wider opacity-60">Failed to establish connection with the driver directory. Please secure your network and retry.</p>
        </div>
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
        <motion.div variants={staggerItem} className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Driver Management
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">Manage charging network drivers and access</p>
          </div>
        </motion.div>

        <Tabs defaultValue="config" className="w-full space-y-8">
          <TabsList className="bg-card/10 backdrop-blur-sm p-1 rounded-xl border border-border/40 h-10 w-fit">
            <TabsTrigger value="config" className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2">
              <Settings className="h-3 w-3" />
              App Configuration
            </TabsTrigger>
            <TabsTrigger value="drivers" className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2">
              <UsersListIcon className="h-3 w-3" />
              Drivers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <DriverAppConfig />
          </TabsContent>

          <TabsContent value="drivers" className="space-y-8">
            <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Drivers"
                value={stats.total}
                icon={UsersIcon}
                color="text-primary"
                bottomRightGlobe="bg-primary"
                description="Enrolled drivers in network"
              />
              <StatCard
                title="Active Drivers"
                value={stats.active}
                icon={CheckCircle2}
                color="text-emerald-500"
                bottomRightGlobe="bg-emerald-500"
                description="Drivers with active accounts"
              />
              <StatCard
                title="Inactive Drivers"
                value={stats.inactive}
                icon={XCircle}
                color="text-destructive"
                bottomRightGlobe="bg-destructive"
                description="Drivers with disabled access"
              />
            </motion.div>

            <motion.div variants={staggerItem} className="relative">
              <Table<Driver>
                data={drivers || []}
                columns={columns}
                isLoading={isLoading}
                showSearch
                searchPosition="end"
                appendWithSearch={
                  <Button
                    onClick={() => setIsFormModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold shrink-0"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Driver
                  </Button>
                }
                pageSize={DEFAULT_PAGE_SIZE}
                maxHeight="700px"
                className="border-none shadow-none"
                emptyState={
                  <div className="py-24 flex flex-col items-center justify-center text-center gap-6 bg-card/10 rounded-[2.5rem] border-2 border-dashed border-border/40">
                    <div className="p-6 rounded-full bg-primary/5 text-primary/40 ring-1 ring-primary/10">
                      <UsersIcon className="h-16 w-16" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black tracking-tight text-foreground">Registry Empty</h3>
                      <p className="max-w-xs text-muted-foreground font-medium text-xs leading-relaxed mx-auto uppercase tracking-wider opacity-60">
                        No drivers detected in the system. Start by adding your first driver.
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsFormModalOpen(true)}
                      className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-black px-8 mt-4 uppercase tracking-widest text-[10px]"
                    >
                      Add First Driver
                    </Button>
                  </div>
                }
              />
            </motion.div>
          </TabsContent>
        </Tabs>

        <DriverFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
        />
      </motion.div>
    </TooltipProvider>
  );
}
