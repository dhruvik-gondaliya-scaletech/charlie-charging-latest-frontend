import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Terminal } from 'lucide-react';
import { WEBSOCKET_CONFIG } from '@/constants/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface WebSocketUrlDisplayProps {
    chargePointId: string;
    tenantId: string;
}

export default function WebSocketUrlDisplay({ chargePointId, tenantId }: WebSocketUrlDisplayProps) {
    const [copied, setCopied] = useState(false);

    // Construct the WebSocket URL: ws://host:port/ocpp/{tenantId}/{chargePointId}
    const wsUrl = `${WEBSOCKET_CONFIG.ocppUrl}/${tenantId}/${chargePointId}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(wsUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex gap-4 items-start">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Terminal className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary">OCPP Connection Endpoint</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Use this secure WebSocket URL to configure your hardware. The charge point will use this persistent connection to communicate with the CSMS management platform.
                    </p>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-violet-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex gap-2 bg-background/50 backdrop-blur-md border border-border/40 p-2 rounded-2xl items-center shadow-xl">
                    <div className="flex-1 px-4 py-2 font-mono text-xs text-primary/80 truncate select-all">
                        {wsUrl}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleCopy}
                        className="h-10 w-10 shrink-0 rounded-xl hover:bg-primary/10 transition-colors"
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
                                    <Copy className="h-4 w-4" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                Protocol version standard: OCPP 1.6-J / 2.0.1
            </div>
        </div>
    );
}
