'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Activity, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { Table } from '@/components/shared/Table';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { OcpiSession } from '@/services/ocpi.service';
import { useOcpiSessions } from '@/hooks/get/useOcpi';
import { cn } from '@/lib/utils';

const columns: ColumnDef<OcpiSession>[] = [
    {
        accessorKey: 'id',
        header: 'Session ID',
        cell: ({ row }) => {
            const fullId = row.getValue<string>('id');
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="font-mono text-xs text-muted-foreground cursor-default">
                                {fullId.slice(0, 8)}…
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-mono text-xs">{fullId}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        id: 'party',
        header: 'Party',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold">{row.original.party_id || '—'}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {row.original.country_code}
                </span>
            </div>
        ),
    },
    {
        id: 'location',
        header: 'Location / EVSE',
        cell: ({ row }) => {
            const locationId = row.original.location_id;
            const evseUid = row.original.evse_uid;
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col max-w-[160px] cursor-default">
                                <span className="truncate text-sm">{locationId || '—'}</span>
                                {evseUid && (
                                    <span className="text-[10px] uppercase text-muted-foreground">{evseUid}</span>
                                )}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">{locationId || '—'}</p>
                            {evseUid && (
                                <p className="text-[10px] uppercase text-muted-foreground mt-0.5">EVSE: {evseUid}</p>
                            )}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: 'kwh',
        header: 'Energy (kWh)',
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 cursor-default w-fit">
                            <Zap className="h-3.5 w-3.5 text-yellow-500" />
                            <span className="font-medium tabular-nums">
                                {(row.getValue<number>('kwh') ?? 0).toFixed(3)}
                            </span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">Total energy delivered in this session</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue<string>('status');
            const colorMap: Record<string, string> = {
                ACTIVE: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                COMPLETED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                INVALID: 'bg-destructive/10 text-destructive border-destructive/20',
                PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            };
            const labelMap: Record<string, string> = {
                ACTIVE: 'Session is currently in progress',
                COMPLETED: 'Session has ended successfully',
                INVALID: 'Session encountered an error',
                PENDING: 'Session is awaiting confirmation',
            };
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge
                                variant="outline"
                                className={cn(
                                    'cursor-default capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm',
                                    colorMap[status] ?? 'bg-muted text-muted-foreground border-border'
                                )}
                            >
                                {status}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">{labelMap[status] ?? status}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: 'start_date_time',
        header: 'Started At',
        cell: ({ row }) => {
            const val = row.getValue<string>('start_date_time');
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground cursor-default">
                                {val ? format(new Date(val), 'MMM d, HH:mm') : '—'}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">
                                {val ? format(new Date(val), 'PPpp') : 'No start time recorded'}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
];

export function OcpiSessionsList() {
    // Fetch with a high pageSize so the shared Table can handle client-side search + pagination
    const { data, isLoading } = useOcpiSessions({ page: 0, pageSize: 500 });

    return (
        <Table<OcpiSession>
            data={data?.items ?? []}
            columns={columns}
            isLoading={isLoading}
            showSearch
            searchPosition="end"
            showPagination
            pageSize={DEFAULT_PAGE_SIZE}
            sortByKey="start_date_time"
            sortOrder="desc"
            maxHeight="600px"
            emptyState={
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-lg font-medium">No roaming sessions</p>
                    <p className="text-sm text-muted-foreground">
                        Active or completed sessions initiated via OCPI will appear here.
                    </p>
                </div>
            }
        />
    );
}
