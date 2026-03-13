'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Tag, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { OcpiToken } from '@/services/ocpi.service';
import { Table } from '@/components/shared/Table';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface OcpiTokensListProps {
    tokens?: OcpiToken[];
    isLoading: boolean;
    isError?: boolean;
    onRetry?: () => void;
}

export function OcpiTokensList({ tokens, isLoading, isError, onRetry }: OcpiTokensListProps) {
    const columns: ColumnDef<OcpiToken>[] = [
        {
            accessorKey: 'uid',
            header: 'UID',
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.uid}</span>,
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
        },
        {
            accessorKey: 'issuer',
            header: 'Issuer (Party ID)',
            cell: ({ row }) => row.original.issuer,
        },
        {
            accessorKey: 'allowed',
            header: 'Allowed',
            cell: ({ row }) => {
                const allowed = !!row.original.allowed;
                const colorClasses = allowed
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20';

                return (
                    <Badge
                        variant="outline"
                        className={cn('capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm', colorClasses)}
                    >
                        {allowed ? 'yes' : 'no'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'whitelist',
            header: 'Whitelist',
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground">{row.original.whitelist}</span>
            ),
        },
        {
            accessorKey: 'lastUpdated',
            header: 'Last Updated',
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground block">
                    {row.original.lastUpdated
                        ? format(new Date(row.original.lastUpdated), 'MMM d, p')
                        : '-'}
                </span>
            ),
        },
    ];

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-destructive/5 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4 opacity-50" />
                <p className="text-lg font-medium text-destructive">Failed to load roaming tokens</p>
                <p className="text-sm text-muted-foreground mb-6">
                    There was an error fetching data from the backend.
                </p>
                <Button onClick={onRetry} variant="outline" size="sm">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <Table<OcpiToken>
            data={tokens ?? []}
            columns={columns}
            isLoading={isLoading}
            loadingRowCount={5}
            showSearch
            searchPosition="end"
            showPagination
            pageSize={DEFAULT_PAGE_SIZE}
            sortByKey="lastUpdated"
            sortOrder="desc"
            maxHeight="600px"
            emptyState={
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/30">
                    <Tag className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-lg font-medium">No roaming tokens yet</p>
                    <p className="text-sm text-muted-foreground">
                        Tokens provided by other roaming parties will appear here.
                    </p>
                </div>
            }
        />
    );
}
