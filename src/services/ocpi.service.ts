import { API_CONFIG } from "@/constants/constants";
import httpService from "@/lib/http-service";

export interface OcpiCredential {
    id: string;
    token_a?: string;
    token_b?: string;
    token_c?: string;
    url: string;
    countryCode: string;
    partyId: string;
    roles: any[];
    endpoints: any[];
    createdAt: string;
    updatedAt: string;
}

export interface OcpiToken {
    uid: string;
    type: string;
    authId: string;
    visualNumber?: string;
    issuer: string;
    allowed: boolean;
    whitelist: string;
    lastUpdated: string;
}

export const ocpiService = {
    getCredentials: () => httpService.get<OcpiCredential[]>(API_CONFIG.endpoints.ocpi.credentials),

    generateRegistrationToken: (url: string) =>
        httpService.post<OcpiCredential>(API_CONFIG.endpoints.ocpi.generateToken, { url }),

    getTokens: () => httpService.get<OcpiToken[]>(API_CONFIG.endpoints.ocpi.tokens),

    getSessions: () => httpService.get<any[]>(API_CONFIG.endpoints.ocpi.sessions),

    getStats: () => httpService.get<{ tokenCount: number; connectedParties: number }>(API_CONFIG.endpoints.ocpi.stats),
};
