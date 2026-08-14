'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { Coins, Plus, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { useTariffs } from '@/hooks/get/useBilling';
import { useCreateTariff, useDeleteTariff, useUpdateTariff } from '@/hooks/post/useBillingMutations';
import { Tariff } from '@/services/billing.service';
import { TariffFormData } from '@/lib/validations/billing.schema';
import { useDebounce } from '@/hooks/use-debounce';
import { DEFAULT_PAGE_SIZE } from '@/constants/constants';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { AppPermission, AppEnvironment } from '@/types';
import { ProtectedAction } from '@/components/shared/ProtectedAction';
import { Table } from '@/components/shared/Table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TariffFormModal } from '@/features/billing/components/TariffFormModal';
import { DeleteTariffModal } from '@/features/billing/components/DeleteTariffModal';
import { ActionIconButton } from '@/components/shared/ActionIconButton';

export function TariffContainer() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, refetch, isFetching } = useTariffs({
    search: debouncedSearch || undefined,
    page,
    limit: pageSize,
  });

  const tariffsList = data || [];
  const totalCount = data?.meta?.total ?? tariffsList.length;

  const createTariff = useCreateTariff();
  const updateTariff = useUpdateTariff();
  const deleteTariff = useDeleteTariff();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);

  const columns: ColumnDef<Tariff>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <span className="font-semibold">{row.getValue('name')}</span>,
      },
      {
        accessorKey: 'environment',
        header: 'Environment',
        cell: ({ row }) => {
          const env = row.original.environment as AppEnvironment;
          const colorClasses = env === AppEnvironment.PRODUCTION
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            : 'bg-blue-500/10 text-blue-500 border-blue-500/20';
          return (
            <Badge
              variant="outline"
              className={cn(
                'capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm',
                colorClasses
              )}
            >
              {env === AppEnvironment.PRODUCTION ? 'PROD' : 'DEV'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'pricePerKwh',
        header: 'Price / kWh',
        cell: ({ row }) => {
          const currency = row.original.currency || '—';
          const value = row.getValue<number>('pricePerKwh');
          return (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-background">
                {currency}
              </Badge>
              <span className="font-bold">{Number(value ?? 0).toFixed(2)}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'serviceFeePercentage',
        header: 'Service Fee',
        cell: ({ row }) => (
          <span className="font-bold">{Number(row.getValue<number>('serviceFeePercentage') ?? 0).toFixed(2)}%</span>
        ),
      },
      {
        accessorKey: 'connectionFee',
        header: 'Connection Fee',
        cell: ({ row }) => {
          const currency = row.original.currency || '—';
          const value = row.getValue<number>('connectionFee');
          return (
            <span className="font-bold">
              {currency} {Number(value ?? 0).toFixed(2)}
            </span>
          );
        },
      },
      {
        accessorKey: 'idleFee',
        header: 'Idle Fee',
        cell: ({ row }) => {
          const isEnabled = row.original.isIdleFeeEnabled;
          if (!isEnabled) {
            return <span className="font-bold text-muted-foreground text-xs bg-muted/40 px-2 py-0.5 rounded-md">Disabled</span>;
          }
          const currency = row.original.currency || '—';
          const value = row.original.idleFeePerMinute;
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-sm">
                {currency} {Number(value ?? 0).toFixed(2)} <span className="text-xs text-muted-foreground font-medium">/ min</span>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                Grace: {row.original.idleGracePeriodMinutes}m
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDate(row.getValue('createdAt'))}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <ProtectedAction permission={AppPermission.TARIFF_UPDATE}>
              <ActionIconButton
                tone="primary"
                tooltip="Edit"
                icon={<Pencil className="h-3.5 w-3.5" />}
                onClick={() => {
                  const tariff = row.original;
                  setSelectedTariff(tariff);
                  setIsEditOpen(true);
                }}
              />
            </ProtectedAction>
            <ProtectedAction permission={AppPermission.TARIFF_DELETE}>
              <ActionIconButton
                tone="destructive"
                tooltip="Delete"
                icon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={() => {
                  setSelectedTariff(row.original);
                  setIsDeleteOpen(true);
                }}
              />
            </ProtectedAction>
          </div>
        ),
      },
    ],
    []
  );

  const onCreateSubmit = (values: TariffFormData) => {
    createTariff.mutate(values, {
      onSuccess: () => {
        setIsCreateOpen(false);
      },
    });
  };

  const onEditSubmit = (values: TariffFormData) => {
    if (!selectedTariff) return;

    updateTariff.mutate(
      { id: selectedTariff.id, data: values },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setSelectedTariff(null);
        },
      }
    );
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="p-8 text-center max-w-md border border-destructive/20 bg-destructive/5 rounded-2xl">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-bold text-lg">Failed to load tariffs</p>
          <p className="text-sm text-muted-foreground mt-2">
            There was an error fetching tariff configuration. Please try again.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto"
    >
      <motion.div
        variants={staggerItem}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Tariff
          </h1>
          <p className="text-sm font-medium text-muted-foreground tracking-tight">
            Define pricing rules for charging sessions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ProtectedAction permission={AppPermission.TARIFF_CREATE}>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold shrink-0"
            >
              <Plus className="h-4 w-4" />
              Create Tariff
            </Button>
          </ProtectedAction>
        </div>
      </motion.div>

      <motion.div
        variants={staggerItem}
        className={cn(
          'relative transition-opacity duration-300',
          isFetching && !isLoading && 'opacity-60 pointer-events-none'
        )}
      >
        <Table<Tariff>
          data={tariffsList}
          columns={columns}
          isLoading={isLoading}
          loadingRowCount={5}
          showSearch={true}
          searchPosition="end"
          onSearch={(value: string) => {
            setSearch(value);
            setPage(1);
          }}
          manualPagination={true}
          manualSearching={true}
          totalCount={totalCount}
          pageIndex={page - 1}
          pageSize={pageSize}
          onPageChange={(newPage: number) => setPage(newPage + 1)}
          onPageSizeChange={(newSize: number) => {
            setPageSize(newSize);
            setPage(1);
          }}
          maxHeight="650px"
          renderMobileCard={(tariff) => (
            <div className="bg-card border border-border rounded-[1.5rem] p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg leading-tight">{tariff.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold px-2 py-0.5 rounded-lg shadow-sm text-xs">
                      {tariff.currency} {Number(tariff.pricePerKwh ?? 0).toFixed(2)} / kWh
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        'capitalize font-bold px-2 py-0.5 rounded-full border shadow-sm text-[9px] uppercase tracking-tighter',
                        tariff.environment === AppEnvironment.PRODUCTION
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      )}
                    >
                      {tariff.environment === AppEnvironment.PRODUCTION ? 'PROD' : 'DEV'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-1">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Service Fee</span>
                  <p className="text-sm font-bold">{Number(tariff.serviceFeePercentage ?? 0).toFixed(2)}%</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Connection</span>
                  <p className="text-sm font-bold">{tariff.currency} {Number(tariff.connectionFee ?? 0).toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Idle Fee</span>
                  {tariff.isIdleFeeEnabled ? (
                    <div className="flex flex-col">
                      <p className="text-sm font-bold">{tariff.currency} {Number(tariff.idleFeePerMinute ?? 0).toFixed(2)}<span className="text-xs text-muted-foreground font-medium">/min</span></p>
                      <p className="text-[10px] text-muted-foreground font-medium">Grace: {tariff.idleGracePeriodMinutes}m {tariff.maxIdleFee ? `• Max: ${tariff.currency} ${tariff.maxIdleFee}` : ''}</p>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md w-fit">Disabled</p>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Created</span>
                  <p className="text-[10px] font-medium text-muted-foreground">{formatDate(tariff.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                <ProtectedAction permission={AppPermission.TARIFF_UPDATE}>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 px-3 rounded-xl font-bold text-xs"
                    onClick={() => {
                      setSelectedTariff(tariff);
                      setIsEditOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                </ProtectedAction>
                <ProtectedAction permission={AppPermission.TARIFF_DELETE}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 rounded-xl font-bold text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      setSelectedTariff(tariff);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                </ProtectedAction>
              </div>
            </div>
          )}
          emptyState={
            <div className="py-20 flex flex-col items-center justify-center text-center gap-6 bg-card/10 rounded-[2.5rem] border-2 border-dashed border-border/40">
              <div className="p-6 rounded-full bg-primary/5 text-primary/40 ring-1 ring-primary/10">
                <Coins className="h-16 w-16" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-foreground">No tariffs found</h3>
                <p className="max-w-xs text-muted-foreground font-medium text-sm leading-relaxed mx-auto">
                  Create your first tariff to define how sessions are priced.
                </p>
              </div>
              <ProtectedAction permission={AppPermission.TARIFF_CREATE}>
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 font-black px-8"
                >
                  <Plus className="h-4 w-4" />
                  Create Tariff
                </Button>
              </ProtectedAction>
            </div>
          }
        />
      </motion.div>

      <TariffFormModal
        key="create-tariff"
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={onCreateSubmit}
        isLoading={createTariff.isPending}
      />

      <TariffFormModal
        key={selectedTariff ? `edit-${selectedTariff.id}` : 'edit-none'}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTariff(null);
        }}
        onSubmit={onEditSubmit}
        initialData={selectedTariff}
        isLoading={updateTariff.isPending}
      />

      <DeleteTariffModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedTariff(null);
        }}
        tariff={selectedTariff}
        isLoading={deleteTariff.isPending}
        onConfirm={() => {
          if (!selectedTariff) return;
          deleteTariff.mutate(selectedTariff.id, {
            onSuccess: () => {
              setIsDeleteOpen(false);
              setSelectedTariff(null);
            },
          });
        }}
      />
    </motion.div>
  );
}
