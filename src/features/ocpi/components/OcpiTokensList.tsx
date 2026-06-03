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
import { useOcpiTokens } from '@/hooks/get/useOcpi';
import { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';


export function OcpiTokensList() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState('');

    const { data, isLoading, isError, refetch } = useOcpiTokens({
        page,
        pageSize,
        search
    });

    const tokens = data?.items ?? [];
    const totalCount = data?.total ?? 0;

    const columns: ColumnDef<OcpiToken>[] = [
        {
            accessorKey: 'uid',
            header: 'UID',
            size: 150,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{row.original.uid}</span>
                    <CopyButton value={row.original.uid} toastMessage="Token UID copied" />
                </div>
            ),
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
        },
        {
            accessorKey: 'authId',
            header: 'Auth ID',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{row.original.authId}</span>
                    <CopyButton value={row.original.authId} toastMessage="Auth ID copied" />
                </div>
            ),
        },
        {
            accessorKey: 'visualNumber',
            header: 'Visual Number',
            cell: ({ row }) => row.original.visualNumber || '-',
        },
        {
            accessorKey: 'issuer',
            header: 'Issuer',
            cell: ({ row }) => row.original.issuer,
        },
        {
            accessorKey: 'valid',
            header: 'Status',
            cell: ({ row }) => {
                const isValid = row.original.valid ?? row.original.allowed ?? false;
                const colorClasses = isValid
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20';

                return (
                    <Badge
                        variant="outline"
                        className={cn('capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm', colorClasses)}
                    >
                        {isValid ? 'valid' : 'invalid'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'groupId',
            header: 'Group ID',
            cell: ({ row }) => row.original.groupId || '-',
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground block">
                    {row.original.createdAt
                        ? format(new Date(row.original.createdAt), 'MMM d, p')
                        : '-'}
                </span>
            ),
        },
        {
            accessorKey: 'updatedAt',
            header: 'Last Updated',
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground block">
                    {row.original.updatedAt || row.original.lastUpdated
                        ? format(new Date(row.original.updatedAt || row.original.lastUpdated || ''), 'MMM d, p')
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
                <Button onClick={() => refetch()} variant="outline" size="sm">
                    Try Again
                </Button>

            </div>
        );
    }

    const renderMobileCard = (item: OcpiToken) => {
        const isValid = item.valid ?? item.allowed ?? false;
        const statusColor = isValid
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            : 'bg-destructive/10 text-destructive border-destructive/20';

        return (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Token UID</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-foreground">{item.uid}</span>
                            <CopyButton value={item.uid} className="bg-background shadow-xs h-7 w-7" toastMessage="Token UID copied" />
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className={cn('capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm text-xs', statusColor)}
                    >
                        {isValid ? 'Valid' : 'Invalid'}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Type</span>
                        <span className="text-xs font-semibold">{item.type}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Issuer</span>
                        <span className="text-xs font-semibold">{item.issuer}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Auth ID</span>
                        <span className="text-xs font-mono font-semibold">{item.authId}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Visual Number</span>
                        <span className="text-xs font-semibold">{item.visualNumber || '-'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 col-span-2">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Group ID</span>
                        <span className="text-xs font-semibold">{item.groupId || '-'}</span>
                    </div>
                </div>

                <div className="pt-3 border-t border-border/40 flex justify-between items-center text-[10px] text-muted-foreground">
                    <span>
                        Created: {item.createdAt ? format(new Date(item.createdAt), 'MMM d, p') : '-'}
                    </span>
                    <span>
                        Updated: {item.updatedAt || item.lastUpdated ? format(new Date(item.updatedAt || item.lastUpdated || ''), 'MMM d, p') : '-'}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <Table<OcpiToken>
            data={tokens}
            columns={columns}
            isLoading={isLoading}
            loadingRowCount={5}
            showSearch
            searchPosition="end"
            onSearch={setSearch}
            manualPagination
            manualSearching
            totalCount={totalCount}
            pageIndex={page}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            showPagination
            pageSize={pageSize}
            sortByKey="updatedAt"
            sortOrder="desc"
            renderMobileCard={renderMobileCard}
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
