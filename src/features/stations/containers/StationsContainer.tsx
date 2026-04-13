'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useStations, useStationStats } from '@/hooks/get/useStations';
import {
  useDeleteStation
} from '@/hooks/delete/useStationMutations';
import { useWebSocketConnection, useRealTimeEvent } from '@/hooks/useRealTime';
import { StationStatusChangeEvent, ConnectorStatusChangeEvent } from '@/lib/realtime.service';
import { useQueryClient } from '@tanstack/react-query';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { Activity, WifiOff, AlertCircle } from 'lucide-react';
import {
  invalidateQueriesDebounced,
  updateStationInListCache
} from '@/lib/query-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActionIconButton } from '@/components/shared/ActionIconButton';
import { Plus, Pencil, Trash2, AlertTriangle, Zap, Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Filter States
  const [search, setSearch] = useState(searchParams.get('name') || '');
  const [status, setStatus] = useState<string>(searchParams.get('status') || 'ALL');
  const [type, setType] = useState<string>(searchParams.get('type') || 'ALL');

  const debouncedSearch = useDebounce(search, 500);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('name', debouncedSearch);
    if (status !== 'ALL') params.set('status', status);
    if (type !== 'ALL') params.set('type', type);

    const queryString = params.toString();
    const newPath = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;

    // Use window.history.replaceState to avoid adding to history stack on every keystroke
    window.history.replaceState(null, '', newPath);
  }, [debouncedSearch, status, type]);

  const { data: stations, isLoading, isFetching, error } = useStations({
    name: debouncedSearch || undefined,
    status: status === 'ALL' ? undefined : status,
    type: type === 'ALL' ? undefined : type,
  });
  const { data: stats, isLoading: isStatsLoading } = useStationStats();

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
      invalidateQueriesDebounced(queryClient, [['stations'], ['station-stats']]);
    }
  );

  // Listen for connector status changes
  useRealTimeEvent<ConnectorStatusChangeEvent>(
    'connector-status-change',
    (data) => {
      console.log(`Connector ${data.connectorId} on station ${data.stationId} status updated to ${data.status}`);

      // Since connectors aren't directly shown in the main table list (it's usually a summary),
      // we'll just debounce the refresh for the list.
      invalidateQueriesDebounced(queryClient, [['stations'], ['station-stats']]);
    }
  );

  // Mutations
  const deleteStation = useDeleteStation();

  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const handleClearFilters = () => {
    setSearch('');
    setStatus('ALL');
    setType('ALL');
  };

  const isFiltered = search !== '' || status !== 'ALL' || type !== 'ALL';

  const handleEdit = (station: Station) => {
    router.push(`${FRONTEND_ROUTES.STATIONS_EDIT(station.id)}?name=${encodeURIComponent(station.name)}`);
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
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors inline-block"
                onClick={() => router.push(`${FRONTEND_ROUTES.STATIONS_DETAILS(row.original.id)}?name=${encodeURIComponent(row.original.name)}`)}
              >
                {row.getValue('name')}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">View Details</p>
            </TooltipContent>
          </Tooltip>
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
            <ActionIconButton
              tone="primary"
              tooltip="Edit Station"
              icon={<Pencil className="h-4 w-4" />}
              onClick={() => handleEdit(row.original)}
            />

            <ActionIconButton
              tone="destructive"
              tooltip="Delete Station"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => handleDelete(row.original)}
            />
          </div>
        ),
      },
    ],
    [router]
  );


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
            Stations
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">Manage and monitor your stations</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={staggerItem}>
            <StatCard
              title="Total Stations"
              value={stats?.total ?? 0}
              icon={Zap}
              color="text-primary"
              description="Connected to network"
              loading={isStatsLoading}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatCard
              title="Active"
              value={stats?.active ?? 0}
              icon={Activity}
              color="text-emerald-500"
              description="Currently online"
              bottomRightGlobe="bg-emerald-500"
              loading={isStatsLoading}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatCard
              title="Offline"
              value={stats?.offline ?? 0}
              icon={WifiOff}
              color="text-orange-500"
              description="Connection lost"
              bottomRightGlobe="bg-orange-500"
              loading={isStatsLoading}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatCard
              title="Faulted"
              value={stats?.faulted ?? 0}
              icon={AlertCircle}
              color="text-destructive"
              description="Requires attention"
              bottomRightGlobe="bg-destructive"
              loading={isStatsLoading}
            />
          </motion.div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div variants={staggerItem} className="flex flex-col md:flex-row gap-4 items-end bg-card/30 p-4 rounded-2xl border border-border/40 backdrop-blur-md">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Search Stations</label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background/50 border-border/40 focus:border-primary/50 transition-all rounded-xl"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-48 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-background/50 border-border/40 rounded-xl">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.values(ChargingStatus).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-40 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-background/50 border-border/40 rounded-xl">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="AC">AC (Alternating Current)</SelectItem>
                <SelectItem value="DC">DC (Direct Current)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="h-10 px-4 hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-bold transition-all rounded-xl"
              >
                Reset
              </Button>
            )}
            <Button
              onClick={() => router.push(FRONTEND_ROUTES.STATIONS_REGISTER)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold h-10 px-6 rounded-xl shrink-0"
            >
              <Plus className="h-4 w-4" />
              Create Station
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className={cn(
            "relative transition-opacity duration-300",
            isFetching && !isLoading && "opacity-60 pointer-events-none"
          )}
        >
          <Table<Station>
            data={stations || []}
            columns={columns}
            isLoading={isLoading}
            showSearch={false}
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
                  <Plus className="h-4 w-4" />
                  Create Station
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
