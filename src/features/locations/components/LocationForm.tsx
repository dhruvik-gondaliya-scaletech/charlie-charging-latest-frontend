import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { locationSchema, LocationFormData } from '@/lib/validations/location.schema';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Building2,
    MapPin,
    Globe,
    Search,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Info,
    Loader2
} from 'lucide-react';
import AddressAutocomplete, { ParsedAddress } from '@/components/shared/AddressAutocomplete';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LocationFormProps {
    initialData?: Partial<LocationFormData>;
    onSubmit: (data: LocationFormData) => void;
    isLoading?: boolean;
    mode?: 'create' | 'edit';
}

export function LocationForm({
    initialData,
    onSubmit,
    isLoading = false,
    mode = 'create',
}: LocationFormProps) {
    const [useManualEntry, setUseManualEntry] = useState(mode === 'edit');
    const [isAddressFilled, setIsAddressFilled] = useState(mode === 'edit');

    const form = useForm<LocationFormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            name: initialData?.name || '',
            address: initialData?.address || '',
            city: initialData?.city || '',
            state: initialData?.state || '',
            country: initialData?.country || 'USA',
            zipCode: initialData?.zipCode || '',
            latitude: initialData?.latitude,
            longitude: initialData?.longitude,
            isActive: initialData?.isActive ?? true,
        },
    });

    const handleAddressSelect = (address: ParsedAddress) => {
        form.setValue('address', address.address, { shouldValidate: true });
        form.setValue('city', address.city, { shouldValidate: true });
        form.setValue('state', address.state, { shouldValidate: true });
        form.setValue('zipCode', address.zipCode, { shouldValidate: true });
        form.setValue('country', address.country || 'USA', { shouldValidate: true });

        if (address.latitude) form.setValue('latitude', address.latitude);
        if (address.longitude) form.setValue('longitude', address.longitude);

        setIsAddressFilled(true);
        toast.success('Address auto-filled successfully');
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Section 1: Identity */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight">Identity</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Global identification for the site</p>
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="font-bold flex items-center gap-1.5 ml-1">
                                    <Globe className="h-3.5 w-3.5 text-primary" />
                                    Location Name*
                                </FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <Input
                                            placeholder="e.g., Silicon Valley Hub"
                                            className="bg-muted/30 border-border/60 focus:bg-background transition-all h-12 font-medium"
                                            {...field}
                                            value={typeof field.value === 'string' ? field.value : ''}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                                            <Info className="h-4 w-4" />
                                        </div>
                                    </div>
                                </FormControl>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Choose a globally unique name for this strategic site</p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Section 2: Precise Location */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight">Geolocation</h3>
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Precise coordinate and address routing</p>
                            </div>
                        </div>
                        {mode === 'create' && (
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => setUseManualEntry(!useManualEntry)}
                            >
                                {useManualEntry ? "Use Address Search" : "Manual Override"}
                            </Button>
                        )}
                    </div>

                    {!useManualEntry && mode === 'create' ? (
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4 items-center">
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                    <Search className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black tracking-tight">Smart Address Search</p>
                                    <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                                        Search for the address to automatically populate all location data including coordinates.
                                    </p>
                                </div>
                            </div>
                            <AddressAutocomplete
                                onAddressSelect={handleAddressSelect}
                                placeholder="Search by street name, landmark, or business..."
                                className="bg-muted/30 py-6"
                            />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2 space-y-2">
                                        <FormLabel className="font-bold ml-1">Street Address*</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123 Innovation Drive"
                                                className="bg-muted/30 border-border/60 focus:bg-background transition-all h-12 font-medium"
                                                {...field}
                                                value={typeof field.value === 'string' ? field.value : ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="font-bold ml-1">City*</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="San Francisco"
                                                className="bg-muted/30 border-border/60 focus:bg-background transition-all h-12 font-medium"
                                                {...field}
                                                value={typeof field.value === 'string' ? field.value : ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="font-bold ml-1">State / Province*</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="California"
                                                className="bg-muted/30 border-border/60 focus:bg-background transition-all h-12 font-medium"
                                                {...field}
                                                value={typeof field.value === 'string' ? field.value : ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="zipCode"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="font-bold ml-1">Zip / Postal Code*</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="94103"
                                                className="bg-muted/30 border-border/60 focus:bg-background transition-all h-12 font-medium"
                                                {...field}
                                                value={typeof field.value === 'string' ? field.value : ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="font-bold ml-1">Country*</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="USA"
                                                className="bg-muted/30 border-border/60 focus:bg-background transition-all h-12 font-medium"
                                                {...field}
                                                value={typeof field.value === 'string' ? field.value : ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    )}
                </div>

                {/* Footer Insight */}
                <div className="p-4 bg-violet-500/5 border border-violet-500/10 rounded-2xl flex gap-4 items-center">
                    <div className="p-2 rounded-full bg-violet-500/10 text-violet-500">
                        <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium italic leading-relaxed">
                        By defining this location, you enable smart deployment and optimized charging network topology for your fleet.
                    </p>
                </div>

                {/* Action Bar */}
                <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border/40 rounded-b-3xl">
                    <div className="hidden md:block">
                        <p className="text-sm font-black tracking-tight">{mode === 'create' ? 'Ready to define site?' : 'Reviewing site metrics?'}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Changes will be synchronized across the network</p>
                    </div>
                    <Button
                        key="submit"
                        type="submit"
                        disabled={isLoading}
                        className="min-w-[160px] h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {mode === 'create' ? 'Complete Site Registration' : 'Sync Global Parameters'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
