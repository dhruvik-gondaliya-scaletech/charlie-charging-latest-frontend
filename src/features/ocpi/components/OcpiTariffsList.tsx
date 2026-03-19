'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Coins, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Table } from '@/components/shared/Table';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { OcpiTariff } from '@/services/ocpi.service';
import { useOcpiTariffs } from '@/hooks/get/useOcpi';
import { Button } from '@/components/ui/button';

const TARIFF_TYPE_COLOR: Record<string, string> = {
    AD_HOC_PAYMENT: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    PROFILE_CHEAP: 'bg-green-500/10 text-green-500 border-green-500/20',
    PROFILE_FAST: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    PROFILE_GREEN: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    REGULAR: 'bg-muted text-muted-foreground border-border',
};

const columns: ColumnDef<OcpiTariff>[] = [
    {
        accessorKey: 'id',
        header: 'Tariff ID',
        cell: ({ row }) => <span className="font-mono text-xs font-bold">{row.getValue('id')}</span>,
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
        accessorKey: 'currency',
        header: 'Currency',
        cell: ({ row }) => <Badge variant="secondary">{row.getValue('currency')}</Badge>,
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue<string | undefined>('type') ?? 'REGULAR';
            const colorClass = TARIFF_TYPE_COLOR[type] ?? TARIFF_TYPE_COLOR.REGULAR;
            return (
                <Badge
                    variant="outline"
                    className={`text-[10px] whitespace-nowrap ${colorClass}`}
                >
                    {type.replace(/_/g, ' ')}
                </Badge>
            );
        },
    },
    {
        id: 'price',
        header: 'Price Components',
        cell: ({ row }) => {
            const elements = row.original.elements || [];
            return (
                <div className="flex flex-col gap-1">
                    {elements.map((el, i) => (
                        <div key={i} className="flex flex-wrap gap-1">
                            {el.price_components.map((pc, j) => (
                                <Badge key={j} variant="outline" className="text-[10px] bg-background">
                                    {pc.type}: ₹{pc.price}/{pc.step_size}kWh
                                    {pc.vat != null ? ` (+${pc.vat}% VAT)` : ''}
                                </Badge>
                            ))}
                        </div>
                    ))}
                </div>
            );
        },
    },
    {
        id: 'alt_text',
        header: 'Description',
        cell: ({ row }) => {
            const altText = row.original.tariff_alt_text;
            const english = altText?.find(t => t.language === 'en')?.text ?? altText?.[0]?.text;
            return english ? (
                <span className="text-xs text-muted-foreground line-clamp-1">{english}</span>
            ) : (
                <span className="text-xs text-muted-foreground/40">—</span>
            );
        },
    },
    {
        accessorKey: 'last_updated',
        header: 'Last Updated',
        cell: ({ row }) => {
            const val = row.getValue<string>('last_updated');
            return (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {val ? format(new Date(val), 'MMM d, p') : '—'}
                </span>
            );
        },
    },
];

export function OcpiTariffsList() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState('');

    const { data, isLoading, isError, refetch } = useOcpiTariffs({
        page,
        pageSize,
        search
    });

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-destructive/5 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4 opacity-50" />
                <p className="text-lg font-medium text-destructive">Failed to load tariffs</p>
                <p className="text-sm text-muted-foreground mb-6">
                    There was an error fetching OCPI tariff data.
                </p>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <Table<OcpiTariff>
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
            sortByKey="id"
            sortOrder="asc"
            emptyState={
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Coins className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-lg font-medium">No tariffs defined</p>
                    <p className="text-sm text-muted-foreground">
                        OCPI Tariffs define how you bill roaming partners for charging sessions.
                    </p>
                </div>
            }
        />
    );
}

