'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control, Resolver, useForm } from 'react-hook-form';
import { tariffSchema, TariffFormData } from '@/lib/validations/billing.schema';
import { Tariff } from '@/services/billing.service';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface TariffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TariffFormData) => void;
  initialData?: Tariff | null;
  isLoading?: boolean;
}

export function TariffFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: TariffFormModalProps) {
  const form = useForm<TariffFormData>({
    resolver: zodResolver(tariffSchema) as unknown as Resolver<TariffFormData>,
    defaultValues: {
      name: '',
      pricePerKwh: 0,
      serviceFeePercentage: 0,
      connectionFee: 0,
      idleFee: 0,
      currency: 'INR',
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    form.reset({
      name: initialData?.name ?? '',
      pricePerKwh: initialData?.pricePerKwh ?? 0,
      serviceFeePercentage: initialData?.serviceFeePercentage ?? 0,
      connectionFee: initialData?.connectionFee ?? 0,
      idleFee: initialData?.idleFee ?? 0,
      currency: initialData?.currency ?? 'INR',
    });
  }, [form, initialData, isOpen]);

  const isEdit = !!initialData;

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Tariff' : 'Create Tariff'}
      description={
        isEdit
          ? 'Update the pricing components used to calculate session costs.'
          : 'Define the pricing components used to calculate session costs.'
      }
      size="lg"
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="font-bold"
          >
            {isLoading ? (isEdit ? 'Saving...' : 'Creating...') : isEdit ? 'Save Changes' : 'Create Tariff'}
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/10 border-border/40 font-medium">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
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
  );
}

