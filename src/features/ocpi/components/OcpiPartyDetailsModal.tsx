'use client';

import * as React from 'react';
import { OcpiCredential, OcpiRole, OcpiEndpoint } from '@/services/ocpi.service';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AppWindow, Globe, Link as LinkIcon } from 'lucide-react';

interface OcpiPartyDetailsModalProps {
    credential: OcpiCredential | null;
    isOpen: boolean;
    onClose: () => void;
}

export function OcpiPartyDetailsModal({ credential, isOpen, onClose }: OcpiPartyDetailsModalProps) {
    if (!credential) return null;

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={onClose}
            title={`${credential.partyId || 'Pending'} (${credential.countryCode || '-'})`}
            description="Detailed OCPI configuration and registered capabilities."
            className="sm:max-w-[700px]"
        >
            <div className="space-y-6 py-4">
                {/* Connection Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30 border-none shadow-none">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Globe className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Version URL</span>
                            </div>
                            <code className="text-[11px] font-mono break-all">{credential.url}</code>
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/30 border-none shadow-none">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-4 w-4 text-amber-500" />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tokens</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Token A:</span>
                                    <code className="text-[10px] font-mono">{credential.token_a || '-'}</code>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Token B:</span>
                                    <code className="text-[10px] font-mono">{credential.token_b ? '********' : '-'}</code>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Token C:</span>
                                    <code className="text-[10px] font-mono">{credential.token_c ? '********' : '-'}</code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Roles */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                        <AppWindow className="h-4 w-4 text-blue-500" />
                        Registered Roles
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {credential.roles?.length > 0 ? (
                            credential.roles.map((role: OcpiRole, idx: number) => (
                                <div key={idx} className="p-3 border rounded-xl bg-background shadow-sm hover:border-primary/30 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="secondary" className="font-bold">{role.role}</Badge>
                                        <span className="text-[10px] font-mono font-bold text-muted-foreground">{role.country_code}-{role.party_id}</span>
                                    </div>
                                    <p className="text-xs font-medium">{role.business_details.name}</p>
                                    {role.business_details.website && (
                                        <a href={role.business_details.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1 mt-1">
                                            <LinkIcon className="h-3 w-3" />
                                            {new URL(role.business_details.website).hostname}
                                        </a>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 py-6 text-center border-2 border-dashed rounded-xl text-muted-foreground text-xs italic">
                                No roles registered yet. Handshake may be incomplete.
                            </div>
                        )}
                    </div>
                </div>

                {/* Endpoints */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-emerald-500" />
                        Available Endpoints
                    </h4>
                    <ScrollArea className="h-[200px] rounded-xl border p-4 bg-muted/10">
                        {credential.endpoints?.length > 0 ? (
                            <div className="space-y-2">
                                {credential.endpoints.map((endpoint: OcpiEndpoint, idx: number) => (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 border-b last:border-0 border-muted-foreground/10">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] font-mono border-primary/20 text-primary uppercase">{endpoint.identifier}</Badge>
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">({endpoint.role})</span>
                                        </div>
                                        <code className="text-[10px] font-mono break-all text-muted-foreground opacity-70 truncate max-w-[300px]" title={endpoint.url}>
                                            {endpoint.url}
                                        </code>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-xs italic">
                                No endpoints discovered yet.
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </AnimatedModal>
    );
}
