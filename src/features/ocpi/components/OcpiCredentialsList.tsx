'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Shield, Trash2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { OcpiCredential } from '@/services/ocpi.service';
import { Table } from '@/components/shared/Table';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { useOcpiCredentials } from '@/hooks/get/useOcpi';
import { useDeleteOcpiCredential } from '@/hooks/post/useOcpiMutations';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { Button } from '@/components/ui/button';
import { OcpiPartyDetailsModal } from './OcpiPartyDetailsModal';
import { useState } from 'react';

export function OcpiCredentialsList() {
    const [selectedParty, setSelectedParty] = useState<OcpiCredential | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [search, setSearch] = useState('');

    const { data: credentialsData, isLoading } = useOcpiCredentials({
        page,
        pageSize,
        search
    });

    const { mutate: deleteCredential } = useDeleteOcpiCredential();

    const credentials = credentialsData?.items ?? [];
    const totalCount = credentialsData?.total ?? 0;

    const onDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this OCPI connection?')) {
            deleteCredential(id);
        }
    };


    const handleViewDetails = (party: OcpiCredential) => {
        setSelectedParty(party);
        setIsDetailsOpen(true);
    };
    const columns: ColumnDef<OcpiCredential>[] = [
        {
            accessorKey: 'partyId',
            header: 'Party ID',
            size: 90,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {row.original.partyId || 'PENDING'}
                </div>
            ),
        },
        {
            accessorKey: 'countryCode',
            header: 'Country',
            size: 80,
            cell: ({ row }) => row.original.countryCode || '-',
        },
        {
            accessorKey: 'url',
            header: 'URL',
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="max-w-[200px] truncate font-mono text-xs text-muted-foreground block cursor-help">
                                {row.original.url}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">
                                {row.original.url}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            id: 'status',
            header: 'Status',
            size: 100,
            cell: ({ row }) => {
                const hasHandshake = !!row.original.token_b && !!row.original.token_c;
                const colorClasses = hasHandshake
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-blue-500/10 text-blue-500 border-blue-500/20';

                return (
                    <Badge
                        variant="outline"
                        className={cn('capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm', colorClasses)}
                    >
                        {hasHandshake ? 'connected' : 'registered'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'token_a',
            header: 'Registration Token',
            size: 150,
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col gap-1 cursor-help">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Token A</span>
                                <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded truncate max-w-[120px] block">
                                    {row.original.token_a}
                                </code>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">
                                {row.original.token_a}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            accessorKey: 'updatedAt',
            header: 'Last Updated',
            size: 120,
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground block">
                    {row.original.updatedAt ? format(new Date(row.original.updatedAt), 'MMM d, p') : '-'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            size: 80,
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    onClick={() => handleViewDetails(row.original)}
                                >
                                    <Info className="h-4 w-4" />
                                    <span className="sr-only">View Details</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">View Details</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => onDelete?.(row.original.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete Connection</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">Delete Connection</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <Skeleton className="h-[125px] w-full rounded-xl" />
            </div>
        );
    }

    return (
        <>
            <Table<OcpiCredential>
                data={credentials ?? []}
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

                emptyState={
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/30">
                        <Shield className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <p className="text-lg font-medium">No connected parties yet</p>
                        <p className="text-sm text-muted-foreground">
                            Generate an OCPI Token A to start a connection with another party.
                        </p>
                    </div>
                }
            />
            <OcpiPartyDetailsModal
                credential={selectedParty}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
            />
        </>
    );
}
