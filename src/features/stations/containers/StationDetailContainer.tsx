'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStation, useStationSessions } from '@/hooks/get/useStations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Zap,
    Activity,
    ShieldCheck,
    MapPin,
    Terminal,
    Cpu,
    History,
    AlertCircle,
    LogOut,
    Loader2,
    Edit,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { ChargingStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfigurationManager } from '../components/ConfigurationManager';
import { StatCard } from '../../dashboard/components/StatCard';
import { StationSessions } from '../components/StationSessions';
import { StationLogs } from '../components/StationLogs';
import { ConnectorCard } from '../components/ConnectorCard';
import { useRemoteStart, useRemoteStop, useResetStation, useChangeAvailability } from '@/hooks/delete/useStationMutations';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import WebSocketUrlDisplay from '@/components/shared/WebSocketUrlDisplay';
import { toast } from 'sonner';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { SessionStatus } from '@/types';
import { BackButton } from '@/components/shared/BackButton';
import { useWebSocketConnection, useRealTimeEvent } from '@/hooks/useRealTime';
import { useTariffs } from '@/hooks/get/useBilling';
import {
    StationStatusChangeEvent,
    ConnectorStatusChangeEvent,
    MeterValuesEvent,
    TransactionEvent
} from '@/lib/realtime.service';
import {
    invalidateQueriesDebounced,
    updateStationDetailCache
} from '@/lib/query-utils';
import { useQueryClient } from '@tanstack/react-query';

