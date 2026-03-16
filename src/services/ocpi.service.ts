import { API_CONFIG } from "@/constants/constants";
import httpService from "@/lib/http-service";

export interface OcpiRole {
    role: 'CPO' | 'EMSP' | 'HUB' | 'NAP' | 'NSP' | 'OTH' | 'SC' | 'TO';
    business_details: {
        name: string;
        website?: string;
        logo?: {
            url: string;
            thumbnail?: string;
            category?: string;
            type?: string;
            width?: number;
            height?: number;
        };
    };
    party_id: string;
    country_code: string;
}

export interface OcpiEndpoint {
    identifier: string;
    role: string;
    url: string;
}

export interface OcpiCredential {
    id: string;
    token_a?: string;
    token_b?: string;
    token_c?: string;
    url: string;
    countryCode: string;
    partyId: string;
    roles: OcpiRole[];
    endpoints: OcpiEndpoint[];
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

export interface OcpiCdr {
    id: string;
    party_id: string;
    country_code: string;
    location_id: string;
    total_energy: number;
    total_time: number;
    total_cost: {
        excl_vat: number;
        incl_vat: number;
    };
    last_updated: string;
}

export interface OcpiTariff {
    id: string;
    party_id: string;
    country_code: string;
    currency: string;
    elements: Array<{
        price_components: Array<{
            type: string;
            price: number;
            step_size: number;
        }>;
    }>;
    last_updated: string;
}

export interface OcpiConnector {
    id: string;
    standard: string;
    format: string;
    power_type: string;
    max_voltage: number;
    max_amperage: number;
    max_electric_power: number;
    tariff_ids?: string[];
    last_updated: string;
}

export interface OcpiEvse {
    uid: string;
    evse_id?: string;
    status: string;
    connectors: OcpiConnector[];
    last_updated: string;
}

export interface OcpiLocation {
    id: string;
    name: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
    coordinates: {
        latitude: string;
        longitude: string;
    };
    evses: OcpiEvse[];
    last_updated: string;
}

export interface OcpiStartSessionRequest {
    response_url?: string;
    token: {
        uid: string;
        type: string;
        auth_id?: string;
        visual_number?: string;
        issuer?: string;
        allowed?: string;
    };
    location_id?: string;
    evse_uid?: string;
    evse_id?: string;
    connector_id?: string;
    authorization_reference?: string;
}

export interface OcpiStopSessionRequest {
    response_url?: string;
    session_id?: string;
    evse_uid?: string;
    evse_id?: string;
    location_id?: string;
}

export interface OcpiUnlockConnectorRequest {
    response_url?: string;
    location_id?: string;
    evse_uid?: string;
    evse_id?: string;
    connector_id?: string;
}

export interface OcpiCommandResponse {
    result: 'ACCEPTED' | 'REJECTED' | 'UNKNOWN' | 'NOT_SUPPORTED';
    timeout: number;
    message?: string;
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
    getCredentials: (params?: OcpiSessionsParams) => {
        const qp = new URLSearchParams();
        if (params?.page !== undefined) qp.set('page', String(params.page));
        if (params?.pageSize !== undefined) qp.set('pageSize', String(params.pageSize));
        if (params?.search) qp.set('search', params.search);
        const qs = qp.toString();
        const url = `${API_CONFIG.endpoints.ocpi.credentials}${qs ? `?${qs}` : ''}`;
        return httpService.get<PaginatedResponse<OcpiCredential>>(url);
    },


    generateRegistrationToken: (url: string, email?: string) =>
        httpService.post<OcpiCredential>(API_CONFIG.endpoints.ocpi.generateToken, { url, email }),

    getTokens: (params?: OcpiSessionsParams) => {
        const qp = new URLSearchParams();
        if (params?.page !== undefined) qp.set('page', String(params.page));
        if (params?.pageSize !== undefined) qp.set('pageSize', String(params.pageSize));
        if (params?.search) qp.set('search', params.search);
        const qs = qp.toString();
        const url = `${API_CONFIG.endpoints.ocpi.tokens}${qs ? `?${qs}` : ''}`;
        return httpService.get<PaginatedResponse<OcpiToken>>(url);
    },


    getSessions: (params?: OcpiSessionsParams) => {
        const qp = new URLSearchParams();
        if (params?.page !== undefined) qp.set('page', String(params.page));
        if (params?.pageSize !== undefined) qp.set('pageSize', String(params.pageSize));
        if (params?.search) qp.set('search', params.search);
        const qs = qp.toString();
        const url = `${API_CONFIG.endpoints.ocpi.sessions}${qs ? `?${qs}` : ''}`;
        return httpService.get<PaginatedResponse<OcpiSession>>(url);
    },

    getCdrs: (params?: OcpiSessionsParams) => {
        const qp = new URLSearchParams();
        if (params?.page !== undefined) qp.set('page', String(params.page));
        if (params?.pageSize !== undefined) qp.set('pageSize', String(params.pageSize));
        if (params?.search) qp.set('search', params.search);
        const qs = qp.toString();
        const url = `${API_CONFIG.endpoints.ocpi.cdrs}${qs ? `?${qs}` : ''}`;
        return httpService.get<PaginatedResponse<OcpiCdr>>(url);
    },

    getTariffs: (params?: OcpiSessionsParams) => {
        const qp = new URLSearchParams();
        if (params?.page !== undefined) qp.set('page', String(params.page));
        if (params?.pageSize !== undefined) qp.set('pageSize', String(params.pageSize));
        if (params?.search) qp.set('search', params.search);
        const qs = qp.toString();
        const url = `${API_CONFIG.endpoints.ocpi.tariffs}${qs ? `?${qs}` : ''}`;
        return httpService.get<PaginatedResponse<OcpiTariff>>(url);
    },


    getLocations: (params?: OcpiSessionsParams) => {
        const qp = new URLSearchParams();
        if (params?.page !== undefined) qp.set('page', String(params.page));
        if (params?.pageSize !== undefined) qp.set('pageSize', String(params.pageSize));
        if (params?.search) qp.set('search', params.search);
        const qs = qp.toString();
        const url = `${API_CONFIG.endpoints.ocpi.locations}${qs ? `?${qs}` : ''}`;
        return httpService.get<PaginatedResponse<OcpiLocation>>(url);
    },


    syncAll: () => httpService.post<{ success: boolean }>(API_CONFIG.endpoints.ocpi.syncAll, {}),

    syncTokens: () => httpService.post<{ success: boolean; pulled: number }>(API_CONFIG.endpoints.ocpi.syncTokens, {}),

    deleteCredential: (id: string) => httpService.post<{ success: boolean }>(API_CONFIG.endpoints.ocpi.deleteCredential(id), {}),

    startRemoteSession: (data: OcpiStartSessionRequest) =>
        httpService.post<OcpiCommandResponse>(API_CONFIG.endpoints.ocpi.commands.start, data),

    stopRemoteSession: (data: OcpiStopSessionRequest) =>
        httpService.post<OcpiCommandResponse>(API_CONFIG.endpoints.ocpi.commands.stop, data),

    unlockConnector: (data: OcpiUnlockConnectorRequest) =>
        httpService.post<OcpiCommandResponse>(API_CONFIG.endpoints.ocpi.commands.unlock, data),

    getStats: () => httpService.get<{ tokenCount: number; connectedParties: number }>(API_CONFIG.endpoints.ocpi.stats),
};
