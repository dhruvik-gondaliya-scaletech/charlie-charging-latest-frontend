'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LocationForm } from '../components/LocationForm';
import { useUpdateLocation } from '@/hooks/put/useLocationMutations';
import { useLocations } from '@/hooks/get/useLocations';
import { LocationFormData } from '@/lib/validations/location.schema';
import { MapPin, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { Button } from '@/components/ui/button';

interface LocationUpdateContainerProps {
    locationId: string;
}

export function LocationUpdateContainer({ locationId }: LocationUpdateContainerProps) {
    const router = useRouter();
    const { data: locations, isLoading: isFetching } = useLocations();
    const updateLocation = useUpdateLocation();

    const location = locations?.find(l => l.id === locationId);

    const handleSubmit = (data: LocationFormData) => {
        updateLocation.mutate(
            { id: locationId, data },
            {
                onSuccess: () => {
                    router.push(FRONTEND_ROUTES.LOCATIONS);
                },
            }
        );
    };

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Synchronizing Registry...</p>
            </div>
        );
    }

    if (!location) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="p-6 rounded-full bg-destructive/10 text-destructive mb-6">
                    <AlertTriangle className="h-12 w-12" />
                </div>
                <h2 className="text-2xl font-black mb-2">Location Not Found</h2>
                <p className="text-muted-foreground mb-8">The location you are trying to edit does not exist in our registry.</p>
                <Button onClick={() => router.push(FRONTEND_ROUTES.LOCATIONS)} className="font-bold">
                    Return to Hub
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                onClick={() => router.push(FRONTEND_ROUTES.LOCATIONS)}
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors group"
            >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Return to Sites List
            </button>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Location Configuration</h1>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-70">Update operational metrics for this charging site</p>
                    </div>
                </div>
            </div>

            <div className="bg-card/30 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5">
                <LocationForm
                    initialData={location}
                    onSubmit={handleSubmit}
                    isLoading={updateLocation.isPending}
                    mode="edit"
                />
            </div>
        </div>
    );
}
