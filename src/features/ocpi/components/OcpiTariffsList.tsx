'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Tag, Zap, Clock, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { Table } from '@/components/shared/Table';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { OcpiTariff } from '@/services/ocpi.service';
import { useOcpiTariffs } from '@/hooks/get/useOcpi';
import { cn } from '@/lib/utils';

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
        id: 'price',
        header: 'Price Components',
        cell: ({ row }) => {
            const elements = row.original.elements || [];
            return (
                <div className="flex flex-col gap-1">
                    {elements.map((el, i) => (
                        <div key={i} className="flex flex-wrap gap-2">
                            {el.price_components.map((pc, j) => (
                                <Badge key={j} variant="outline" className="text-[10px] bg-background">
                                    {pc.type}: ₹{pc.price}/{pc.step_size}kWh
                                </Badge>
                            ))}
                        </div>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: 'last_updated',
        header: 'Last Updated',
        cell: ({ row }) => {
            const val = row.getValue<string>('last_updated');
            return (
                <span className="text-xs text-muted-foreground">
                    {val ? format(new Date(val), 'MMM d, p') : '—'}
                </span>
            );
        },
    },
];

export function OcpiTariffsList() {
    const { data: tariffs, isLoading } = useOcpiTariffs();

    return (
        <Table<OcpiTariff>
            data={tariffs ?? []}
            columns={columns}
            isLoading={isLoading}
            showSearch
            searchPosition="end"
            showPagination
            pageSize={DEFAULT_PAGE_SIZE}
            sortByKey="id"
            sortOrder="asc"
            maxHeight="600px"
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
