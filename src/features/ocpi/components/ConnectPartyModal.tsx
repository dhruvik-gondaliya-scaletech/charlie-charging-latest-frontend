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
    const generateToken = useGenerateOcpiToken();

    const handleClose = () => {
        setUrl('');
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        await generateToken.mutateAsync(url);
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
                    <Label htmlFor="party-url">The other party's Credentials URL</Label>
                    <Input
                        id="party-url"
                        placeholder="https://example.com/ocpi/cpo/credentials"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        This is the URL our system will call during the OCPI handshake.
                    </p>
                </div>
            </div>
        </AnimatedModal>
    );
}
