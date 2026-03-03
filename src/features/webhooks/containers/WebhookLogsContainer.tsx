'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { useWebhook, useWebhookDeliveries } from '@/hooks/get/useWebhooks';
import { useRetryWebhookDelivery } from '@/hooks/post/useWebhookMutations';
import { Table } from '@/components/shared/Table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WebhookDelivery, WebhookDeliveryStatus, WebhookEvent } from '@/types';
import { formatDateTime, formatTimeAgo } from '@/lib/date';
import { staggerContainer, staggerItem } from '@/lib/motion';
import {
    CheckCircle2,
    XCircle,
    Clock,
    RotateCcw,
    AlertCircle,
    Zap,
    ArrowLeft,
    Activity,
    CheckCircle,
    XCircle as XCircleIcon,
    X,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { StatCard } from '@/features/dashboard/components/StatCard';

export function WebhookLogsContainer() {
    const params = useParams();
    const router = useRouter();
    const webhookId = params.id as string;

    const { data: webhook, isLoading: isLoadingWebhook } = useWebhook(webhookId);

    // Filter State
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [eventFilter, setEventFilter] = useState<string | undefined>(undefined);

    const { data: deliveries, isLoading: isLoadingDeliveries } = useWebhookDeliveries({
        webhookId,
        status: statusFilter,
    });

    // Client-side filtering for Event Type (if not supported by API or for better UX)
    const filteredDeliveries = useMemo(() => {
        if (!deliveries) return [];
        return deliveries.filter(d => {
            const matchesEvent = !eventFilter || d.eventType === eventFilter;
            return matchesEvent;
        });
    }, [deliveries, eventFilter]);

    const retryMutation = useRetryWebhookDelivery();

    const getStatusBadge = (status: WebhookDeliveryStatus) => {
        switch (status) {
            case WebhookDeliveryStatus.SUCCESS:
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 gap-1.5 px-2.5 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="capitalize font-bold text-[10px] tracking-tight">{status}</span>
                    </Badge>
                );
            case WebhookDeliveryStatus.FAILED:
                return (
                    <Badge variant="destructive" className="gap-1.5 px-2.5 py-1">
                        <XCircle className="h-3.5 w-3.5" />
                        <span className="capitalize font-bold text-[10px] tracking-tight">{status}</span>
                    </Badge>
                );
            case WebhookDeliveryStatus.RETRYING:
                return (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 gap-1.5 px-2.5 py-1">
                        <RotateCcw className="h-3.5 w-3.5 animate-spin-slow" />
                        <span className="capitalize font-bold text-[10px] tracking-tight">{status}</span>
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="capitalize font-bold text-[10px] tracking-tight">{status}</span>
                    </Badge>
                );
        }
    };

    const getEventColor = (event: string) => {
        switch (event) {
            case WebhookEvent.START_TRANSACTION:
                return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
            case WebhookEvent.STOP_TRANSACTION:
                return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
            case WebhookEvent.STATUS_NOTIFICATION:
                return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
            case WebhookEvent.METER_VALUES:
                return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
            default:
                return 'bg-primary/5 border-primary/20 text-primary';
        }
    };

    const columns: ColumnDef<WebhookDelivery>[] = useMemo(
        () => [
            {
                accessorKey: 'createdAt',
                header: 'Timestamp',
                cell: ({ row }) => (
                    <div className="flex flex-col min-w-[140px]">
                        <span className="font-bold text-sm text-foreground">
                            {formatDateTime(row.original.createdAt)}
                        </span>
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter mt-0.5">
                            {formatTimeAgo(row.original.createdAt)}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'eventType',
                header: 'Event Stream',
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <Badge
                            variant="outline"
                            className={`${getEventColor(row.original.eventType)} text-[10px] uppercase font-bold px-2 py-1 flex items-center gap-2`}
                        >
                            <Zap className="h-3 w-3" />
                            {row.original.eventType}
                        </Badge>
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Delivery Status',
                cell: ({ row }) => getStatusBadge(row.original.status),
            },
            {
                accessorKey: 'responseStatus',
                header: 'Server Response',
                cell: ({ row }) => {
                    const status = row.original.responseStatus;
                    return (
                        <div className="flex items-center gap-2">
                            <span className={`font-mono font-bold text-sm ${status && status < 300 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {status || '---'}
                            </span>
                            {row.original.errorMessage && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <AlertCircle className="h-4 w-4 text-rose-500 cursor-help opacity-70 hover:opacity-100 transition-opacity" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[300px] p-3 bg-card/95 backdrop-blur-md border-primary/20 shadow-2xl rounded-2xl">
                                        <p className="text-[11px] font-bold uppercase text-muted-foreground mb-1 tracking-widest">Error Detail</p>
                                        <p className="text-xs font-medium leading-relaxed">{row.original.errorMessage}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'attemptCount',
                header: 'Attempts',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-muted/50 border border-muted-foreground/10 flex items-center justify-center text-[10px] font-black">
                            {row.original.attemptCount}
                        </div>
                        <span className="text-muted-foreground uppercase text-[10px] font-black tracking-widest opacity-60">Sequence</span>
                    </div>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const canRetry = row.original.status === WebhookDeliveryStatus.FAILED;
                    return (
                        <div className="flex justify-start pr-2">
                            {canRetry && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => retryMutation.mutate(row.original.id)}
                                    disabled={retryMutation.isPending}
                                    className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                                >
                                    <RotateCcw className={`h-4 w-4 ${retryMutation.isPending ? 'animate-spin' : ''}`} />
                                    Retry
                                </Button>
                            )}
                        </div>
                    );
                },
            },
        ],
        [retryMutation]
    );

    const stats = useMemo(() => {
        if (!deliveries) return null;
        const total = deliveries.length;
        const success = deliveries.filter(d => d.status === WebhookDeliveryStatus.SUCCESS).length;
        const failed = deliveries.filter(d => d.status === WebhookDeliveryStatus.FAILED).length;
        return {
            total,
            success,
            failed,
            rate: total > 0 ? Math.round((success / total) * 100) : 0
        };
    }, [deliveries]);

    const InlineFilters = (
        <div className="flex items-center gap-3">
            <Select
                value={statusFilter || "all"}
                onValueChange={(val) => setStatusFilter(val === "all" ? undefined : val)}
            >
                <SelectTrigger className="h-10 w-[160px] rounded-xl border-primary/10 bg-muted/30 focus:ring-primary/20 font-bold text-[10px] uppercase tracking-wider">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-primary/10 shadow-2xl">
                    <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Statuses</SelectItem>
                    {Object.values(WebhookDeliveryStatus).map((status) => (
                        <SelectItem key={status} value={status} className="capitalize font-bold text-[11px]">
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={eventFilter || "all"}
                onValueChange={(val) => setEventFilter(val === "all" ? undefined : val)}
            >
                <SelectTrigger className="h-10 w-[180px] rounded-xl border-primary/10 bg-muted/30 focus:ring-primary/20 font-bold text-[10px] uppercase tracking-wider">
                    <SelectValue placeholder="All Events" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-primary/10 shadow-2xl">
                    <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Events</SelectItem>
                    {Object.values(WebhookEvent).map((event) => (
                        <SelectItem key={event} value={event} className="capitalize font-bold text-[11px]">
                            {event}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <TooltipProvider>
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto"
            >
                {/* Header Section */}
                <motion.div variants={staggerItem} className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/webhooks')}
                            className="w-fit h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest group"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                            Back to Webhooks
                        </Button>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Delivery Logs
                            </h1>
                            <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">
                                Monitoring stream for {isLoadingWebhook ? '...' : `"${webhook?.name}"`}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Deliveries"
                        value={stats?.total || 0}
                        icon={Activity}
                        color="text-primary"
                        bottomRightGlobe="bg-primary"
                        description="Total stream attempts logged"
                    />
                    <StatCard
                        title="Successful"
                        value={stats?.success || 0}
                        icon={CheckCircle}
                        color="text-emerald-500"
                        bottomRightGlobe="bg-emerald-500"
                        description={`${stats?.rate || 0}% delivery success rate`}
                    />
                    <StatCard
                        title="Failed Attempts"
                        value={stats?.failed || 0}
                        icon={XCircleIcon}
                        color="text-rose-500"
                        bottomRightGlobe="bg-rose-500"
                        description="Deliveries requiring attention"
                    />
                </motion.div>

                {/* Tabular Matrix */}
                <motion.div variants={staggerItem} className="relative">
                    <Table<WebhookDelivery>
                        data={filteredDeliveries}
                        columns={columns}
                        isLoading={isLoadingDeliveries}
                        showSearch
                        searchPosition="end"
                        prependWithSearch={InlineFilters}
                        pageSize={15}
                        maxHeight="700px"
                        className="border-none shadow-none"
                    />
                </motion.div>
            </motion.div>
        </TooltipProvider>
    );
}
