'use client';

import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Key, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface TenantSecretModalProps {
    isOpen: boolean;
    onClose: () => void;
    secret: string;
    tenantName: string;
}

export function TenantSecretModal({
    isOpen,
    onClose,
    secret,
    tenantName,
}: TenantSecretModalProps) {
    const [showSecret, setShowSecret] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(secret);
        setCopied(true);
        toast.success('API secret copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={onClose}
            title="Tenant API Secret"
            description={`Below is the API secret for "${tenantName}". Please store it securely as it will not be shown again.`}
            className="max-w-md"
        >
            <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                    <Key className="h-8 w-8 text-amber-500" />
                </div>

                <div className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 mb-8 flex items-center justify-between gap-3 overflow-hidden">
                    <div className="flex-1 text-left overflow-hidden">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                            Secret Key
                        </p>
                        <p className="font-mono text-sm tracking-tighter truncate">
                            {showSecret ? secret : '•'.repeat(32)}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => setShowSecret(!showSecret)}
                        >
                            {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={handleCopy}
                        >
                            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <Button
                    onClick={onClose}
                    className="w-full h-12 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 shadow-xl"
                >
                    I have stored the secret
                </Button>
            </div>
        </AnimatedModal>
    );
}
