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

import { useDriverSessions } from '@/hooks/get/useDriverSessions';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DriverAppConfig } from '../components/DriverAppConfig';
import { Settings, Users as UsersListIcon } from 'lucide-react';

export function DriversContainer() {
  const { data: drivers, isLoading, error } = useDrivers();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedDriverForSessions, setSelectedDriverForSessions] = useState<Driver | null>(null);

  const { data: sessions, isLoading: isLoadingSessions } = useDriverSessions(selectedDriverForSessions?.id || '');

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
        header: 'Intelligence',
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDriverForSessions(row.original)}
            className="h-8 rounded-lg font-bold text-[10px] uppercase tracking-widest border-border/40 hover:bg-primary/10 hover:text-primary transition-all"
          >
            <History className="mr-1.5 h-3 w-3" />
            Sessions
          </Button>
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
                    <UserPlus className="mr-2 h-4 w-4" />
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

        <Drawer open={!!selectedDriverForSessions} onOpenChange={(open) => !open && setSelectedDriverForSessions(null)}>
          <DrawerContent className="h-[80vh] p-0 border-t border-border/40 bg-background/95 backdrop-blur-xl rounded-t-[2.5rem]">
            <DrawerHeader className="p-8 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <DrawerTitle className="text-2xl font-black tracking-tight">
                    {selectedDriverForSessions?.firstName} {selectedDriverForSessions?.lastName}
                  </DrawerTitle>
                  <DrawerDescription className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                    Historical Charging sessions intelligence
                  </DrawerDescription>
                </div>
                <Badge className="bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] py-1 px-3 border border-primary/20">
                  {sessions?.length || 0} Sessions
                </Badge>
              </div>
            </DrawerHeader>
            <ScrollArea className="flex-1 p-8">
              <div className="grid gap-4">
                {isLoadingSessions ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-muted/20 animate-pulse border border-border/40" />
                  ))
                ) : sessions?.length === 0 ? (
                  <div className="py-20 text-center">
                    <History className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No session history detected</p>
                  </div>
                ) : (
                  sessions?.map((session: any) => (
                    <div key={session.id} className="group p-5 rounded-2xl border border-border/40 bg-card/10 hover:bg-card/20 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Zap className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm tracking-tight">{session.stationName}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              Connector {session.connectorId} • {session.connectorType}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={cn(
                          "font-black uppercase tracking-widest text-[9px] px-2 py-0.5 rounded-full border-2",
                          session.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/10" :
                          session.status === 'IN_PROGRESS' ? "bg-primary/10 text-primary border-primary/10 animate-pulse" :
                          "bg-muted/10 text-muted-foreground border-muted/10"
                        )}>
                          {session.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Energy</p>
                          <p className="text-sm font-black tracking-tight">{session.energyDeliveredKwh.toFixed(2)} <span className="text-[10px] opacity-40">kWh</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Duration</p>
                          <p className="text-sm font-black tracking-tight">{session.durationMinutes} <span className="text-[10px] opacity-40">Min</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Cost</p>
                          <p className="text-sm font-black tracking-tight text-primary">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: session.currency || 'INR' }).format(session.totalCost)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-muted-foreground opacity-60">
                        <Calendar className="h-3 w-3" />
                        {new Date(session.startTime).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      </motion.div>
    </TooltipProvider>
  );
}
