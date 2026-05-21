'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Terminal, Command, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { useOcpiLocations, useOcpiTokens } from '@/hooks/get/useOcpi';
import { useOcpiCommands } from '@/hooks/post/useOcpiMutations';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface LogEntry {
    timestamp: string;
    type: 'SYSTEM' | 'ACTION' | 'ACCEPTED' | 'REJECTED' | 'FAULT';
    command: string;
    message: string;
    details?: string;
}

export function OcpiCommandConsole() {
    const [locationId, setLocationId] = useState('');
    const [evseUid, setEvseUid] = useState('');
    const [tokenUid, setTokenUid] = useState('');
    const [connectorId, setConnectorId] = useState('');

    const [logs, setLogs] = useState<LogEntry[]>([
        {
            timestamp: format(new Date(), 'HH:mm:ss'),
            type: 'SYSTEM',
            command: 'SYSTEM',
            message: 'Console initialized. Waiting for protocol dispatch...',
        }
    ]);

    const { data: locationsData, isLoading: isLocationsLoading } = useOcpiLocations({ pageSize: 1000 });
    const { data: tokensData, isLoading: isTokensLoading } = useOcpiTokens({ pageSize: 1000 });

    const locations = locationsData?.items || [];
    const tokens = tokensData?.items || [];

    const { startSession, stopSession, unlockConnector } = useOcpiCommands();

    const selectedLocation = locations?.find(loc => loc.id === locationId);
    const evses = selectedLocation?.evses || [];
    const selectedEvse = evses?.find(evse => evse.uid === evseUid);
    const connectors = selectedEvse?.connectors || [];

    const handleStart = async () => {
        if (!locationId || !evseUid || !tokenUid) return;

        const timestamp = format(new Date(), 'HH:mm:ss');
        setLogs(prev => [
            ...prev,
            {
                timestamp,
                type: 'ACTION',
                command: 'START_SESSION',
                message: `Transmitting START_SESSION packet for EVSE ${evseUid}...`,
            }
        ]);

        try {
            const res = await startSession.mutateAsync({
                location_id: locationId,
                evse_uid: evseUid,
                connector_id: connectorId || undefined,
                token: {
                    uid: tokenUid,
                    type: 'RFID',
                },
            });

            const isAccepted = res.result === 'ACCEPTED';
            setLogs(prev => [
                ...prev,
                {
                    timestamp: format(new Date(), 'HH:mm:ss'),
                    type: isAccepted ? 'ACCEPTED' : 'REJECTED',
                    command: 'START_SESSION',
                    message: `REMOTE_START ${isAccepted ? 'recognized' : 'rejected'} by target`,
                    details: res.message || (isAccepted ? 'Session transition initiated' : 'Protocol rejection'),
                }
            ]);
        } catch (err: any) {
            setLogs(prev => [
                ...prev,
                {
                    timestamp: format(new Date(), 'HH:mm:ss'),
                    type: 'FAULT',
                    command: 'START_SESSION',
                    message: `Network/Server Error: START_SESSION failed`,
                    details: err.message || 'Unknown network error',
                }
            ]);
        }
    };

    const handleStop = async () => {
        if (!locationId || !evseUid) return;

        const timestamp = format(new Date(), 'HH:mm:ss');
        setLogs(prev => [
            ...prev,
            {
                timestamp,
                type: 'ACTION',
                command: 'STOP_SESSION',
                message: `Transmitting STOP_SESSION packet for EVSE ${evseUid}...`,
            }
        ]);

        try {
            const res = await stopSession.mutateAsync({
                location_id: locationId,
                evse_uid: evseUid,
            });

            const isAccepted = res.result === 'ACCEPTED';
            setLogs(prev => [
                ...prev,
                {
                    timestamp: format(new Date(), 'HH:mm:ss'),
                    type: isAccepted ? 'ACCEPTED' : 'REJECTED',
                    command: 'STOP_SESSION',
                    message: `REMOTE_STOP ${isAccepted ? 'dispatch confirmed' : 'rejected'}`,
                    details: res.message || (isAccepted ? 'Termination sequence started' : 'Protocol rejection'),
                }
            ]);
        } catch (err: any) {
            setLogs(prev => [
                ...prev,
                {
                    timestamp: format(new Date(), 'HH:mm:ss'),
                    type: 'FAULT',
                    command: 'STOP_SESSION',
                    message: `Network/Server Error: STOP_SESSION failed`,
                    details: err.message || 'Unknown network error',
                }
            ]);
        }
    };

    const handleUnlock = async () => {
        if (!locationId || !evseUid) return;

        const timestamp = format(new Date(), 'HH:mm:ss');
        setLogs(prev => [
            ...prev,
            {
                timestamp,
                type: 'ACTION',
                command: 'UNLOCK_CONNECTOR',
                message: `Transmitting UNLOCK_CONNECTOR packet for EVSE ${evseUid} Connector ${connectorId || '1'}...`,
            }
        ]);

        try {
            const res = await unlockConnector.mutateAsync({
                location_id: locationId,
                evse_uid: evseUid,
                connector_id: connectorId || '1',
            });

            const isAccepted = res.result === 'ACCEPTED';
            setLogs(prev => [
                ...prev,
                {
                    timestamp: format(new Date(), 'HH:mm:ss'),
                    type: isAccepted ? 'ACCEPTED' : 'REJECTED',
                    command: 'UNLOCK_CONNECTOR',
                    message: `UNLOCK_CONNECTOR ${isAccepted ? 'command accepted' : 'rejected'}`,
                    details: res.message || (isAccepted ? 'Unlock signal dispatched' : 'Protocol rejection'),
                }
            ]);
        } catch (err: any) {
            setLogs(prev => [
                ...prev,
                {
                    timestamp: format(new Date(), 'HH:mm:ss'),
                    type: 'FAULT',
                    command: 'UNLOCK_CONNECTOR',
                    message: `Network/Server Error: UNLOCK_CONNECTOR failed`,
                    details: err.message || 'Unknown network error',
                }
            ]);
        }
    };

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 pt-4">
            <Card className="lg:col-span-2 bg-background/40 backdrop-blur-md border border-white/5 shadow-2xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <Command className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Remote Control</CardTitle>
                            <CardDescription className="text-xs">
                                Manually trigger OCPI commands.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="location-id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                Target Location
                            </Label>
                            <Select
                                value={locationId}
                                onValueChange={(val) => {
                                    setLocationId(val);
                                    setEvseUid('');
                                    setConnectorId('');
                                }}
                            >
                                <SelectTrigger id="location-id" className="h-11 bg-background/50 border-white/10 hover:border-primary/50 transition-colors">
                                    <SelectValue placeholder={isLocationsLoading ? "Loading..." : "Select Location"} />
                                </SelectTrigger>
                                <SelectContent className="max-w-[300px]">
                                    {locations.map((loc: any) => (
                                        <SelectItem key={loc.id} value={loc.id} className="text-xs">
                                            {loc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="evse-uid" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                Target EVSE
                            </Label>
                            <Select
                                value={evseUid}
                                onValueChange={(val) => {
                                    setEvseUid(val);
                                    const evse = evses.find(e => e.uid === val);
                                    if (evse && evse.connectors && evse.connectors.length > 0) {
                                        setConnectorId(evse.connectors[0].id);
                                    } else {
                                        setConnectorId('');
                                    }
                                }}
                                disabled={!locationId || evses.length === 0}
                            >
                                <SelectTrigger id="evse-uid" className="h-11 bg-background/50 border-white/10 hover:border-primary/50 transition-colors disabled:opacity-40">
                                    <SelectValue placeholder={!locationId ? "Pick Location First" : "Select EVSE Component"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {evses.map((evse) => (
                                        <SelectItem key={evse.uid} value={evse.uid} className="text-xs">
                                            {evse.evse_id || evse.uid}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {connectors.length > 0 && (
                            <div className="space-y-2 animate-in fade-in duration-200">
                                <Label htmlFor="connector-id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                    Target Connector
                                </Label>
                                <Select
                                    value={connectorId}
                                    onValueChange={setConnectorId}
                                    disabled={connectors.length <= 1}
                                >
                                    <SelectTrigger id="connector-id" className="h-11 bg-background/50 border-white/10 hover:border-primary/50 transition-colors disabled:opacity-75">
                                        <SelectValue placeholder="Select Connector" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {connectors.map((c) => (
                                            <SelectItem key={c.id} value={c.id} className="text-xs">
                                                Connector {c.id} ({c.standard || 'Unknown'})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="token-uid" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                Authentication Token
                            </Label>
                            <Select
                                value={tokenUid}
                                onValueChange={setTokenUid}
                            >
                                <SelectTrigger id="token-uid" className="h-11 bg-background/50 border-white/10 hover:border-primary/50 transition-colors">
                                    <SelectValue placeholder={isTokensLoading ? "Loading..." : "Select RFID/App Token"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {tokens.map((token: any) => (
                                        <SelectItem key={token.uid} value={token.uid} className="text-xs">
                                            {token.visualNumber || token.uid}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <Button
                            onClick={handleStart}
                            disabled={startSession.isPending || !locationId || !evseUid || !tokenUid}
                            className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 group"
                        >
                            <Play className="mr-2 h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                            {startSession.isPending ? 'Executing...' : 'START_SESSION'}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleStop}
                            disabled={stopSession.isPending || !locationId || !evseUid}
                            className="h-12 font-bold rounded-xl shadow-lg shadow-red-900/20 group hover:bg-red-700"
                        >
                            <Square className="mr-2 h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                            {stopSession.isPending ? 'Executing...' : 'STOP_SESSION'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleUnlock}
                            disabled={unlockConnector.isPending || !locationId || !evseUid}
                            className="h-12 font-bold rounded-xl border-amber-500/50 text-amber-500 hover:bg-amber-500/10 shadow-lg shadow-amber-900/10 group col-span-1 sm:col-span-2"
                        >
                            <Shield className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            {unlockConnector.isPending ? 'Executing...' : 'UNLOCK_CONNECTOR'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-3 bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
                <CardHeader className="py-3 px-4 border-b border-white/10 bg-white/[0.03] flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                        </div>
                        <div className="h-4 w-px bg-white/10 mx-1" />
                        <Terminal className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold">OCPI_IO_LOG</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className="h-6 text-[9px] font-mono text-zinc-500 hover:text-white px-2 py-0"
                            onClick={() => setLogs([{
                                timestamp: format(new Date(), 'HH:mm:ss'),
                                type: 'SYSTEM',
                                command: 'SYSTEM',
                                message: 'Console logs cleared.',
                            }])}
                        >
                            CLEAR
                        </Button>
                        <Badge variant="outline" className="text-[9px] border-zinc-700 text-zinc-500 font-mono">2.2.1-STABLE</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6 font-mono text-[11px] text-zinc-400 flex-1 overflow-y-auto min-h-[400px]">
                    <div className="space-y-3">
                        {logs.map((log, index) => {
                            if (log.type === 'SYSTEM') {
                                return (
                                    <div key={index} className="flex gap-3">
                                        <span className="text-zinc-700 select-none">[{log.timestamp}]</span>
                                        <span className="text-blue-500 font-bold tracking-widest">[SYSTEM]</span>
                                        <span className="text-zinc-500">{log.message}</span>
                                    </div>
                                );
                            }
                            if (log.type === 'ACTION') {
                                return (
                                    <div key={index} className="flex gap-3 animate-pulse">
                                        <span className="text-zinc-700 opacity-50 select-none">[{log.timestamp}]</span>
                                        <span className="text-amber-500 font-bold">[ACTION]</span>
                                        <span className="text-zinc-400 italic">{log.message}</span>
                                    </div>
                                );
                            }
                            if (log.type === 'ACCEPTED' || log.type === 'REJECTED') {
                                const isAccepted = log.type === 'ACCEPTED';
                                return (
                                    <div key={index} className="space-y-1 animate-in slide-in-from-top-1 duration-300">
                                        <div className="flex gap-3">
                                            <span className="text-zinc-700 select-none">[{log.timestamp}]</span>
                                            <span className={isAccepted ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
                                                [{log.type}]
                                            </span>
                                            <span className={isAccepted ? "text-emerald-400" : "text-amber-400"}>
                                                {log.message}
                                            </span>
                                        </div>
                                        {log.details && (
                                            <div className="pl-11 text-[10px] text-zinc-600 opacity-80">
                                                {">"} {log.details}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            if (log.type === 'FAULT') {
                                return (
                                    <div key={index} className="space-y-1 animate-in shake-in duration-300">
                                        <div className="flex gap-3">
                                            <span className="text-zinc-700 select-none">[{log.timestamp}]</span>
                                            <span className="text-red-500 font-bold">[FAULT]</span>
                                            <span className="text-red-400 font-semibold tracking-tight uppercase">{log.message}</span>
                                        </div>
                                        {log.details && (
                                            <div className="pl-11 text-[10px] text-red-500/70 border-l border-red-500/20 ml-2 py-1 italic">
                                                {log.details}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })}

                        <div className="flex gap-2 text-zinc-600 pt-4">
                            <span className="animate-pulse">_</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
