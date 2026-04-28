'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { driverSchema, DriverFormValues } from '@/lib/validations/driver.schema';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateDriver } from '@/hooks/post/useCreateDriver';
import { Mail, User, Phone, Lock, Loader2 } from 'lucide-react';

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DriverFormModal({ isOpen, onClose }: DriverFormModalProps) {
  const createDriver = useCreateDriver();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
    }
  });

  const onSubmit = (data: DriverFormValues) => {
    createDriver.mutate({
      ...data,
      password: data.password || undefined,
    }, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Register New Driver"
      description="Enter driver credentials to grant access to the charging network infrastructure."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                id="firstName"
                placeholder="John"
                className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                {...register('firstName')}
              />
            </div>
            {errors.firstName && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                id="lastName"
                placeholder="Doe"
                className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                {...register('lastName')}
              />
            </div>
            {errors.lastName && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              id="email"
              type="email"
              placeholder="driver@enterprise.com"
              className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Access Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
              {...register('password')}
            />
          </div>
          {errors.password && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Phone Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              id="phoneNumber"
              placeholder="+1 (555) 000-0000"
              className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
              {...register('phoneNumber')}
            />
          </div>
          {errors.phoneNumber && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.phoneNumber.message}</p>}
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
            disabled={createDriver.isPending}
            className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary shadow-lg shadow-primary/20"
          >
            {createDriver.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirm Registration"
            )}
          </Button>
        </div>
      </form>
    </AnimatedModal>
  );
}
