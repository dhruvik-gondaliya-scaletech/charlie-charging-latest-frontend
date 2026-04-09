import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ocpiService, OcpiStartSessionRequest, OcpiStopSessionRequest, OcpiUnlockConnectorRequest } from '@/services/ocpi.service';
import { toast } from 'sonner';

export const useGenerateOcpiToken = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ url, email }: { url: string; email?: string }) =>
            ocpiService.generateRegistrationToken(url, email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ocpi-credentials'] });
            queryClient.invalidateQueries({ queryKey: ['ocpi-stats'] });
            toast.success('Registration token (Token A) generated successfully');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to generate token';
            toast.error(errorMessage);
        },
    });
};

export const useSyncAllOcpi = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => ocpiService.syncAll(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ocpi-locations'] });
            queryClient.invalidateQueries({ queryKey: ['ocpi-sessions'] });
            queryClient.invalidateQueries({ queryKey: ['ocpi-tariffs'] });
            queryClient.invalidateQueries({ queryKey: ['ocpi-cdrs'] });
            toast.success('Full OCPI synchronization triggered successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to trigger sync: ${error.message}`);
        },
    });
};

export const useSyncTokensOcpi = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => ocpiService.syncTokens(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['ocpi-tokens'] });
            queryClient.invalidateQueries({ queryKey: ['ocpi-stats'] });
            toast.success(`Successfully pulled ${data.pulled || 0} roaming tokens`);
        },
        onError: (error: any) => {
            toast.error(`Failed to pull tokens: ${error.message}`);
        },
    });
};

export const useDeleteOcpiCredential = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ocpiService.deleteCredential(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ocpi-credentials'] });
            queryClient.invalidateQueries({ queryKey: ['ocpi-stats'] });
            toast.success('OCPI connection deleted successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to delete connection: ${error.message}`);
        },
    });
};

export const useOcpiCommands = () => {
    const queryClient = useQueryClient();

    const startSession = useMutation({
        mutationFn: (data: OcpiStartSessionRequest) => ocpiService.startRemoteSession(data),
        onSuccess: () => {
            toast.success('Remote start command sent successfully');
            queryClient.invalidateQueries({ queryKey: ['ocpi-sessions'] });
        },
        onError: (error: any) => {
            toast.error(`Failed to send start command: ${error.message}`);
        },
    });

    const stopSession = useMutation({
        mutationFn: (data: OcpiStopSessionRequest) => ocpiService.stopRemoteSession(data),
        onSuccess: () => {
            toast.success('Remote stop command sent successfully');
            queryClient.invalidateQueries({ queryKey: ['ocpi-sessions'] });
        },
        onError: (error: any) => {
            toast.error(`Failed to send stop command: ${error.message}`);
        },
    });


    const unlockConnector = useMutation({
        mutationFn: (data: OcpiUnlockConnectorRequest) => ocpiService.unlockConnector(data),
        onSuccess: () => {
            toast.success('Unlock connector command sent successfully');
            queryClient.invalidateQueries({ queryKey: ['ocpi-locations'] });
        },
        onError: (error: any) => {
            toast.error(`Failed to send unlock command: ${error.message}`);
        },
    });

    return { startSession, stopSession, unlockConnector };
};
