'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useLocations } from '@/hooks/get/useLocations';
import { useDeleteLocation } from '@/hooks/delete/useLocationMutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Trash2, Pencil } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Table } from '@/components/shared/Table';
import { Location } from '@/types';
import { formatDate } from '@/lib/date';

export function LocationsContainer() {
  const { data: locations, isLoading, error } = useLocations();
  const deleteLocation = useDeleteLocation();

  const columns: ColumnDef<Location>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.getValue('name')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => (
          <div className="max-w-xs truncate text-muted-foreground">
            {row.getValue('address')}
          </div>
        ),
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'country',
        header: 'Country',
      },
      {
        accessorKey: 'stationCount',
        header: 'Stations',
        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.getValue('stationCount') || 0} stations
          </Badge>
        ),
        meta: {
          headerAlign: 'center',
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.getValue('isActive') ? 'default' : 'secondary'}>
            {row.getValue('isActive') ? 'Active' : 'Inactive'}
          </Badge>
        ),
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
              onClick={() => {
                // TODO: Implement edit functionality
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm('Are you sure you want to delete this location?')) {
                  deleteLocation.mutate(row.original.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
        meta: {
          headerAlign: 'right',
        },
      },
    ],
    [deleteLocation]
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-6 rounded-lg border border-destructive bg-destructive/10">
          <p className="text-destructive font-medium">Failed to load locations</p>
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
          <h1 className="text-3xl font-bold">Locations</h1>
          <p className="text-muted-foreground">Manage charging station locations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Table<Location>
          data={locations || []}
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
