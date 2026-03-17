'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useStations } from '@/hooks/get/useStations';
import {
  useCreateStation,
  useUpdateStation,
  useDeleteStation
} from '@/hooks/delete/useStationMutations';
import { useWebSocketConnection, useRealTimeEvent } from '@/hooks/useRealTime';
import { StationStatusChangeEvent, ConnectorStatusChangeEvent } from '@/lib/realtime.service';
import { useQueryClient } from '@tanstack/react-query';
import {
  invalidateQueriesDebounced,
  updateStationInListCache
} from '@/lib/query-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Pencil, Trash2, AlertTriangle, Zap } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Table } from '@/components/shared/Table';
import { Station, ChargingStatus } from '@/types';
import { formatDate } from '@/lib/date';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { cn } from '@/lib/utils';
import { DEFAULT_PAGE_SIZE, FRONTEND_ROUTES } from '@/constants/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function StationsContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: stations, isLoading, error } = useStations();

  // Establish WebSocket connection
  useWebSocketConnection();

  // Listen for station status changes
  useRealTimeEvent<StationStatusChangeEvent>(
    'station-status-change',
    (data) => {
      console.log(`Station ${data.stationId} status updated to ${data.status}`);

      // 1. Optimistic update in list
      updateStationInListCache(queryClient, data.stationId, { status: data.status });

      // 2. Debounced refresh
      invalidateQueriesDebounced(queryClient, ['stations']);
    }
  );

  // Listen for connector status changes
  useRealTimeEvent<ConnectorStatusChangeEvent>(
    'connector-status-change',
    (data) => {
      console.log(`Connector ${data.connectorId} on station ${data.stationId} status updated to ${data.status}`);

      // Since connectors aren't directly shown in the main table list (it's usually a summary),
      // we'll just debounce the refresh for the list.
      invalidateQueriesDebounced(queryClient, ['stations']);
    }
  );

  // Mutations
  const createStation = useCreateStation();
  const updateStation = useUpdateStation();
  const deleteStation = useDeleteStation();

  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const handleEdit = (station: Station) => {
    router.push(FRONTEND_ROUTES.STATIONS_EDIT(station.id));
  };

  const handleDelete = (station: Station) => {
    setSelectedStation(station);
    setIsDeleteModalOpen(true);
  };

  const columns: ColumnDef<Station>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="font-semibold text-foreground">{row.getValue('name')}</div>
        ),
      },
      {
        accessorKey: 'chargePointId',
        header: 'ID',
        cell: ({ row }) => (
          <code className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-mono text-muted-foreground">
            {row.getValue('chargePointId')}
          </code>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as ChargingStatus;

          let colorClasses = "";
          if (status === ChargingStatus.AVAILABLE) {
            colorClasses = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
          } else if (status === ChargingStatus.CHARGING || status === ChargingStatus.PREPARING || status === ChargingStatus.FINISHING) {
            colorClasses = "bg-blue-500/10 text-blue-500 border-blue-500/20";
          } else if (status === ChargingStatus.OFFLINE || status === ChargingStatus.FAULTED || status === ChargingStatus.UNAVAILABLE) {
            colorClasses = "bg-destructive/10 text-destructive border-destructive/20";
          } else {
            colorClasses = "bg-muted text-muted-foreground border-border";
          }

          return (
            <Badge
              variant="outline"
              className={cn("capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm", colorClasses)}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'vendor',
        header: 'Hardware',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.vendor}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-tight">{row.original.model}</span>
          </div>
        )
      },
      {
        accessorKey: 'maxPower',
        header: 'Power',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 font-bold">
            <span>{row.getValue('maxPower')}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">kW</span>
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Added',
        cell: ({ row }) => (
          <div className="text-xs text-muted-foreground">
            {formatDate(row.getValue('createdAt'))}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary cursor-pointer"
                  onClick={() => router.push(FRONTEND_ROUTES.STATIONS_DETAILS(row.original.id))}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">View Details</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary cursor-pointer"
                  onClick={() => handleEdit(row.original)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Edit Station</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  onClick={() => handleDelete(row.original)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Delete Station</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ),
      },
    ],
    [router]
  );

  if (isLoading) {
    return (
      <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="rounded-2xl border border-border/40 overflow-hidden">
            <div className="bg-muted/30 p-4 border-b border-border/40 space-y-2">
              <div className="flex gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-4 flex-1" />
                ))}
              </div>
            </div>
            <div className="p-4 space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex gap-4">
                  {Array(6).fill(0).map((_, j) => (
                    <Skeleton key={j} className="h-12 flex-1 rounded-xl" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="p-8 text-center max-w-md border border-destructive/20 bg-destructive/5 rounded-2xl">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-bold text-lg">Failed to load stations</p>
          <p className="text-sm text-muted-foreground mt-2">There was an error connecting to the management service. Please try again or contact support.</p>
          <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>Retry Connection</Button>
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
        <motion.div variants={staggerItem}>
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Charging Stations
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">Manage and monitor your decentralized charging network</p>
        </motion.div>

        <motion.div variants={staggerItem} className="relative">
          <Table<Station>
            data={stations || []}
            columns={columns}
            isLoading={isLoading}
            showSearch
            searchPosition="end"
            appendWithSearch={
              <Button
                onClick={() => router.push(FRONTEND_ROUTES.STATIONS_REGISTER)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold shrink-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Register Station
              </Button>
            }
            pageSize={DEFAULT_PAGE_SIZE || 25}
            maxHeight="650px"
            className="border-none shadow-none"
            emptyState={
              <div className="py-20 flex flex-col items-center justify-center text-center gap-6 bg-card/10 rounded-[2.5rem] border-2 border-dashed border-border/40">
                <div className="p-6 rounded-full bg-primary/5 text-primary/40 ring-1 ring-primary/10">
                  <Zap className="h-16 w-16" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight text-foreground">No stations found</h3>
                  <p className="max-w-xs text-muted-foreground font-medium text-sm leading-relaxed mx-auto">
                    Your decentralized charging network is empty. Start by registering your first charging station.
                  </p>
                </div>
                <Button
                  onClick={() => router.push(FRONTEND_ROUTES.STATIONS_REGISTER)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 font-black px-8"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Register New Station
                </Button>
              </div>
            }
          />
        </motion.div>



        {/* Delete Confirmation Modal */}
        <AnimatedModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Charging Station"
          description="Are you absolutely sure? This action cannot be undone. This will permanently remove the station and all associated session logs from our servers."
          size="md"
          footer={
            <div className="flex gap-3 justify-end w-full">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel Request
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedStation) {
                    deleteStation.mutate(selectedStation.id, {
                      onSuccess: () => setIsDeleteModalOpen(false),
                    });
                  }
                }}
                disabled={deleteStation.isPending}
                className="font-bold"
              >
                {deleteStation.isPending ? 'Removing...' : 'Confirm Deletion'}
              </Button>
            </div>
          }
        >
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-destructive/5 border border-destructive/20 text-destructive">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p className="text-sm font-medium">You are about to delete <strong>{selectedStation?.name}</strong> ({selectedStation?.chargePointId}).</p>
          </div>
        </AnimatedModal>
      </motion.div>
    </TooltipProvider>
  );
}
