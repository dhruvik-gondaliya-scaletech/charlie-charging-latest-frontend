'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Plus, Users, ShieldCheck, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { useOcpiCredentials, useOcpiTokens, useOcpiStats } from '@/hooks/get/useOcpi';
import { OcpiCredentialsList } from '../components/OcpiCredentialsList';
import { OcpiTokensList } from '../components/OcpiTokensList';
import { OcpiSessionsList } from '../components/OcpiSessionsList';
import { OcpiCdrsList } from '../components/OcpiCdrsList';
import { OcpiTariffsList } from '../components/OcpiTariffsList';
import { OcpiLocationsList } from '../components/OcpiLocationsList';
import { OcpiCommandConsole } from '../components/OcpiCommandConsole';
import { ConnectPartyModal } from '../components/ConnectPartyModal';
import { StatCard } from '@/features/dashboard/components/StatCard';

export function OcpiContainer() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: credentials, isLoading: isCredentialsLoading } = useOcpiCredentials();
    const { data: tokens, isLoading: isTokensLoading } = useOcpiTokens();
    const { data: stats } = useOcpiStats();

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto"
        >
            {/* Header */}
            <motion.div
                variants={staggerItem}
                className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        OCPI Management
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground tracking-tight">
                        Monitor and manage OCPI roaming connections, credentials, and tokens.
                    </p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold shrink-0"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Connect New Party
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Connected Parties"
                    value={stats?.connectedParties ?? 0}
                    icon={Users}
                    color="text-primary"
                    bottomRightGlobe="bg-primary"
                    description="Active OCPI handshakes"
                />
                <StatCard
                    title="Remote Tokens"
                    value={stats?.tokenCount ?? 0}
                    icon={ShieldCheck}
                    color="text-amber-500"
                    bottomRightGlobe="bg-amber-500"
                    description="Whitelisted roaming tokens"
                />
                <StatCard
                    title="Protocol"
                    value="OCPI 2.2.1"
                    icon={Share2}
                    color="text-green-500"
                    bottomRightGlobe="bg-green-500"
                    description="CPO role active"
                />
                <StatCard
                    title="Roaming Sessions"
                    value={stats?.connectedParties ?? 0}
                    icon={Activity}
                    color="text-blue-500"
                    bottomRightGlobe="bg-blue-500"
                    description="Current OCPI sessions"
                />
            </motion.div>

            {/* Tabs */}
            <motion.div variants={staggerItem}>
                <Tabs defaultValue="credentials" className="space-y-4">
                    <TabsList className="bg-background/50 backdrop-blur-sm border p-1 rounded-xl">
                        <TabsTrigger value="credentials" className="rounded-lg px-6">Connected Parties</TabsTrigger>
                        <TabsTrigger value="tokens" className="rounded-lg px-6">Roaming Tokens</TabsTrigger>
                        <TabsTrigger value="sessions" className="rounded-lg px-6">Roaming Sessions</TabsTrigger>
                        <TabsTrigger value="cdrs" className="rounded-lg px-6">Billing (CDRs)</TabsTrigger>
                        <TabsTrigger value="tariffs" className="rounded-lg px-6">Tariffs</TabsTrigger>
                        <TabsTrigger value="locations" className="rounded-lg px-6">Locations</TabsTrigger>
                        <TabsTrigger value="commands" className="rounded-lg px-6 text-rose-500 font-bold">Command Console</TabsTrigger>
                    </TabsList>

                    <TabsContent value="credentials" className="pt-2">
                        <OcpiCredentialsList credentials={credentials} isLoading={isCredentialsLoading} />
                    </TabsContent>

                    <TabsContent value="tokens" className="pt-2">
                        <OcpiTokensList tokens={tokens} isLoading={isTokensLoading} />
                    </TabsContent>

                    <TabsContent value="sessions" className="pt-2">
                        <OcpiSessionsList />
                    </TabsContent>

                    <TabsContent value="cdrs" className="pt-2">
                        <OcpiCdrsList />
                    </TabsContent>

                    <TabsContent value="tariffs" className="pt-2">
                        <OcpiTariffsList />
                    </TabsContent>

                    <TabsContent value="locations" className="pt-2">
                        <OcpiLocationsList />
                    </TabsContent>

                    <TabsContent value="commands" className="pt-2">
                        <OcpiCommandConsole />
                    </TabsContent>
                </Tabs>
            </motion.div>

            <ConnectPartyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </motion.div>
    );
}
