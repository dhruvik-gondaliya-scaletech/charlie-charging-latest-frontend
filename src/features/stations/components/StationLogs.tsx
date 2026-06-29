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
    RotateCcw,
    Search,
    FileText,
    Maximize2,
    Clock,
    Download
} from 'lucide-react';
import { OcppLog } from '@/types';
import { ExportLogsModal } from './ExportLogsModal';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatePicker } from '@/components/shared/DatePicker';
import { startOfDay, endOfDay, format } from 'date-fns';
import { CopyButton } from '@/components/shared/CopyButton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';

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
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [directionFilter, setDirectionFilter] = useState<string>('all');
    const [messageTypeFilter, setMessageTypeFilter] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    });

    const filteredTypes = useMemo(() => {
        return OCPP_MESSAGE_TYPES.filter(type =>
            type.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort();
    }, [searchQuery]);

    const filters = useMemo(() => ({
        limit: 15,
        sessionId,
        direction: directionFilter === 'all' ? undefined : (directionFilter as 'INCOMING' | 'OUTGOING'),
        messageType: (messageTypeFilter.length > 0 && messageTypeFilter.length < OCPP_MESSAGE_TYPES.length)
            ? messageTypeFilter.join(',')
            : undefined,
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

    const [selectedMessage, setSelectedMessage] = useState<{ title: string; json: any } | null>(null);

    // Flatten pages into a single logs array
    const logs = data?.pages.flatMap(page => page.logs) || [];

    const groupedLogs = useMemo(() => {
        const CSMS_INITIATED_ACTIONS = [
            'RemoteStartTransaction',
            'RemoteStopTransaction',
            'Reset',
            'UnlockConnector',
            'ChangeConfiguration',
            'GetConfiguration',
            'ClearCache',
            'GetDiagnostics',
            'UpdateFirmware',
            'TriggerMessage',
            'ReserveNow',
            'CancelReservation',
            'SetChargingProfile',
            'ClearChargingProfile',
            'GetCompositeSchedule',
            'SendLocalList',
            'GetLocalListVersion'
        ];

        const isCSMSInitiated = (action: string) => {
            return CSMS_INITIATED_ACTIONS.some(a => action?.toLowerCase() === a.toLowerCase());
        };

        const isRequestLog = (log: OcppLog) => {
            if (Array.isArray(log.message)) {
                return log.message[0] === 2;
            }
            const isCSMS = isCSMSInitiated(log.messageType);
            if (isCSMS) {
                return log.direction === 'OUTGOING';
            } else {
                return log.direction === 'INCOMING';
            }
        };

        const getInitiatorForLog = (log: OcppLog) => {
            const isReq = isRequestLog(log);
            if (isReq) {
                return log.direction === 'INCOMING' ? 'ChargePoint' : 'CentralSystem';
            } else {
                return log.direction === 'INCOMING' ? 'CentralSystem' : 'ChargePoint';
            }
        };

        const messageGroups: { [messageId: string]: OcppLog[] } = {};
        const noIdLogs: OcppLog[] = [];

        logs.forEach(log => {
            const msgId = log.messageId;
            if (!msgId) {
                noIdLogs.push(log);
                return;
            }
            if (!messageGroups[msgId]) {
                messageGroups[msgId] = [];
            }
            messageGroups[msgId].push(log);
        });

        const rows: {
            id: string;
            timestamp: string;
            initiator: string;
            action: string;
            duration: string;
            request: any;
            response: any;
            rawRequestLog?: OcppLog;
            rawResponseLog?: OcppLog;
        }[] = [];

        Object.entries(messageGroups).forEach(([messageId, groupLogs]) => {
            let requestLog: OcppLog | undefined;
            let responseLog: OcppLog | undefined;

            if (groupLogs.length === 2) {
                const logA = groupLogs[0];
                const logB = groupLogs[1];
                const isReqA = isRequestLog(logA);
                const isReqB = isRequestLog(logB);

                if (isReqA && !isReqB) {
                    requestLog = logA;
                    responseLog = logB;
                } else if (!isReqA && isReqB) {
                    requestLog = logB;
                    responseLog = logA;
                } else {
                    const sorted = [...groupLogs].sort((a, b) => {
                        const timeA = new Date(a.createdAt).getTime();
                        const timeB = new Date(b.createdAt).getTime();
                        if (timeA !== timeB) return timeA - timeB;
                        return a.id.localeCompare(b.id);
                    });
                    requestLog = sorted[0];
                    responseLog = sorted[1];
                }
            } else {
                const singleLog = groupLogs[0];
                if (isRequestLog(singleLog)) {
                    requestLog = singleLog;
                } else {
                    responseLog = singleLog;
                }
            }

            const primaryLog = requestLog || responseLog;
            if (!primaryLog) return;

            let duration = '0ms';
            if (requestLog && responseLog) {
                const reqTime = new Date(requestLog.createdAt).getTime();
                const resTime = new Date(responseLog.createdAt).getTime();
                duration = `${Math.abs(resTime - reqTime)}ms`;
            }

            const initiator = getInitiatorForLog(primaryLog);

            rows.push({
                id: messageId,
                timestamp: primaryLog.createdAt,
                initiator,
                action: primaryLog.messageType,
                duration,
                request: requestLog ? requestLog.message : null,
                response: responseLog ? responseLog.message : null,
                rawRequestLog: requestLog,
                rawResponseLog: responseLog,
            });
        });

        // Fallback pairing for noIdLogs (using action and timestamp proximity)
        const pairedNoIdRows: typeof rows = [];
        const usedNoIdIndices = new Set<number>();
        const sortedNoIdLogs = [...noIdLogs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        for (let i = 0; i < sortedNoIdLogs.length; i++) {
            if (usedNoIdIndices.has(i)) continue;

            const currentLog = sortedNoIdLogs[i];
            const isReq = isRequestLog(currentLog);

            if (isReq) {
                let matchedIndex = -1;
                const currentLogTime = new Date(currentLog.createdAt).getTime();

                for (let j = i + 1; j < sortedNoIdLogs.length; j++) {
                    if (usedNoIdIndices.has(j)) continue;

                    const candidateLog = sortedNoIdLogs[j];
                    if (!isRequestLog(candidateLog) && candidateLog.messageType === currentLog.messageType) {
                        const candidateTime = new Date(candidateLog.createdAt).getTime();
                        if (Math.abs(candidateTime - currentLogTime) <= 10000) { // 10 seconds window
                            matchedIndex = j;
                            break;
                        }
                    }
                }

                if (matchedIndex !== -1) {
                    const responseLog = sortedNoIdLogs[matchedIndex];
                    usedNoIdIndices.add(i);
                    usedNoIdIndices.add(matchedIndex);

                    const reqTime = new Date(currentLog.createdAt).getTime();
                    const resTime = new Date(responseLog.createdAt).getTime();
                    const duration = `${Math.abs(resTime - reqTime)}ms`;

                    pairedNoIdRows.push({
                        id: `paired-noid-${currentLog.id}`,
                        timestamp: currentLog.createdAt,
                        initiator: getInitiatorForLog(currentLog),
                        action: currentLog.messageType,
                        duration,
                        request: currentLog.message,
                        response: responseLog.message,
                        rawRequestLog: currentLog,
                        rawResponseLog: responseLog,
                    });
                }
            }
        }

        // For any remaining unpaired noIdLogs
        sortedNoIdLogs.forEach((log, index) => {
            if (usedNoIdIndices.has(index)) return;

            const isReq = isRequestLog(log);

            pairedNoIdRows.push({
                id: log.id,
                timestamp: log.createdAt,
                initiator: getInitiatorForLog(log),
                action: log.messageType,
                duration: '0ms',
                request: isReq ? log.message : null,
                response: isReq ? null : log.message,
                rawRequestLog: isReq ? log : undefined,
                rawResponseLog: isReq ? undefined : log,
            });
        });

        rows.push(...pairedNoIdRows);

        return rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [logs]);

    const handleResetFilters = () => {
        setDirectionFilter('all');
        setMessageTypeFilter([]);
        setSearchQuery('');
        setDateRange({ from: undefined, to: undefined });
    };

    const isAnyFilterActive = directionFilter !== 'all' || messageTypeFilter.length > 0 || dateRange.from || dateRange.to;

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
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-[220px] h-10 rounded-xl border-border/40 bg-card/20 hover:bg-card/30 font-bold text-xs flex justify-between items-center px-3"
                                    >
                                        <span className="truncate">
                                            {messageTypeFilter.length === 0 || messageTypeFilter.length === OCPP_MESSAGE_TYPES.length
                                                ? "Any Message Type"
                                                : messageTypeFilter.length === 1
                                                ? messageTypeFilter[0]
                                                : `${messageTypeFilter.length} actions selected`}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-60 shrink-0" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent 
                                    className="w-[260px] p-2 rounded-xl border-border/40 bg-card/95 backdrop-blur-xl shadow-lg z-50 flex flex-col gap-2"
                                    align="start"
                                >
                                    {/* Search input */}
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                                        <Input
                                            type="text"
                                            placeholder="Search OCPP actions..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-8 h-9 rounded-lg border-border/25 bg-muted/20 text-xs focus-visible:ring-1 focus-visible:ring-primary"
                                        />
                                    </div>

                                    {/* Quick action buttons */}
                                    <div className="flex justify-between items-center px-1 py-0.5 border-b border-border/10 pb-1.5">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md"
                                            onClick={() => setMessageTypeFilter([...OCPP_MESSAGE_TYPES])}
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md"
                                            onClick={() => setMessageTypeFilter([])}
                                        >
                                            Clear All
                                        </Button>
                                    </div>

                                    {/* Checkbox list */}
                                    <ScrollArea className="h-[220px] pr-1">
                                        <div className="space-y-0.5">
                                            {filteredTypes.map((type) => {
                                                const isChecked = messageTypeFilter.includes(type);
                                                return (
                                                    <label
                                                        key={type}
                                                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted/40 cursor-pointer select-none text-xs font-semibold transition-colors"
                                                    >
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setMessageTypeFilter((prev) => [...prev, type]);
                                                                } else {
                                                                    setMessageTypeFilter((prev) => prev.filter((t) => t !== type));
                                                                }
                                                            }}
                                                        />
                                                        <span className="truncate">{type}</span>
                                                    </label>
                                                );
                                            })}
                                            {filteredTypes.length === 0 && (
                                                <div className="text-center py-6 text-xs text-muted-foreground/60 font-medium">
                                                    No actions match search
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </PopoverContent>
                            </Popover>
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

                        {/* Export Logs Button */}
                        <Button
                            variant="outline"
                            onClick={() => setIsExportModalOpen(true)}
                            className="h-10 flex items-center gap-2 font-bold bg-background hover:bg-muted border-border/40 transition-all active:scale-95 rounded-xl shadow-sm px-4 flex-1 lg:flex-none justify-center"
                        >
                            <Download className="h-4 w-4 text-primary" />
                            <span className="text-xs">Export Logs</span>
                        </Button>

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
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 pt-4">
                <div className="w-full overflow-x-auto rounded-2xl border border-border/40 bg-zinc-950/20 shadow-sm custom-scrollbar">
                    <div className="min-w-[1200px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-[180px_120px_140px_90px_1fr_1fr] items-center gap-4 bg-muted/40 p-4 border-b border-border/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                            <div>Timestamp</div>
                            <div>Initiator</div>
                            <div>OCPP Action</div>
                            <div>Duration</div>
                            <div>Request</div>
                            <div>Response</div>
                        </div>

                        {/* Table Body */}
                        {isLoading && !groupedLogs.length ? (
                            <div className="p-4 space-y-3">
                                {Array(5).fill(0).map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                                ))}
                            </div>
                        ) : groupedLogs.length > 0 ? (
                            <div className="divide-y divide-border/20">
                                {groupedLogs.map((row) => (
                                    <div
                                        key={row.id}
                                        className="grid grid-cols-[180px_120px_140px_90px_1fr_1fr] items-start gap-4 p-4 hover:bg-muted/10 transition-colors"
                                    >
                                        {/* Timestamp Column */}
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium py-2">
                                            <Clock className="h-3.5 w-3.5 opacity-60 shrink-0" />
                                            <span>
                                                {format(new Date(row.timestamp), "MM/dd/yyyy HH:mm:ss")}
                                            </span>
                                        </div>

                                        {/* Initiator Column */}
                                        <div className="py-1">
                                            {row.initiator === 'ChargePoint' ? (
                                                <span className="inline-flex items-center justify-center bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                                    ChargePoint
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/25 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                                    CSMS
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Column */}
                                        <div className="py-1">
                                            <span className="inline-flex items-center justify-center bg-sky-500/10 text-sky-400 border border-sky-500/25 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                                                {row.action}
                                            </span>
                                        </div>

                                        {/* Duration Column */}
                                        <div className="text-xs text-muted-foreground/60 font-semibold py-2">
                                            {row.duration}
                                        </div>

                                        {/* Request Column */}
                                        <div>
                                            {row.request ? (
                                                <div className="flex gap-2 items-start bg-zinc-950/60 hover:bg-zinc-950/80 border border-border/10 rounded-lg p-2 relative group font-mono text-[10px] text-zinc-300 leading-normal min-h-[40px] break-all">
                                                    <FileText className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
                                                    <div className="flex-1 whitespace-pre-wrap pr-12 line-clamp-3">
                                                        {JSON.stringify(row.request)}
                                                    </div>
                                                    <div className="absolute right-1 top-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <CopyButton value={JSON.stringify(row.request, null, 2)} className="h-6 w-6" />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-md"
                                                            onClick={() => setSelectedMessage({ title: `${row.action} Request`, json: row.request })}
                                                        >
                                                            <Maximize2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-muted-foreground/30 italic text-[10px] flex items-center justify-center h-10 border border-dashed border-border/10 rounded-lg">
                                                    -
                                                </div>
                                            )}
                                        </div>

                                        {/* Response Column */}
                                        <div>
                                            {row.response ? (
                                                <div className="flex gap-2 items-start bg-zinc-950/60 hover:bg-zinc-950/80 border border-border/10 rounded-lg p-2 relative group font-mono text-[10px] text-zinc-300 leading-normal min-h-[40px] break-all">
                                                    <FileText className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
                                                    <div className="flex-1 whitespace-pre-wrap pr-12 line-clamp-3">
                                                        {JSON.stringify(row.response)}
                                                    </div>
                                                    <div className="absolute right-1 top-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <CopyButton value={JSON.stringify(row.response, null, 2)} className="h-6 w-6" />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-md"
                                                            onClick={() => setSelectedMessage({ title: `${row.action} Response`, json: row.response })}
                                                        >
                                                            <Maximize2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-muted-foreground/30 italic text-[10px] flex items-center justify-center h-10 border border-dashed border-border/10 rounded-lg">
                                                    -
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center bg-muted/5 border-t border-border/40">
                                <Terminal className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <p className="text-muted-foreground text-sm font-semibold tracking-tight">No diagnostic data found</p>
                                <p className="text-xs text-muted-foreground/60 mt-1 font-medium">Try adjusting your filters or search terms</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Observer element for infinite scroll */}
                <div ref={ref} className="h-20 flex items-center justify-center border-t border-border/5 mt-4">
                    {isFetchingNextPage ? (
                        <div className="flex items-center gap-3 text-primary p-3 rounded-full bg-primary/5 px-6 border border-primary/10 shadow-sm animate-pulse">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-[10px] uppercase tracking-black font-black tracking-widest">Streaming events...</span>
                        </div>
                    ) : (
                        !hasNextPage && groupedLogs.length > 0 && (
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

            {/* Inspect Payload Modal */}
            <Dialog open={selectedMessage !== null} onOpenChange={(open) => !open && setSelectedMessage(null)}>
                <DialogContent className="max-w-2xl bg-card border-border/40 text-foreground p-6 rounded-2xl shadow-xl z-50">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-primary" />
                            {selectedMessage?.title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 relative">
                        <div className="absolute right-4 top-4 z-10 flex gap-2">
                            {selectedMessage?.json && (
                                <CopyButton 
                                    value={JSON.stringify(selectedMessage.json, null, 2)} 
                                    className="bg-muted/80 hover:bg-muted"
                                />
                            )}
                        </div>
                        <div className="max-h-[500px] overflow-y-auto rounded-xl bg-black/90 p-5 shadow-inner border border-white/5 ring-1 ring-white/5 custom-scrollbar">
                            <pre className="text-xs font-mono text-emerald-400/90 leading-relaxed whitespace-pre-wrap break-all">
                                {selectedMessage ? JSON.stringify(selectedMessage.json, null, 2) : ''}
                            </pre>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ExportLogsModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                stationId={stationId}
                sessionId={sessionId}
            />
        </div>
    );
}
