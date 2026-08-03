'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { useLocations } from '@/hooks/get/useLocations';
import { useDeleteLocation } from '@/hooks/delete/useLocationMutations';
import { useTransferLocation } from '@/hooks/post/useLocationMutations';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActionIconButton } from '@/components/shared/ActionIconButton';
import { Plus, MapPin, Trash2, Pencil, Zap, AlertTriangle, ArrowRightLeft, Search } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Table } from '@/components/shared/Table';
import { Input } from '@/components/ui/input';
import { Location, LocationEnv, PaginatedResponse } from '@/types';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useDebounce } from '@/hooks/use-debounce';

const SERVER_PAGE_SIZE = 25;

export function LocationsContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Server-side search + pagination state
  const [search, setSearch] = useState(() => {
    const fromUrl = searchParams.get('search') || searchParams.get('name');
    if (fromUrl !== null) return fromUrl;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('locations_search') || '';
    }
    return '';
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(SERVER_PAGE_SIZE);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);

    const queryString = params.toString();
    const newPath = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
    window.history.replaceState(null, '', newPath);

    if (typeof window !== 'undefined') {
      localStorage.setItem('locations_search', search);
    }
  }, [debouncedSearch, search]);

  // Reset to page 1 whenever the search changes
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const { data: rawData, isLoading, error } = useLocations({
    search: debouncedSearch || undefined,
    page,
    limit,
  });

  // Normalise the server response — paginated or plain array
  const isPaginated = rawData && !Array.isArray(rawData) && 'meta' in rawData;
  const locations = useMemo<Location[]>(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return [...rawData].sort((a, b) => a.name.localeCompare(b.name));
    return (rawData as PaginatedResponse<Location>).items;
  }, [rawData]);
  const paginationMeta = isPaginated ? (rawData as PaginatedResponse<Location>).meta : null;
  const totalCount = paginationMeta?.total ?? locations.length;
  const deleteLocation = useDeleteLocation();
  const transferLocation = useTransferLocation();

  const handleCreate = () => {
    router.push(FRONTEND_ROUTES.LOCATIONS_NEW);
  };

  const handleEdit = useCallback((location: Location) => {
    router.push(`${FRONTEND_ROUTES.LOCATIONS_EDIT(location.id)}?name=${encodeURIComponent(location.name)}`);
  }, [router]);

  const handleViewDetails = useCallback((location: Location) => {
    router.push(`${FRONTEND_ROUTES.LOCATIONS_DETAILS(location.id)}?name=${encodeURIComponent(location.name)}`);
  }, [router]);

  const handleDelete = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsDeleteModalOpen(true);
  }, []);



  const columns: ColumnDef<Location>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group"
                onClick={() => handleViewDetails(row.original)}
              >
                {/* <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> */}
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {row.getValue('name')}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">View Details</p>
            </TooltipContent>
          </Tooltip>
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
              <TooltipContent className="max-w-xs">
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
        accessorKey: 'visibility',
        header: 'Visibility',
        cell: ({ row }) => {
          const visibility = row.original.visibility || 'public';
          return (
            <Badge
              variant="outline"
              className={cn(
                "capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm",
                visibility === 'public'
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              )}
            >
              {visibility}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Active/Inactive',
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
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'stationCount',
        header: 'Total Stations',
        cell: ({ row }) => (
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            {row.getValue('stationCount') || 0} units
          </Badge>
        ),
      },
      {
        accessorKey: 'offlineStationCount',
        header: 'Offline Stations',
        cell: ({ row }) => {
          const offlineCount = row.original.offlineStationCount || 0;
          return (
            <Badge
              variant="outline"
              className={cn(
                "font-bold px-2.5 py-0.5 rounded-full border shadow-sm",
                offlineCount > 0
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {offlineCount} units
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex justify-start gap-1">
            {row.original.locationEnv === LocationEnv.DEVELOPMENT && (
              <ActionIconButton
                tone="primary"
                tooltip="Transfer to Production"
                icon={<ArrowRightLeft className="h-4 w-4" />}
                onClick={() => {
                  setSelectedLocation(row.original);
                  setIsTransferModalOpen(true);
                }}
              />
            )}

            <ActionIconButton
              tone="primary"
              tooltip="Edit Location"
              icon={<Pencil className="h-4 w-4" />}
              onClick={() => handleEdit(row.original)}
            />

            <ActionIconButton
              tone="destructive"
              tooltip="Delete Location"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => handleDelete(row.original)}
            />
          </div>
        ),
      },
      {
        accessorKey: 'locationEnv',
        header: 'Environment',
        cell: ({ row }) => {
          const env = row.original.locationEnv;
          if (!env) return <span className="text-xs text-muted-foreground">-</span>;
          return (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border tracking-wider",
                env === LocationEnv.PRODUCTION
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-blue-500/10 text-blue-500 border-blue-500/20"
              )}
            >
              {env === LocationEnv.PRODUCTION ? 'Production' : 'Development'}
            </Badge>
          );
        },
      },
    ],
    [handleEdit, handleViewDetails, handleDelete]
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
        className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto"
      >
        <motion.div variants={staggerItem} className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Locations
          </h1>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground tracking-tight">Manange your charging locations</p>
        </motion.div>

        <motion.div variants={staggerItem} className="relative">
          {/* Server-side search input */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-10 rounded-xl border-border/50 bg-card/20"
              />
            </div>
            <Button
              onClick={handleCreate}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-bold shrink-0"
            >
              <Plus className="h-4 w-4" />
              Create Location
            </Button>
          </div>

          <Table<Location>
            data={locations}
            columns={columns}
            isLoading={isLoading}
            pageSize={limit}
            maxHeight="650px"
            className="border-none shadow-none"
            manualPagination={true}
            totalCount={totalCount}
            pageIndex={page - 1}
            onPageChange={(newPage) => setPage(newPage + 1)}
            onPageSizeChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
            renderMobileCard={(location) => (
              <div className="bg-card border border-border rounded-[1.5rem] p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start text-left">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className="font-bold text-lg cursor-pointer hover:text-primary transition-colors leading-tight"
                        onClick={() => handleViewDetails(location)}
                      >
                        {location.name}
                      </h3>
                      {location.locationEnv && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border tracking-wider",
                            location.locationEnv === LocationEnv.PRODUCTION
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          )}
                        >
                          {location.locationEnv === LocationEnv.PRODUCTION ? 'PROD' : 'DEV'}
                        </Badge>
                      )}
                      {location.visibility && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border tracking-wider",
                            location.visibility === 'public'
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          )}
                        >
                          {location.visibility}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs font-medium truncate max-w-[200px]">{location.city}, {location.state}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm",
                      location.isActive
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {location.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Full Address</span>
                  <p className="text-sm font-medium leading-normal">{location.address}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold px-2.5 py-1 rounded-xl shadow-sm text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    {location.stationCount || 0} Total Stations
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-bold px-2.5 py-1 rounded-xl shadow-sm text-xs",
                      (location.offlineStationCount || 0) > 0
                        ? "bg-rose-500/5 text-rose-500 border-rose-500/10"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {location.offlineStationCount || 0} Offline
                  </Badge>
                </div>

                {/* No Separator needed if using ghost/secondary buttons at bottom */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/50">
                  {location.locationEnv === LocationEnv.DEVELOPMENT && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 px-3 rounded-xl font-bold text-xs bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                      onClick={() => {
                        setSelectedLocation(location);
                        setIsTransferModalOpen(true);
                      }}
                    >
                      <ArrowRightLeft className="h-3.5 w-3.5 mr-1.5" />
                      To Prod
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 px-3 rounded-xl font-bold text-xs"
                    onClick={() => handleEdit(location)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 rounded-xl font-bold text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(location)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
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
                  <Plus className="h-4 w-4" />
                  Create Location
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

        {/* Transfer Confirmation Modal */}
        <AnimatedModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          title="Transfer to Production"
          description="Are you sure you want to transfer this location to Production? This will make the location active in the live environment."
          size="md"
          footer={
            <div className="flex gap-3 justify-end w-full">
              <Button variant="outline" onClick={() => setIsTransferModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  if (selectedLocation) {
                    transferLocation.mutate(
                      { id: selectedLocation.id, targetEnv: LocationEnv.PRODUCTION },
                      { onSuccess: () => setIsTransferModalOpen(false) }
                    );
                  }
                }}
                disabled={transferLocation.isPending}
                className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {transferLocation.isPending ? 'Transferring...' : 'Confirm Transfer'}
              </Button>
            </div>
          }
        >
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <p className="text-sm font-medium">You are about to transfer <strong>{selectedLocation?.name}</strong> to the Production environment. Ensure that all associated stations are moved to the Production Environment and are ready for live use.</p>
          </div>
        </AnimatedModal>
      </motion.div>
    </TooltipProvider>
  );
}
