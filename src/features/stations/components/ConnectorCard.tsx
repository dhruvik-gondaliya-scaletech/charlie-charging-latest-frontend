'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Play, Square, Loader2 } from 'lucide-react';
import { ChargingStatus, Connector } from '@/types';
import { cn } from '@/lib/utils';

interface ConnectorCardProps {
    connector: Connector;
    onStart: (connectorId: number) => void;
    onStop: (connectorId: number) => void;
    isStarting?: boolean;
    isStopping?: boolean;
    disabled?: boolean;
}

export function ConnectorCard({
    connector,
    onStart,
    onStop,
    isStarting,
    isStopping,
    disabled
}: ConnectorCardProps) {
    const isAvailable = connector.status === ChargingStatus.AVAILABLE;
    const isCharging = connector.status === ChargingStatus.CHARGING;

    return (
        <Card className="border-border/40 bg-card/10 backdrop-blur-md rounded-3xl border hover:bg-card/20 transition-all group overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "p-4 rounded-2xl relative overflow-hidden transition-colors",
                            isAvailable ? "bg-emerald-500/10 text-emerald-500" :
                                isCharging ? "bg-blue-500/10 text-blue-500" :
                                    "bg-muted/40 text-muted-foreground"
                        )}>
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-[10px] font-black leading-none mb-1 text-muted-foreground/60">ID</span>
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
                                    "h-1.5 w-1.5 p-0 rounded-full",
                                    isAvailable ? "bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" :
                                        isCharging ? "bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse" :
                                            "bg-muted-foreground"
                                )} />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    isAvailable ? "text-emerald-500" :
                                        isCharging ? "text-blue-500" :
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
                </div>

                <div className="pt-4 border-t border-border/10">
                    {isCharging ? (
                        <Button
                            variant="destructive"
                            onClick={() => onStop(connector.connectorId)}
                            disabled={disabled || isStopping}
                            className="w-full shadow-lg shadow-destructive/20 font-bold rounded-xl h-11 transition-all active:scale-95"
                        >
                            {isStopping ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Square className="h-4 w-4 mr-2 fill-current" />
                            )}
                            Stop Charging
                        </Button>
                    ) : (
                        <Button
                            onClick={() => onStart(connector.connectorId)}
                            disabled={disabled || isStarting}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 font-bold rounded-xl h-11 transition-all active:scale-95"
                        >
                            {isStarting ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Play className="h-4 w-4 mr-2 fill-current" />
                            )}
                            Start Charging
                        </Button>
                    )}
                </div>
            </CardContent>
            <div className={cn(
                "h-1 w-full mt-auto opacity-40 transition-colors",
                isAvailable ? "bg-emerald-500" :
                    isCharging ? "bg-blue-500" :
                        "bg-muted-foreground"
            )} />
        </Card>
    );
}
