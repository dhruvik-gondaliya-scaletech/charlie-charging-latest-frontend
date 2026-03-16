export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000"),
    endpoints: {
        auth: {
            login: "/auth/login",
            register: "/auth/register",
            verifyEmail: "/auth/verify-email",
            resendVerification: "/auth/resend-verification",
            inviteUser: "/auth/invite",
            acceptInvitation: "/auth/accept-invitation",
        },
        users: {
            base: "/users",
            profile: "/users/profile",
            changePassword: "/users/change-password",
        },
        stations: {
            base: "/stations",
            byId: (id: string) => `/stations/${id}`,
            remoteStart: (id: string) => `/stations/${id}/remote-start`,
            remoteStop: (id: string) => `/stations/${id}/remote-stop`,
            configuration: (id: string) => `/stations/${id}/configuration`,
            setConfiguration: (id: string) => `/stations/${id}/configuration`,
            ocppLogs: (id: string) => `/ocpp-logs?stationId=${id}`,
            sessions: (id: string) => `/stations/${id}/sessions`,
        },
        locations: {
            base: "/locations",
            byId: (id: string) => `/locations/${id}`,
        },
        webhooks: {
            base: "/webhooks",
            byId: (id: string) => `/webhooks/${id}`,
            secret: (id: string) => `/webhooks/${id}/secret`,
            deliveries: "/webhooks/deliveries/all",
            retry: (deliveryId: string) => `/webhooks/deliveries/${deliveryId}/retry`,
        },
        sessions: {
            base: "/sessions",
            byId: (id: string) => `/sessions/${id}`,
            byStation: (stationId: string) => `/sessions/station/${stationId}`,
            active: (stationId: string) => `/sessions/station/${stationId}/active`,
        },
        dashboard: {
            base: "/dashboard",
            stats: "/dashboard/stats",
            activity: "/dashboard/activity",
        },
        tenants: {
            base: "/tenants",
            byId: (id: string) => `/tenants/${id}`,
            activate: (id: string) => `/tenants/${id}/activate`,
            deactivate: (id: string) => `/tenants/${id}/deactivate`,
            regenerateSecret: (id: string) => `/tenants/${id}/regenerate-api-secret`,
        },
        ocpi: {
            credentials: "/ocpi/mgmt/credentials",
            deleteCredential: (id: string) => `/ocpi/mgmt/credentials/${id}/delete`,
            generateToken: "/ocpi/mgmt/credentials/generate-token",
            syncAll: "/ocpi/mgmt/sync-all",
            syncTokens: "/ocpi/mgmt/sync-tokens",
            tokens: "/ocpi/mgmt/tokens",
            sessions: "/ocpi/mgmt/sessions",
            cdrs: "/ocpi/mgmt/cdrs",
            tariffs: "/ocpi/mgmt/tariffs",
            locations: "/ocpi/mgmt/locations",
            commands: {
                start: "/ocpi/mgmt/commands/start",
                stop: "/ocpi/mgmt/commands/stop",
                unlock: "/ocpi/mgmt/commands/unlock",
            },
            stats: "/ocpi/mgmt/stats",
        },
        brands: {
            base: "/brands",
        }
    }
}

export const FRONTEND_ROUTES = {
    DASHBOARD: "/dashboard",
    LOCATIONS: "/locations",
    LOCATIONS_NEW: "/locations/new",
    LOCATIONS_DETAILS: (id: string) => `/locations/${id}`,
    LOCATIONS_EDIT: (id: string) => `/locations/${id}/edit`,
    STATIONS: "/stations",
    STATIONS_REGISTER: "/stations/register",
    STATIONS_DETAILS: (id: string) => `/stations/${id}`,
    STATIONS_EDIT: (id: string) => `/stations/${id}/edit`,
    SESSIONS: "/sessions",
    TENANTS: "/tenants",
    WEBHOOKS: "/webhooks",
    WEBHOOKS_LOGS: (id: string) => `/webhooks/${id}/logs`,
    OCPI: "/ocpi",
    REGISTER: "/register",
    LOGIN: "/login",
    PROFILE: "/profile",
    USERS: "/users",
    VERIFY_EMAIL: "/verify-email",
    ACCEPT_INVITE: "/accept-invitation",
}

export const AUTH_CONFIG = {
    tokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || "csms_auth_token",
    userKey: process.env.NEXT_PUBLIC_AUTH_USER_KEY || "csms_user",
    tenantKey: process.env.NEXT_PUBLIC_AUTH_TENANT_KEY || "csms_tenant",
}

export const WEBSOCKET_CONFIG = {
    url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000",
    ocppUrl: process.env.NEXT_PUBLIC_CSMS_WEBSOCKET_BASE_URL || "ws://localhost:9220/ocpp",
}

export const CONNECTOR_OPTIONS = [{
    type: "CHAdeMO",
    label: "CHAdeMO",
    description: "Japanese standard"
},
{
    type: "Type2",
    label: "Type 2",
    description: "European AC"
},
{
    type: "CCS",
    label: "CCS",
    description: "Combined Charging System"
},
{
    type: "Type1",
    label: "type1",
    description: "North American standard"
},
{
    type: "COMMANDO",
    label: "Commando",
    description: "Industrial connector"
},
{
    type: "3PIN",
    label: "3-Pin",
    description: "Three-pin connector"
},
{
    type: "SCHUKO",
    label: "Schuko",
    description: "European standard"
},
{
    type: "TYPE3",
    label: "Type 3",
    description: "European standard"
},
{
    type: "NACS",
    label: "NACS",
    description: "North American standard"
},
{
    type: "CCS1",
    label: "CCS1",
    description: "Combined Charging System"
},
{
    type: "MCS",
    label: "MCS",
    description: "Megawatt Charging System"
}
]

export const DEFAULT_PAGE_SIZE = 10;