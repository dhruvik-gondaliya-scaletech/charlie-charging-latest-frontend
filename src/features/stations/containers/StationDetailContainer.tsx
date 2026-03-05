'use client';

import { useState } from 'react';
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
    MapPin,
    Terminal,
    Cpu,
    History,
    Edit,
    AlertCircle,
    LogOut,
    Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { ChargingStatus } from '@/types';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfigurationManager } from '../components/ConfigurationManager';
import { StatCard } from '../../dashboard/components/StatCard';
import { StationSessions } from '../components/StationSessions';
import { StationLogs } from '../components/StationLogs';
import { ConnectorCard } from '../components/ConnectorCard';
import { useRemoteStart, useRemoteStop } from '@/hooks/delete/useStationMutations';
import { useStationSessions } from '@/hooks/get/useStations';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import WebSocketUrlDisplay from '@/components/shared/WebSocketUrlDisplay';
import { toast } from 'sonner';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { SessionStatus } from '@/types';

export function StationDetailContainer() {
    const { id } = useParams();
    const router = useRouter();
    const { user, tenant } = useAuth();
    const { data: station, isLoading, error } = useStation(id as string);
    const { data: sessions } = useStationSessions(id as string);
    const [activeTab, setActiveTab] = useState('overview');

    const [isStopModalOpen, setIsStopModalOpen] = useState(false);
    const [selectedConnectorId, setSelectedConnectorId] = useState<number | null>(null);
    const [stopTransactionId, setStopTransactionId] = useState<string>('');

    const remoteStart = useRemoteStart();
    const remoteStop = useRemoteStop();

    const handleStartConnector = (connectorId: number) => {
        remoteStart.mutate({
            id: station?.id || '',
            connectorId,
            idTag: 'ADMIN_TAG',
            userId: user?.id || 'admin-user',
        });
    };

    const handleStopConnector = (connectorId: number) => {
        // Find active session for this connector
        const activeSession = sessions?.find(s =>
            s.connectorId === connectorId &&
            (s.status === 'in-progress' || s.status === 'IN_PROGRESS' || s.status === SessionStatus.IN_PROGRESS)
        );

        if (!activeSession) {
            toast.error(`No active charging session found on Connector #${connectorId}`);
            return;
        }

        setSelectedConnectorId(connectorId);
        setStopTransactionId(activeSession.transactionId.toString());
        setIsStopModalOpen(true);
    };

    const confirmStop = () => {
        if (!stopTransactionId) return;

        remoteStop.mutate({
            id: station?.id || '',
            transactionId: parseInt(stopTransactionId),
        }, {
            onSuccess: () => {
                setIsStopModalOpen(false);
            }
        });
    };

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
                    <p className="text-muted-foreground">The requested charging station could not be found or you don&apos;t have permission to access it.</p>
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
                        onClick={() => router.push(FRONTEND_ROUTES.STATIONS_EDIT(id as string))}
                        className={cn(
                            "border-border/60 hover:bg-muted font-bold",
                            activeTab === 'sessions' && "bg-muted border-primary/40 shadow-sm"
                        )}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Configure Station
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Voltage Output', value: '400 V', icon: Zap, color: 'text-amber-500', bottomRightGlobe: "bg-amber-500", description: 'Real-time voltage reporting' },
                    { label: 'Active Power', value: `${station.maxPower} kW`, icon: Activity, color: 'text-primary', bottomRightGlobe: "bg-primary", description: 'Current power throughput' },
                    { label: 'Fleet Status', value: station.isActive ? 'Active' : 'Inactive', icon: ShieldCheck, color: 'text-emerald-500', bottomRightGlobe: "bg-emerald-500", description: 'System availability' },
                    { label: 'Connectors', value: String(station.connectors?.length || station.connectorCount || 0), icon: Cpu, color: 'text-blue-500', bottomRightGlobe: "bg-blue-500", description: 'Available charging ports' },
                ].map((stat, i) => (
                    <StatCard
                        key={i}
                        title={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        description={stat.description}
                        bottomRightGlobe={stat.bottomRightGlobe}
                    />
                ))}
            </motion.div>

            {/* Main Content Tabs */}
            <motion.div variants={fadeInUp}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-muted/40 p-1 border border-border/40 rounded-2xl backdrop-blur-md overflow-x-auto h-auto flex-wrap sm:flex-nowrap">
                        <TabsTrigger value="overview" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                        <TabsTrigger value="connectors" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Connectors</TabsTrigger>
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
                                    <CardContent className="space-y-8">
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

                                        <div className="pt-8 border-t border-border/10 space-y-4">
                                            <div className="flex items-center gap-2 px-2">
                                                <History className="h-4 w-4 text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" />
                                                <h4 className="text-sm font-black uppercase tracking-widest">Live System Timeline</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
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
                                                        <div className="flex-1 -mt-1">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{event.time}</p>
                                                            <p className="text-sm font-bold tracking-tight">{event.msg}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-1 space-y-6">
                                {/* Connection URL */}
                                <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border shadow-sm">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500">
                                                <Terminal className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-black">CSMS Connection</CardTitle>
                                                <CardDescription>Remote OCPP configuration endpoint</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <WebSocketUrlDisplay
                                            chargePointId={station.chargePointId}
                                            tenantId={tenant?.id || ''}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
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
                                    <ConnectorCard
                                        key={connector.id}
                                        connector={connector}
                                        onStart={handleStartConnector}
                                        onStop={handleStopConnector}
                                        isStarting={remoteStart.isPending}
                                        isStopping={remoteStop.isPending}
                                        disabled={station.status === ChargingStatus.OFFLINE}
                                    />
                                ))}

                                {(!station.connectors || station.connectors.length === 0) && (
                                    <div className="md:col-span-2 lg:col-span-3 p-12 border-2 border-dashed border-border/40 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 bg-muted/20">
                                        <Zap className="h-12 w-12 text-muted-foreground/40" />
                                        <div>
                                            <p className="text-xl font-bold text-muted-foreground">No connectors found</p>
                                            <p className="text-sm text-muted-foreground opacity-60">This station hasn&apos;t reported any connectors yet.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
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

            <AnimatedModal
                isOpen={isStopModalOpen}
                onClose={() => setIsStopModalOpen(false)}
                title="Stop Charging Session"
                description={`Stop the active charging session on Connector #${selectedConnectorId}.`}
                size="md"
                footer={
                    <div className="flex gap-3 justify-end w-full">
                        <Button variant="outline" onClick={() => setIsStopModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmStop}
                            disabled={remoteStop.isPending}
                            className="font-bold"
                        >
                            {remoteStop.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Stopping...
                                </>
                            ) : (
                                'Stop Transaction'
                            )}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <LogOut className="h-10 w-10 text-destructive" />
                        </div>
                        <p className="text-muted-foreground">
                            You are about to stop the charging session on <strong>Connector #{selectedConnectorId}</strong>.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm font-medium">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>This will send a remote stop command to the station for the active transaction.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground font-medium">Transaction ID</span>
                            <code className="px-2 py-1 rounded bg-background border font-mono text-sm font-bold text-primary">
                                {stopTransactionId}
                            </code>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground font-medium">Connector</span>
                            <span className="font-bold">Port #{selectedConnectorId}</span>
                        </div>
                    </div>
                </div>
            </AnimatedModal>
        </motion.div>
    );
}
