'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStation } from '@/hooks/get/useStations';
import { useLocations } from '@/hooks/get/useLocations';
import { useUpdateStation, useCreateStation } from '@/hooks/delete/useStationMutations';
import { StationWizard } from '../components/StationWizard';
import { Activity, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Station, ConnectorType } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useAuth } from '@/contexts/AuthContext';

interface StationWizardContainerProps {
    stationId?: string;
    mode: 'create' | 'edit';
}

export function StationWizardContainer({ stationId, mode }: StationWizardContainerProps) {
    const router = useRouter();
    const { tenant } = useAuth();
    const isEdit = mode === 'edit';
    const { data: station, isLoading: stationLoading, error } = useStation(stationId || '', { enabled: isEdit && !!stationId });
    const { data: locations, isLoading: locationsLoading } = useLocations();
    const updateStation = useUpdateStation();
    const createStation = useCreateStation();
    const isPending = isEdit ? updateStation.isPending : createStation.isPending;

    // Normalize data: ensure connectorTypes is populated from connectors if missing
    // CRITICAL: Do NOT use Set here, as it reduces count if types are duplicate (e.g. 2x Type2)
    const normalizedStation = useMemo(() => {
        if (!station) return isEdit ? null : {};

        return {
            ...station,
            connectorTypes: station.connectorTypes?.length
                ? station.connectorTypes
                : station.connectors?.map(c => c.type as ConnectorType).filter(Boolean) || []
        };
    }, [station, isEdit]);

    if ((isEdit && stationLoading) || locationsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Activity className="h-10 w-10 text-primary animate-pulse" />
                <p className="text-muted-foreground font-medium animate-pulse">
                    {isEdit ? 'Fetching station configuration...' : 'Preparing registration environment...'}
                </p>
            </div>
        );
    }

    if (isEdit && (error || !station)) {
        return (
            <div className="flex items-center justify-center min-h-[400px] p-8">
                <div className="text-center space-y-4 max-w-md">
                    <div className="p-4 rounded-full bg-destructive/10 text-destructive inline-block">
                        <ShieldCheck className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold">Station Not Found</h2>
                    <p className="text-muted-foreground">We couldn't locate the charging station you're trying to edit.</p>
                    <Button onClick={() => router.push(FRONTEND_ROUTES.STATIONS)} variant="outline" className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Fleet
                    </Button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (values: any) => {
        try {
            // Create station data object matching old validation/flow
            const stationData = {
                ...values,
                connectorCount: values.connectorTypes?.length || 0,
                isOccupied: isEdit ? station?.isOccupied : false,
                isActive: isEdit ? station?.isActive : true,
                locationId: values.locationId || undefined,
            };

            if (isEdit && stationId) {
                await updateStation.mutateAsync({ id: stationId, data: stationData });
                router.push(FRONTEND_ROUTES.STATIONS_DETAILS(stationId));
            } else {
                const result = await createStation.mutateAsync({
                    ...stationData,
                    ocppConfiguration: {}
                } as any);
                router.push(FRONTEND_ROUTES.STATIONS_DETAILS(result.id));
            }
        } catch (err) {
            console.log("Error in StationWizardContainer", err)
        }
    };

    if (isEdit && !normalizedStation) return null;

    return (
        <StationWizard
            initialData={normalizedStation || {}}
            locations={locations || []}
            locationsLoading={locationsLoading}
            onSubmit={handleSubmit}
            isLoading={isPending}
            onCancel={() => router.back()}
            isEdit={isEdit}
            tenantSlug={tenant?.slug || tenant?.id || ''}
        />
    );
}
