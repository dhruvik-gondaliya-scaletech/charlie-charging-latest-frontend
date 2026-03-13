'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Shield, Trash2, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { OcpiCredential } from '@/services/ocpi.service';
import { Table } from '@/components/shared/Table';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface OcpiCredentialsListProps {
    credentials?: OcpiCredential[];
    isLoading: boolean;
    onDelete?: (id: string) => void;
}

export function OcpiCredentialsList({ credentials, isLoading, onDelete }: OcpiCredentialsListProps) {
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
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete?.(row.original.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Connection
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
        <Table<OcpiCredential>
            data={credentials ?? []}
            columns={columns}
            isLoading={isLoading}
            showSearch
            searchPosition="end"
            showPagination
            pageSize={DEFAULT_PAGE_SIZE}
            sortByKey="updatedAt"
            sortOrder="desc"
            maxHeight="600px"
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
    );
}
