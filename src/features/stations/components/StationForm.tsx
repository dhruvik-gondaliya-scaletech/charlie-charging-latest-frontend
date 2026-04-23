'use client';

import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { stationSchema } from '@/lib/validations/station.schema';
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
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useLocations } from '@/hooks/get/useLocations';
import { useAuth } from '@/contexts/AuthContext';
import { Station } from '@/types';
import { Info, Zap, MapPin, Cpu, Link as LinkIcon, ShieldCheck, CheckCircle2, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfiniteScrollDropdown } from '@/components/shared/InfiniteScrollDropdown';
import { useBrands } from '@/hooks/get/useBrands';
import { Brand, ConnectorType } from '@/types';
import { useConnectorTypes } from '@/hooks/get/useConnectorTypes';

export type StationFormValues = z.infer<typeof stationSchema>;

interface StationFormProps {
    initialData?: Partial<StationFormValues>;
    onSubmit: (data: StationFormValues) => void;
    isLoading?: boolean;
    onCancel: () => void;
}

export function StationForm({ initialData, onSubmit, isLoading, onCancel }: StationFormProps) {
    const { data: locations, isLoading: locationsLoading } = useLocations();
    const { tenant } = useAuth();
    const isEdit = !!initialData?.serialNumber;

    const [brandSearch, setBrandSearch] = React.useState('');
    const {
        data: brandData,
        fetchNextPage: fetchNextBrands,
        hasNextPage: hasNextBrands,
        isFetchingNextPage: isFetchingNextBrands,
        isLoading: isBrandsLoading,
    } = useBrands({ search: brandSearch, limit: 20 });

    const brands = brandData?.pages.flatMap((page) => page.items) || [];
    const { data: connectorTypesResponse, isLoading: isConnectorTypesLoading } = useConnectorTypes();
    const connectorTypesFromApi = (connectorTypesResponse as any) || [];

    const form = useForm<StationFormValues>({
        resolver: zodResolver(stationSchema) as any,
        defaultValues: {
            name: initialData?.name || '',
            chargePointId: initialData?.chargePointId || '',
            serialNumber: initialData?.serialNumber || '',
            model: initialData?.model || '',
            vendor: initialData?.vendor || '',
            maxPower: initialData?.maxPower || 22, // Defaulting to 22kW
            locationId: initialData?.locationId || '',
            type: initialData?.type || 'AC',
            connectorTypes: (initialData?.connectorTypes as ConnectorType[]) || [ConnectorType.MENNEKES],
        },
    });

    const hasInitialized = useRef(false);

    // Handle auto-filling when initialData is loaded asynchronously
    useEffect(() => {
        const hasData = initialData && Object.keys(initialData).length > 0;
        if (hasData && !hasInitialized.current) {
            form.reset({
                name: initialData.name || '',
                chargePointId: initialData.chargePointId || '',
                serialNumber: initialData.serialNumber || '',
                model: initialData.model || '',
                vendor: initialData.vendor || '',
                maxPower: initialData.maxPower ?? 22,
                locationId: initialData.locationId || '',
                type: initialData.type || 'AC',
                connectorTypes: (initialData.connectorTypes as ConnectorType[]) || [],
            }, {
                keepDirtyValues: true,
            });
            hasInitialized.current = true;
        }
    }, [initialData, form]);

    const onFormSubmit = (data: StationFormValues) => {
        onSubmit(data);
    };

    const wsUrl = `ws://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8020/ocpp/${tenant?.id || 'tenant-id'}/${form.watch('chargePointId') || 'charge-point-id'}`;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit as any)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Info className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight">Basic Information</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Essential details for station identification</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <FormField
                            control={form.control as any}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1.5 font-bold">
                                        <Zap className="h-3.5 w-3.5 text-primary" />
                                        Station Name*
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter a descriptive name" className="bg-muted/30 border-border/60 focus:bg-background transition-all font-medium py-6" {...field} />
                                    </FormControl>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Choose a descriptive name for easy identification</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                                control={form.control as any}
                                name="serialNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Serial Number*</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Unique hardware serial"
                                                className="bg-muted/30 border-border/60 focus:bg-background transition-all font-medium py-6"
                                                disabled={isEdit}
                                                {...field}
                                            />
                                        </FormControl>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1">
                                            <ShieldCheck className="h-3 w-3" />
                                            {isEdit ? "Serial number cannot be changed" : "Must be globally unique"}
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="chargePointId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Charge Point ID*</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="OCPP Identifier"
                                                className="bg-muted/30 border-border/60 focus:bg-background transition-all font-medium py-6"
                                                disabled={isEdit}
                                                {...field}
                                            />
                                        </FormControl>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1">
                                            <Cpu className="h-3 w-3" />
                                            {isEdit ? "Charge Point ID cannot be changed" : "Internal identifier used by OCPP protocol"}
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                                control={form.control as any}
                                name="vendor"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70 mb-2">Vendor</FormLabel>
                                        <FormControl>
                                            <InfiniteScrollDropdown<Brand>
                                                options={brands}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                isLoading={isBrandsLoading}
                                                isFetchingNextPage={isFetchingNextBrands}
                                                hasNextPage={hasNextBrands}
                                                fetchNextPage={fetchNextBrands}
                                                onSearchChange={setBrandSearch}
                                                getOptionLabel={(brand) => brand.name}
                                                getOptionValue={(brand) => brand.name} // Payload sends the name
                                                placeholder="Select Vendor"
                                                searchPlaceholder="Search vendors..."
                                                className="bg-muted/10 border-border/40 font-medium h-12 py-2 rounded-md w-full"
                                            />
                                        </FormControl>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">Charging station manufacturer</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Model</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Terra 54" className="bg-muted/10 border-border/40 font-medium h-12 w-full" {...field} />
                                        </FormControl>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Specific model designation</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                                control={form.control as any}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70 flex items-center gap-1.5">
                                            <Activity className="h-3.5 w-3.5 text-primary" />
                                            Station Type*
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-muted/10 border-border/40 font-medium h-12 hover:bg-muted/20 transition-all">
                                                    <SelectValue placeholder="Select AC or DC" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-border/60 shadow-2xl">
                                                <SelectItem value="AC" className="font-bold py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-500">
                                                            <Zap className="h-3 w-3" />
                                                        </div>
                                                        <span>AC (Alternating Current)</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="DC" className="font-bold py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
                                                            <Zap className="h-3 w-3" />
                                                        </div>
                                                        <span>DC (Direct Current)</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mt-1 opacity-70">Power delivery classification</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="maxPower"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-xs uppercase tracking-widest items-center flex gap-1.5 opacity-70">
                                            <Zap className="h-3 w-3 text-amber-500" />
                                            Max Power (kW)
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" className="bg-muted/10 border-border/40 font-medium h-10" {...field} />
                                        </FormControl>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Maximum charging power in kilowatts</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight">Location</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Assign station to a physical site</p>
                        </div>
                    </div>

                    <FormField
                        control={form.control as any}
                        name="locationId"
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={locationsLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger className="bg-muted/30 border-border/60 py-6 font-bold">
                                            <SelectValue placeholder="Choose a location..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {locations?.map((location) => (
                                            <SelectItem key={location.id} value={location.id} className="font-bold">
                                                {location.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1">
                                    <Info className="h-3 w-3" />
                                    Optional - Associate this station with a location
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Connector Types */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight">Connector Types*</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Select the types of connectors available on this station</p>
                        </div>
                    </div>

                    <FormField
                        control={form.control as any}
                        name="connectorTypes"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                                    {connectorTypesFromApi.map((connector: any) => {
                                        const connectorId = connector.identifier;
                                        const isSelected = field.value?.includes(connectorId);
                                        return (
                                            <Card
                                                key={connector.id}
                                                className={cn(
                                                    "cursor-pointer transition-all border-border/40 hover:border-primary/40",
                                                    isSelected ? "bg-primary/5 border-primary/50 ring-1 ring-primary/20 shadow-lg shadow-primary/10" : "bg-card/40"
                                                )}
                                                onClick={() => {
                                                    const current = field.value || [];
                                                    const updated = isSelected
                                                        ? current.filter((t: string) => t !== connectorId)
                                                        : [...current, connectorId];
                                                    field.onChange(updated);
                                                }}
                                            >
                                                <CardContent className="p-4 flex items-start gap-4">
                                                    <div className={cn(
                                                        "p-2.5 rounded-xl shrink-0 transition-colors",
                                                        isSelected ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground"
                                                    )}>
                                                        <Zap className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-black truncate uppercase tracking-tight">{connector.name}</p>
                                                            {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{connector.identifier}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                                <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="h-3 w-3 text-primary" />
                                        {field.value?.length || 0} Connector type selected
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {field.value?.map((type: string) => (
                                            <Badge key={type} className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1">
                                                {type}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* OCPP Configuration Note */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex gap-4 items-center">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Info className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-black tracking-tight">OCPP Configuration</p>
                        <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                            OCPP settings will be automatically configured by the system.
                            The station will use these settings to communicate with the CSMS platform.
                        </p>
                    </div>
                </div>

                {/* Connection Details */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                        <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                            <LinkIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight">Connection Details</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">WebSocket URL for station configuration</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 bg-muted/30 border border-border/40 rounded-3xl space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">WebSocket Connection URL</p>
                                <p className="text-xs font-bold leading-relaxed text-muted-foreground/80">
                                    Use this URL to configure your charging station's connection to the CSMS. The station will use this endpoint for OCPP communication.
                                </p>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 right-3 flex items-center">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(wsUrl);
                                                        toast.success('Connection URL copied to clipboard');
                                                    }}
                                                    className="p-2 rounded-lg bg-background border border-border shadow-sm hover:scale-110 active:scale-95 transition-all text-muted-foreground hover:text-primary"
                                                >
                                                    <LinkIcon className="h-4 w-4" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent className="font-bold">Copy URL</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="w-full bg-muted/50 border border-border/60 rounded-xl p-4 pr-14 font-mono text-sm tracking-tight text-foreground break-all">
                                    {wsUrl}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-linear-to-r from-muted/20 to-transparent border-t border-border/40 rounded-b-3xl -mx-6 -mb-6">
                    <div className="hidden md:block">
                        <p className="text-sm font-black tracking-tight">Ready to {isEdit ? 'update' : 'register'} the charging station?</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Your changes will be saved and applied to the station configuration</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Button type="button" variant="ghost" className="flex-1 md:flex-none font-bold text-muted-foreground hover:bg-muted" onClick={onCancel} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-8 font-black" disabled={isLoading}>
                            {isLoading ? 'Processing...' : isEdit ? 'Update Station' : 'Register Station'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
