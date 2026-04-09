'use client';

import * as React from 'react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { useGenerateOcpiToken } from '@/hooks/post/useOcpiMutations';

interface ConnectPartyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ConnectPartyModal({ isOpen, onClose }: ConnectPartyModalProps) {
    const [url, setUrl] = useState('');
    const [email, setEmail] = useState('');
    const generateToken = useGenerateOcpiToken();

    const handleClose = () => {
        setUrl('');
        setEmail('');
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        await generateToken.mutateAsync({ url, email: email || undefined });
        handleClose();
    };

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Connect New OCPI Party"
            description="Generate a registration token (Token A) to provide to another OCPI party."
            footer={
                <div className="flex gap-3 justify-end w-full">
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={generateToken.isPending || !url}
                    >
                        {generateToken.isPending ? 'Generating...' : 'Generate Token A'}
                    </Button>
                </div>
            }
        >
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="party-url">The other party's Versions URL</Label>
                    <Input
                        id="party-url"
                        placeholder="https://example.com/ocpi/versions"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        This is the entry point (Versions URL) our system will call to discover endpoints.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="partner-email">Partner's Email Address (Optional)</Label>
                    <Input
                        id="partner-email"
                        type="email"
                        placeholder="technical@partner.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        If provided, an automated invitation with the token will be sent to this address.
                    </p>
                </div>
            </div>
        </AnimatedModal>
    );
}
