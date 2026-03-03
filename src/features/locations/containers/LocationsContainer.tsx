'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useLocations } from '@/hooks/get/useLocations';
import { useDeleteLocation } from '@/hooks/delete/useLocationMutations';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Trash2, Pencil, Zap, AlertTriangle, Eye } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Table } from '@/components/shared/Table';
import { Location } from '@/types';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DEFAULT_PAGE_SIZE, FRONTEND_ROUTES } from '@/constants/constants';

export function LocationsContainer() {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const { data: locations, isLoading, error } = useLocations();
  const deleteLocation = useDeleteLocation();

  const handleCreate = () => {
    router.push(FRONTEND_ROUTES.LOCATIONS_NEW);
  };

  const handleEdit = (location: Location) => {
    router.push(FRONTEND_ROUTES.LOCATIONS_EDIT(location.id));
  };

  const handleViewDetails = (location: Location) => {
    router.push(FRONTEND_ROUTES.LOCATIONS_DETAILS(location.id));
  };

  const handleDelete = (location: Location) => {
    setSelectedLocation(location);
    setIsDeleteModalOpen(true);
  };



  const columns: ColumnDef<Location>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{row.getValue('name')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => {
          const address = row.getValue('address') as string;
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-xs truncate text-muted-foreground text-xs font-medium cursor-help">
                  {address}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-xs">{address}</p>
              </TooltipContent>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: 'city',
        header: 'City',
        cell: ({ row }) => <span className="text-xs font-semibold">{row.original.city}, {row.original.state}</span>
      },
      {
        accessorKey: 'stationCount',
        header: 'Stations',
        cell: ({ row }) => (
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            {row.getValue('stationCount') || 0} units
          </Badge>
        ),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
          const isActive = row.getValue('isActive') as boolean;
          return (
            <Badge
              variant="outline"
              className={cn(
                "capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm",
                isActive
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {isActive ? 'Live' : 'Inactive'}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex justify-start gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={() => handleViewDetails(row.original)}
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
    []
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="p-8 text-center max-w-md border border-destructive/20 bg-destructive/5 rounded-2xl">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-bold text-lg">Failed to load locations</p>
          <p className="text-sm text-muted-foreground mt-2">There was an error connecting to the location registry. Please try again or contact support.</p>
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
            Location Hub
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">Strategic Fleet Positioning & Asset Management</p>
        </motion.div>

        <motion.div variants={staggerItem} className="relative">
          <Table<Location>
            data={locations || []}
            columns={columns}
            isLoading={isLoading}
            showSearch
            searchPosition="end"
            appendWithSearch={
              <Button
                onClick={handleCreate}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold shrink-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Define New Location
              </Button>
            }
            pageSize={DEFAULT_PAGE_SIZE || 25}
            maxHeight="650px"
            className="border-none shadow-none"
            emptyState={
              <div className="py-20 flex flex-col items-center justify-center text-center gap-6 bg-card/10 rounded-[2.5rem] border-2 border-dashed border-border/40">
                <div className="p-6 rounded-full bg-primary/5 text-primary/40 ring-1 ring-primary/10">
                  <MapPin className="h-16 w-16" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight text-foreground">No locations found</h3>
                  <p className="max-w-xs text-muted-foreground font-medium text-sm leading-relaxed mx-auto">
                    Your location registry is empty. Start by defining your first strategic charging site.
                  </p>
                </div>
                <Button
                  onClick={handleCreate}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 font-black px-8"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Define New Location
                </Button>
              </div>
            }
          />
        </motion.div>



        {/* Delete Confirmation Modal */}
        <AnimatedModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Retire Location"
          description="Are you absolutely sure? This will deactivate the location. All associated stations will remain in the system but the site will be marked as inactive."
          size="md"
          footer={
            <div className="flex gap-3 justify-end w-full">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedLocation) {
                    deleteLocation.mutate(selectedLocation.id, {
                      onSuccess: () => setIsDeleteModalOpen(false),
                    });
                  }
                }}
                disabled={deleteLocation.isPending}
                className="font-bold"
              >
                {deleteLocation.isPending ? 'Retiring...' : 'Confirm Retirement'}
              </Button>
            </div>
          }
        >
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-destructive/5 border border-destructive/20 text-destructive">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p className="text-sm font-medium">You are about to retire <strong>{selectedLocation?.name}</strong>. This action marks the site as inactive.</p>
          </div>
        </AnimatedModal>
      </motion.div>
    </TooltipProvider>
  );
}
