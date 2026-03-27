'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema, UserProfileFormData } from '@/lib/validations/user.schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Loader2, Save } from 'lucide-react';
import { User as UserType } from '@/types';

interface ProfileFormProps {
    user: UserType;
    onSubmit: (data: UserProfileFormData) => void;
    isLoading: boolean;
}

export function ProfileForm({ user, onSubmit, isLoading }: ProfileFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<UserProfileFormData>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
        },
    });

    return (
        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black">Personal Identity</CardTitle>
                        <CardDescription className="font-medium text-xs uppercase tracking-widest opacity-60">Manage your enterprise profile and contact reachability</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">First Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                <Input
                                    id="firstName"
                                    className="pl-10 h-12 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                                    {...register('firstName')}
                                />
                            </div>
                            {errors.firstName && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.firstName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Last Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                <Input
                                    id="lastName"
                                    className="pl-10 h-12 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                                    {...register('lastName')}
                                />
                            </div>
                            {errors.lastName && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <Input
                                id="email"
                                type="email"
                                className="pl-10 h-12 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                                {...register('email')}
                            />
                        </div>
                        {errors.email && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Number (Optional)</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <Input
                                id="phoneNumber"
                                className="pl-10 h-12 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                                {...register('phoneNumber')}
                            />
                        </div>
                        {errors.phoneNumber && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.phoneNumber.message}</p>}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={isLoading || !isDirty}
                            className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Synchronize Profile
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
