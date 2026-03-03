'use client';

import { useState } from 'react';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Copy, Check, Key } from 'lucide-react';
import { toast } from 'sonner';

interface WebhookSecretModalProps {
    isOpen: boolean;
    onClose: () => void;
    secret: string;
    webhookName: string;
}

export function WebhookSecretModal({ isOpen, onClose, secret, webhookName }: WebhookSecretModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(secret);
            setIsCopied(true);
            toast.success('Secret copied to clipboard');
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            toast.error('Failed to copy secret');
        }
    };

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={onClose}
            title="Webhook Secret Key"
            description={`Use this secret to verify signatures for "${webhookName}"`}
        >
            <div className="space-y-6 pt-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                        <Key className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-foreground">HMAC Verification</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Securely sign and verify event payloads
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="webhook-secret" className="text-sm font-medium">
                        Secret Key
                    </Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                id="webhook-secret"
                                type={isVisible ? 'text' : 'password'}
                                value={secret}
                                readOnly
                                className="pr-10 font-mono text-sm bg-muted/30 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                                aria-label="Webhook secret key"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground hover:bg-transparent"
                                onClick={() => setIsVisible(!isVisible)}
                                title={isVisible ? "Hide secret" : "Show secret"}
                            >
                                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sr-only">{isVisible ? "Hide secret" : "Show secret"}</span>
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            className="px-4 border-muted-foreground/20 hover:bg-primary/5 hover:border-primary/30 transition-all"
                            onClick={handleCopy}
                            disabled={!secret}
                        >
                            {isCopied ? (
                                <Check className="h-4 w-4 text-success" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                            <span className="ml-2">{isCopied ? "Copied" : "Copy"}</span>
                        </Button>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/20 border border-muted-foreground/10">
                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                        Verification Example (Node.js)
                    </p>
                    <pre className="text-[11px] font-mono p-3 rounded-lg bg-background/50 border border-muted-foreground/10 overflow-x-auto text-muted-foreground whitespace-pre-wrap">
                        {`const signature = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex');`}
                    </pre>
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        onClick={onClose}
                        className="bg-primary/10 hover:bg-primary/20 text-primary border-none shadow-none px-8"
                    >
                        Done
                    </Button>
                </div>
            </div>
        </AnimatedModal>
    );
}
