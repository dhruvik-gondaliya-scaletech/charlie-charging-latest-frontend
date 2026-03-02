'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { stationService } from '@/services/station.service';
import { useSetConfiguration } from '@/hooks/delete/useStationMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    RefreshCw,
    Save,
    Search,
    Lock,
    Unlock,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ConfigurationKey } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ConfigurationManagerProps {
    stationId: string;
}

export function ConfigurationManager({ stationId }: ConfigurationManagerProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['station-config', stationId],
        queryFn: () => stationService.getConfiguration(stationId),
        enabled: !!stationId,
    });

    const setConfig = useSetConfiguration();
    const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

    const handleValueChange = (key: string, value: string) => {
        setPendingChanges(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = (key: string) => {
        const value = pendingChanges[key];
        if (value === undefined) return;

        setConfig.mutate({
            id: stationId,
            configurations: [{ key, value }]
        }, {
            onSuccess: () => {
                const newPending = { ...pendingChanges };
                delete newPending[key];
                setPendingChanges(newPending);
                refetch();
            }
        });
    };

    const filteredKeys = (data?.configurationKey as ConfigurationKey[] || []).filter((ck: ConfigurationKey) =>
        ck.key.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <div className="space-y-3">
                    {Array(8).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="p-4 rounded-full bg-destructive/10 text-destructive">
                    <AlertCircle className="h-10 w-10" />
                </div>
                <div>
                    <p className="text-destructive font-bold text-lg">Communication Error</p>
                    <p className="text-sm text-muted-foreground max-w-xs mt-1">
                        Failed to fetch configuration. The station might be offline or using an unsupported protocol.
                    </p>
                </div>
                <Button variant="outline" onClick={() => refetch()} className="mt-2">
                    Retry Request
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 no-scrollbar">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search configuration keys..."
                        className="pl-10 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    className="flex items-center gap-2 font-semibold"
                    disabled={isLoading}
                >
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    Sync with Station
                </Button>
            </div>

            <div className="grid gap-3">
                {filteredKeys.length > 0 ? (
                    filteredKeys.map((ck: ConfigurationKey) => (
                        <div
                            key={ck.key}
                            className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border border-border/60 bg-card/40 hover:bg-card hover:shadow-sm transition-all gap-4"
                        >
                            <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-bold tracking-tight text-foreground truncate">{ck.key}</span>
                                    {ck.readonly ? (
                                        <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 bg-muted/50 text-muted-foreground border-border/50 uppercase tracking-widest font-bold">
                                            <Lock className="h-3 w-3 mr-1" />
                                            Read Only
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 bg-primary/5 text-primary border-primary/20 uppercase tracking-widest font-bold">
                                            <Unlock className="h-3 w-3 mr-1" />
                                            Writable
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                    {ck.description || "No description provided for this core configuration key."}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 md:w-80">
                                <Input
                                    value={pendingChanges[ck.key] ?? ck.value ?? ''}
                                    onChange={(e) => handleValueChange(ck.key, e.target.value)}
                                    disabled={ck.readonly || setConfig.isPending}
                                    className={cn(
                                        "flex-1 font-medium",
                                        pendingChanges[ck.key] !== undefined && "border-primary ring-1 ring-primary/20 bg-primary/5"
                                    )}
                                />
                                {!ck.readonly && pendingChanges[ck.key] !== undefined && (
                                    <Button
                                        size="icon"
                                        className="shrink-0 h-10 w-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                        onClick={() => handleSave(ck.key)}
                                        disabled={setConfig.isPending}
                                    >
                                        {setConfig.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl">
                        <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground font-medium">No configuration keys match your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
