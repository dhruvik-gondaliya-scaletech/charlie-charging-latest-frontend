'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { idTagSchema, IdTagFormValues } from '@/lib/validations/id-tag.schema';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateIdTag } from '@/hooks/post/useCreateIdTag';
import { useUpdateIdTag } from '@/hooks/patch/useUpdateIdTag';
import { useDrivers } from '@/hooks/get/useDrivers';
import { IdTag, IdTagStatus } from '@/types';
import { CreditCard, User, Activity, Calendar, Loader2 } from 'lucide-react';

interface IdTagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IdTag | null;
}

export function IdTagFormModal({ isOpen, onClose, initialData }: IdTagFormModalProps) {
  const isEditing = !!initialData;
  const createIdTag = useCreateIdTag();
  const updateIdTag = useUpdateIdTag(initialData?.idTag || '');
  const { data: drivers, isLoading: isLoadingDrivers } = useDrivers();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IdTagFormValues>({
    resolver: zodResolver(idTagSchema),
    defaultValues: {
      idTag: '',
      status: IdTagStatus.ACCEPTED,
      driverId: '',
      expiryDate: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        idTag: initialData.idTag,
        status: initialData.status,
        driverId: initialData.driverId,
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
      });
    } else {
      reset({
        idTag: '',
        status: IdTagStatus.ACCEPTED,
        driverId: '',
        expiryDate: '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: IdTagFormValues) => {
    const payload = {
      ...data,
      expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : undefined,
    };

    if (isEditing) {
      const { idTag: _, ...updatePayload } = payload;
      updateIdTag.mutate(updatePayload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      createIdTag.mutate(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title={isEditing ? "Modify Access Token" : "Enroll New Access Token"}
      description={isEditing ? "Update existing RFID tag credentials and association." : "Register a new RFID tag and assign it to a network driver."}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="idTag" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">RFID Tag ID</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              id="idTag"
              placeholder="TAG123456"
              disabled={isEditing}
              className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold uppercase tracking-widest"
              {...register('idTag')}
            />
          </div>
          {errors.idTag && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.idTag.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="driverId" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Assign to Driver</Label>
          <Controller
            control={control}
            name="driverId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground/50" />
                    <SelectValue placeholder={isLoadingDrivers ? "Loading..." : "Select driver"} />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 bg-background/95 backdrop-blur-xl">
                  {drivers?.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id} className="font-bold py-2.5">
                      {driver.firstName} {driver.lastName} ({driver.email})
                    </SelectItem>
                  ))}
                  {drivers?.length === 0 && (
                    <div className="p-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      No drivers registered
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.driverId && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.driverId.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Token Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground/50" />
                      <SelectValue placeholder="Select status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40 bg-background/95 backdrop-blur-xl">
                    {Object.values(IdTagStatus).map((status) => (
                      <SelectItem key={status} value={status} className="font-bold py-2.5">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Expiry Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                id="expiryDate"
                type="date"
                className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                {...register('expiryDate')}
              />
            </div>
            {errors.expiryDate && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.expiryDate.message}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] border-border/40 hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createIdTag.isPending || updateIdTag.isPending}
            className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary shadow-lg shadow-primary/20"
          >
            {createIdTag.isPending || updateIdTag.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              isEditing ? "Store Changes" : "Activate Token"
            )}
          </Button>
        </div>
      </form>
    </AnimatedModal>
  );
}
