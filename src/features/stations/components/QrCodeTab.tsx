'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { useTenantConfig } from '@/hooks/get/useTenantConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, ExternalLink, QrCode as QrCodeIcon, Check, Loader2, Info, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';

interface QrCodeTabProps {
    station: any;
}

export function QrCodeTab({ station }: QrCodeTabProps) {
    const { data: config, isLoading } = useTenantConfig();
    const [copied, setCopied] = useState(false);

    const BASE_DOMAIN = 'scaleev.scaletech.xyz';
    const domain = config?.domain;
    const hasDomain = domain && domain.trim() !== '';
    const qrUrl = `https://${domain}.${BASE_DOMAIN}/stations/qr/${station.id}`;

    const handleCopy = () => {
        if (!hasDomain) return;
        navigator.clipboard.writeText(qrUrl);
        setCopied(true);
        toast.success('URL copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const svg = document.getElementById('station-qr-code');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = 1024;
            canvas.height = 1024;
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 50, 50, 924, 924);

                const pngFile = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.download = `${station.name}-QR.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
                toast.success('QR Code downloaded');
            }
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!hasDomain) {
        return (
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="w-full">
                <Card className="border-border/40 rounded-[2rem] overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-destructive/10 text-destructive shadow-sm">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black tracking-tight text-destructive/90">
                                    QR Generation Blocked
                                </CardTitle>
                                <CardDescription className="text-sm font-medium opacity-80">
                                    Missing driver application domain configuration
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-destructive/5 flex items-center justify-center mb-6 border border-destructive/10">
                            <QrCodeIcon className="h-10 w-10 text-destructive/40" />
                        </div>

                        <div className="space-y-3 max-w-md mb-8">
                            <h3 className="text-xl font-bold text-foreground">Domain Not Configured</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                We cannot generate a station QR code because no domain has been set for your driver application. This domain is required to create a valid scan destination.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <Button asChild size="lg" className="rounded-2xl px-8 h-14 font-black gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                                <Link href="/drivers">
                                    Configure Drivers
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-10 p-4 rounded-2xl bg-muted/30 border border-border/40 max-w-sm flex gap-3 text-left">
                            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground leading-normal">
                                Once you set a domain in the drivers section, return here to instantly generate and download station-specific QR codes.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="w-full">
            <Card className="border-border/40 bg-card/20 backdrop-blur-md rounded-[2rem] overflow-hidden border shadow-xl">
                <CardHeader className="pb-2 border-b border-border/10 bg-muted/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/15 text-primary shadow-inner">
                            <QrCodeIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                                Station QR Code
                            </CardTitle>
                            <CardDescription className="text-sm font-medium opacity-80">
                                Management & deployment tools for physical station access
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/10">
                        {/* QR Code Section */}
                        <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-gradient-to-b from-transparent to-muted/5">
                            <div className="relative group w-full max-w-[280px] sm:max-w-[320px]">
                                <div className="absolute -inset-6 bg-gradient-to-tr from-primary/30 to-violet-500/30 rounded-[3rem] blur-3xl opacity-40 group-hover:opacity-70 transition-all duration-500" />
                                <div className="relative bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 ring-1 ring-black/5">
                                    <QRCode
                                        id="station-qr-code"
                                        value={qrUrl}
                                        size={512}
                                        level="H"
                                        className="h-auto w-full"
                                        style={{ maxWidth: "100%" }}
                                    />
                                    <div className="mt-4 flex justify-center">
                                        <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80">High Resolution</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-8 text-xs text-center text-muted-foreground font-medium max-w-[240px]">
                                Unique identifier: <span className="font-mono text-primary">{station.id}</span>
                            </p>
                        </div>

                        {/* Actions Section */}
                        <div className="flex flex-col p-6 sm:p-10 space-y-8 bg-muted/5 lg:bg-transparent">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Direct Scan URL</h4>
                                </div>
                                <div className="flex items-center gap-2 p-1.5 pl-4 rounded-[1.25rem] bg-background/50 border border-border/40 hover:border-primary/30 transition-colors group">
                                    <code className="flex-1 text-sm font-mono truncate text-foreground/80 group-hover:text-primary transition-colors">
                                        {qrUrl}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={handleCopy}
                                        className="rounded-xl font-bold h-9 px-4 gap-2 shadow-sm border border-border/20 active:scale-95 transition-all"
                                    >
                                        {copied ? (
                                            <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</>
                                        ) : (
                                            <><Copy className="h-3.5 w-3.5" /> Copy</>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Description</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Deploy this QR code at <strong>{station.name}</strong>. When scanned, it instantly identifies the station and guides the driver to the charging setup.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    <Button
                                        onClick={handleDownload}
                                        className="rounded-2xl font-black gap-2.5 h-14 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                                    >
                                        <Download className="h-5 w-5" />
                                        Download PNG
                                    </Button>
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="rounded-2xl font-black gap-2.5 h-14 bg-background hover:bg-muted/50 border-2 active:scale-[0.98] transition-all"
                                    >
                                        <a href={qrUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-5 w-5" />
                                            Link
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-auto pt-6">
                                <div className="p-5 rounded-[1.5rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 relative overflow-hidden group">
                                    <div className="flex items-center gap-2 text-primary mb-2">
                                        <div className="p-1 rounded-lg bg-primary/20">
                                            <QrCodeIcon className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Printing Specs</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                        For optimal scanning reliability in all conditions, print at <span className="text-foreground font-bold">10x10cm</span> minimum on <span className="text-foreground font-bold">non-reflective</span>, UV-resistant material.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

