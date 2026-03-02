'use client';

import React, { useMemo } from 'react';
import { useStationSessions } from '@/hooks/get/useStations';
import { Table } from '@/components/shared/Table';
import { ColumnDef } from '@tanstack/react-table';
import { Session, SessionStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDuration } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Zap, Clock, Battery, AlertCircle, History } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StationSessionsProps {
    stationId: string;
}

export function StationSessions({ stationId }: StationSessionsProps) {
    const { data: sessions, isLoading, error } = useStationSessions(stationId);

    const columns: ColumnDef<Session>[] = useMemo(
        () => [
            {
                accessorKey: 'transactionId',
                header: 'TX ID',
                cell: ({ row }) => (
                    <code className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-mono text-muted-foreground">
                        {row.getValue('transactionId') || 'N/A'}
                    </code>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.getValue('status') as string;
                    let colorClasses = "";

                    if (status === 'completed' || status === 'COMPLETED') {
                        colorClasses = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                    } else if (status === 'in-progress' || status === 'IN_PROGRESS') {
                        colorClasses = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                    } else {
                        colorClasses = "bg-destructive/10 text-destructive border-destructive/20";
                    }

                    return (
                        <Badge
                            variant="outline"
                            className={cn("capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm", colorClasses)}
                        >
                            {status.replace('_', ' ')}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'connectorId',
                header: 'Port',
                cell: ({ row }) => (
                    <div className="flex items-center gap-1.5 font-bold">
                        <Zap className="h-3 w-3 text-muted-foreground" />
                        <span>#{row.getValue('connectorId')}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'startTime',
                header: 'Started',
                cell: ({ row }) => (
                    <div className="text-xs font-medium">
                        {formatDate(row.getValue('startTime'))}
                    </div>
                ),
            },
            {
                accessorKey: 'energyDelivered',
                header: 'Energy',
                cell: ({ row }) => {
                    const energy = row.getValue('energyDelivered') as number;
                    return (
                        <div className="flex items-center gap-1.5 font-bold text-primary">
                            <Battery className="h-3.5 w-3.5" />
                            <span>{energy?.toFixed(2) || '0.00'}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">kWh</span>
                        </div>
                    );
                },
            },
            {
                id: 'duration',
                header: 'Duration',
                cell: ({ row }) => {
                    const start = new Date(row.original.startTime);
                    const end = row.original.endTime ? new Date(row.original.endTime) : new Date();
                    const durationMs = end.getTime() - start.getTime();
                    const minutes = Math.floor(durationMs / 60000);

                    return (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{minutes} min</span>
                        </div>
                    );
                },
            },
        ],
        []
    );

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48 rounded-xl" />
                        <Skeleton className="h-3 w-64 rounded-lg" />
                    </div>
                </div>
                <div className="rounded-2xl border border-border/40 overflow-hidden">
                    <div className="bg-muted/30 p-4 border-b border-border/40">
                        <div className="flex gap-4">
                            {Array(6).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-4 flex-1 rounded-md" />
                            ))}
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="flex gap-4">
                                {Array(6).fill(0).map((_, j) => (
                                    <Skeleton key={j} className="h-10 flex-1 rounded-lg" />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-destructive/20 rounded-[2rem] bg-destructive/5">
                <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-bold text-destructive">Failed to Load Sessions</h3>
                <p className="text-sm text-muted-foreground mt-2">There was an error fetching the transaction history for this station.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <History className="h-6 w-6 text-primary" />
                        Charging History
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Complete record of energy transactions</p>
                </div>
                {sessions && sessions.length > 0 && (
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-4 py-1 rounded-full">
                        {sessions.length} recorded sessions
                    </Badge>
                )}
            </div>

            <Table<Session>
                data={sessions || []}
                columns={columns}
                isLoading={isLoading}
                showSearch
                searchPosition="end"
                pageSize={10}
                maxHeight="600px"
                className="border-none shadow-none"
                emptyState={
                    <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
                        <Battery className="h-12 w-12 text-muted-foreground/40" />
                        <div>
                            <p className="text-xl font-bold text-muted-foreground">No sessions recorded</p>
                            <p className="text-sm text-muted-foreground opacity-60">This station hasn't processed any charging sessions yet.</p>
                        </div>
                    </div>
                }
            />
        </div>
    );
}
