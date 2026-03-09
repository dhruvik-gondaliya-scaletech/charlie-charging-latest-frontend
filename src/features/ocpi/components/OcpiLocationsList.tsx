'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { MapPin, Zap, Globe, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { Table } from '@/components/shared/Table';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { OcpiLocation } from '@/services/ocpi.service';
import { useOcpiLocations } from '@/hooks/get/useOcpi';

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

export function OcpiLocationsList() {
    const { data: locations, isLoading } = useOcpiLocations();

    return (
        <Table<OcpiLocation>
            data={locations ?? []}
            columns={columns}
            isLoading={isLoading}
            showSearch
            searchPosition="end"
            showPagination
            pageSize={DEFAULT_PAGE_SIZE}
            sortByKey="name"
            sortOrder="asc"
            maxHeight="600px"
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
