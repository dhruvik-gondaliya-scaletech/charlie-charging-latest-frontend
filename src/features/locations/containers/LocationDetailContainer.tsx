'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocation } from '@/hooks/get/useLocations';
import { useStations } from '@/hooks/get/useStations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Building2,
    Activity,
    ShieldCheck,
    MapPin,
    History,
    Zap,
    LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '../../dashboard/components/StatCard';
import { LocationOverview } from '../components/LocationOverview';
import { LocationStations } from '../components/LocationStations';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function LocationDetailContainer() {
    const { id } = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');

    const { data: location, isLoading: isLocationLoading, error: locationError } = useLocation(id as string);
    const { data: stations, isLoading: isStationsLoading } = useStations({ locationId: id as string });

    if (isLocationLoading) {
        return (
            <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-3xl" />
                    ))}
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-12 w-full max-w-2xl rounded-2xl" />
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                </div>
            </div>
        );
    }

    if (locationError || !location) {
        return (
            <div className="flex items-center justify-center min-h-[600px] p-8">
                <div className="text-center space-y-4 max-w-md">
                    <div className="p-4 rounded-full bg-destructive/10 text-destructive inline-block">
                        <Building2 className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold">Location Not Found</h2>
                    <p className="text-muted-foreground">The requested site could not be found or you don't have permission to access it.</p>
                    <Button onClick={() => router.push(FRONTEND_ROUTES.LOCATIONS)} variant="outline" className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sites
                    </Button>
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
            {/* Header Section */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <button
                        onClick={() => router.push(FRONTEND_ROUTES.LOCATIONS)}
                        className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Return to Sites List
                    </button>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">{location.name}</h1>
                        <Badge
                            variant="outline"
                            className={cn(
                                "px-3 py-1 rounded-full border shadow-sm font-bold uppercase tracking-widest text-[10px]",
                                location.isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-destructive/10 text-destructive border-destructive/30"
                            )}
                        >
                            {location.isActive ? 'Network Active' : 'Offline'}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground mt-2">
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                            <MapPin className="h-3.5 w-3.5" />
                            {location.city}, {location.country}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => router.push(FRONTEND_ROUTES.LOCATIONS_EDIT(location.id))}
                        className="border-border/60 hover:bg-muted font-bold h-11 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Configure Site
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Active Terminals"
                    value={stations?.length || 0}
                    icon={Zap}
                    color="text-primary"
                    bottomRightGlobe="bg-primary"
                    description="Equipment connected to site"
                />
                <StatCard
                    title="Site Connectivity"
                    value={location.isActive ? '100%' : '0%'}
                    icon={Activity}
                    color="text-emerald-500"
                    bottomRightGlobe="bg-emerald-500"
                    description="Network reachability status"
                />
                <StatCard
                    title="Operational Status"
                    value={location.isActive ? 'Active' : 'Offline'}
                    icon={ShieldCheck}
                    color={location.isActive ? "text-blue-500" : "text-destructive"}
                    bottomRightGlobe={location.isActive ? "bg-blue-500" : "bg-destructive"}
                    description="Global system state"
                />
            </motion.div>

            {/* Main Content Tabs */}
            <motion.div variants={fadeInUp}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-muted/40 p-1 border border-border/40 rounded-2xl backdrop-blur-md h-auto flex-wrap sm:flex-nowrap">
                        <TabsTrigger value="overview" className="rounded-xl font-black uppercase tracking-widest text-[11px] px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                        <TabsTrigger value="stations" className="rounded-xl font-black uppercase tracking-widest text-[11px] px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">Assigned Stations</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <LocationOverview location={location} />
                    </TabsContent>

                    <TabsContent value="stations">
                        <LocationStations stations={stations || []} isLoading={isStationsLoading} />
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
}
