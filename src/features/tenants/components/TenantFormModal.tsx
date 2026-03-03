'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenantSchema, TenantFormData } from '@/lib/validations/tenant.schema';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Building2, Mail, User, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TenantFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TenantFormData) => Promise<void>;
    isLoading: boolean;
}

export function TenantFormModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
}: TenantFormModalProps) {
    const [step, setStep] = useState(1);
    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        reset,
    } = useForm<TenantFormData>({
        resolver: zodResolver(tenantSchema),
    });

    const handleNext = async () => {
        const fieldsToValidate: (keyof TenantFormData)[] = step === 1
            ? ['name']
            : ['adminEmail', 'adminFirstName', 'adminLastName', 'adminPassword'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid && step === 1) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const onModalClose = () => {
        onClose();
        setTimeout(() => {
            setStep(1);
            reset();
        }, 300);
    };

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={onModalClose}
            title="Create New Tenant"
            description="Set up a new organization and its initial administrator."
            className="max-w-xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-between mb-8">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className={`flex-1 h-1.5 rounded-full mx-1 transition-colors duration-300 ${step >= i ? 'bg-primary' : 'bg-muted'
                                }`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">Tenant Name</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="e.g. Acme Corporation"
                                        className="pl-10 h-12 rounded-xl"
                                        {...register('name')}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full h-12 rounded-xl font-bold gap-2"
                                >
                                    Continue to Admin Setup
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="adminFirstName">First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="adminFirstName"
                                            placeholder="John"
                                            className="pl-10 h-10 rounded-xl"
                                            {...register('adminFirstName')}
                                        />
                                    </div>
                                    {errors.adminFirstName && (
                                        <p className="text-xs text-destructive font-medium">{errors.adminFirstName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="adminLastName">Last Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="adminLastName"
                                            placeholder="Doe"
                                            className="pl-10 h-10 rounded-xl"
                                            {...register('adminLastName')}
                                        />
                                    </div>
                                    {errors.adminLastName && (
                                        <p className="text-xs text-destructive font-medium">{errors.adminLastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adminEmail">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="adminEmail"
                                        type="email"
                                        placeholder="admin@example.com"
                                        className="pl-10 h-10 rounded-xl"
                                        {...register('adminEmail')}
                                    />
                                </div>
                                {errors.adminEmail && (
                                    <p className="text-xs text-destructive font-medium">{errors.adminEmail.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adminPassword">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="adminPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-10 rounded-xl"
                                        {...register('adminPassword')}
                                    />
                                </div>
                                {errors.adminPassword && (
                                    <p className="text-xs text-destructive font-medium">{errors.adminPassword.message}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="flex-1 h-12 rounded-xl font-bold"
                                    disabled={isLoading}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-2 h-12 rounded-xl font-bold gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Create Tenant
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </AnimatedModal>
    );
}
