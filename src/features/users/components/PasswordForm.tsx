'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormData } from '@/lib/validations/user.schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';

interface PasswordFormProps {
    onSubmit: (data: ChangePasswordFormData) => void;
    isLoading: boolean;
}

export function PasswordForm({ onSubmit, isLoading }: PasswordFormProps) {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const handleFormSubmit = (data: ChangePasswordFormData) => {
        onSubmit(data);
        reset();
    };

    return (
        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border shadow-sm h-full">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <Lock className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black">Security Protocols</CardTitle>
                        <CardDescription className="font-medium text-xs uppercase tracking-widest opacity-60">Update your access credentials</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword" dangerouslySetInnerHTML={{ __html: 'Current Password' }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1" />
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <Input
                                id="currentPassword"
                                type={showCurrent ? "text" : "password"}
                                className="pl-10 pr-10 h-12 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                                {...register('currentPassword')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                                title={showCurrent ? "Hide password" : "Show password"}
                            >
                                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.currentPassword && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.currentPassword.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword" dangerouslySetInnerHTML={{ __html: 'New Credentials' }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1" />
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <Input
                                id="newPassword"
                                type={showNew ? "text" : "password"}
                                className="pl-10 pr-10 h-12 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                                {...register('newPassword')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                                title={showNew ? "Hide password" : "Show password"}
                            >
                                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.newPassword.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" dangerouslySetInnerHTML={{ __html: 'Validate Credentials' }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1" />
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <Input
                                id="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                className="pl-10 pr-10 h-12 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                                {...register('confirmPassword')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                                title={showConfirm ? "Hide password" : "Show password"}
                            >
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Upgrade Credentials
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
