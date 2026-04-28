'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useInfiniteOcppLogs } from '@/hooks/get/useStations';
import { useInView } from 'react-intersection-observer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import {
    Terminal,
    Activity,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    ArrowDownLeft,
    ArrowUpRight,
    Loader2,
    Filter,
    Calendar,
    RotateCcw
} from 'lucide-react';
import { OcppLog } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { DatePicker } from '@/components/shared/DatePicker';
import { startOfDay, endOfDay, format } from 'date-fns';

interface StationLogsProps {
    stationId: string;
    sessionId?: string;
    onClearSessionId?: () => void;
}

const OCPP_MESSAGE_TYPES = [
    'BootNotification',
    'StatusNotification',
    'Heartbeat',
    'Authorize',
    'StartTransaction',
    'StopTransaction',
    'MeterValues',
    'DataTransfer',
    'FirmwareStatusNotification',
    'Reset',
    'ChangeConfiguration',
    'ChangeAvailability',
    'RemoteStartTransaction',
    'RemoteStopTransaction',
    'SetChargingProfile',
    'ClearChargingProfile',
    'GetConfiguration',
    'GetCompositeSchedule',
    'TriggerMessage',
    'GetDiagnostics',
    'UpdateFirmware',
    'AuthorizeRemoteTxStop',
];

