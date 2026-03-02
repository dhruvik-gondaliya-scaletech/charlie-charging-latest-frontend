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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Table } from '@/components/shared/Table';
import { Station, ChargingStatus } from '@/types';
import { formatDate } from '@/lib/date';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { cn } from '@/lib/utils';

export function StationsContainer() {
  const router = useRouter();
  const { data: stations, isLoading, error } = useStations();

  // Mutations
  const createStation = useCreateStation();
  const updateStation = useUpdateStation();
  const deleteStation = useDeleteStation();

  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const handleEdit = (station: Station) => {
    router.push(`/stations/${station.id}/edit`);
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={() => router.push(`/stations/${row.original.id}`)}
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              onClick={() => handleEdit(row.original)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleDelete(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
              onClick={() => router.push('/stations/register')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Register Station
            </Button>
          }
          pageSize={25}
          maxHeight="650px"
          className="border-none shadow-none"
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
  );
}
