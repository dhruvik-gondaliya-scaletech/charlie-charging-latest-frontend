'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
    value: string;
    className?: string;
    iconClassName?: string;
    toastMessage?: string;
}

export function CopyButton({ value, className, iconClassName, toastMessage }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click or modal toggle trigger
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            if (toastMessage) {
                toast.success(toastMessage);
            }
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy to clipboard');
        }
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={cn(
                "h-6 w-6 shrink-0 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                className
            )}
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Check className={cn("h-3.5 w-3.5 text-emerald-500", iconClassName)} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="copy"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Copy className={cn("h-3.5 w-3.5", iconClassName)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    );
}
