'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Zap } from 'lucide-react';
import { format } from 'date-fns';

interface OcpiSessionsListProps {
    sessions?: any[];
    isLoading: boolean;
}

export function OcpiSessionsList({ sessions, isLoading }: OcpiSessionsListProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <Skeleton className="h-[125px] w-full rounded-xl" />
            </div>
        );
    }

    if (!sessions || sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/30">
                <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-lg font-medium">No roaming sessions active</p>
                <p className="text-sm text-muted-foreground">
                    Active charging sessions initiated via OCPI will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Session ID</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead>Location / EVSE</TableHead>
                        <TableHead>Energy (kWh)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Started At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sessions.map((session) => (
                        <TableRow key={session.id}>
                            <TableCell className="font-mono text-xs">{session.id}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{session.party_id}</span>
                                    <span className="text-[10px] text-muted-foreground">{session.country_code}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="truncate w-32 text-sm">{session.location_id}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase">{session.evse_uid}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <Zap className="h-3 w-3 text-yellow-500" />
                                    <span className="text-sm">{(session.kwh ?? 0).toFixed(2)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="default" className="bg-blue-500">{session.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                                {session.start_date_time ? format(new Date(session.start_date_time), 'MMM d, p') : '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
