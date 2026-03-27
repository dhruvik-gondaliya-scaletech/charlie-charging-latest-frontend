'use client';

import React, { useMemo, useState } from 'react';
import { useStationSessions } from '@/hooks/get/useStations';
import { Table } from '@/components/shared/Table';
import { ColumnDef } from '@tanstack/react-table';
import { Session, SessionStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatTime, formatDuration as formatDurationUtil } from '@/lib/date';
import { cn } from '@/lib/utils';
import {
    Zap,
    Clock,
    Battery,
    AlertCircle,
    History,
    User as UserIcon,
    Cable,
    ArrowRight,
    Download,
    Filter,
    Calendar,
    RefreshCw,
    Terminal
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { DatePicker } from '@/components/shared/DatePicker';
import { startOfDay, endOfDay, format } from 'date-fns';

interface StationSessionsProps {
    stationId: string;
    onViewLogs?: (sessionId: string) => void;
}

export function StationSessions({ stationId, onViewLogs }: StationSessionsProps) {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    });

    const filters = useMemo(() => ({
        status: statusFilter === 'all' ? undefined : statusFilter,
        startFrom: dateRange.from ? format(startOfDay(dateRange.from), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : undefined,
        startTo: dateRange.to ? format(endOfDay(dateRange.to), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : undefined,
    }), [statusFilter, dateRange]);

    const { data: sessions, isLoading, error, refetch } = useStationSessions(stationId, filters);

    const columns: ColumnDef<Session>[] = useMemo(
        () => [
            {
                accessorKey: 'user',
                header: 'User',
                cell: ({ row }) => {
                    const firstName = row.original.userFirstName;
                    const lastName = row.original.userLastName;
                    const fullName = firstName && lastName ? `${firstName} ${lastName}` : 'Guest User';

                    return (
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                                <UserIcon className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-foreground tracking-tight">{fullName}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'connectorId',
                header: 'Connector',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 font-black text-primary uppercase tracking-widest text-[10px]">
                            <Zap className="h-3 w-3" />
                            <span>{row.original.connectorTypes || 'CCS1'}</span>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground ml-4">
                            ({row.original.connectorMaxPower || 22} kW)
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'pluggedAt',
                header: 'Plugged At',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <Cable className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase text-foreground">{formatDate(row.original.pluggedAt || row.original.startTime, 'MMM dd, yyyy')}</span>
                            <span className="text-[10px] font-bold text-muted-foreground">{formatTime(row.original.pluggedAt || row.original.startTime)}</span>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'startTime',
                header: 'Start Time',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                            <Clock className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase text-foreground">{formatDate(row.original.startTime, 'MMM dd, yyyy')}</span>
                            <span className="text-[10px] font-bold text-muted-foreground">{formatTime(row.original.startTime)}</span>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'endTime',
                header: 'End Time',
                cell: ({ row }) => row.original.endTime ? (
                    <div className="flex items-center gap-2 opacity-80">
                        <div className="p-1.5 rounded-lg bg-destructive/10 text-destructive">
                            <Clock className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase text-foreground">{formatDate(row.original.endTime, 'MMM dd, yyyy')}</span>
                            <span className="text-[10px] font-bold text-muted-foreground">{formatTime(row.original.endTime)}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center w-full">
                        <Badge variant="outline" className="text-[10px] uppercase font-black bg-blue-500/10 text-blue-500 border-blue-500/20">Active</Badge>
                    </div>
                ),
            },
            {
                accessorKey: 'unpluggedAt',
                header: 'Unplugged At',
                cell: ({ row }) => row.original.unpluggedAt ? (
                    <div className="flex items-center gap-2 opacity-60">
                        <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                            <Cable className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase text-foreground">{formatDate(row.original.unpluggedAt, 'MMM dd, yyyy')}</span>
                            <span className="text-[10px] font-bold text-muted-foreground">{formatTime(row.original.unpluggedAt)}</span>
                        </div>
                    </div>
                ) : (
                    <span className="text-muted-foreground text-xs font-bold ml-6">-</span>
                ),
            },
            {
                id: 'duration',
                header: 'Duration',
                cell: ({ row }) => {
                    const durationText = formatDurationUtil(row.original.startTime, row.original.endTime);
                    const isLessThanMinute = durationText === '0m';

                    return (
                        <div className="flex items-center gap-2 font-bold text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 opacity-40" />
                            <span>{isLessThanMinute ? 'Less than a minute' : durationText}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'energyDeliveredKwh',
                header: 'Energy',
                cell: ({ row }) => {
                    const energy = row.original.energyDeliveredKwh || row.original.energyDelivered || 0;
                    return (
                        <div className="flex items-center gap-1.5 font-black text-foreground">
                            <Zap className="h-3.5 w-3.5 text-emerald-500" />
                            <span>{energy.toFixed(2)}</span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">kWh</span>
                        </div>
                    );
                },
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
                            className={cn("capitalize font-black px-2.5 py-0.5 rounded-lg border text-[10px] uppercase tracking-widest", colorClasses)}
                        >
                            {status.replace('_', ' ')}
                        </Badge>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const transactionId = row.original.transactionId;
                    if (!transactionId) return null;

                    return (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewLogs?.(row.original.id)}
                            className="h-8 px-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10"
                        >
                            <Terminal className="h-3.5 w-3.5 mr-1.5" />
                            View Logs
                        </Button>
                    );
                },
            },
        ],
        [onViewLogs]
    );

    if (isLoading && !sessions) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <Skeleton className="h-10 w-48 rounded-xl" />
                    <Skeleton className="h-10 w-64 rounded-xl" />
                </div>
                <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl flex gap-4">
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                    <Skeleton className="h-10 w-48 rounded-xl" />
                </div>
                <div className="rounded-2xl border border-border/40 overflow-hidden">
                    <div className="p-4 space-y-4">
                        {Array(5).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-xl" />
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
                <h3 className="text-lg font-bold text-destructive underline decoration-2">Failed to Load Diagnostic Data</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2 opacity-60">Critical error during transaction matrix synchronization</p>
                <Button onClick={() => refetch()} variant="outline" className="mt-6 rounded-full border-destructive/20 text-destructive hover:bg-destructive/10">
                    Attempt Reconnaissance
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3 uppercase">
                        <History className="h-6 w-6 text-primary" />
                        Charging Sessions
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-50">Real-time ledger of energy flow and user interactions</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl border-border/40 font-bold gap-2">
                    <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                    Refresh
                </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 p-4 md:p-6 bg-muted/20 backdrop-blur-sm border border-border/40 rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filter by:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] rounded-xl border-border/40 bg-card/20 font-bold uppercase tracking-widest text-[10px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/40 bg-card/95 backdrop-blur-xl">
                            <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Statuses</SelectItem>
                            <SelectItem value="completed" className="text-[10px] font-black uppercase tracking-widest">Completed</SelectItem>
                            <SelectItem value="in-progress" className="text-[10px] font-black uppercase tracking-widest">In Progress</SelectItem>
                            <SelectItem value="failed" className="text-[10px] font-black uppercase tracking-widest">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date range:</span>
                    <DatePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
                </div>
            </div>

            <Table<Session>
                data={sessions || []}
                columns={columns}
                isLoading={isLoading}
                pageSize={10}
                maxHeight="800px"
                className="border-none shadow-none"
                emptyState={
                    <div className="py-20 flex flex-col items-center justify-center text-center gap-6">
                        <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center border border-dashed border-border/60">
                            <Battery className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                        <div>
                            <p className="text-xl font-black uppercase tracking-tighter text-muted-foreground">No Transmission Records</p>
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">This node has processed no energy exchange in this lifecycle.</p>
                        </div>
                    </div>
                }
            />
        </div>
    );
}
