'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Receipt, Zap, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Table } from '@/components/shared/Table';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { OcpiCdr } from '@/services/ocpi.service';
import { useOcpiCdrs } from '@/hooks/get/useOcpi';
import { Button } from '@/components/ui/button';

const formatCurrency = (amount: number, currencyCode?: string) => {
    const code = currencyCode?.toUpperCase() || 'INR';
    try {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: code,
        }).format(amount);
    } catch {
        return `${code} ${amount.toFixed(2)}`;
    }
};

const columns: ColumnDef<OcpiCdr>[] = [
    {
        accessorKey: 'id',
        header: 'CDR ID',
        cell: ({ row }) => {
            const fullId = row.getValue<string>('id');
            return (
                <div className='relative'>
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
                </div>
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
        accessorKey: 'location_id',
        header: 'Location',
        cell: ({ row }) => <span className="text-sm font-medium">{row.getValue('location_id')}</span>,
    },
    {
        accessorKey: 'total_energy',
        header: 'Energy',
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 w-fit">
                <Zap className="h-3.5 w-3.5 text-yellow-500" />
                <span className="font-medium tabular-nums">
                    {(row.getValue<number>('total_energy') ?? 0).toFixed(2)} kWh
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'total_time',
        header: 'Duration',
        cell: ({ row }) => {
            const hours = row.getValue<number>('total_time') || 0;
            const mins = Math.round(hours * 60);
            return (
                <div className="flex items-center gap-1.5 w-fit text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs tabular-nums">
                        {mins < 60 ? `${mins}m` : `${hours.toFixed(1)}h`}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'total_cost',
        header: 'Total Cost',
        cell: ({ row }) => {
            const cost = row.original.total_cost?.incl_vat || 0;
            return (
                <div className="font-bold text-foreground tabular-nums">
                    {formatCurrency(cost, row.original.currency)}
                </div>
            );
        },
    },
    {
        accessorKey: 'last_updated',
        header: 'Created At',
        cell: ({ row }) => {
            const val = row.getValue<string>('last_updated');
            return (
                <span className="text-xs text-muted-foreground">
                    {val ? format(new Date(val), 'MMM d, HH:mm') : '—'}
                </span>
            );
        },
    },
];

import { useState } from 'react';

// ... (columns remains the same)

export function OcpiCdrsList() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState('');

    const { data, isLoading, isError, refetch } = useOcpiCdrs({
        page,
        pageSize,
        search
    });

    const renderMobileCard = (item: OcpiCdr) => {
        const cost = item.total_cost?.incl_vat || 0;
        const hours = item.total_time || 0;
        const mins = Math.round(hours * 60);

        return (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">CDR ID</span>
                        <span className="font-mono font-bold text-xs text-foreground">{item.id.slice(0, 16)}…</span>
                    </div>
                    <div className="font-bold text-foreground text-sm">
                        {formatCurrency(cost, item.currency)}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Party</span>
                        <span className="text-xs font-semibold">{item.party_id || '—'} ({item.country_code || '—'})</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Energy</span>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Zap className="h-3.5 w-3.5 fill-current" />
                            <span>{(item.total_energy ?? 0).toFixed(2)} kWh</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Duration</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{mins < 60 ? `${mins}m` : `${hours.toFixed(1)}h`}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Location</span>
                        <span className="text-xs font-medium text-muted-foreground truncate">{item.location_id || '—'}</span>
                    </div>
                </div>

                <div className="pt-3 border-t border-border/40 flex justify-between items-center text-[10px] text-muted-foreground">
                    <span>
                        Date: {item.last_updated ? format(new Date(item.last_updated), 'MMM d, p') : '—'}
                    </span>
                </div>
            </div>
        );
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-destructive/5 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4 opacity-50" />
                <p className="text-lg font-medium text-destructive">Failed to load billing records</p>
                <p className="text-sm text-muted-foreground mb-6">
                    There was an error fetching CDR data.
                </p>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <Table<OcpiCdr>
            data={data?.items ?? []}
            columns={columns}
            isLoading={isLoading}
            loadingRowCount={5}
            showSearch
            searchPosition="end"
            onSearch={setSearch}
            manualPagination
            manualSearching
            totalCount={data?.total ?? 0}
            pageIndex={page}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            showPagination
            pageSize={pageSize}
            sortByKey="last_updated"
            sortOrder="desc"
            renderMobileCard={renderMobileCard}
            emptyState={
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Receipt className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-lg font-medium">No billing records (CDRs)</p>
                    <p className="text-sm text-muted-foreground">
                        Completed roaming sessions will generate CDRs here for billing.
                    </p>
                </div>
            }
        />
    );
}

