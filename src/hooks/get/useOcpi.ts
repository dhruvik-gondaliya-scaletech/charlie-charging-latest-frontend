import { useQuery } from '@tanstack/react-query';
import { ocpiService, OcpiSessionsParams } from '@/services/ocpi.service';

export const useOcpiCredentials = (params?: OcpiSessionsParams) => {
    return useQuery({
        queryKey: ['ocpi-credentials', params],
        queryFn: () => ocpiService.getCredentials(params),
        staleTime: 30000,
    });
};

export const useOcpiTokens = (params?: OcpiSessionsParams) => {
    return useQuery({
        queryKey: ['ocpi-tokens', params],
        queryFn: () => ocpiService.getTokens(params),
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

export const useOcpiTariffs = (params?: OcpiSessionsParams) => {
    return useQuery({
        queryKey: ['ocpi-tariffs', params],
        queryFn: () => ocpiService.getTariffs(params),
        staleTime: 60000,
    });
};

export const useOcpiLocations = (params?: OcpiSessionsParams) => {
    return useQuery({
        queryKey: ['ocpi-locations', params],
        queryFn: () => ocpiService.getLocations(params),
        staleTime: 60000,
    });
};