export function StationDetailContainer() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, tenant } = useAuth();
    const { data: station, isLoading, error } = useStation(id as string);
    const { data: tariffs } = useTariffs();
    const { data: sessions } = useStationSessions(id as string);
    const [activeTab, setActiveTab] = useState('connectors');
    const [filterSessionId, setFilterSessionId] = useState<string | undefined>(undefined);

    const stationTariff = tariffs?.find((t) => t.id === station?.tariffId);

    const handleViewSessionLogs = (sessionId: string) => {
        setFilterSessionId(sessionId);
        setActiveTab('logs');
    };

    // Establish WebSocket connection
    useWebSocketConnection();

    // Listen for station status changes
    useRealTimeEvent<StationStatusChangeEvent>(
        'station-status-change',
        (data) => {
            if (data.stationId === id) {
                console.log(`Station ${data.stationId} status updated to ${data.status}`);

                // 1. Optimistically update the detailed station status
                updateStationDetailCache(queryClient, id as string, { status: data.status });

                // 2. Debounce the background refresh
                invalidateQueriesDebounced(queryClient, ['station', id]);
            }
        },
        [id]
    );

    // Listen for connector status changes
    useRealTimeEvent<ConnectorStatusChangeEvent>(
        'connector-status-change',
        (data) => {
            if (data.stationId === id) {
                console.log(`Connector ${data.connectorId} on station ${data.stationId} status updated to ${data.status}`);

                // 1. Optimistically update the specific connector status in the station detail cache
                queryClient.setQueryData(['station', id], (oldData: any) => {
                    if (!oldData || !oldData.connectors) return oldData;

                    const updatedConnectors = oldData.connectors.map((c: any) =>
                        c.id === data.connectorId || c.connectorId === data.connectorId
                            ? { ...c, status: data.status }
                            : c
                    );

                    return { ...oldData, connectors: updatedConnectors };
                });

                // Clear busy state for this connector
                setBusyConnectors(prev => {
                    if (prev.has(data.connectorId)) {
                        const next = new Set(prev);
                        next.delete(data.connectorId);
                        return next;
                    }
                    return prev;
                });

                // 2. Debounce the background refresh for the station and sessions
                invalidateQueriesDebounced(queryClient, ['station', id]);
                invalidateQueriesDebounced(queryClient, ['station-sessions', id]);
            }
        },
        [id]
    );

    // Listen for meter values
    useRealTimeEvent<MeterValuesEvent>(
        'meter-values',
        (data) => {
            if (data.stationId === id) {
                console.log(`Received meter values for station ${data.stationId}`);
                // Debounce log and session updates as meter values can be very frequent
                invalidateQueriesDebounced(queryClient, ['station-logs', id]);
                invalidateQueriesDebounced(queryClient, ['station-sessions', id]);
            }
        },
        [id]
    );

    // Listen for transaction events
    useRealTimeEvent<TransactionEvent>(
        'transaction-start',
        (data) => {
            if (data.stationId === id) {
                console.log(`Transaction started on station ${data.stationId}, connector ${data.connectorId}`);
                invalidateQueriesDebounced(queryClient, ['station-sessions', id]);
                invalidateQueriesDebounced(queryClient, ['station-logs', id]);
                // Also refresh station to get updated connector status
                invalidateQueriesDebounced(queryClient, ['station', id]);
            }
        },
        [id]
    );

    useRealTimeEvent<TransactionEvent>(
        'transaction-stop',
        (data) => {
            if (data.stationId === id) {
                console.log(`Transaction stopped on station ${data.stationId}, connector ${data.connectorId}`);
                invalidateQueriesDebounced(queryClient, ['station-sessions', id]);
                invalidateQueriesDebounced(queryClient, ['station-logs', id]);
                // Also refresh station to get updated connector status
                invalidateQueriesDebounced(queryClient, ['station', id]);
            }
        },
        [id]
    );

    const [isStopModalOpen, setIsStopModalOpen] = useState(false);
    const [selectedConnectorId, setSelectedConnectorId] = useState<number | null>(null);
    const [stopTransactionId, setStopTransactionId] = useState<string>('');
    const [busyConnectors, setBusyConnectors] = useState<Set<number>>(new Set());

    const remoteStart = useRemoteStart();
    const remoteStop = useRemoteStop();

    const handleStartConnector = (connectorId: number) => {
        setBusyConnectors(prev => new Set(prev).add(connectorId));
        remoteStart.mutate({
            id: station?.id || '',
            connectorId,
            idTag: 'ADMIN_TAG',
            userId: user?.id || 'admin-user',
        }, {
            onSuccess: (response: any) => {
                // If station rejected the command, we should clear the busy state immediately
                if (response?.status !== 'Accepted') {
                    setBusyConnectors(prev => {
                        const next = new Set(prev);
                        next.delete(connectorId);
                        return next;
                    });
                }
            },
            onError: () => {
                setBusyConnectors(prev => {
                    const next = new Set(prev);
                    next.delete(connectorId);
                    return next;
                });
            }
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
        if (!stopTransactionId || selectedConnectorId === null) return;

        const connectorId = selectedConnectorId;
        setBusyConnectors(prev => new Set(prev).add(connectorId));

        remoteStop.mutate({
            id: station?.id || '',
            transactionId: stopTransactionId,
        }, {
            onSuccess: (response: any) => {
                setIsStopModalOpen(false);
                // If station rejected the command, we should clear the busy state immediately
                if (response?.status !== 'Accepted') {
                    setBusyConnectors(prev => {
                        const next = new Set(prev);
                        next.delete(connectorId);
                        return next;
                    });
                }
            },
            onError: () => {
                setBusyConnectors(prev => {
                    const next = new Set(prev);
                    next.delete(connectorId);
                    return next;
                });
            }
        });
    };

    const resetStation = useResetStation();
    const changeAvailability = useChangeAvailability();

    const [isRebootModalOpen, setIsRebootModalOpen] = useState(false);
    const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

    const confirmReboot = (type: 'Hard' | 'Soft') => {
        resetStation.mutate({ id: station?.id || '', type }, {
            onSuccess: () => setIsRebootModalOpen(false)
        });
    };

    const confirmAvailability = (type: 'Operative' | 'Inoperative') => {
        changeAvailability.mutate({ id: station?.id || '', type }, {
            onSuccess: () => setIsAvailabilityModalOpen(false)
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(3).fill(0).map((_, i) => (
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
                    <BackButton
                        href={FRONTEND_ROUTES.STATIONS}
                        label="Back to Stations"
                        className="mt-4 mx-auto w-fit"
                    />
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
                    <BackButton
                        href={FRONTEND_ROUTES.STATIONS}
                        label="Return to Stations"
                    />
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
                    <div className="relative group">
                        <Button
                            variant="default"
                            className="bg-primary/90 hover:bg-primary font-bold shadow-md"
                        >
                            Station Actions
                        </Button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border pb-1 pt-1 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <button
                                onClick={() => setIsRebootModalOpen(true)}
                                className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted transition-colors flex items-center cursor-pointer"
                            >
                                <History className="mr-2 h-4 w-4" /> Reboot Station
                            </button>
                            <button
                                onClick={() => setIsAvailabilityModalOpen(true)}
                                className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted transition-colors flex items-center cursor-pointer"
                            >
                                <ShieldCheck className="mr-2 h-4 w-4" /> Change Availability
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
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
                        <TabsTrigger value="connectors" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Connectors</TabsTrigger>
                        <TabsTrigger value="overview" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                        <TabsTrigger value="sessions" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Sessions</TabsTrigger>
                        <TabsTrigger value="config" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Config</TabsTrigger>
                        <TabsTrigger value="logs" className="rounded-xl font-bold px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Live Logs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="connectors">
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                        <Zap className="h-6 w-6 text-primary" />
                                        System Connectors
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-medium mt-1">Individual port status and capabilities</p>
                                </div>
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full shadow-sm">
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
                                        isStarting={remoteStart.isPending || busyConnectors.has(connector.connectorId)}
                                        isStopping={remoteStop.isPending || busyConnectors.has(connector.connectorId)}
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

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Technical Specifications */}
                                <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border shadow-sm h-full">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-sm">
                                                <Cpu className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-black tracking-tight">Technical Specifications</CardTitle>
                                                <CardDescription className="text-xs font-medium">Detailed hardware and software reporting</CardDescription>
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
                                                { label: 'Tariff', value: stationTariff?.name || (station?.tariffId ? 'Tariff not found' : 'Not assigned'), icon: History },
                                                { label: 'Price per kWh', value: stationTariff ? `${stationTariff.pricePerKwh} ${stationTariff.currency}` : '-', icon: Zap },
                                                { label: 'Service Fee', value: stationTariff ? `${stationTariff.serviceFeePercentage}%` : '-', icon: Activity },
                                                { label: 'Connection Fee', value: stationTariff ? `${stationTariff.connectionFee} ${stationTariff.currency}` : '-', icon: Terminal },
                                                { label: 'Idle Fee', value: stationTariff ? `${stationTariff.idleFee} ${stationTariff.currency}` : '-', icon: Terminal },
                                                { label: 'Station Type', value: station.type || 'AC', icon: Zap },
                                                { label: 'Visibility', value: station.visibility === 'private' ? 'Private' : 'Public', icon: ShieldCheck },
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

                            <div className="lg:col-span-1 space-y-6">
                                {/* Connection URL */}
                                <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border shadow-sm">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500 shadow-sm">
                                                <Terminal className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-black tracking-tight">CSMS Connection</CardTitle>
                                                <CardDescription className="text-xs font-medium">Remote OCPP configuration endpoint</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <WebSocketUrlDisplay
                                            chargePointId={station.chargePointId}
                                            tenantSlug={tenant?.slug || tenant?.id || ''}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="sessions">
                        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border">
                            <CardContent className="p-6">
                                <StationSessions
                                    stationId={station.id}
                                    onViewLogs={handleViewSessionLogs}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="config" className="no-scrollbar">
                        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border">
                            <CardContent className="p-6">
                                <ConfigurationManager stationId={station.id} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="logs">
                        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border">
                            <CardContent className="p-6">
                                <StationLogs
                                    stationId={station.id}
                                    sessionId={filterSessionId}
                                    onClearSessionId={() => setFilterSessionId(undefined)}
                                />
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

                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 dark:text-orange-400 text-sm font-medium">
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

            {/* Reboot Modal */}
            <AnimatedModal
                isOpen={isRebootModalOpen}
                onClose={() => setIsRebootModalOpen(false)}
                title="Reboot Station"
                description={`Send a reboot command to ${station.name}.`}
                size="md"
                footer={
                    <div className="flex gap-3 justify-end w-full">
                        <Button variant="outline" onClick={() => setIsRebootModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => confirmReboot('Soft')}
                            disabled={resetStation.isPending}
                            className="font-bold"
                        >
                            Soft Reset
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => confirmReboot('Hard')}
                            disabled={resetStation.isPending}
                            className="font-bold"
                        >
                            Hard Reset
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 dark:text-orange-400 text-sm font-medium">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>A soft reset will wait for active transactions to end. A hard reset is immediate and may interrupt charging.</p>
                    </div>
                </div>
            </AnimatedModal>

            {/* Change Availability Modal */}
            <AnimatedModal
                isOpen={isAvailabilityModalOpen}
                onClose={() => setIsAvailabilityModalOpen(false)}
                title="Change Station Availability"
                description={`Turn ${station.name} on or off.`}
                size="md"
                footer={
                    <div className="flex gap-3 justify-end w-full">
                        <Button variant="outline" onClick={() => setIsAvailabilityModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => confirmAvailability('Inoperative')}
                            disabled={changeAvailability.isPending}
                            className="font-bold"
                        >
                            {changeAvailability.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 'Turn OFF'}
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => confirmAvailability('Operative')}
                            disabled={changeAvailability.isPending}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                            {changeAvailability.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 'Turn ON'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 text-sm font-medium">
                        <ShieldCheck className="h-5 w-5 shrink-0" />
                        <p>Changes the station's operational status. This command will be sent directly to the charge point.</p>
                    </div>
                </div>
            </AnimatedModal>
        </motion.div>
    );
}
