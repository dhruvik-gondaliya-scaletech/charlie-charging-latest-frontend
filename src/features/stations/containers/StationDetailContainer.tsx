'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useStation, useStationSessions, useStationSessionStats } from '@/hooks/get/useStations';
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
    Unlock,
    CheckCircle2,
    Play,
    Percent,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { ChargingStatus, LocationEnv } from '@/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfigurationManager } from '../components/ConfigurationManager';
import { QrCodeTab } from '../components/QrCodeTab';
import { StatCard } from '../../dashboard/components/StatCard';
import { StationSessions } from '../components/StationSessions';
import { StationLogs } from '../components/StationLogs';
import { ConnectorCard } from '../components/ConnectorCard';
import { StationSmartCharging } from '../components/StationSmartCharging';
import { useRemoteStart, useRemoteStop, useResetStation, useChangeAvailability, useUnlockConnector } from '@/hooks/delete/useStationMutations';
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
import { useQueryClient, useQueries } from '@tanstack/react-query';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { complianceService } from '@/services/compliance.service';

export function StationDetailContainer() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const { environment } = useEnvironment();
    const { user, tenant } = useAuth();
    const { data: station, isLoading, error } = useStation(id as string);
    const { data: tariffs } = useTariffs();
    const { data: rawSessions } = useStationSessions(id as string);
    const sessions = Array.isArray(rawSessions) ? rawSessions : (rawSessions?.items || []);
    const { data: sessionStats, isLoading: isStatsLoading } = useStationSessionStats(id as string);
    const [activeTab, setActiveTab] = useState('connectors');

    // Date range calculation for 30-day compliance scope
    const formatDateString = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = formatDateString(thirtyDaysAgo);
    const endDate = formatDateString(new Date());

    // Fetch compliance uptime data for all connectors of this station
    const connectors = station?.connectors || [];
    const uptimeQueries = useQueries({
        queries: connectors.map((c: any) => ({
            queryKey: ['compliance-uptime', c.id, startDate, endDate],
            queryFn: () => complianceService.calculateUptime(c.id, startDate, endDate),
            enabled: !!c.id && !!startDate && !!endDate,
            staleTime: 30000,
        })),
    });

    const isUptimeLoading = uptimeQueries.some((q) => q.isLoading);

    const averageUptime = useMemo(() => {
        const validUptimes = uptimeQueries
            .map((q) => q.data?.uptimePercentage)
            .filter((val): val is number => val !== undefined && val !== null);
        
        if (validUptimes.length === 0) return null;
        const sum = validUptimes.reduce((acc, val) => acc + val, 0);
        return sum / validUptimes.length;
    }, [uptimeQueries]);

    const uptimeCardDescription = useMemo(() => {
        if (!station || !station.connectors || station.connectors.length === 0) {
            return "No connectors configured";
        }
        if (station.connectors.length === 1) {
            return `Uptime of Connector #${station.connectors[0].connectorId}`;
        }
        return `Average uptime of ${station.connectors.length} connectors`;
    }, [station]);

    const uptimeColor = averageUptime !== null
        ? averageUptime >= 97
            ? 'text-emerald-500'
            : averageUptime >= 95
                ? 'text-amber-500'
                : 'text-rose-500'
        : 'text-muted-foreground';

    const uptimeGlobeColor = averageUptime !== null
        ? averageUptime >= 97
            ? 'bg-emerald-500'
            : averageUptime >= 95
                ? 'bg-amber-500'
                : 'bg-rose-500'
        : 'bg-muted-foreground';
    const [filterSessionId, setFilterSessionId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const tabParam = searchParams ? searchParams.get('tab') : null;
        const sessionIdParam = searchParams ? searchParams.get('sessionId') : null;
        if (tabParam) {
            setActiveTab(tabParam);
        }
        if (sessionIdParam) {
            setFilterSessionId(sessionIdParam);
        }
    }, [searchParams]);

    const fromLocationId = searchParams ? searchParams.get('fromLocation') : null;
    const backHref = fromLocationId
        ? `${FRONTEND_ROUTES.LOCATIONS_DETAILS(fromLocationId)}?tab=stations`
        : FRONTEND_ROUTES.STATIONS;
    const backLabel = fromLocationId
        ? "Return to Location Stations"
        : "Return to Stations";

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

                // 1. Optimistically update the detailed station status
                updateStationDetailCache(queryClient, id as string, { status: data.status });

                // 2. Debounce the background refresh
                invalidateQueriesDebounced(queryClient, ['station', environment, id]);
                invalidateQueriesDebounced(queryClient, ['compliance-uptime']);
            }
        },
        [id, environment]
    );

    // Listen for connector status changes
    useRealTimeEvent<ConnectorStatusChangeEvent>(
        'connector-status-change',
        (data) => {
            if (data.stationId === id) {

                // 1. Optimistically update the specific connector status in the station detail cache using a predicate to match environment-aware key
                queryClient.setQueriesData({
                    predicate: (query) =>
                        query.queryKey[0] === 'station' &&
                        (query.queryKey[2] === id || query.queryKey[1] === id)
                }, (oldData: any) => {
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
                invalidateQueriesDebounced(queryClient, ['station', environment, id]);
                invalidateQueriesDebounced(queryClient, ['station-sessions', environment, id]);
                invalidateQueriesDebounced(queryClient, ['compliance-uptime']);
            }
        },
        [id, environment]
    );

    // Listen for meter values
    useRealTimeEvent<MeterValuesEvent>(
        'meter-values',
        (data) => {
            if (data.stationId === id) {
                // Debounce log and session updates as meter values can be very frequent
                invalidateQueriesDebounced(queryClient, ['station-logs', id]);
                invalidateQueriesDebounced(queryClient, ['station-sessions', environment, id]);
                invalidateQueriesDebounced(queryClient, ['station-session-stats', environment, id]);
            }
        },
        [id, environment]
    );

    // Listen for transaction events
    useRealTimeEvent<TransactionEvent>(
        'transaction-start',
        (data) => {
            if (data.stationId === id) {
                invalidateQueriesDebounced(queryClient, ['station-sessions', environment, id]);
                invalidateQueriesDebounced(queryClient, ['station-session-stats', environment, id]);
                invalidateQueriesDebounced(queryClient, ['station-logs', id]);
                // Also refresh station to get updated connector status
                invalidateQueriesDebounced(queryClient, ['station', environment, id]);
                invalidateQueriesDebounced(queryClient, ['compliance-uptime']);
            }
        },
        [id, environment]
    );

    useRealTimeEvent<TransactionEvent>(
        'transaction-stop',
        (data) => {
            if (data.stationId === id) {
                invalidateQueriesDebounced(queryClient, ['station-sessions', environment, id]);
                invalidateQueriesDebounced(queryClient, ['station-session-stats', environment, id]);
                invalidateQueriesDebounced(queryClient, ['station-logs', id]);
                // Also refresh station to get updated connector status
                invalidateQueriesDebounced(queryClient, ['station', environment, id]);
                invalidateQueriesDebounced(queryClient, ['compliance-uptime']);
            }
        },
        [id, environment]
    );

    const [isStopModalOpen, setIsStopModalOpen] = useState(false);
    const [selectedConnectorId, setSelectedConnectorId] = useState<number | null>(null);
    const [stopTransactionId, setStopTransactionId] = useState<string>('');
    const [busyConnectors, setBusyConnectors] = useState<Set<number>>(new Set());

    const remoteStart = useRemoteStart();
    const remoteStop = useRemoteStop();
    const unlockConnector = useUnlockConnector();

    const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
    const [unlockConnectorId, setUnlockConnectorId] = useState<number | null>(null);

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

    const handleUnlockConnector = (connectorId: number) => {
        setUnlockConnectorId(connectorId);
        setIsUnlockModalOpen(true);
    };

    const confirmUnlock = () => {
        if (unlockConnectorId === null) return;

        const connectorId = unlockConnectorId;
        setBusyConnectors(prev => new Set(prev).add(connectorId));

        unlockConnector.mutate({
            id: station?.id || '',
            connectorId,
        }, {
            onSuccess: (response: any) => {
                setIsUnlockModalOpen(false);
                const status = response?.status || response;
                if (status === 'Unlocked') {
                    toast.success(`Connector #${connectorId} unlocked successfully`);
                } else {
                    toast.error(`Unlock failed: ${status || 'Unknown response'}`);
                }

                setBusyConnectors(prev => {
                    const next = new Set(prev);
                    next.delete(connectorId);
                    return next;
                });
                queryClient.invalidateQueries({ queryKey: ['station', environment, id] });
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
            className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto"
        >
            {/* Header Section */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <BackButton
                        href={backHref}
                        label={backLabel}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-foreground truncate">{station.name}</h1>
                        <Badge
                            variant="outline"
                            className={cn(
                                "w-fit px-3 py-1 rounded-full border shadow-sm font-bold uppercase tracking-widest text-[10px]",
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
                            {station.location && typeof station.location === 'object' ? (
                                <span
                                    className="cursor-pointer hover:text-primary hover:underline font-bold transition-colors"
                                    onClick={() => {
                                        if (station.location && typeof station.location === 'object') {
                                            router.push(`${FRONTEND_ROUTES.LOCATIONS_DETAILS(station.location.id)}?tab=stations`);
                                        }
                                    }}
                                >
                                    {station.location.name}
                                </span>
                            ) : 'Unassigned Location'}
                        </div>
                        <span className="text-muted-foreground/30">•</span>
                        <div className="flex items-center gap-1.5 text-sm font-mono tracking-tighter">
                            <Terminal className="h-3.5 w-3.5" />
                            {station.chargePointId}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => setIsRebootModalOpen(true)}
                        className="font-bold border-orange-500/30 text-orange-500 hover:bg-orange-500/10 hover:text-orange-500 h-12 px-6 rounded-xl flex-1 sm:flex-initial"
                    >
                        <History className="mr-2.5 h-4.5 w-4.5 text-orange-500" /> Reboot System
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsAvailabilityModalOpen(true)}
                        className="font-bold border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500 h-12 px-6 rounded-xl flex-1 sm:flex-initial"
                    >
                        <ShieldCheck className="mr-2.5 h-4.5 w-4.5 text-emerald-500" /> Availability Matrix
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                    { label: 'Uptime', value: averageUptime !== null ? `${averageUptime.toFixed(2)}%` : 'N/A', icon: Percent, color: uptimeColor, bottomRightGlobe: uptimeGlobeColor, description: uptimeCardDescription, loading: isUptimeLoading },
                    { label: 'Total Energy', value: `${(sessionStats?.totalEnergyDelivered || 0).toFixed(2)} kWh`, icon: Zap, color: 'text-amber-500', bottomRightGlobe: "bg-amber-500", description: 'Total energy delivered', loading: isStatsLoading },
                    { label: 'Total Sessions', value: String(sessionStats?.totalSessions || 0), icon: History, color: 'text-violet-500', bottomRightGlobe: "bg-violet-500", description: 'Total charging sessions', loading: isStatsLoading },
                    { label: 'Completed Sessions', value: String(sessionStats?.completedSessions || 0), icon: CheckCircle2, color: 'text-emerald-500', bottomRightGlobe: "bg-emerald-500", description: 'Successfully finished sessions', loading: isStatsLoading },
                    { label: 'Failed Sessions', value: String(sessionStats?.failedSessions || 0), icon: AlertCircle, color: 'text-rose-500', bottomRightGlobe: "bg-rose-500", description: 'Failed or interrupted sessions', loading: isStatsLoading },
                    { label: 'Active Sessions', value: String(sessionStats?.activeSessions || 0), icon: Play, color: 'text-primary', bottomRightGlobe: "bg-primary", description: 'Sessions currently in progress', loading: isStatsLoading },
                ].map((stat, i) => (
                    <StatCard
                        key={i}
                        title={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        description={stat.description}
                        bottomRightGlobe={stat.bottomRightGlobe}
                        loading={stat.loading}
                    />
                ))}
            </motion.div>

            {/* Main Content Tabs */}
            <motion.div variants={fadeInUp}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-muted/40 p-1 border border-border/40 rounded-2xl backdrop-blur-md overflow-x-auto w-full inline-flex h-auto sm:flex-nowrap justify-start no-scrollbar">
                        <TabsTrigger value="connectors" className="rounded-xl font-bold px-6 py-2.5 min-w-fit data-[state=active]:bg-background data-[state=active]:shadow-sm">Connectors</TabsTrigger>
                        <TabsTrigger value="overview" className="rounded-xl font-bold px-6 py-2.5 min-w-fit data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                        <TabsTrigger value="qr-code" className="rounded-xl font-bold px-6 py-2.5 min-w-fit data-[state=active]:bg-background data-[state=active]:shadow-sm">QR Code</TabsTrigger>
                        <TabsTrigger value="sessions" className="rounded-xl font-bold px-6 py-2.5 min-w-fit data-[state=active]:bg-background data-[state=active]:shadow-sm">Sessions</TabsTrigger>
                        <TabsTrigger value="config" className="rounded-xl font-bold px-6 py-2.5 min-w-fit data-[state=active]:bg-background data-[state=active]:shadow-sm">Config</TabsTrigger>
                        <TabsTrigger value="smart-charging" className="rounded-xl font-bold px-6 py-2.5 min-w-fit data-[state=active]:bg-background data-[state=active]:shadow-sm">Smart Charging</TabsTrigger>
                        <TabsTrigger value="logs" className="rounded-xl font-bold px-6 py-2.5 min-w-fit data-[state=active]:bg-background data-[state=active]:shadow-sm">Live Logs</TabsTrigger>
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
                                        onUnlock={handleUnlockConnector}
                                        isStarting={remoteStart.isPending || busyConnectors.has(connector.connectorId)}
                                        isStopping={remoteStop.isPending || busyConnectors.has(connector.connectorId)}
                                        isUnlocking={unlockConnector.isPending || busyConnectors.has(connector.connectorId)}
                                        disabled={station.status === ChargingStatus.OFFLINE}
                                        stationName={station.name}
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

                    <TabsContent value="qr-code">
                        <QrCodeTab station={station} />
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 lg:gap-x-12 gap-y-4 sm:gap-y-6 p-1 sm:p-2">
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
                                                { label: 'Idle Fee Per Minute', value: stationTariff && stationTariff.isIdleFeeEnabled ? `${stationTariff.idleFeePerMinute} ${stationTariff.currency}` : '-', icon: Terminal },
                                                { label: 'Station Type', value: station.type || 'AC', icon: Zap },
                                                { label: 'Visibility', value: station.visibility === 'private' ? 'Private' : 'Public', icon: ShieldCheck },
                                                { label: 'Environment Type', value: station.location?.locationEnv || LocationEnv.DEVELOPMENT, icon: Activity },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-start gap-3 group">
                                                    <div className="mt-1 p-1.5 rounded-md bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        {item.icon && <item.icon className="h-3 w-3" />}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 border-b border-border/10 flex-1 pb-2">
                                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                                                        <span className="text-[10px] sm:text-sm font-bold tracking-tight">{item.value}</span>
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
                                            password={station.password}
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

                    <TabsContent value="smart-charging">
                        <Card className="border-border/40 bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border">
                            <CardContent className="p-6">
                                <StationSmartCharging stationId={station.id} />
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
                        <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsRebootModalOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    {/* Soft Reset Banner */}
                    <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                            <h4 className="text-sm font-bold text-amber-500 flex items-center gap-2">
                                <History className="h-4 w-4" />
                                Soft Reset
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Gracefully restarts the station. It waits for active charging transactions to end before rebooting.
                            </p>
                        </div>
                        <Button
                            onClick={() => confirmReboot('Soft')}
                            disabled={resetStation.isPending}
                            className="font-bold border-amber-500/30 bg-amber-500 hover:bg-amber-500/80 text-white rounded-xl px-5 h-11 shrink-0 w-full sm:w-auto"
                        >
                            Soft Reset
                        </Button>
                    </div>

                    {/* Hard Reset Banner */}
                    <div className="p-5 rounded-2xl bg-destructive/5 border border-destructive/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                            <h4 className="text-sm font-bold text-destructive flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Hard Reset
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Immediately restarts the station. This is a cold reboot and will abruptly interrupt active charging sessions.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => confirmReboot('Hard')}
                            disabled={resetStation.isPending}
                            className="font-bold rounded-xl px-5 h-11 shrink-0 w-full sm:w-auto"
                        >
                            Hard Reset
                        </Button>
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
                        <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsAvailabilityModalOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    {/* Turn ON Banner */}
                    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                            <h4 className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Turn ON (Operative)
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Brings the station online. Drivers will be able to discover, connect, and initiate new charging sessions.
                            </p>
                        </div>
                        <Button
                            variant="default"
                            onClick={() => confirmAvailability('Operative')}
                            disabled={changeAvailability.isPending}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-5 h-11 shrink-0 w-full sm:w-auto"
                        >
                            {changeAvailability.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Turn ON'}
                        </Button>
                    </div>

                    {/* Turn OFF Banner */}
                    <div className="p-5 rounded-2xl bg-destructive/5 border border-destructive/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                            <h4 className="text-sm font-bold text-destructive flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Turn OFF (Inoperative)
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Sets the station to inoperative. Active sessions can finish gracefully, but new charging requests will be blocked.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => confirmAvailability('Inoperative')}
                            disabled={changeAvailability.isPending}
                            className="font-bold rounded-xl px-5 h-11 shrink-0 w-full sm:w-auto"
                        >
                            {changeAvailability.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Turn OFF'}
                        </Button>
                    </div>
                </div>
            </AnimatedModal>
            {/* Unlock Cable Modal */}
            <AnimatedModal
                isOpen={isUnlockModalOpen}
                onClose={() => setIsUnlockModalOpen(false)}
                title="Unlock Connector Cable"
                description={`Send a remote unlock command to ${station.name}.`}
                size="md"
                footer={
                    <div className="flex gap-3 justify-end w-full">
                        <Button variant="outline" onClick={() => setIsUnlockModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmUnlock}
                            disabled={unlockConnector.isPending}
                            className="font-bold flex items-center gap-2"
                        >
                            {unlockConnector.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Unlock className="h-4 w-4" />
                            )}
                            Confirm Unlock
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 dark:text-orange-400 text-sm font-medium">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>This will force the station to unlock the charging cable on Connector #{unlockConnectorId}.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground font-medium">Connector</span>
                            <span className="font-bold">Port #{unlockConnectorId}</span>
                        </div>
                    </div>
                </div>
            </AnimatedModal>
        </motion.div>
    );
}