export function StationLogs({ stationId, sessionId, onClearSessionId }: StationLogsProps) {
    const [directionFilter, setDirectionFilter] = useState<string>('all');
    const [messageTypeFilter, setMessageTypeFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    });

    const filters = useMemo(() => ({
        limit: 15,
        sessionId,
        direction: directionFilter === 'all' ? undefined : (directionFilter as 'INCOMING' | 'OUTGOING'),
        messageType: messageTypeFilter === 'all' ? undefined : messageTypeFilter,
        startDate: dateRange.from ? format(startOfDay(dateRange.from), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : undefined,
        endDate: dateRange.to ? format(endOfDay(dateRange.to), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : undefined,
    }), [sessionId, directionFilter, messageTypeFilter, dateRange]);

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch
    } = useInfiniteOcppLogs(stationId, filters);

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

    // Flatten pages into a single logs array
    const logs = data?.pages.flatMap(page => page.logs) || [];

    const handleResetFilters = () => {
        setDirectionFilter('all');
        setMessageTypeFilter('all');
        setDateRange({ from: undefined, to: undefined });
    };

    const isAnyFilterActive = directionFilter !== 'all' || messageTypeFilter !== 'all' || dateRange.from || dateRange.to;

    if (isLoading && !logs.length) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <div className="space-y-3">
                    {Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-0 h-auto min-h-[600px] md:h-[800px]">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 mb-6">
                <div>
                    <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                        <Terminal className="h-6 w-6 text-primary" />
                        OCPP Diagnostic Stream
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Real-time machine communication logs</p>
                </div>
            </div>

            {/* Sticky Header: Multi-layered Filters */}
            <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm pb-6 pt-1 space-y-4">
                {/* Advanced Server-side Filters */}
                <div className="flex flex-wrap items-center lg:items-center gap-3 p-3 sm:p-4 bg-muted/20 backdrop-blur-sm border border-border/40 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <Filter className="h-3.5 w-3.5 text-muted-foreground/60" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filters:</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 flex-1 w-full">
                        {/* Direction Filter */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Select value={directionFilter} onValueChange={setDirectionFilter}>
                                <SelectTrigger className="w-full sm:w-[140px] h-10 rounded-xl border-border/40 bg-card/20 font-bold text-xs">
                                    <SelectValue placeholder="Direction" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/40 bg-card/95 backdrop-blur-xl">
                                    <SelectItem value="all" className="text-xs font-semibold">All Flow</SelectItem>
                                    <SelectItem value="INCOMING" className="text-xs font-semibold">Incoming</SelectItem>
                                    <SelectItem value="OUTGOING" className="text-xs font-semibold">Outgoing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Message Type Filter */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Select value={messageTypeFilter} onValueChange={setMessageTypeFilter}>
                                <SelectTrigger className="w-full sm:w-[220px] h-10 rounded-xl border-border/40 bg-card/20 font-bold text-xs">
                                    <SelectValue placeholder="Message Type" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[400px] w-[var(--radix-select-trigger-width)] sm:w-auto rounded-xl border-border/40 bg-card/95 backdrop-blur-xl">
                                    <SelectItem value="all" className="text-xs font-semibold">Any Message Type</SelectItem>
                                    {OCPP_MESSAGE_TYPES.sort().map((type) => (
                                        <SelectItem key={type} value={type} className="text-xs font-medium">
                                            {type}
                                        </SelectItem>
                                    ))}
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

                    <div className="flex items-center gap-2 w-full lg:w-auto lg:ml-auto">
                        {/* Reset Filters Button */}
                        {isAnyFilterActive && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResetFilters}
                                className="h-10 px-4 text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive transition-all flex items-center gap-2 rounded-xl flex-1 lg:flex-none justify-center"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset
                            </Button>
                        )}

                        {/* Refresh Logs Button */}
                        <Button
                            variant="outline"
                            onClick={() => refetch()}
                            className="h-10 flex items-center gap-2 font-bold bg-background hover:bg-muted border-border/40 transition-all active:scale-95 rounded-xl shadow-sm px-4 flex-1 lg:flex-none justify-center"
                            disabled={isLoading}
                        >
                            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin text-primary")} />
                            <span className="text-xs">Refresh Logs</span>
                        </Button>
                    </div>
                </div>

                {sessionId && (
                    <div className="flex items-center justify-between gap-3 bg-primary/5 border border-primary/20 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold tracking-tight flex items-center gap-2">
                                    Filtering by Session
                                    <Badge variant="outline" className="text-xs font-mono font-bold border-primary/40 bg-primary/10 text-primary">
                                        {sessionId}
                                    </Badge>
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearSessionId}
                            className="h-10 text-xs font-bold hover:bg-primary/20 hover:text-primary transition-colors"
                        >
                            Clear Session Filter
                        </Button>
                    </div>
                )}
            </div>

            {/* Scrollable Logs Container */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 min-h-0 pt-4">
                {logs.length > 0 ? (
                    logs.map((log, idx) => (
                        <div
                            key={`${log.id}-${idx}`}
                            className={cn(
                                "group border border-border/50 rounded-2xl overflow-hidden transition-all duration-200",
                                expandedLogId === log.id ? "bg-card shadow-lg border-primary/30 ring-1 ring-primary/10" : "bg-card/40 hover:bg-card/60 hover:border-border/80"
                            )}
                        >
                            <div
                                className="flex items-center justify-between p-3.5 sm:p-5 cursor-pointer"
                                onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                            >
                                <div className="flex items-center gap-5 min-w-0">
                                    <div className={cn(
                                        "p-3 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                        log.direction === 'INCOMING' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                                    )}>
                                        {log.direction === 'INCOMING' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="text-sm sm:text-base font-bold tracking-tight truncate">
                                                {log.messageType}
                                            </p>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            {formatDate(log.createdAt)}
                                            <span className="hidden sm:block h-1 w-1 rounded-full bg-muted-foreground/30" />
                                            <span className="font-mono text-[10px] sm:text-[11px] opacity-70 truncate">{log.messageId || 'NO-ID'}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-medium text-muted-foreground hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                                        Inspect Message
                                    </span>
                                    <div className="p-2 rounded-full group-hover:bg-muted transition-colors">
                                        {expandedLogId === log.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </div>
                                </div>
                            </div>

                            {expandedLogId === log.id && (
                                <div className="p-5 pt-0 border-t border-border/10 bg-muted/5 animate-in slide-in-from-top-1 duration-200">
                                    <div className="mt-4 rounded-xl bg-black/90 p-6 shadow-inner border border-white/5 overflow-x-auto ring-1 ring-white/5">
                                        <pre className="text-[13px] font-mono text-emerald-400/90 leading-relaxed custom-scrollbar">
                                            {JSON.stringify(log.message, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-24 text-center border-2 border-dashed border-border/40 rounded-[2rem] bg-muted/10 animate-in fade-in zoom-in-95 duration-500">
                        <Terminal className="h-14 w-14 text-muted-foreground mx-auto mb-5 opacity-20" />
                        <p className="text-muted-foreground text-lg font-semibold tracking-tight">No diagnostic data found</p>
                        <p className="text-sm text-muted-foreground/60 mt-2 font-medium">Try adjusting your filters or search terms</p>
                    </div>
                )}

                {/* Observer element for infinite scroll */}
                <div ref={ref} className="h-20 flex items-center justify-center border-t border-border/5 mt-4">
                    {isFetchingNextPage ? (
                        <div className="flex items-center gap-3 text-primary p-3 rounded-full bg-primary/5 px-6 border border-primary/10 shadow-sm animate-pulse">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-[10px] uppercase tracking-black font-black tracking-widest">Streaming events...</span>
                        </div>
                    ) : (
                        !hasNextPage && logs.length > 0 && (
                            <div className="flex flex-col items-center gap-2 opacity-40 py-4">
                                <div className="h-px w-20 bg-border/40" />
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                                    End of diagnostic stream
                                </span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
