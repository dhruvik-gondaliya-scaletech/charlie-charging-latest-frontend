'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { MapPin, Zap, Globe, Share2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Table } from '@/components/shared/Table';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { OcpiLocation } from '@/services/ocpi.service';
import { useOcpiLocations } from '@/hooks/get/useOcpi';
import { Button } from '@/components/ui/button';

const columns: ColumnDef<OcpiLocation>[] = [
    {
        accessorKey: 'name',
        header: 'Location Name',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold">{row.getValue('name')}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{row.original.id}</span>
            </div>
        ),
    },
    {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{row.getValue('address')}, {row.original.city}</span>
            </div>
        ),
    },
    {
        accessorKey: 'country',
        header: 'Country',
        cell: ({ row }) => <Badge variant="outline">{row.getValue('country')}</Badge>,
    },
    {
        id: 'evses',
        header: 'EVSEs / Connectors',
        cell: ({ row }) => {
            const evses = row.original.evses || [];
            const connectorsCount = evses.reduce((acc, evse) => acc + (evse.connectors?.length || 0), 0);
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{evses.length} EVSEs</Badge>
                    <Badge variant="secondary">{connectorsCount} Connectors</Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'last_updated',
        header: 'Last Published',
        cell: ({ row }) => {
            const val = row.getValue<string>('last_updated');
            return (
                <span className="text-xs text-muted-foreground font-medium">
                    {val ? format(new Date(val), 'MMM d, p') : '—'}
                </span>
            );
        },
    },
];

import { useState } from 'react';

// ... (columns remains the same)

export function OcpiLocationsList() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState('');

    const { data, isLoading, isError, refetch } = useOcpiLocations({
        page,
        pageSize,
        search
    });

    const renderMobileCard = (item: OcpiLocation) => {
        const evses = item.evses || [];
        const connectorsCount = evses.reduce((acc, evse) => acc + (evse.connectors?.length || 0), 0);

        return (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Location ID</span>
                        <span className="font-mono font-bold text-xs text-foreground">{item.id}</span>
                    </div>
                    <Badge variant="outline" className="w-fit text-[10px] px-2 py-0 border-primary/20 bg-primary/5 text-primary">
                        {item.country || '—'}
                    </Badge>
                </div>

                <div className="space-y-2">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Name</span>
                        <span className="text-sm font-bold text-foreground">{item.name}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Address</span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                            <span className="truncate">{item.address}, {item.city}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/40">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">EVSEs</span>
                        <span className="text-xs font-semibold">{evses.length} Available</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Connectors</span>
                        <span className="text-xs font-semibold">{connectorsCount} Total</span>
                    </div>
                </div>

                <div className="pt-3 border-t border-border/40 flex justify-between items-center text-[10px] text-muted-foreground">
                    <span>
                        Updated: {item.last_updated ? format(new Date(item.last_updated), 'MMM d, p') : '—'}
                    </span>
                </div>
            </div>
        );
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-destructive/5 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4 opacity-50" />
                <p className="text-lg font-medium text-destructive">Failed to load locations</p>
                <p className="text-sm text-muted-foreground mb-6">
                    There was an error fetching OCPI location data.
                </p>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <Table<OcpiLocation>
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
            sortByKey="name"
            sortOrder="asc"
            renderMobileCard={renderMobileCard}
            emptyState={
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Globe className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-lg font-medium">No shared locations</p>
                    <p className="text-sm text-muted-foreground">
                        Locations published to the OCPI interface will appear here.
                    </p>
                </div>
            }
        />
    );
}

