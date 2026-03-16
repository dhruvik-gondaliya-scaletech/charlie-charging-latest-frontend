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
                    ₹{cost.toFixed(2)}
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

