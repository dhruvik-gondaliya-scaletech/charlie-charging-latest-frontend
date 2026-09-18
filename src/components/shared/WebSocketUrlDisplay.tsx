import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Terminal, Key, Fingerprint } from 'lucide-react';
import { WEBSOCKET_CONFIG } from '@/constants/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface WebSocketUrlDisplayProps {
    chargePointId: string;
    serialNumber?: string;
    tenantSlug?: string;
    password?: string;
}

export default function WebSocketUrlDisplay({ chargePointId, serialNumber, tenantSlug, password }: WebSocketUrlDisplayProps) {
    const [copied, setCopied] = useState(false);
    const [passwordCopied, setPasswordCopied] = useState(false);
    const [identityCopied, setIdentityCopied] = useState(false);

    // Clean WebSocket URL: wss://ocpp.scaleev.xyz
    const wsUrl = WEBSOCKET_CONFIG.ocppUrl.replace(/\/ocpp\/?$/, '');
    const identityValue = serialNumber || chargePointId;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(wsUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleIdentityCopy = async () => {
        try {
            await navigator.clipboard.writeText(identityValue);
            setIdentityCopied(true);
            setTimeout(() => setIdentityCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy identity:', err);
        }
    };

    const handlePasswordCopy = async () => {
        try {
            await navigator.clipboard.writeText(password || '');
            setPasswordCopied(true);
            setTimeout(() => setPasswordCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy password:', err);
        }
    };

    return (
        <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
                Configure your hardware's network settings using the credentials below. The charge point will use these to maintain a persistent secure connection to the CSMS.
            </p>

            <div className="space-y-2.5">
                <CopyableFieldRow
                    icon={Terminal}
                    title="Connection Endpoint"
                    description="The secure WebSocket URL"
                    value={wsUrl}
                    colorClass="bg-primary/10 text-primary"
                    copied={copied}
                    onCopy={handleCopy}
                />

                <CopyableFieldRow
                    icon={Fingerprint}
                    title="Connection Identity"
                    description="Charge Point Identity / Station ID"
                    value={identityValue}
                    colorClass="bg-blue-500/10 text-blue-500"
                    copied={identityCopied}
                    onCopy={handleIdentityCopy}
                />

                {password && (
                    <CopyableFieldRow
                        icon={Key}
                        title="Connection Password"
                        description="Basic Auth / Authorization Key"
                        value={password}
                        colorClass="bg-violet-500/10 text-violet-400"
                        copied={passwordCopied}
                        onCopy={handlePasswordCopy}
                    />
                )}
            </div>

            <div className="flex items-center gap-2 px-1 pt-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Protocol version standard: OCPP 1.6-J / 2.0.1
            </div>
        </div>
    );
}

const CopyableFieldRow = ({
    icon: Icon,
    title,
    description,
    value,
    colorClass,
    copied,
    onCopy,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    value: string;
    colorClass: string;
    copied: boolean;
    onCopy: () => void;
}) => (
    <div className="flex flex-col p-4 bg-background/40 hover:bg-background/60 border border-border/40 rounded-xl gap-3 transition-colors group">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/90">{title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-2 bg-background/80 border border-border/50 group-hover:border-border/80 rounded-lg p-1.5 pl-3 transition-colors shadow-sm w-full">
            <span className="font-mono text-xs text-foreground/80 truncate flex-1 select-all">{value}</span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onCopy}
                className="h-8 w-8 rounded-md hover:bg-foreground/5 transition-colors shrink-0"
            >
                <AnimatePresence mode="wait">
                    {copied ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <Check className="h-4 w-4 text-emerald-500" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="copy"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground/70 transition-colors" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Button>
        </div>
    </div>
);
