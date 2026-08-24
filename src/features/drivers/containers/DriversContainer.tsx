'use client';

import React, { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
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
import { Driver, AppPermission, AppRole } from '@/types';
import { formatDate } from '@/lib/date';
import { StatCard } from '../../dashboard/components/StatCard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { DriverFormModal } from '../components/DriverFormModal';

import { Settings, Users as UsersListIcon, History, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DriverAppConfig } from '../components/DriverAppConfig';
import { ActionIconButton } from '@/components/shared/ActionIconButton';
import { ProtectedAction } from '@/components/shared/ProtectedAction';
import { useAuth } from '@/contexts/AuthContext';
import { useDeleteDriver } from '@/hooks/delete/useDeleteDriver';
import { DeleteDriverModal } from '../components/DeleteDriverModal';


export function DriversContainer() {
  const router = useRouter();
  const { hasPermission, roles, hasRole } = useAuth();
  const isSiteManager = useMemo(() => {
    return (
      hasRole(AppRole.SITE_MANAGER) ||
      hasRole(AppRole.SITE_MANAGER.toLowerCase()) ||
      (Array.isArray(roles) && roles.some(r => r.toUpperCase() === AppRole.SITE_MANAGER))
    );
  }, [roles, hasRole]);
  const canUpdate = hasPermission(AppPermission.DRIVER_UPDATE);
  const defaultTab = canUpdate ? 'config' : 'drivers';

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedSearch = useDebounce(search, 400);

  const { data: drivers, isLoading, error } = useDrivers({
    search: debouncedSearch,
    page,
    limit: pageSize,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const deleteDriverMutation = useDeleteDriver();

  const driversList: Driver[] = drivers || [];
  const totalCount = drivers?.meta?.total ?? driversList.length;
  const totalPages = drivers?.meta?.totalPages ?? Math.ceil((driversList.length || 1) / pageSize);

  const stats = useMemo(() => {
    if (!driversList) return { total: 0, active: 0, inactive: 0 };
    return {
      total: totalCount || driversList.length,
      active: driversList.filter((d) => d.isActive).length,
      inactive: driversList.filter((d) => !d.isActive).length,
    };
  }, [driversList, totalCount]);

  const columns: ColumnDef<Driver>[] = useMemo(
    () => {
      const cols: ColumnDef<Driver>[] = [
        {
          accessorKey: 'firstName',
          header: 'Driver Identity',
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-foreground">
                  {`${row.original.firstName} ${row.original.lastName}`.trim()}
                </span>
                {!isSiteManager && (
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                    <Mail className="h-2.5 w-2.5 opacity-60" />
                    {row.original.email}
                  </div>
                )}
              </div>
            </div>
          ),
        },
        ...(!isSiteManager ? [
          {
            accessorKey: 'phoneNumber',
            header: 'Contact',
            cell: ({ row }) => (
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/80 tracking-tight">
                <Phone className="h-3.5 w-3.5 opacity-40" />
                {row.getValue('phoneNumber') || 'N/A'}
              </div>
            ),
          } as ColumnDef<Driver>
        ] : []),
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
          header: 'Actions',
          cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
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
                icon={<History className="h-3.5 w-3.5" />}
              />
              <ProtectedAction permission={AppPermission.DRIVER_DELETE}>
                <ActionIconButton
                  tooltip="Delete Driver"
                  tone="destructive"
                  onClick={() => setDriverToDelete(row.original)}
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                />
              </ProtectedAction>
            </div>
          ),
        },
      ];
      return cols;
    },
    [isSiteManager, router]
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
        className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto"
      >
        {/* Header Section */}
        <motion.div variants={staggerItem} className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Driver Management
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">Manage charging network drivers and access</p>
          </div>
        </motion.div>

        <Tabs key={defaultTab} defaultValue={defaultTab} className="w-full space-y-8">
          <TabsList className="bg-muted/40 p-1.5 border border-border/40 rounded-2xl backdrop-blur-md h-auto flex-wrap sm:flex-nowrap w-fit gap-1 shadow-inner">
            <ProtectedAction permission={AppPermission.DRIVER_UPDATE}>
              <TabsTrigger
                value="config"
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-2 cursor-pointer hover:bg-muted/20 hover:text-foreground text-muted-foreground"
              >
                <Settings className="h-3.5 w-3.5" />
                App Configuration
              </TabsTrigger>
            </ProtectedAction>
            <TabsTrigger
              value="drivers"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-2 cursor-pointer hover:bg-muted/20 hover:text-foreground text-muted-foreground"
            >
              <UsersListIcon className="h-3.5 w-3.5" />
              Drivers
            </TabsTrigger>
          </TabsList>

          <ProtectedAction permission={AppPermission.DRIVER_UPDATE}>
            <TabsContent value="config">
              <DriverAppConfig />
            </TabsContent>
          </ProtectedAction>

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
                data={driversList}
                columns={columns}
                isLoading={isLoading}
                showSearch
                searchPosition="end"
                onSearch={(value: string) => {
                  setSearch(value);
                  setPage(1);
                }}
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
                appendWithSearch={
                  <ProtectedAction permission={AppPermission.DRIVER_CREATE}>
                    <Button
                      onClick={() => setIsFormModalOpen(true)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold shrink-0"
                    >
                      <UserPlus className="h-4 w-4" />
                      Add Driver
                    </Button>
                  </ProtectedAction>
                }
                maxHeight="700px"
                className="border-none shadow-none"
                renderMobileCard={(driver) => (
                  <div className="bg-card border border-border rounded-[1.5rem] p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {driver.firstName[0]}{driver.lastName[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">
                            {`${driver.firstName} ${driver.lastName}`.trim()}
                          </span>
                          {!isSiteManager && (
                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                              <Mail className="h-2.5 w-2.5" />
                              {driver.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize font-bold px-2 py-0.5 rounded-full border shadow-sm text-[9px] uppercase tracking-tighter",
                          driver.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        )}
                      >
                        {driver.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className={cn("grid gap-4 py-1", isSiteManager ? "grid-cols-1" : "grid-cols-2")}>
                      {!isSiteManager && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase text-muted-foreground/50 tracking-wider flex items-center gap-1">
                            <Phone className="h-2.5 w-2.5" /> Contact
                          </span>
                          <p className="text-sm font-semibold">{driver.phoneNumber || 'N/A'}</p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/50 tracking-wider flex items-center gap-1">
                          <Calendar className="h-2.5 w-2.5" /> Joined
                        </span>
                        <p className="text-sm font-semibold">{formatDate(driver.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/50">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 px-4 rounded-xl font-bold text-xs flex-1"
                        onClick={() =>
                          router.push(
                            `${FRONTEND_ROUTES.DRIVER_DETAILS(driver.id)}?name=${encodeURIComponent(
                              `${driver.firstName} ${driver.lastName}`
                            )}`
                          )
                        }
                      >
                        <History className="h-3.5 w-3.5 mr-1.5" />
                        Charging History
                      </Button>
                      <ProtectedAction permission={AppPermission.DRIVER_DELETE}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 rounded-xl font-bold text-xs text-destructive hover:bg-destructive/10 border-destructive/20"
                          onClick={() => setDriverToDelete(driver)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Delete
                        </Button>
                      </ProtectedAction>
                    </div>
                  </div>
                )}
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
                    <ProtectedAction permission={AppPermission.DRIVER_CREATE}>
                      <Button
                        onClick={() => setIsFormModalOpen(true)}
                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-black px-8 mt-4 uppercase tracking-widest text-[10px]"
                      >
                        Add First Driver
                      </Button>
                    </ProtectedAction>
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

        <DeleteDriverModal
          isOpen={!!driverToDelete}
          onClose={() => setDriverToDelete(null)}
          driver={driverToDelete}
          isLoading={deleteDriverMutation.isPending}
          onConfirm={() => {
            if (driverToDelete) {
              deleteDriverMutation.mutate(driverToDelete.id, {
                onSuccess: () => setDriverToDelete(null),
              });
            }
          }}
        />
      </motion.div>
    </TooltipProvider>
  );
}
