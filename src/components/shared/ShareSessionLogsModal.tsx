'use client';

import React, { useState } from 'react';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, Check, ExternalLink, Terminal, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { useEnvironment } from '@/contexts/EnvironmentContext';

interface ShareSessionLogsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stationId: string;
    sessionId: string;
    date?: string;
}

export function ShareSessionLogsModal({
    isOpen,
    onClose,
    stationId,
    sessionId,
    date,
}: ShareSessionLogsModalProps) {
    const [copied, setCopied] = useState(false);
    const { environment } = useEnvironment();

    // Build the shareable URL matching requirement:
    // https://scaleev.scaletech.xyz/stations/<stationId>?tab=sessions&date=<date>&sessionId=<sessionId>&env=<env>
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://scaleev.scaletech.xyz';
    const dateParam = date ? `&date=${encodeURIComponent(date)}` : '';
    const envParam = environment ? `&env=${encodeURIComponent(environment.toLowerCase())}` : '';
    const shareUrl = `${baseUrl}/stations/${stationId}?tab=sessions${dateParam}&sessionId=${sessionId}${envParam}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Session logs link copied to clipboard!');
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Failed to copy share link:', err);
            toast.error('Failed to copy link to clipboard');
        }
    };

    const handleOpenLink = () => {
        window.open(shareUrl, '_blank');
    };

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={onClose}
            title="Share Session Logs"
            description="Generate and share a direct link to the OCPP diagnostic logs for this session."
            size="lg"
            footer={
                <div className="flex items-center justify-start w-full">
                    <Button
                        variant="outline"
                        onClick={handleOpenLink}
                        className="h-10 rounded-xl text-xs font-bold gap-2 border-border/40 hover:bg-primary/10 hover:text-primary transition-all"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Open Link in New Tab
                    </Button>
                </div>
            }
        >
            <div className="space-y-6 py-2">
                {/* Session details card */}
                <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                            <Terminal className="h-3.5 w-3.5" /> Session Log Scope
                        </span>
                        {date && (
                            <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary bg-primary/10 gap-1">
                                <Calendar className="h-3 w-3" /> {date}
                            </Badge>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Session ID</p>
                        <p className="font-mono text-sm font-bold text-foreground break-all tracking-tight mt-0.5">
                            {sessionId}
                        </p>
                    </div>
                </div>

                {/* URL Input and Copy Button */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Share2 className="h-3.5 w-3.5 text-primary" /> Shareable Session Link
                    </label>
                    <div className="flex items-center gap-2">
                        <Input
                            readOnly
                            value={shareUrl}
                            className="h-11 font-mono text-xs font-semibold bg-muted/30 border-border/40 rounded-xl select-all focus-visible:ring-primary"
                        />
                        <Button
                            type="button"
                            onClick={handleCopy}
                            className="h-11 px-5 rounded-xl font-bold text-xs gap-2 shrink-0 shadow-md transition-all active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <AnimatePresence mode="wait">
                                {copied ? (
                                    <motion.div
                                        key="check"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Check className="h-4 w-4" />
                                        <span>Copied!</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="copy"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <Copy className="h-4 w-4" />
                                        <span>Copy Link</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium">
                        Anyone with this link will open the Live Logs page with the session automatically filtered.
                    </p>
                </div>
            </div>
        </AnimatedModal>
    );
}
