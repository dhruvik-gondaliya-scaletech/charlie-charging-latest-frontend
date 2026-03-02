'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { stationSchema } from '@/lib/validations/station.schema';
import { CONNECTOR_OPTIONS } from '@/constants/constants';
import { motion, AnimatePresence } from 'framer-motion';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Station, ConnectorType } from '@/types';
import {
    Zap,
    MapPin,
    Cpu,
    ShieldCheck,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Info,
    Terminal,
    Activity,
    Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WebSocketUrlDisplay from '@/components/shared/WebSocketUrlDisplay';

type WizardValues = z.infer<typeof stationSchema>;

interface StationWizardProps {
    initialData?: Partial<Station>;
    locations: any[];
    locationsLoading: boolean;
    onSubmit: (data: WizardValues) => void;
    isLoading: boolean;
    onCancel: () => void;
    isEdit?: boolean;
    tenantId: string;
}

const STEPS = [
    { id: 1, title: 'Identity', icon: Zap, description: 'Brand and basic info' },
    { id: 2, title: 'Technical', icon: Cpu, description: 'Hardware specifications' },
    { id: 3, title: 'Network', icon: MapPin, description: 'Location and connectivity' },
    { id: 4, title: 'Connectors', icon: Activity, description: 'Charging port configuration' },
    { id: 5, title: 'Connection', icon: ShieldCheck, description: 'OCPP WebSocket Setup' },
];


export function StationWizard({
    initialData = {},
    locations,
    locationsLoading,
    onSubmit,
    isLoading,
    onCancel,
    isEdit = true,
    tenantId
}: StationWizardProps) {
    const [step, setStep] = useState(1);

    const form = useForm<WizardValues>({
        resolver: zodResolver(stationSchema) as any,
        defaultValues: {
            name: initialData.name || '',
            chargePointId: initialData.chargePointId || '',
            serialNumber: initialData.serialNumber || '',
            model: initialData.model || '',
            vendor: initialData.vendor || '',
            firmware: initialData.firmware || '',
            maxPower: initialData.maxPower || 22,
            locationId: (initialData.location && typeof initialData.location === 'object' ? (initialData.location as any).id : initialData.locationId) || '',
            ocppVersion: (initialData.ocppVersion as any) || '1.6',
            connectorTypes: initialData.connectorTypes || [],
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
                firmware: initialData.firmware || '',
                maxPower: initialData.maxPower ?? 22,
                locationId: (initialData.location && typeof initialData.location === 'object' ? (initialData.location as any).id : initialData.locationId) || '',
                ocppVersion: (initialData.ocppVersion as any) || '1.6',
                connectorTypes: initialData.connectorTypes || [],
            }, {
                keepDirtyValues: true, // Don't overwrite what user already typed if they started
            });
            hasInitialized.current = true;
        }
    }, [initialData, form]);

    const nextStep = async () => {
        let fieldsToValidate: (keyof WizardValues)[] = [];
        if (step === 1) fieldsToValidate = ['name', 'vendor', 'model', 'maxPower'];
        if (step === 2) fieldsToValidate = ['serialNumber', 'chargePointId', 'firmware'];
        if (step === 3) fieldsToValidate = ['locationId', 'ocppVersion'];

        const isValid = await form.trigger(fieldsToValidate);
        if (isValid) setStep(prev => Math.min(prev + 1, 5));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const onFormSubmit = (data: WizardValues) => {
        // CRITICAL: Double guard to prevent early submission
        // Only allow if we are on step 5 AND not already loading
        if (step === 5 && !isLoading) {
            console.log('Wizard submitting data:', data);
            onSubmit(data);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header & Progress */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">{isEdit ? (initialData.name || 'Edit Station') : 'Register New Station'}</h1>
                        <p className="text-muted-foreground font-medium">Step {step} of 5: {STEPS[step - 1].description}</p>
                    </div>
                    <Button variant="ghost" onClick={onCancel} className="font-bold text-muted-foreground">
                        Cancel
                    </Button>
                </div>

                <div className="flex gap-2">
                    {STEPS.map((s) => (
                        <div
                            key={s.id}
                            className={cn(
                                "h-2 flex-1 rounded-full transition-all duration-500",
                                step >= s.id ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "bg-muted/40"
                            )}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-5 gap-4">
                    {STEPS.map((s) => (
                        <div
                            key={s.id}
                            className={cn(
                                "flex flex-col items-center gap-2 transition-all duration-300",
                                step === s.id ? "opacity-100 scale-105" : "opacity-40 scale-95"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-xl border",
                                step === s.id ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/10 border-border/40 text-muted-foreground"
                            )}>
                                <s.icon className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Form {...form}>
                <form
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && step < 5) {
                            e.preventDefault();
                            e.stopPropagation();
                            nextStep();
                        }
                    }}
                    className="space-y-8 min-h-[400px]"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-6 md:p-8"
                        >
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                            <Zap className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black">Identity & Brand</h2>
                                            <p className="text-sm text-muted-foreground font-medium">Basic information about the charging station</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control as any}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold">Station Name*</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter station name" className="bg-muted/30 py-6" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control as any}
                                            name="maxPower"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold">Max Power (kW)*</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" className="bg-muted/30 py-6" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control as any}
                                            name="vendor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold">Vendor*</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. ABB, Schneider" className="bg-muted/30 py-6" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control as any}
                                            name="model"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold">Model*</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Terra 54" className="bg-muted/30 py-6" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                            <Cpu className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black">Technical specifications</h2>
                                            <p className="text-sm text-muted-foreground font-medium">Locked identifiers and firmware reporting</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 items-center mb-6">
                                        <ShieldCheck className="h-5 w-5 text-amber-500" />
                                        <p className="text-xs font-bold text-amber-200/80 leading-relaxed">
                                            Hardware identifiers (Serial Number and Charge Point ID) are immutable after registration and cannot be modified.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control as any}
                                            name="serialNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold">Serial Number*</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled={isEdit}
                                                            className={cn("bg-muted/30 py-6", isEdit && "bg-muted/10 opacity-60")}
                                                            {...field}
                                                            placeholder="e.g. SN-123456"
                                                            title={isEdit ? "Serial number is locked" : ""}
                                                        />
                                                    </FormControl>
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
                                                            disabled={isEdit}
                                                            className={cn("bg-muted/30 py-6", isEdit && "bg-muted/10 opacity-60")}
                                                            {...field}
                                                            placeholder="e.g. CP-789"
                                                            title={isEdit ? "Charge point ID is locked" : ""}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control as any}
                                            name="firmware"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel className="font-bold">Firmware Version*</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-muted/30 py-6" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black">Network & Location</h2>
                                            <p className="text-sm text-muted-foreground font-medium">Site assignment and OCPP protocol settings</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <FormField
                                            control={form.control as any}
                                            name="locationId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold">Physical Location*</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        disabled={locationsLoading}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="bg-muted/30 py-6 font-bold">
                                                                <SelectValue placeholder="Select a location site" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {locations?.map((loc: any) => (
                                                                <SelectItem key={loc.id} value={loc.id} className="font-bold">
                                                                    {loc.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control as any}
                                            name="ocppVersion"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold">OCPP Protocol Version</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="bg-muted/30 py-6 font-bold">
                                                                <SelectValue placeholder="OCPP Version" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1.6" className="font-bold">OCPP 1.6 (JSON)</SelectItem>
                                                            <SelectItem value="2.0.1" className="font-bold">OCPP 2.0.1</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex gap-4 items-center">
                                            <Info className="h-5 w-5 text-primary shrink-0" />
                                            <div className="space-y-1">
                                                <p className="text-xs font-black uppercase tracking-widest text-primary">Connection URL Managed</p>
                                                <p className="text-xs text-muted-foreground font-medium">
                                                    Changing the location or identifiers will automatically update the station's assigned WebSocket endpoint.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500">
                                            <Activity className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black">Connector Configuration</h2>
                                            <p className="text-sm text-muted-foreground font-medium">Select the types of charging ports available</p>
                                        </div>
                                    </div>

                                    <FormField
                                        control={form.control as any}
                                        name="connectorTypes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {CONNECTOR_OPTIONS.map((option: any) => {
                                                        const isSelected = field.value?.includes(option.type);
                                                        return (
                                                            <Card
                                                                key={option.type}
                                                                className={cn(
                                                                    "cursor-pointer transition-all border-border/40 hover:border-primary/40",
                                                                    isSelected ? "bg-primary/5 border-primary/50 ring-1 ring-primary/20 shadow-lg shadow-primary/10" : "bg-card/40"
                                                                )}
                                                                onClick={() => {
                                                                    const current = field.value || [];
                                                                    const updated = isSelected
                                                                        ? current.filter((t: string) => t !== option.type)
                                                                        : [...current, option.type];
                                                                    field.onChange(updated);
                                                                }}
                                                            >
                                                                <CardContent className="p-4 flex items-start gap-3">
                                                                    <div className={cn(
                                                                        "p-2 rounded-lg transition-colors",
                                                                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                                                                    )}>
                                                                        <Zap className="h-4 w-4" />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="text-sm font-black truncate">{option.label}</p>
                                                                            {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                                                                        </div>
                                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{option.description}</p>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        );
                                                    })}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="h-3 w-3 text-primary" />
                                            {form.watch('connectorTypes')?.length || 0} Selection Active
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {form.watch('connectorTypes')?.map((type: string) => (
                                                <Badge key={type} className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1">
                                                    {type}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black">Connection Details</h2>
                                            <p className="text-sm text-muted-foreground font-medium">Finalize and configure hardware connection</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                            The charging station is almost ready. Use the following URL in your station's configuration local web interface or via its management API to connect it to the CSMS.
                                        </p>

                                        <WebSocketUrlDisplay
                                            chargePointId={form.watch('chargePointId')}
                                            tenantId={tenantId}
                                        />

                                        <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Info className="h-3 w-3 text-primary" />
                                                Next Steps
                                            </p>
                                            <ul className="space-y-2">
                                                <li className="text-xs font-medium text-muted-foreground flex items-start gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</div>
                                                    Access your hardware console or web interface
                                                </li>
                                                <li className="text-xs font-medium text-muted-foreground flex items-start gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</div>
                                                    Paste the WebSocket URL provided above
                                                </li>
                                                <li className="text-xs font-medium text-muted-foreground flex items-start gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">3</div>
                                                    Save and verify connection in the Live Logs
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-border/40">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={step === 1 || isLoading}
                            className="font-bold border-border/60"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                        </Button>

                        <div className="flex gap-4">
                            {step < 5 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-black px-8"
                                >
                                    Continue <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => {
                                        console.log('Manual save trigger initiated');
                                        form.handleSubmit(onFormSubmit as any)();
                                    }}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-black px-10"
                                >
                                    {isLoading ? (
                                        <>
                                            <Activity className="h-4 w-4 mr-2 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" /> {isEdit ? 'Complete Update' : 'Register Station'}
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
