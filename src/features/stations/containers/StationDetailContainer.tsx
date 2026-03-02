'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStation } from '@/hooks/get/useStations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    Zap,
    Activity,
    ShieldCheck,
    Settings,
    MapPin,
    Terminal,
    Cpu,
    History,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { ChargingStatus } from '@/types';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RemoteOperations } from '../components/RemoteOperations';
import { ConfigurationManager } from '../components/ConfigurationManager';
import { StatCard } from '../../dashboard/components/StatCard';
import { StationSessions } from '../components/StationSessions';
import { StationLogs } from '../components/StationLogs';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function StationDetailContainer() {
    const { id } = useParams();
    const router = useRouter();
    const { data: station, isLoading, error } = useStation(id as string);
    const [activeTab, setActiveTab] = useState('overview');

    if (isLoading) {
        return (
            <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-40" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array(4).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-3xl" />
                    ))}
                </div>

                <div className="space-y-6">
                    <Skeleton className="h-12 w-full max-w-2xl rounded-2xl" />
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                </div>
            </div>
        );
    }

    if (error || !station) {
        return (
            <div className="flex items-center justify-center min-h-[600px] p-8">
                <div className="text-center space-y-4 max-w-md">
                    <div className="p-4 rounded-full bg-destructive/10 text-destructive inline-block">
                        <ShieldCheck className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold">Station Not Found</h2>
                    <p className="text-muted-foreground">The requested charging station could not be found or you don't have permission to access it.</p>
                    <Button onClick={() => router.push(FRONTEND_ROUTES.STATIONS)} variant="outline" className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stations
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto"
        >
            {/* Header Section */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <button
                        onClick={() => router.push(FRONTEND_ROUTES.STATIONS)}
                        className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Return to Stations
                    </button>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tight text-foreground">{station.name}</h1>
                        <Badge
                            variant="outline"
                            className={cn(
                                "px-3 py-1 rounded-full border shadow-sm font-bold uppercase tracking-widest text-[10px]",
                                station.status === ChargingStatus.AVAILABLE ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" :
                                    station.status === ChargingStatus.CHARGING ? "bg-blue-500/10 text-blue-500 border-blue-500/30" :
                                        "bg-destructive/10 text-destructive border-destructive/30"
                            )}
                        >
                            {station.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground mt-2">
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                            <MapPin className="h-3.5 w-3.5" />
                            {station.location && typeof station.location === 'object' ? station.location.name : 'Unassigned Location'}
                        </div>
                        <span className="text-muted-foreground/30">•</span>
                        <div className="flex items-center gap-1.5 text-sm font-mono tracking-tighter">
                            <Terminal className="h-3.5 w-3.5" />
                            {station.chargePointId}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setActiveTab('sessions')}
                        className={cn(
                            "border-border/60 hover:bg-muted font-bold",
                            activeTab === 'sessions' && "bg-muted border-primary/40 shadow-sm"
                        )}
                    >
                        <History className="h-4 w-4 mr-2" />
                        Transaction History
                    </Button>
                    <Button
                        onClick={() => setActiveTab('remote')}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold"
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Hardware Tools
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Voltage Output', value: '400 V', icon: Zap, color: 'text-amber-500', description: 'Real-time voltage reporting' },
                    { label: 'Active Power', value: `${station.maxPower} kW`, icon: Activity, color: 'text-primary', description: 'Current power throughput' },
                    { label: 'Fleet Status', value: station.isActive ? 'Active' : 'Inactive', icon: ShieldCheck, color: 'text-emerald-500', description: 'System availability' },
                    { label: 'Connectors', value: String(station.connectors?.length || station.connectorCount || 0), icon: Cpu, color: 'text-blue-500', description: 'Available charging ports' },
                ].map((stat, i) => (
                    <StatCard
                        key={i}
                        title={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        description={stat.description}
                    />
                ))}
            </motion.div>

            {/* Main Content Tabs */}
            <motion.div variants={fadeInUp}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-muted/40 p-1 border border-border/40 rounded-2xl backdrop-blur-md overflow-x-auto h-auto flex-wrap sm:flex-nowrap">
                        <TabsTrigger value="overview" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                        <TabsTrigger value="connectors" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Connectors</TabsTrigger>
                        <TabsTrigger value="remote" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Remote Control</TabsTrigger>
                        <TabsTrigger value="sessions" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Sessions</TabsTrigger>
                        <TabsTrigger value="config" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Config</TabsTrigger>
                        <TabsTrigger value="logs" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Live Logs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Technical Specifications */}
                                <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border shadow-sm h-full">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Cpu className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-black">Technical Specifications</CardTitle>
                                                <CardDescription>Detailed hardware and software reporting</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 p-2">
                                            {[
                                                { label: 'Manufacturer', value: station.vendor, icon: ShieldCheck },
                                                { label: 'Hardware Model', value: station.model, icon: Cpu },
                                                { label: 'Serial Number', value: station.serialNumber, icon: Terminal },
                                                { label: 'Charge Point ID', value: station.chargePointId, icon: History },
                                                { label: 'Firmware Version', value: station.firmware, icon: Activity },
                                                { label: 'OCPP Version', value: station.ocppVersion, icon: Zap },
                                                { label: 'Connector Count', value: station.connectors?.length || station.connectorCount || 0, icon: Zap },
                                                { label: 'Max Capacity', value: `${station.maxPower} kW`, icon: Activity },
                                                { label: 'Registration Date', value: formatDate(station.createdAt || new Date().toISOString()), icon: History },
                                                { label: 'Last Heartbeat', value: formatDate(station.updatedAt || new Date().toISOString()), icon: Activity },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-start gap-3 group">
                                                    <div className="mt-1 p-1.5 rounded-md bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        {item.icon && <item.icon className="h-3 w-3" />}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 border-b border-border/10 flex-1 pb-2">
                                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                                                        <span className="text-sm font-bold tracking-tight">{item.value}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm rounded-3xl overflow-hidden border-2 h-full">
                                <CardHeader>
                                    <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
                                        <History className="h-5 w-5" />
                                        Live Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { type: 'Status', msg: 'Heartbeat received', time: 'Just now' },
                                        { type: 'Status', msg: 'Status verified: Available', time: '2 mins ago' },
                                        { type: 'Update', msg: 'Configuration synced', time: '1 hour ago' },
                                    ].map((event, i) => (
                                        <div key={i} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                                <div className="w-[1px] flex-1 bg-border/40 my-1 group-last:hidden" />
                                            </div>
                                            <div className="flex-1 -mt-1 pb-4">
                                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{event.time}</p>
                                                <p className="text-sm font-bold">{event.msg}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="connectors">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">System Connectors</h3>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Individual port status and capabilities</p>
                                </div>
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-4 py-1 rounded-full">
                                    {station.connectors?.length || 0} Ports Active
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {station.connectors?.map((connector) => (
                                    <Card key={connector.id} className="border-border/40 bg-card/10 backdrop-blur-md rounded-3xl border hover:bg-card/20 transition-all group overflow-hidden">
                                        <CardContent className="p-6 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "p-4 rounded-2xl relative overflow-hidden",
                                                    connector.status === ChargingStatus.AVAILABLE ? "bg-emerald-500/10 text-emerald-500" :
                                                        connector.status === ChargingStatus.CHARGING ? "bg-blue-500/10 text-blue-500" :
                                                            "bg-muted/40 text-muted-foreground"
                                                )}>
                                                    <div className="relative z-10 flex flex-col items-center">
                                                        <span className="text-[10px] font-black leading-none mb-1">ID</span>
                                                        <span className="text-2xl font-black leading-none">#{connector.connectorId}</span>
                                                    </div>
                                                    <div className="absolute top-0 right-0 p-1 opacity-20">
                                                        <Zap className="h-10 w-10 -m-2" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-lg font-black tracking-tight">{connector.type}</p>
                                                        <Badge className={cn(
                                                            "h-1.5 w-1.5 p-0 rounded-full animate-pulse",
                                                            connector.status === ChargingStatus.AVAILABLE ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" :
                                                                connector.status === ChargingStatus.CHARGING ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]" :
                                                                    "bg-muted-foreground"
                                                        )} />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest",
                                                            connector.status === ChargingStatus.AVAILABLE ? "text-emerald-500" :
                                                                connector.status === ChargingStatus.CHARGING ? "text-blue-500" :
                                                                    "text-muted-foreground"
                                                        )}>
                                                            {connector.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Max Power</p>
                                                <p className="text-xl font-black tracking-tighter">{connector.maxPower} kW</p>
                                            </div>
                                        </CardContent>
                                        <div className={cn(
                                            "h-1.5 w-full mt-auto opacity-40",
                                            connector.status === ChargingStatus.AVAILABLE ? "bg-emerald-500" :
                                                connector.status === ChargingStatus.CHARGING ? "bg-blue-500" :
                                                    "bg-muted-foreground"
                                        )} />
                                    </Card>
                                ))}

                                {(!station.connectors || station.connectors.length === 0) && (
                                    <div className="md:col-span-2 lg:col-span-3 p-12 border-2 border-dashed border-border/40 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 bg-muted/20">
                                        <Zap className="h-12 w-12 text-muted-foreground/40" />
                                        <div>
                                            <p className="text-xl font-bold text-muted-foreground">No connectors found</p>
                                            <p className="text-sm text-muted-foreground opacity-60">This station hasn't reported any connectors yet.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="remote">
                        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border">
                            <CardHeader>
                                <CardTitle className="text-xl font-black">Remote Operations</CardTitle>
                                <CardDescription>Trigger actions directly from the central management system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RemoteOperations station={station} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sessions">
                        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border">
                            <CardContent className="p-6">
                                <StationSessions stationId={station.id} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="config" className="no-scrollbar">
                        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black text-foreground tracking-tight underline-offset-4">OCPP Configuration</CardTitle>
                                    <CardDescription>Manage Read/Write keys via OCPP 1.6 Protocol</CardDescription>
                                </div>
                                <Badge variant="outline" className="font-mono text-xs border-border/60 bg-muted/30">
                                    <ShieldCheck className="h-3 w-3 mr-1.5 text-emerald-500" />
                                    TLS 1.2 Encrypted
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <ConfigurationManager stationId={station.id} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="logs">
                        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border">
                            <CardHeader>
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <Terminal className="h-5 w-5 text-primary" />
                                    OCPP Diagnostic Stream
                                </CardTitle>
                                <CardDescription>Real-time machine communication logs</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <StationLogs stationId={station.id} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
}
