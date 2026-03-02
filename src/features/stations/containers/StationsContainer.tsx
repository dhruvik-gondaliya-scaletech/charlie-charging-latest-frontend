'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useStations } from '@/hooks/get/useStations';
import { useDeleteStation } from '@/hooks/delete/useStationMutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Table } from '@/components/shared/Table';
import { Station } from '@/types';
import { formatDate } from '@/lib/date';

export function StationsContainer() {
  const router = useRouter();
  const { data: stations, isLoading, error } = useStations();
  const deleteStation = useDeleteStation();

  const columns: ColumnDef<Station>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue('name')}</div>
        ),
      },
      {
        accessorKey: 'chargePointId',
        header: 'Charge Point ID',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <Badge
              variant={
                status === 'available' ? 'default' :
                status === 'charging' ? 'secondary' :
                status === 'offline' ? 'destructive' :
                'outline'
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'vendor',
        header: 'Vendor',
      },
      {
        accessorKey: 'model',
        header: 'Model',
      },
      {
        accessorKey: 'maxPower',
        header: 'Max Power (kW)',
        cell: ({ row }) => `${row.getValue('maxPower')} kW`,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => formatDate(row.getValue('createdAt')),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/stations/${row.original.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/stations/${row.original.id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm('Are you sure you want to delete this station?')) {
                  deleteStation.mutate(row.original.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [router, deleteStation]
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-6 rounded-lg border border-destructive bg-destructive/10">
          <p className="text-destructive font-medium">Failed to load stations</p>
          <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
        </div>
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
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Charging Stations</h1>
          <p className="text-muted-foreground">Manage your charging infrastructure</p>
        </div>
        <Button onClick={() => router.push('/stations/add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Station
        </Button>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Table<Station>
          data={stations || []}
          columns={columns}
          isLoading={isLoading}
          showSearch
          searchPosition="end"
          pageSize={25}
          maxHeight="600px"
        />
      </motion.div>
    </motion.div>
  );
}
