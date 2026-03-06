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
import { Tag, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { OcpiToken } from '@/services/ocpi.service';

interface OcpiTokensListProps {
    tokens?: OcpiToken[];
    isLoading: boolean;
}

export function OcpiTokensList({ tokens, isLoading }: OcpiTokensListProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <Skeleton className="h-[125px] w-full rounded-xl" />
            </div>
        );
    }

    if (!tokens || tokens.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/30">
                <Tag className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-lg font-medium">No roaming tokens yet</p>
                <p className="text-sm text-muted-foreground">
                    Tokens provided by other roaming parties will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>UID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Issuer (Party ID)</TableHead>
                        <TableHead>Allowed</TableHead>
                        <TableHead>Whitelist</TableHead>
                        <TableHead className="text-right">Last Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tokens.map((token) => (
                        <TableRow key={token.uid}>
                            <TableCell className="font-mono text-xs">{token.uid}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{token.type}</Badge>
                            </TableCell>
                            <TableCell>{token.issuer}</TableCell>
                            <TableCell>
                                {token.allowed ? (
                                    <Badge variant="default" className="bg-green-500">YES</Badge>
                                ) : (
                                    <Badge variant="destructive">NO</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{token.whitelist}</TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                                {token.lastUpdated ? format(new Date(token.lastUpdated), 'MMM d, p') : '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
