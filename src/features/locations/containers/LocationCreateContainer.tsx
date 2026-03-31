'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LocationForm } from '../components/LocationForm';
import { useCreateLocation } from '@/hooks/post/useLocationMutations';
import { LocationFormData } from '@/lib/validations/location.schema';
import { MapPin } from 'lucide-react';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { BackButton } from '@/components/shared/BackButton';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';

export function LocationCreateContainer() {
    const router = useRouter();
    const createLocation = useCreateLocation();

    const handleSubmit = (data: LocationFormData) => {
        createLocation.mutate(data, {
            onSuccess: () => {
                router.push(FRONTEND_ROUTES.LOCATIONS);
            },
        });
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="p-4 md:p-8 max-w-5xl mx-auto"
        >
            <motion.div variants={fadeInUp} className="space-y-6">
                <BackButton
                    href={FRONTEND_ROUTES.LOCATIONS}
                    label="Return to Locations"
                />
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Strategic Site Definition</h1>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-70"> Register a new charging destination in the ecosystem</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card/30 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5">
                    <LocationForm
                        onSubmit={handleSubmit}
                        isLoading={createLocation.isPending}
                        mode="create"
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}
