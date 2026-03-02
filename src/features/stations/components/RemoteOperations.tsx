'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Square, Loader2, Zap, AlertCircle } from 'lucide-react';
import { useRemoteStart, useRemoteStop } from '@/hooks/delete/useStationMutations';
import { Station, ChargingStatus } from '@/types';
import { toast } from 'sonner';
import { AnimatedModal } from '@/components/shared/AnimatedModal';

interface RemoteOperationsProps {
    station: Station;
}

export function RemoteOperations({ station }: RemoteOperationsProps) {
    const [idTag, setIdTag] = useState('ADMIN_TAG');
    const [connectorId, setConnectorId] = useState(1);
    const [userId, setUserId] = useState('admin-user');
    const [isStopModalOpen, setIsStopModalOpen] = useState(false);
    const [stopTransactionId, setStopTransactionId] = useState('');

    const remoteStart = useRemoteStart();
    const remoteStop = useRemoteStop();

    const handleStart = () => {
        remoteStart.mutate({
            id: station.id,
            connectorId,
            idTag,
            userId,
        });
    };

    const handleStop = () => {
        setIsStopModalOpen(true);
    };

    const confirmStop = () => {
        if (!stopTransactionId) {
            toast.error('Please enter a Transaction ID');
            return;
        }

        remoteStop.mutate({
            id: station.id,
            transactionId: parseInt(stopTransactionId),
        }, {
            onSuccess: () => {
                setIsStopModalOpen(false);
                setStopTransactionId('');
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label>ID Tag (RFID)</Label>
                    <Input
                        value={idTag}
                        onChange={(e) => setIdTag(e.target.value)}
                        placeholder="e.g. AB123456"
                        className="font-mono text-xs uppercase"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Connector ID</Label>
                    <Input
                        type="number"
                        value={connectorId}
                        onChange={(e) => setConnectorId(parseInt(e.target.value))}
                        min={1}
                        max={station.connectorCount}
                    />
                </div>
                <div className="space-y-2">
                    <Label>User Context ID</Label>
                    <Input
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="User ID"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-border/40">
                <Button
                    onClick={handleStart}
                    disabled={remoteStart.isPending || station.status === ChargingStatus.OFFLINE}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 font-bold"
                >
                    {remoteStart.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Play className="h-4 w-4 mr-2 fill-current" />
                    )}
                    Remote Start
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleStop}
                    disabled={remoteStop.isPending || station.status === ChargingStatus.OFFLINE}
                    className="shadow-lg shadow-destructive/20 font-bold"
                >
                    {remoteStop.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Square className="h-4 w-4 mr-2 fill-current" />
                    )}
                    Remote Stop
                </Button>

                {station.status === ChargingStatus.OFFLINE && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                        <Zap className="h-3 w-3" />
                        Station is offline. Remote commands unavailable.
                    </div>
                )}
            </div>

            <AnimatedModal
                isOpen={isStopModalOpen}
                onClose={() => setIsStopModalOpen(false)}
                title="Remote Stop Transaction"
                description="Manually stop a charging session by providing its Transaction ID."
                size="md"
                footer={
                    <div className="flex gap-3 justify-end w-full">
                        <Button variant="outline" onClick={() => setIsStopModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmStop}
                            disabled={remoteStop.isPending || !stopTransactionId}
                            className="font-bold"
                        >
                            {remoteStop.isPending ? 'Stopping...' : 'Stop Transaction'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-medium">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p>This will send a remote stop command to the station. Please ensure the Transaction ID is correct.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="stop-transaction-id" className="font-bold">Transaction ID*</Label>
                        <Input
                            id="stop-transaction-id"
                            type="number"
                            placeholder="e.g. 123456"
                            value={stopTransactionId}
                            onChange={(e) => setStopTransactionId(e.target.value)}
                            className="bg-muted/30 py-6"
                            autoFocus
                        />
                    </div>
                </div>
            </AnimatedModal>
        </div>
    );
}
