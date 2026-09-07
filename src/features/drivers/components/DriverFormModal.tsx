'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { driverSchema, DriverFormValues } from '@/lib/validations/driver.schema';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateDriver } from '@/hooks/post/useCreateDriver';
import { useDebounce } from '@/hooks/use-debounce';
import { locationService } from '@/services/location.service';
import { Environment } from '@/constants/constants';
import { Location } from '@/types';
import { Mail, User, MapPin, Search, Loader2, X } from 'lucide-react';

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DriverFormModal({ isOpen, onClose }: DriverFormModalProps) {
  const createDriver = useCreateDriver();
  const [locationSearch, setLocationSearch] = React.useState('');
  const debouncedLocationSearch = useDebounce(locationSearch, 400);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      locationId: '',
    }
  });

  const selectedLocationId = watch('locationId');

  const { data: prodLocationsResponse, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations', Environment.PROD, { search: debouncedLocationSearch }],
    queryFn: () => locationService.getAllLocations(Environment.PROD, { search: debouncedLocationSearch || undefined }),
    staleTime: 60000,
  });

  const prodLocations = React.useMemo(() => {
    const locations = Array.isArray(prodLocationsResponse)
      ? (prodLocationsResponse as Location[])
      : ((prodLocationsResponse as { data?: Location[] } | undefined)?.data ?? []);
    return locations;
  }, [prodLocationsResponse]);

  const selectedLocation = prodLocations.find((loc) => loc.id === selectedLocationId);

  const onSubmit = (data: DriverFormValues) => {
    createDriver.mutate({
      ...data,
      locationId: data.locationId || undefined,
    }, {
      onSuccess: () => {
        reset();
        setLocationSearch('');
        onClose();
      },
    });
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={() => {
        reset();
        setLocationSearch('');
        onClose();
      }}
      title="Register New Driver"
      description="Enter driver credentials to grant access to the charging network infrastructure."
      size="md"
      footer={
        <div className="flex gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] border-border/40 hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="driver-form"
            onClick={handleSubmit(onSubmit)}
            disabled={createDriver.isPending}
            className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary shadow-lg shadow-primary/20"
          >
            {createDriver.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirm Registration"
            )}
          </Button>
        </div>
      }
    >
      <form id="driver-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                id="firstName"
                placeholder="John"
                className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                autoComplete="given-name"
                {...register('firstName')}
              />
            </div>
            {errors.firstName && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                id="lastName"
                placeholder="Doe"
                className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                autoComplete="family-name"
                {...register('lastName')}
              />
            </div>
            {errors.lastName && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              id="email"
              type="email"
              placeholder="driver@enterprise.com"
              className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
              autoComplete="email"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Location (Optional)</Label>
            {selectedLocation && (
              <button
                type="button"
                onClick={() => setValue('locationId', '', { shouldValidate: true })}
                className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 hover:text-destructive"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              type="text"
              placeholder={selectedLocation ? selectedLocation.name : "Search production locations..."}
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
            />
          </div>
          {locationsLoading ? (
            <div className="flex items-center text-xs text-muted-foreground/60 ml-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              Loading locations...
            </div>
          ) : prodLocations.length === 0 ? (
            <p className="text-xs text-muted-foreground/60 ml-1">No production locations found.</p>
          ) : (
            <div className="max-h-40 overflow-y-auto border border-border/40 bg-muted/10 rounded-xl p-2 space-y-1">
              {prodLocations.map((loc) => {
                const isSelected = selectedLocationId === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() =>
                      setValue('locationId', isSelected ? '' : loc.id, { shouldValidate: true })
                    }
                    className={`flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-primary/15 text-primary'
                        : 'text-foreground/80 hover:bg-muted/40'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="truncate">{loc.name}</span>
                  </button>
                );
              })}
            </div>
          )}
          {errors.locationId && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.locationId.message}</p>}
        </div>

      </form>
    </AnimatedModal>
  );
}
