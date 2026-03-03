'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    MapPin,
    Globe,
    Navigation,
    Calendar,
    Clock,
    Info,
    Building2,
    Hash
} from 'lucide-react';
import { Location } from '@/types';
import { formatDate } from '@/lib/date';

interface LocationOverviewProps {
    location: Location;
}

export function LocationOverview({ location }: LocationOverviewProps) {
    const details = [
        { label: 'Display Name', value: location.name, icon: Info },
        { label: 'Global Address', value: location.address, icon: MapPin },
        { label: 'City / Region', value: location.city, icon: Building2 },
        { label: 'State / Province', value: location.state || 'N/A', icon: Navigation },
        { label: 'Country Code', value: location.country, icon: Globe },
        { label: 'Postal Code', value: location.zipCode, icon: Hash },
        { label: 'Latitude', value: location.latitude?.toFixed(6) || 'N/A', icon: Navigation },
        { label: 'Longitude', value: location.longitude?.toFixed(6) || 'N/A', icon: Navigation },
        { label: 'System Status', value: location.isActive ? 'Active' : 'Inactive', icon: Clock },
        { label: 'Creation Date', value: formatDate(location.createdAt || new Date()), icon: Calendar },
        { label: 'Last Sync', value: formatDate(location.updatedAt || new Date()), icon: Clock },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black">Location Parameters</CardTitle>
                                <CardDescription>Detailed site metadata and geographic anchors</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 p-2">
                            {details.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <div className="mt-1 p-1.5 rounded-md bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        {item.icon && <item.icon className="h-3 w-3" />}
                                    </div>
                                    <div className="flex flex-col gap-0.5 border-b border-border/10 flex-1 pb-2">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                                        <span className="text-sm font-bold tracking-tight">{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm rounded-3xl overflow-hidden border-2 h-full">
                <CardHeader>
                    <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
                        <Navigation className="h-5 w-5" />
                        Geographic Context
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="aspect-square rounded-2xl bg-muted/30 flex items-center justify-center border border-dashed border-primary/20 p-8 text-center">
                        <div className="space-y-2">
                            <MapPin className="h-12 w-12 text-primary/40 mx-auto" />
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Map Preview Not Available</p>
                            <p className="text-[10px] text-muted-foreground/60 leading-tight">Coordinates: {location.latitude}, {location.longitude}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-background/50 border border-primary/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Status Report</p>
                            <p className="text-sm font-bold">This location is currently {location.isActive ? 'broadcasting' : 'offline'} on the global network.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
