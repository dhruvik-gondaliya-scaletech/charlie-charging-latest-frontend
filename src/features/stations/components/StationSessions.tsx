'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useStationSessions } from '@/hooks/get/useStations';
import { Table } from '@/components/shared/Table';
import { ColumnDef } from '@tanstack/react-table';
import { Session, SessionStatus, PaginatedResponse } from '@/types';
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
    Terminal,
    RotateCcw,
    Leaf,
    Share2,
    DollarSign
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShareSessionLogsModal } from '@/components/shared/ShareSessionLogsModal';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { DatePicker } from '@/components/shared/DatePicker';
import { startOfDay, endOfDay, format } from 'date-fns';
import { AppPermission } from '@/types';
import { ProtectedAction } from '@/components/shared/ProtectedAction';
import { useAuth } from '@/contexts/AuthContext';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';

interface StationSessionsProps {
    stationId: string;
    onViewLogs?: (sessionId: string) => void;
}

export function StationSessions({ stationId, onViewLogs }: StationSessionsProps) {
    const searchParams = useSearchParams();
    const selectedSessionId = searchParams ? searchParams.get('sessionId') : null;
    const selectedDateParam = searchParams ? searchParams.get('date') : null;

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    });

    const { environment } = useEnvironment();
    const [shareModal, setShareModal] = useState<{ isOpen: boolean; sessionId: string; date?: string }>({
        isOpen: false,
        sessionId: '',
        date: undefined,
    });

    const handleShareSession = (session: Session) => {
        const dateVal = session.startTime || session.pluggedAt;
        let dateStr: string | undefined;
        if (dateVal) {
            const d = new Date(dateVal);
            if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                dateStr = `${year}-${month}-${day}`;
            }
        }
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://scaleev.scaletech.xyz';
        const dateParam = dateStr ? `&date=${encodeURIComponent(dateStr)}` : '';
        const envParam = environment ? `&env=${encodeURIComponent(environment.toLowerCase())}` : '';
        const shareUrl = `${baseUrl}/stations/${stationId}?tab=logs${dateParam}&sessionId=${session.id}${envParam}`;

        try {
            navigator.clipboard.writeText(shareUrl);
            toast.success('Session logs link copied to clipboard!');
        } catch (e) {
            console.error('Copy failed:', e);
        }

        setShareModal({
            isOpen: true,
            sessionId: session.id,
            date: dateStr,
        });
    };

    useEffect(() => {
        if (selectedDateParam) {
            const parts = selectedDateParam.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const day = parseInt(parts[2], 10);
                const parsedDate = new Date(year, month, day);
                if (!isNaN(parsedDate.getTime())) {
                    setDateRange({ from: parsedDate, to: parsedDate });
                }
            } else {
                const parsedDate = new Date(selectedDateParam);
                if (!isNaN(parsedDate.getTime())) {
                    setDateRange({ from: parsedDate, to: parsedDate });
                }
            }
        }
    }, [selectedDateParam]);

    // Server-side pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);

    const handleResetFilters = () => {
        setStatusFilter('all');
        setDateRange({ from: undefined, to: undefined });
        setPage(1);
    };

    const isAnyFilterActive = statusFilter !== 'all' || dateRange.from || dateRange.to;

    const filters = useMemo(() => ({
        status: statusFilter === 'all' ? undefined : statusFilter,
        startFrom: dateRange.from ? format(startOfDay(dateRange.from), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : undefined,
        startTo: dateRange.to ? format(endOfDay(dateRange.to), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : undefined,
        page,
        limit,
    }), [statusFilter, dateRange, page, limit]);

    const { data: rawData, isLoading, error, refetch } = useStationSessions(stationId, filters);

    // Normalize the response (paginated or plain array)
    const isPaginatedData = rawData && !Array.isArray(rawData) && 'meta' in rawData;
    const sessions = useMemo<Session[]>(() => {
        if (!rawData) return [];
        if (Array.isArray(rawData)) return rawData;
        return (rawData as PaginatedResponse<Session>).items;
    }, [rawData]);
    const sessionsMeta = isPaginatedData ? (rawData as PaginatedResponse<Session>).meta : null;
    const totalSessionCount = sessionsMeta?.total ?? sessions.length;

    const { hasPermission } = useAuth();
    const canViewLogs = hasPermission(AppPermission.OCPP_LOGS_READ);

    const columns: ColumnDef<Session>[] = useMemo(
        () => {
            const cols: ColumnDef<Session>[] = [
            {
                accessorKey: 'user',
                header: 'User',
                cell: ({ row }) => {
                    const firstName = row.original.userFirstName;
                    const lastName = row.original.userLastName;
                    const fullName = firstName && lastName ? `${firstName} ${lastName}` : 'ChargePoint';
                    const useMode = row.original.useMode;

                    return (
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                                <UserIcon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-foreground tracking-tight leading-none">{fullName}</span>
                                {useMode && (
                                    <span className={cn(
                                        "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit",
                                        useMode === 'CSMS'
                                            ? "bg-violet-500/10 text-violet-500 border-violet-500/20"
                                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    )}>
                                        {useMode}
                                    </span>
                                )}
                            </div>
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
                            <span>{row.original.connectorType || 'Unknown'}</span>
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
                cell: ({ row }) => {
                    const val = row.original.pluggedAt || row.original.startTime;
                    if (!val) return <span className="text-muted-foreground text-xs font-bold ml-6">-</span>;
                    return (
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                                <Cable className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase text-foreground">{formatDate(val, 'MMM dd, yyyy')}</span>
                                <span className="text-[10px] font-bold text-muted-foreground">{formatTime(val)}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'remoteStartTime',
                header: 'Remote Start',
                cell: ({ row }) => {
                    const val = row.original.remoteStartTime;
                    if (!val) return <span className="text-muted-foreground text-xs font-bold ml-6">-</span>;
                    return (
                        <div className="flex items-center gap-2 opacity-80">
                            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                                <Clock className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase text-foreground">{formatDate(val, 'MMM dd, yyyy')}</span>
                                <span className="text-[10px] font-bold text-muted-foreground">{formatTime(val)}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'startTime',
                header: 'Start Time',
                cell: ({ row }) => {
                    const val = row.original.startTime;
                    if (!val) return <span className="text-muted-foreground text-xs font-bold ml-6">-</span>;
                    return (
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                <Clock className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase text-foreground">{formatDate(val, 'MMM dd, yyyy')}</span>
                                <span className="text-[10px] font-bold text-muted-foreground">{formatTime(val)}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'remoteStopTime',
                header: 'Remote Stop',
                cell: ({ row }) => {
                    const val = row.original.remoteStopTime;
                    if (!val) return <span className="text-muted-foreground text-xs font-bold ml-6">-</span>;
                    return (
                        <div className="flex items-center gap-2 opacity-80">
                            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-500">
                                <Clock className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase text-foreground">{formatDate(val, 'MMM dd, yyyy')}</span>
                                <span className="text-[10px] font-bold text-muted-foreground">{formatTime(val)}</span>
                            </div>
                        </div>
                    );
                },
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
                    if (!row.original.startTime) {
                        return <span className="text-muted-foreground text-xs font-bold ml-6">-</span>;
                    }
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
                id: 'cost',
                header: 'Cost',
                cell: ({ row }) => {
                    const cost = row.original.totalCost ?? row.original.cost ?? 0;
                    return (
                        <div className="flex items-center gap-1.5 font-black text-foreground">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                            <span>{cost.toFixed(2)}</span>
                        </div>
                    );
                },
            },
            {
                id: 'co2Emitted',
                header: 'CO2 Emitted',
                cell: ({ row }) => {
                    const energy = row.original.energyDeliveredKwh || row.original.energyDelivered || 0;
                    const co2Emitted = energy * 0.273;
                    return (
                        <div className="flex items-center gap-1.5 font-black text-foreground">
                            <Leaf className="h-3.5 w-3.5 text-emerald-500" />
                            <span>{co2Emitted.toFixed(2)}</span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">kg</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'currentSpeed',
                header: 'Speed',
                cell: ({ row }) => {
                    const speed = row.original.currentSpeed || 0;
                    return (
                        <div className="flex items-center gap-1.5 font-black text-foreground">
                            <Zap className="h-3.5 w-3.5 text-blue-500" />
                            <span>{speed.toFixed(2)}</span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">kW</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'peakKwh',
                header: 'Peak',
                cell: ({ row }) => {
                    const peak = row.original.peakKwh || 0;
                    return (
                        <div className="flex items-center gap-1.5 font-black text-foreground">
                            <Zap className="h-3.5 w-3.5 text-amber-500" />
                            <span>{peak.toFixed(2)}</span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">kW</span>
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
        ];

        if (canViewLogs) {
            cols.push({
                id: 'actions',
                header: 'Actions',
                size: 210,
                cell: ({ row }) => {
                    const transactionId = row.original.transactionId;
                    if (!transactionId) return null;

                    return (
                        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap min-w-[190px]">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewLogs?.(row.original.id)}
                                className="h-8 px-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors"
                            >
                                <Terminal className="h-3.5 w-3.5 mr-1.5" />
                                View Logs
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShareSession(row.original)}
                                className="h-8 px-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
                                title="Share Session Logs Link"
                            >
                                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                                Share Logs
                            </Button>
                        </div>
                    );
                },
            });
        }
        return cols;
    }, [canViewLogs, onViewLogs, stationId]);

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
                <h3 className="text-lg font-bold text-destructive underline decoration-2">Failed to Load Session Data</h3>
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
                    <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                        <History className="h-6 w-6 text-primary" />
                        Charging Sessions
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Real-time ledger of energy flow and user interactions</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-muted/20 backdrop-blur-sm border border-border/40 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filters:</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 w-full">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl border-border/40 bg-card/20 font-bold text-xs">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent className="w-[var(--radix-select-trigger-width)] sm:w-auto rounded-xl border-border/40 bg-card/95 backdrop-blur-xl">
                                <SelectItem value="all" className="text-xs font-semibold">All Statuses</SelectItem>
                                <SelectItem value={SessionStatus.COMPLETED} className="text-xs font-semibold">Completed</SelectItem>
                                <SelectItem value={SessionStatus.IN_PROGRESS} className="text-xs font-semibold">In Progress</SelectItem>
                                <SelectItem value={SessionStatus.FAILED} className="text-xs font-semibold">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Range Picker */}
                    <div className="flex items-center gap-2 w-full sm:w-auto sm:border-l sm:border-border/20 sm:pl-3">
                        <DatePicker 
                            dateRange={dateRange} 
                            onDateRangeChange={setDateRange}
                            className="h-10 w-full sm:w-auto"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                    {/* Reset Filters Button */}
                    {isAnyFilterActive && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            className="h-10 px-4 text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive transition-all flex items-center gap-2 rounded-xl flex-1 sm:flex-none justify-center"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset
                        </Button>
                    )}

                    {/* Refresh Button */}
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        className="h-10 flex items-center gap-2 font-bold bg-background hover:bg-muted border-border/40 transition-all active:scale-95 rounded-xl shadow-sm px-4 flex-1 sm:flex-none justify-center"
                        disabled={isLoading}
                    >
                        <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin text-primary")} />
                        <span className="text-xs">Refresh</span>
                    </Button>
                </div>
            </div>

            <Table<Session>
                data={sessions || []}
                columns={columns}
                isLoading={isLoading}
                pageSize={limit}
                maxHeight="800px"
                className="border-none shadow-none"
                manualPagination={true}
                totalCount={totalSessionCount}
                pageIndex={page - 1}
                onPageChange={(newPage) => setPage(newPage + 1)}
                onPageSizeChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                rowClassName={(session) => {
                    const isSelected = selectedSessionId && (session.id === selectedSessionId || String(session.transactionId) === selectedSessionId);
                    return isSelected ? "bg-primary/15 border-l-4 border-l-primary font-bold shadow-md shadow-primary/5 transition-all" : "";
                }}
                renderMobileCard={(session) => {
                    const isSelected = selectedSessionId && (session.id === selectedSessionId || String(session.transactionId) === selectedSessionId);
                    const status = session.status as string;
                    let colorClasses = "";
                    if (status?.toLowerCase().includes('completed')) colorClasses = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                    else if (status?.toLowerCase().includes('progress')) colorClasses = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                    else colorClasses = "bg-destructive/10 text-destructive border-destructive/20";

                    const fullName = session.userFirstName && session.userLastName ? `${session.userFirstName} ${session.userLastName}` : 'ChargePoint';

                    return (
                        <div className={cn(
                            "bg-card border border-border/50 rounded-3xl p-5 space-y-4 shadow-sm transition-all",
                            isSelected && "ring-2 ring-primary bg-primary/10 border-primary/50"
                        )}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground leading-tight">{fullName}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">
                                            {session.connectorType || 'CCS2'} • {session.connectorMaxPower || 22}kW
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className={cn("rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest", colorClasses)}>
                                    {status.replace('_', ' ')}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 py-2 border-y border-border/10">
                                {session.remoteStartTime && (
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-1">
                                            <Clock className="h-2.5 w-2.5" /> Remote Start
                                        </p>
                                        <p className="text-xs font-bold">{formatDate(session.remoteStartTime, 'MMM dd')} at {formatTime(session.remoteStartTime)}</p>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                                        <Clock className="h-2.5 w-2.5" /> Start Time
                                    </p>
                                    <p className="text-xs font-bold">
                                        {session.startTime ? `${formatDate(session.startTime, 'MMM dd')} at ${formatTime(session.startTime)}` : '-'}
                                    </p>
                                </div>
                                {session.remoteStopTime && (
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase text-pink-500 tracking-widest flex items-center gap-1">
                                            <Clock className="h-2.5 w-2.5" /> Remote Stop
                                        </p>
                                        <p className="text-xs font-bold">{formatDate(session.remoteStopTime, 'MMM dd')} at {formatTime(session.remoteStopTime)}</p>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                                        <Zap className="h-2.5 w-2.5" /> Energy
                                    </p>
                                    <p className="text-xs font-bold">{(session.energyDeliveredKwh || session.energyDelivered || 0).toFixed(2)} kWh</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                                        <Leaf className="h-2.5 w-2.5 text-emerald-500" /> CO2 Emitted
                                    </p>
                                    <p className="text-xs font-bold">{((session.energyDeliveredKwh || session.energyDelivered || 0) * 0.273).toFixed(2)} kg</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />
                                    <span className="text-xs font-bold text-muted-foreground">
                                        {session.startTime ? formatDurationUtil(session.startTime, session.endTime) : '-'}
                                    </span>
                                </div>
                                <ProtectedAction permission={AppPermission.OCPP_LOGS_READ}>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleShareSession(session)}
                                            className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
                                        >
                                            <Share2 className="h-3.5 w-3.5 mr-1.5" />
                                            Share Logs
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewLogs?.(session.id)}
                                            className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 hover:bg-primary/10"
                                        >
                                            <Terminal className="h-3.5 w-3.5 mr-1.5" />
                                            Logs
                                        </Button>
                                    </div>
                                </ProtectedAction>
                            </div>
                        </div>
                    );
                }}
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

            <ShareSessionLogsModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal(prev => ({ ...prev, isOpen: false }))}
                stationId={stationId}
                sessionId={shareModal.sessionId}
                date={shareModal.date}
            />
        </div>
    );
}
