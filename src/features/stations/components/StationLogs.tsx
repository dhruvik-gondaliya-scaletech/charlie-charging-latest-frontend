'use client';

import React, { useState, useEffect } from 'react';
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
    Search,
    Loader2
} from 'lucide-react';
import { OcppLog, OcppLogResponse } from '@/types';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface StationLogsProps {
    stationId: string;
    sessionId?: string;
    onClearSessionId?: () => void;
}

export function StationLogs({ stationId, sessionId, onClearSessionId }: StationLogsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch
    } = useInfiniteOcppLogs(stationId, { limit: 15, sessionId });

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

    // Flatten pages into a single logs array
    const logs = data?.pages.flatMap(page => page.logs) || [];

    const filteredLogs = logs.filter((log: OcppLog) =>
        log.messageType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.messageId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(log.message).toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filter message type or ID..."
                        className="pl-10 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    className="flex items-center gap-2 font-semibold"
                    disabled={isLoading}
                >
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    Refresh Logs
                </Button>
            </div>

            {sessionId && (
                <div className="flex items-center justify-between gap-3 bg-primary/5 border border-primary/20 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <Activity className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs font-black tracking-tight flex items-center gap-2">
                                Filtering by Session
                                <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-mono font-black border-primary/40 bg-primary/10 text-primary">
                                    UUID: {sessionId.substring(0, 8)}...
                                </Badge>
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearSessionId}
                        className="h-8 text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 hover:text-primary"
                    >
                        Clear Filter
                    </Button>
                </div>
            )}

            <div className="space-y-3">
                {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, idx) => (
                        <div
                            key={`${log.id}-${idx}`}
                            className={cn(
                                "group border border-border/60 rounded-2xl overflow-hidden transition-all",
                                expandedLogId === log.id ? "bg-card shadow-md border-primary/20" : "bg-card/40 hover:bg-card/60"
                            )}
                        >
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer"
                                onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={cn(
                                        "p-2 rounded-xl flex items-center justify-center shrink-0",
                                        log.direction === 'INCOMING' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                                    )}>
                                        {log.direction === 'INCOMING' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black tracking-tight flex items-center gap-2 truncate">
                                            {log.messageType}
                                            <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-mono uppercase tracking-tighter opacity-70">
                                                {log.direction}
                                            </Badge>
                                        </p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                                            {formatDate(log.createdAt)} • {log.messageId || 'NO-ID'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-mono text-muted-foreground hidden md:block opacity-40">
                                        Click to inspect
                                    </span>
                                    {expandedLogId === log.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </div>
                            </div>

                            {expandedLogId === log.id && (
                                <div className="p-4 pt-0 border-t border-border/20 bg-muted/10">
                                    <div className="mt-4 rounded-xl bg-black/90 p-4 overflow-x-auto">
                                        <pre className="text-xs font-mono text-emerald-400">
                                            {JSON.stringify(log.message, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-muted/10">
                        <Terminal className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground font-medium">No communication logs found for this filter.</p>
                    </div>
                )}

                {/* Observer element for infinite scroll */}
                <div ref={ref} className="h-10 flex items-center justify-center">
                    {isFetchingNextPage && (
                        <div className="flex items-center gap-2 text-primary font-bold animate-pulse">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-[10px] uppercase tracking-widest">Loading more machine events...</span>
                        </div>
                    )}
                    {!hasNextPage && logs.length > 0 && (
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                            End of diagnostic stream
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
