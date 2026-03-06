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

export interface OcpiSession {
    id: string;
    party_id: string;
    country_code: string;
    location_id: string;
    evse_uid?: string;
    kwh: number;
    status: string;
    start_date_time: string;
    end_date_time?: string;
    auth_id?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface OcpiSessionsParams {
    page?: number;
    pageSize?: number;
    search?: string;
}

export const ocpiService = {
    getCredentials: () => httpService.get<OcpiCredential[]>(API_CONFIG.endpoints.ocpi.credentials),

    generateRegistrationToken: (url: string) =>
        httpService.post<OcpiCredential>(API_CONFIG.endpoints.ocpi.generateToken, { url }),

    getTokens: () => httpService.get<OcpiToken[]>(API_CONFIG.endpoints.ocpi.tokens),

    getSessions: (params?: OcpiSessionsParams) => {
        const qp = new URLSearchParams();
        if (params?.page !== undefined) qp.set('page', String(params.page));
        if (params?.pageSize !== undefined) qp.set('pageSize', String(params.pageSize));
        if (params?.search) qp.set('search', params.search);
        const qs = qp.toString();
        const url = `${API_CONFIG.endpoints.ocpi.sessions}${qs ? `?${qs}` : ''}`;
        return httpService.get<PaginatedResponse<OcpiSession>>(url);
    },

    getStats: () => httpService.get<{ tokenCount: number; connectedParties: number }>(API_CONFIG.endpoints.ocpi.stats),
};
