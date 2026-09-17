'use client';

import { useState, useMemo } from 'react';
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
import { AppPermission } from '@/types';
import { useHasPermission } from '@/lib/permissions';
import { ProtectedAction } from '@/components/shared/ProtectedAction';
import { ActionIconButton } from '@/components/shared/ActionIconButton';
import { CopyButton } from '@/components/shared/CopyButton';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { OcpiPartyDetailsModal } from './OcpiPartyDetailsModal';

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


    const canManageOcpi = useHasPermission(AppPermission.OCPI_MANAGE);

    const handleViewDetails = (party: OcpiCredential) => {
        setSelectedParty(party);
        setIsDetailsOpen(true);
    };

    const columns: ColumnDef<OcpiCredential>[] = useMemo(
        () => {
            const cols: ColumnDef<OcpiCredential>[] = [
                {
                    accessorKey: 'partyId',
                    header: 'Party ID',
                    size: 90,
                    cell: ({ row }) => (
                        <div
                            className="flex items-center gap-2 cursor-pointer hover:text-primary font-semibold transition-colors"
                            onClick={() => handleViewDetails(row.original)}
                        >
                            {row.original.partyId || 'PENDING'}
                        </div>
                    ),
                },
                {
                    accessorKey: 'countryCode',
                    header: 'Country',
                    size: 80,
                    cell: ({ row }) => (
                        <Badge variant="outline" className="font-mono text-xs">
                            {row.original.countryCode}
                        </Badge>
                    ),
                },
                {
                    accessorKey: 'roles',
                    header: 'Roles',
                    cell: ({ row }) => {
                        const roles = row.original.roles || [];
                        return (
                            <div className="flex flex-wrap gap-1">
                                {roles.map((r, i) => (
                                    <Badge key={i} variant="secondary" className="text-[10px] uppercase font-bold px-2 py-0.5">
                                        {r.role} ({r.party_id})
                                    </Badge>
                                ))}
                            </div>
                        );
                    },
                },
                {
                    accessorKey: 'token',
                    header: 'TOKEN (C) / (A)',
                    cell: ({ row }) => (
                        <div className="flex flex-col gap-1 text-xs">
                            <div className="flex items-center gap-1.5 font-mono text-[11px]">
                                <span className="text-muted-foreground font-sans font-bold">C:</span>
                                <span className="truncate max-w-[90px]">{row.original.tokenC || '—'}</span>
                                {row.original.tokenC && <CopyButton value={row.original.tokenC} className="h-4 w-4 p-0" />}
                            </div>
                            <div className="flex items-center gap-1.5 font-mono text-[11px]">
                                <span className="text-muted-foreground font-sans font-bold">A:</span>
                                <span className="truncate max-w-[90px]">{row.original.tokenA || '—'}</span>
                                {row.original.tokenA && <CopyButton value={row.original.tokenA} className="h-4 w-4 p-0" />}
                            </div>
                        </div>
                    ),
                },
                {
                    accessorKey: 'partnerVersionsUrl',
                    header: 'Endpoint URL',
                    cell: ({ row }) => (
                        <span className="font-mono text-xs text-muted-foreground truncate max-w-[180px] block" title={row.original.partnerVersionsUrl}>
                            {row.original.partnerVersionsUrl}
                        </span>
                    ),
                },
            ];

            if (canManageOcpi) {
                cols.push({
                    id: 'actions',
                    header: 'Actions',
                    size: 80,
                    cell: ({ row }) => (
                        <div className="flex items-center justify-start gap-1">
                            <ActionIconButton
                                tone="info"
                                tooltip="View Details"
                                icon={<Info className="h-4 w-4" />}
                                onClick={() => handleViewDetails(row.original)}
                            />
                            <ProtectedAction permission={AppPermission.OCPI_MANAGE}>
                                <ActionIconButton
                                    tone="destructive"
                                    tooltip="Delete Connection"
                                    icon={<Trash2 className="h-4 w-4" />}
                                    onClick={() => onDelete(row.original.id)}
                                />
                            </ProtectedAction>
                        </div>
                    ),
                });
            }

            return cols;
        },
        [canManageOcpi, onDelete]
    );

    const renderMobileCard = (item: OcpiCredential) => {
        const hasHandshake = item.roles && item.roles.length > 0;
        const statusColor = hasHandshake
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-500 border-amber-500/20';

        return (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Party ID</span>
                        <span className="font-bold text-sm text-foreground">
                            {item.partyId || 'Pending'} ({item.countryCode || '-'})
                        </span>
                    </div>
                    <Badge
                        variant="outline"
                        className={cn('capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm text-xs', statusColor)}
                    >
                        {hasHandshake ? 'connected' : 'registered'}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Version URL</span>
                        <span className="text-xs font-mono truncate max-w-[250px]" title={item.partnerVersionsUrl}>
                            {item.partnerVersionsUrl}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Registration Token</span>
                        <div className="flex items-center gap-2 bg-muted/60 px-2 py-1 rounded-lg border border-border/40 justify-between">
                            <code className="text-[10px] font-mono break-all pr-2">
                                {item.tokenA || '-'}
                            </code>
                            {item.tokenA && (
                                <CopyButton value={item.tokenA} className="bg-background shadow-xs h-7 w-7" toastMessage="Registration Token copied" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <span className="text-[10px] text-muted-foreground font-medium">
                        Updated: {item.updatedAt ? format(new Date(item.updatedAt), 'MMM d, p') : '-'}
                    </span>
                    <div className="flex items-center gap-2">
                        <ActionIconButton
                            tone="info"
                            tooltip="View Details"
                            icon={<Info className="h-4 w-4" />}
                            onClick={() => handleViewDetails(item)}
                        />
                        <ProtectedAction permission={AppPermission.OCPI_MANAGE}>
                            <ActionIconButton
                                tone="destructive"
                                tooltip="Delete Connection"
                                icon={<Trash2 className="h-4 w-4" />}
                                onClick={() => onDelete(item.id)}
                            />
                        </ProtectedAction>
                    </div>
                </div>
            </div>
        );
    };

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
                renderMobileCard={renderMobileCard}
                rightPinnedColumnIds={['actions']}

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
