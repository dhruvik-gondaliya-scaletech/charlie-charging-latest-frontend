'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/components/shared/Table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Zap } from 'lucide-react';
import { Station, ChargingStatus } from '@/types';
import { cn } from '@/lib/utils';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface LocationStationsProps {
    stations: Station[];
    isLoading: boolean;
}

export function LocationStations({ stations, isLoading }: LocationStationsProps) {
    const router = useRouter();

    const columns: ColumnDef<Station>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Station ID',
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-bold tracking-tight">{row.getValue('name')}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{row.original.chargePointId}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Current Status',
                cell: ({ row }) => {
                    const status = row.getValue('status') as ChargingStatus;
                    let colorClasses = "";
                    if (status === ChargingStatus.AVAILABLE) {
                        colorClasses = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                    } else if (status === ChargingStatus.CHARGING || status === ChargingStatus.PREPARING || status === ChargingStatus.FINISHING) {
                        colorClasses = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                    } else if (status === ChargingStatus.OFFLINE || status === ChargingStatus.FAULTED || status === ChargingStatus.UNAVAILABLE) {
                        colorClasses = "bg-destructive/10 text-destructive border-destructive/20";
                    } else {
                        colorClasses = "bg-muted text-muted-foreground border-border";
                    }

                    return (
                        <Badge
                            variant="outline"
                            className={cn("capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm text-[10px] tracking-widest", colorClasses)}
                        >
                            {status}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'vendor',
                header: 'Hardware Specs',
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="text-sm font-bold">{row.original.vendor}</span>
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tight">{row.original.model}</span>
                    </div>
                )
            },
            {
                accessorKey: 'maxPower',
                header: 'Capacity',
                cell: ({ row }) => (
                    <div className="flex items-center gap-1.5 font-black">
                        <span className="text-lg tracking-tighter">{row.getValue('maxPower')}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">kW</span>
                    </div>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => router.push(FRONTEND_ROUTES.STATIONS_DETAILS(row.original.id))}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                ),
            },
        ],
        [router]
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h3 className="text-2xl font-black tracking-tight text-foreground">Assigned Stations</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Real-time assets reporting at this location</p>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                    {stations.length} Units Online
                </Badge>
            </div>

            <Table<Station>
                data={stations}
                columns={columns}
                isLoading={isLoading}
                pageSize={10}
                className="border-none shadow-none"
                emptyState={
                    <div className="py-20 flex flex-col items-center justify-center text-center gap-6 bg-card/10 rounded-[2.5rem] border-2 border-dashed border-border/40">
                        <div className="p-6 rounded-full bg-primary/5 text-primary/40 ring-1 ring-primary/10">
                            <Zap className="h-12 w-12" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black tracking-tight text-foreground">No stations found</h3>
                            <p className="max-w-xs text-muted-foreground font-medium text-xs leading-relaxed mx-auto uppercase tracking-wider opacity-60">
                                This location has no charging equipment assigned yet.
                            </p>
                        </div>
                    </div>
                }
            />
        </div>
    );
}
