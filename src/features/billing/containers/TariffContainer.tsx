'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ColumnDef } from '@tanstack/react-table';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control, Resolver, useForm } from 'react-hook-form';
import { Coins, Plus, AlertTriangle } from 'lucide-react';
import { useTariffs } from '@/hooks/get/useBilling';
import { useCreateTariff } from '@/hooks/post/useBillingMutations';
import { Tariff } from '@/services/billing.service';
import { tariffSchema, TariffFormData } from '@/lib/validations/billing.schema';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Table } from '@/components/shared/Table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AnimatedModal } from '@/components/shared/AnimatedModal';

export function TariffContainer() {
  const { data, isLoading, isError, refetch, isFetching } = useTariffs();
  const createTariff = useCreateTariff();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const form = useForm<TariffFormData>({
    resolver: zodResolver(tariffSchema) as unknown as Resolver<TariffFormData>,
    defaultValues: {
      name: '',
      pricePerKwh: 0,
      serviceFeePercentage: 0,
      connectionFee: 0,
      idleFee: 0,
      currency: 'USD',
    },
  });

  const columns: ColumnDef<Tariff>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <span className="font-semibold">{row.getValue('name')}</span>,
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
          const currency = row.original.currency || '—';
          const value = row.getValue<number>('idleFee');
          return (
            <span className="font-bold">
              {currency} {Number(value ?? 0).toFixed(2)}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDate(row.getValue('createdAt'))}</span>,
      },
    ],
    []
  );

  const onSubmit = (values: TariffFormData) => {
    createTariff.mutate(values, {
      onSuccess: () => {
        setIsCreateOpen(false);
        form.reset();
      },
    });
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
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Tariff
          </Button>
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
          data={data ?? []}
          columns={columns}
          isLoading={isLoading}
          loadingRowCount={5}
          showSearch={false}
          pageSize={25}
          maxHeight="650px"
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
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 font-black px-8"
              >
                <Plus className="h-4 w-4" />
                Create Tariff
              </Button>
            </div>
          }
        />
      </motion.div>

      <AnimatedModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Tariff"
        description="Define the pricing components used to calculate session costs."
        size="lg"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={createTariff.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={createTariff.isPending}
              className="font-bold"
            >
              {createTariff.isPending ? 'Creating...' : 'Create Tariff'}
            </Button>
          </div>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control as unknown as Control<TariffFormData>}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Standard Tariff"
                      className="bg-muted/10 border-border/40 font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control as unknown as Control<TariffFormData>}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Currency</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="USD"
                        className="bg-muted/10 border-border/40 font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as unknown as Control<TariffFormData>}
                name="pricePerKwh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Price per kWh</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-muted/10 border-border/40 font-medium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as unknown as Control<TariffFormData>}
                name="serviceFeePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Service fee (%)</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-muted/10 border-border/40 font-medium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as unknown as Control<TariffFormData>}
                name="connectionFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Connection fee</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-muted/10 border-border/40 font-medium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as unknown as Control<TariffFormData>}
                name="idleFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Idle fee</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-muted/10 border-border/40 font-medium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </AnimatedModal>
    </motion.div>
  );
}
