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
import { Globe, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { OcpiCredential } from '@/services/ocpi.service';

interface OcpiCredentialsListProps {
    credentials?: OcpiCredential[];
    isLoading: boolean;
}

export function OcpiCredentialsList({ credentials, isLoading }: OcpiCredentialsListProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <Skeleton className="h-[125px] w-full rounded-xl" />
            </div>
        );
    }

    if (!credentials || credentials.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/30">
                <Shield className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-lg font-medium">No connected parties yet</p>
                <p className="text-sm text-muted-foreground">
                    Generate an OCPI Token A to start a connection with another party.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Party ID</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registration Token</TableHead>
                        <TableHead className="text-right">Last Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {credentials.map((cred) => {
                        const hasHandshake = !!cred.token_b && !!cred.token_c;
                        return (
                            <TableRow key={cred.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        {cred.partyId || 'PENDING'}
                                    </div>
                                </TableCell>
                                <TableCell>{cred.countryCode || '-'}</TableCell>
                                <TableCell className="max-w-[200px] truncate font-mono text-xs text-muted-foreground">
                                    {cred.url}
                                </TableCell>
                                <TableCell>
                                    {hasHandshake ? (
                                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">CONNECTED</Badge>
                                    ) : (
                                        <Badge variant="secondary">REGISTERED</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Token A</span>
                                        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded truncate max-w-[120px] block">{cred.token_a}</code>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground">
                                    {format(new Date(cred.updatedAt), 'MMM d, p')}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
