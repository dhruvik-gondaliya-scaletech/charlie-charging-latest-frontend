'use client';

import { useForm, SubmitHandler, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { webhookSchema, WebhookFormData } from '@/lib/validations/webhook.schema';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { WebhookEvent, WebhookConfiguration } from '@/types';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Globe, Bell } from 'lucide-react';

interface WebhookFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: WebhookFormData) => void;
    initialData?: WebhookConfiguration | null;
    isLoading?: boolean;
}

const EVENT_TYPES = Object.values(WebhookEvent);

export function WebhookFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isLoading,
}: WebhookFormModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        control,
        formState: { errors },
    } = useForm<WebhookFormData>({
        resolver: zodResolver(webhookSchema),
        defaultValues: {
            name: '',
            url: '',
            events: [],
            isActive: true,
            maxRetries: 3,
            timeoutSeconds: 10,
        },
    });

    const selectedEvents = useWatch({
        control,
        name: 'events',
        defaultValue: [],
    });

    const isActive = useWatch({
        control,
        name: 'isActive',
        defaultValue: true,
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                url: initialData.url,
                events: initialData.events as WebhookEvent[],
                isActive: initialData.isActive,
                maxRetries: initialData.maxRetries,
                timeoutSeconds: initialData.timeoutSeconds,
            });
        } else {
            reset({
                name: '',
                url: '',
                events: [],
                isActive: true,
                maxRetries: 3,
                timeoutSeconds: 10,
            });
        }
    }, [initialData, reset, isOpen]);





    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Update Webhook' : 'Create Webhook'}
            description={
                initialData
                    ? 'Modify your webhook configuration'
                    : 'Configure a new endpoint to receive real-time OCPP events'
            }
            className="max-w-2xl"
        >
            <form onSubmit={handleSubmit(onSubmit as SubmitHandler<WebhookFormData>)} className="space-y-8 pt-4">
                {/* Core Settings Section */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 pb-1 border-b border-muted-foreground/10">
                        <Globe className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            Endpoint Configuration
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Friendly Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Production Monitoring"
                                {...register('name')}
                                className={errors.name ? 'border-destructive focus-visible:ring-destructive' : 'bg-muted/30'}
                                aria-invalid={!!errors.name}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url" className="text-sm font-medium">
                                Target URL
                            </Label>
                            <Input
                                id="url"
                                placeholder="https://api.yourdomain.com/webhook"
                                {...register('url')}
                                className={errors.url ? 'border-destructive focus-visible:ring-destructive' : 'bg-muted/30'}
                                aria-invalid={!!errors.url}
                            />
                            {errors.url && (
                                <p className="text-xs text-destructive font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                                    {errors.url.message}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Events Selection Section */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 pb-1 border-b border-muted-foreground/10">
                        <Bell className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            OCPP Events Subscription
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {EVENT_TYPES.map((event) => (
                            <div
                                key={event}
                                className={`
                  group flex items-center justify-between p-3 rounded-xl border transition-all
                  ${selectedEvents.includes(event)
                                        ? 'bg-primary/5 border-primary/30 shadow-sm'
                                        : 'bg-muted/20 border-muted-foreground/10 hover:border-primary/20 hover:bg-muted/30'
                                    }
                `}
                            >
                                <Label
                                    htmlFor={`event-${event}`}
                                    className="flex items-center gap-3 w-full cursor-pointer"
                                >
                                    <Controller
                                        control={control}
                                        name="events"
                                        render={({ field }) => (
                                            <Checkbox
                                                id={`event-${event}`}
                                                checked={field.value.includes(event)}
                                                onCheckedChange={(checked) => {
                                                    const newValue = checked
                                                        ? [...field.value, event]
                                                        : field.value.filter((v: WebhookEvent) => v !== event);
                                                    field.onChange(newValue);
                                                }}
                                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                        )}
                                    />
                                    <span className={`text-sm font-medium ${selectedEvents.includes(event) ? 'text-primary' : 'text-foreground'}`}>
                                        {event}
                                    </span>
                                </Label>
                                {selectedEvents.includes(event) && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-1.5 h-1.5 rounded-full bg-primary"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.events && (
                        <p className="text-xs text-destructive font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                            {errors.events.message}
                        </p>
                    )}
                </section>

                {/* Advanced Settings Section */}
                <section className="space-y-5">
                    <div className="flex items-center gap-2 pb-1 border-b border-muted-foreground/10">
                        <Settings2 className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            Reliability & Status
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="maxRetries" className="text-sm font-medium">
                                Max Retries
                            </Label>
                            <Input
                                id="maxRetries"
                                type="number"
                                {...register('maxRetries', { valueAsNumber: true })}
                                className="bg-muted/30"
                            />
                            {errors.maxRetries && (
                                <p className="text-xs text-destructive font-medium mt-1">{errors.maxRetries.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timeoutSeconds" className="text-sm font-medium">
                                Timeout (s)
                            </Label>
                            <Input
                                id="timeoutSeconds"
                                type="number"
                                {...register('timeoutSeconds', { valueAsNumber: true })}
                                className="bg-muted/30"
                            />
                            {errors.timeoutSeconds && (
                                <p className="text-xs text-destructive font-medium mt-1">{errors.timeoutSeconds.message}</p>
                            )}
                        </div>

                        <div className="flex items-end pb-2">
                            <Label
                                htmlFor="isActive"
                                className="flex items-center gap-3 p-3 w-full rounded-xl bg-muted/20 border border-muted-foreground/10 cursor-pointer"
                            >
                                <Controller
                                    control={control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <Checkbox
                                            id="isActive"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                                        />
                                    )}
                                />
                                <span className="text-sm font-semibold">Enabled</span>
                            </Label>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="hover:bg-muted/50 transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                <span>{initialData ? 'Updating...' : 'Creating...'}</span>
                            </div>
                        ) : (
                            initialData ? 'Update Configuration' : 'Create Webhook'
                        )}
                    </Button>
                </div>
            </form>
        </AnimatedModal>
    );
}
