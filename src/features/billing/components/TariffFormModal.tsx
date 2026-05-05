'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control, Resolver, useForm } from 'react-hook-form';
import { tariffSchema, TariffFormData } from '@/lib/validations/billing.schema';
import { Tariff } from '@/services/billing.service';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Clock, Coins, Shield } from 'lucide-react';
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
      idleFeePerMinute: 0,
      isIdleFeeEnabled: false,
      idleGracePeriodMinutes: 0,
      maxIdleFee: 0,
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
      idleFeePerMinute: initialData?.idleFeePerMinute ?? 0,
      isIdleFeeEnabled: initialData?.isIdleFeeEnabled ?? false,
      idleGracePeriodMinutes: initialData?.idleGracePeriodMinutes ?? 0,
      maxIdleFee: initialData?.maxIdleFee ?? 0,
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

          </div>

          <div className="space-y-6 pt-6 border-t border-border/50">
            <FormField
              control={form.control as unknown as Control<TariffFormData>}
              name="isIdleFeeEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/40 bg-card shadow-sm p-4">
                  <div className="space-y-1">
                    <FormLabel className="text-base font-bold text-foreground">Enable Idle Fees</FormLabel>
                    <div className="text-sm text-muted-foreground font-medium">Charge users who remain plugged in after charging completes</div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('isIdleFeeEnabled') && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                {/* Grace Period */}
                <FormField
                  control={form.control as unknown as Control<TariffFormData>}
                  name="idleGracePeriodMinutes"
                  render={({ field }) => (
                    <FormItem className="space-y-3 pb-6 border-b border-border/40">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <FormLabel className="font-bold text-foreground">Grace Period</FormLabel>
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Time after charging completes before idle fees begin (0-60 minutes)</div>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Slider
                            min={0}
                            max={60}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="flex-1 cursor-pointer"
                          />
                          <div className="w-16 flex items-center justify-end font-mono text-sm font-semibold">
                            {field.value} min
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Idle Rate */}
                <FormField
                  control={form.control as unknown as Control<TariffFormData>}
                  name="idleFeePerMinute"
                  render={({ field }) => (
                    <FormItem className="space-y-3 pb-6 border-b border-border/40">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-muted-foreground" />
                        <FormLabel className="font-bold text-foreground">Idle Rate (per minute)</FormLabel>
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Amount charged per minute while vehicle is idle</div>
                      <FormControl>
                        <div className="relative w-48">
                          <Input type="number" step="0.01" className="pr-12 bg-background border-border/40 font-medium rounded-lg shadow-sm" {...field} />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-muted-foreground font-medium text-sm">{form.watch('currency') === 'USD' ? '$' : '₹'}/min</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Fee Cap */}
                <FormField
                  control={form.control as unknown as Control<TariffFormData>}
                  name="maxIdleFee"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <FormLabel className="font-bold text-foreground">Maximum Fee Cap</FormLabel>
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">Set a maximum limit on idle fees</div>
                      </div>
                      
                      <FormControl>
                        <div className="relative w-48 mt-3">
                          <Input type="number" step="0.01" className="pr-12 bg-background border-border/40 font-medium rounded-lg shadow-sm" {...field} />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-muted-foreground font-medium text-sm">{form.watch('currency') === 'USD' ? '$' : '₹'}/max</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preview Box */}
                <div className="bg-muted/30 border border-border/40 rounded-xl p-4 mt-6">
                  <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Preview</div>
                  <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                    After charging completes, a <span className="font-bold">{form.watch('idleGracePeriodMinutes')}-minute</span> grace period applies. Then <span className="font-bold">{form.watch('currency') === 'USD' ? '$' : '₹'}{Number(form.watch('idleFeePerMinute')).toFixed(2)}/min</span> is charged
                    up to a maximum of <span className="font-bold">{form.watch('currency') === 'USD' ? '$' : '₹'}{Number(form.watch('maxIdleFee')).toFixed(2)}</span>.
                  </p>
                </div>

              </div>
            )}
          </div>
        </form>
      </Form>
    </AnimatedModal>
  );
}

