'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Terminal, Command } from 'lucide-react';
import { format } from 'date-fns';
import { useOcpiCommands, useOcpiLocations, useOcpiTokens } from '@/hooks/get/useOcpi';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function OcpiCommandConsole() {
    const [locationId, setLocationId] = useState('');
    const [evseUid, setEvseUid] = useState('');
    const [tokenUid, setTokenUid] = useState('');

    const { data: locations, isLoading: isLocationsLoading } = useOcpiLocations();
    const { data: tokens, isLoading: isTokensLoading } = useOcpiTokens();
    const { startSession, stopSession } = useOcpiCommands();

    const selectedLocation = locations?.find(loc => loc.id === locationId);
    const evses = selectedLocation?.evses || [];

    const handleStart = async () => {
        if (!locationId || !evseUid || !tokenUid) return;
        await startSession.mutateAsync({
            location_id: locationId,
            evse_uid: evseUid,
            token: {
                uid: tokenUid,
                type: 'RFID',
            },
        });
    };

    const handleStop = async () => {
        if (!locationId || !evseUid) return;
        await stopSession.mutateAsync({
            location_id: locationId,
            evse_uid: evseUid,
        });
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
                                }}
                            >
                                <SelectTrigger id="location-id" className="h-11 bg-background/50 border-white/10 hover:border-primary/50 transition-colors">
                                    <SelectValue placeholder={isLocationsLoading ? "Loading..." : "Select Location"} />
                                </SelectTrigger>
                                <SelectContent className="max-w-[300px]">
                                    {locations?.map((loc) => (
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
                                onValueChange={setEvseUid}
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
                                    {tokens?.map((token) => (
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
                    <Badge variant="outline" className="text-[9px] border-zinc-700 text-zinc-500 font-mono">2.2.1-STABLE</Badge>
                </CardHeader>
                <CardContent className="p-6 font-mono text-[11px] text-zinc-400 flex-1 overflow-y-auto min-h-[400px]">
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <span className="text-zinc-700 select-none">[{format(new Date(), 'HH:mm:ss')}]</span>
                            <span className="text-blue-500 font-bold tracking-widest">[SYSTEM]</span>
                            <span className="text-zinc-500">Console initialized. Waiting for protocol dispatch...</span>
                        </div>

                        {(startSession.isPending || stopSession.isPending) && (
                            <div className="flex gap-3 animate-pulse">
                                <span className="text-zinc-700 opacity-50 select-none">[{format(new Date(), 'HH:mm:ss')}]</span>
                                <span className="text-amber-500 font-bold">[ACTION]</span>
                                <span className="text-zinc-400 italic">Transmitting packet to remote CPO...</span>
                            </div>
                        )}

                        {startSession.isSuccess && (
                            <div className="space-y-1 animate-in slide-in-from-top-1 duration-300">
                                <div className="flex gap-3">
                                    <span className="text-zinc-700 select-none">[{format(new Date(), 'HH:mm:ss')}]</span>
                                    <span className={startSession.data?.result === 'ACCEPTED' ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
                                        [{startSession.data?.result || 'UNKNOWN'}]
                                    </span>
                                    <span className={startSession.data?.result === 'ACCEPTED' ? "text-emerald-400" : "text-amber-400"}>
                                        REMOTE_START {startSession.data?.result === 'ACCEPTED' ? 'recognized' : 'rejected'} by target
                                    </span>
                                </div>
                                <div className="pl-11 text-[10px] text-zinc-600 opacity-80">
                                    {">"} {startSession.data?.message || (startSession.data?.result === 'ACCEPTED' ? 'Session transition initiated' : 'Protocol rejection')} for {evseUid}
                                </div>
                            </div>
                        )}

                        {stopSession.isSuccess && (
                            <div className="space-y-1 animate-in slide-in-from-top-1 duration-300">
                                <div className="flex gap-3">
                                    <span className="text-zinc-700 select-none">[{format(new Date(), 'HH:mm:ss')}]</span>
                                    <span className={stopSession.data?.result === 'ACCEPTED' ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
                                        [{stopSession.data?.result || 'UNKNOWN'}]
                                    </span>
                                    <span className={stopSession.data?.result === 'ACCEPTED' ? "text-emerald-400" : "text-amber-400"}>
                                        REMOTE_STOP {stopSession.data?.result === 'ACCEPTED' ? 'dispatch confirmed' : 'rejected'}
                                    </span>
                                </div>
                                <div className="pl-11 text-[10px] text-zinc-600 opacity-80">
                                    {">"} {stopSession.data?.message || (stopSession.data?.result === 'ACCEPTED' ? 'Termination sequence started' : 'Protocol rejection')} for {evseUid}
                                </div>
                            </div>
                        )}

                        {(startSession.isError || stopSession.isError) && (
                            <div className="space-y-1 animate-in shake-in duration-300">
                                <div className="flex gap-3">
                                    <span className="text-zinc-700 select-none">[{format(new Date(), 'HH:mm:ss')}]</span>
                                    <span className="text-red-500 font-bold">[FAULT]</span>
                                    <span className="text-red-400 font-semibold tracking-tight uppercase">Network/Server Error</span>
                                </div>
                                <div className="pl-11 text-[10px] text-red-500/70 border-l border-red-500/20 ml-2 py-1 italic">
                                    {startSession.error?.message || stopSession.error?.message}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 text-zinc-600 pt-4">
                            <span className="animate-pulse">_</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
