import { useQuery } from '@tanstack/react-query';
import { ocpiService, OcpiSessionsParams } from '@/services/ocpi.service';

export const useOcpiCredentials = () => {
    return useQuery({
        queryKey: ['ocpi-credentials'],
        queryFn: () => ocpiService.getCredentials(),
        staleTime: 30000,
    });
};

export const useOcpiTokens = () => {
    return useQuery({
        queryKey: ['ocpi-tokens'],
        queryFn: () => ocpiService.getTokens(),
        staleTime: 30000,
    });
};

export const useOcpiSessions = (params?: OcpiSessionsParams) => {
    return useQuery({
        queryKey: ['ocpi-sessions', params],
        queryFn: () => ocpiService.getSessions(params),
        staleTime: 15000,
    });
};

export const useOcpiStats = () => {
    return useQuery({
        queryKey: ['ocpi-stats'],
        queryFn: () => ocpiService.getStats(),
        staleTime: 30000,
    });
};

export const useOcpiCdrs = (params?: OcpiSessionsParams) => {
    return useQuery({
        queryKey: ['ocpi-cdrs', params],
        queryFn: () => ocpiService.getCdrs(params),
        staleTime: 60000,
    });
};

export const useOcpiTariffs = () => {
    return useQuery({
        queryKey: ['ocpi-tariffs'],
        queryFn: () => ocpiService.getTariffs(),
        staleTime: 60000,
    });
};

export const useOcpiLocations = () => {
    return useQuery({
        queryKey: ['ocpi-locations'],
        queryFn: () => ocpiService.getLocations(),
        staleTime: 60000,
    });
};
