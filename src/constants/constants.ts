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
            forgotPassword: "/auth/forgot-password",
            resetPassword: "/auth/reset-password",
            getCredentials: "/auth/get-credentials",
            documentationToken: "/auth/documentation-token",
        },
        users: {
            base: "/users",
            profile: "/users/profile",
            changePassword: "/users/change-password",
            byId: (id: string) => `/users/${id}`,
        },
        drivers: {
            base: "/drivers",
            appConfig: "/drivers/app-config",
            byId: (id: string) => `/drivers/${id}`,
            sessions: (id: string) => `/drivers/${id}/sessions`,
        },
        idTags: {
            base: "/id-tags",
            byId: (idTag: string) => `/id-tags/${idTag}`,
        },
        stations: {
            create: (env: string) => `/stations?env=${env}`,
            base: (env: string) => `/stations?env=${env}`,
            stats: (env: string) => `/stations/stats?env=${env}`,
            byId: (env: string, id: string) => `/stations/${id}?env=${env}`,
            update: (env: string, id: string) => `/stations/${id}?env=${env}`,
            delete: (id: string) => `/stations/${id}`,
            remoteStart: (id: string) => `/stations/${id}/remote-start`,
            remoteStop: (id: string) => `/stations/${id}/remote-stop`,
            reset: (id: string) => `/stations/${id}/reset`,
            availability: (id: string) => `/stations/${id}/availability`,
            unlock: (id: string) => `/stations/${id}/unlock`,
            configuration: (env: string, id: string) => `/stations/${id}/configuration?env=${env}`,
            setConfiguration: (id: string) => `/stations/${id}/configuration`,
            ocppLogs: (id: string) => `/ocpp-logs?stationId=${id}`,
            exportOcppLogs: () => '/ocpp-logs/export',
            sessions: (env: string, id: string) => `/stations/${id}/sessions?env=${env}`,
            sessionStats: (env: string, id: string) => `/stations/${id}/sessions/stats?env=${env}`,
            chargingProfile: (id: string) => `/stations/${id}/charging-profile`,
            liveChargingProfile: (id: string) => `/stations/${id}/live-profile`,
        },
        locations: {
            create: (env: string) => `/locations?env=${env}`,
            base: (env: string) => `/locations?env=${env}`,
            byId: (env: string, id: string) => `/locations/${id}?env=${env}`,
            update: (env: string, id: string) => `/locations/${id}?env=${env}`,
            delete: (id: string) => `/locations/${id}`,
            transferEnv: (id: string) => `/locations/${id}/transfer-env`,
        },
        webhooks: {
            create: (env: string) => `/webhooks?env=${env}`,
            base: (env: string) => `/webhooks?env=${env}`,
            byId: (env: string, id: string) => `/webhooks/${id}?env=${env}`,
            update: (env: string, id: string) => `/webhooks/${id}?env=${env}`,
            delete: (id: string) => `/webhooks/${id}`,
            secret: (env: string, id: string) => `/webhooks/${id}/secret?env=${env}`,
            deliveries: (env: string) => `/webhooks/deliveries/all?env=${env}`,
            retry: (deliveryId: string) => `/webhooks/deliveries/${deliveryId}/retry`,
        },
        sessions: {
            base: "/sessions",
            byId: (id: string) => `/sessions/${id}`,
            byStation: (stationId: string) => `/sessions/station/${stationId}`,
            active: (stationId: string) => `/sessions/station/${stationId}/active`,
            export: "/sessions/export",
        },
        dashboard: {
            base: "/dashboard",
            stats: "/dashboard/stats",
            activity: "/dashboard/activity",
        },
        tenants: {
            base: "/tenants",
            config: "/tenants/config",
            byId: (id: string) => `/tenants/${id}`,
            activate: (id: string) => `/tenants/${id}/activate`,
            deactivate: (id: string) => `/tenants/${id}/deactivate`,
            regenerateSecret: (id: string) => `/tenants/${id}/regenerate-api-secret`,
            connectStripe: (id: string) => `/tenants/${id}/stripe/connect`,
            resetStripe: (id: string) => `/tenants/${id}/stripe/reset`,
        },
        aws: {
            uploadUrl: "/aws/upload-url",
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
        reporting: {
            intervals: '/reporting/intervals',
            intervalsExport: '/reporting/intervals/export',
            aggregated: '/reporting/intervals/aggregated',
            sessionIntervals: (id: string) => `/reporting/sessions/${id}/intervals`,
            sessionSummary: (id: string) => `/reporting/sessions/${id}/intervals/summary`,
            sessionStats: '/reporting/sessions/stats',
            sessionExport: '/reporting/sessions/export',
            downtimeExport: '/reporting/downtime/export',
            getLocationGroups: '/reporting/locations-groups',
            getLocationGroup: (groupName: string) => `/reporting/locations-group/${groupName}`,
            updateLocationGroupLocations: (groupName: string) => `/reporting/locations-group/${groupName}/locations`,
            getApiKey: '/reporting/api-key',
        },
        compliance: {
            uptime: '/compliance/uptime',
            downtimeIntervals: '/compliance/downtime/intervals',
            override: (id: string) => `/compliance/downtime/${id}/override`,
            dailyReport: '/reports/daily',
            monthlyReport: '/reports/monthly',
            quarterlyReport: '/reports/quarterly',
        },
        brands: {
            base: "/brands",
        },
        billing: {
            create: (env: string) => `/billing/tariffs?env=${env}`,
            tariffs: (env: string) => `/billing/tariffs?env=${env}`,
            tariffById: (env: string, id: string) => `/billing/tariffs/${id}?env=${env}`,
            update: (env: string, id: string) => `/billing/tariffs/${id}?env=${env}`,
            delete: (id: string) => `/billing/tariffs/${id}`,
            estimate: "/billing/estimate",
            calculateSessionCost: (id: string) => `/billing/sessions/${id}/calculate`,
        },
        contact: "/contact",
        partner: {
            auth: {
                token: "/partner/auth/token",
                refresh: "/partner/auth/refresh",
            },
            stations: {
                base: "/partner/stations",
                stats: "/partner/stations/stats",
                byId: (id: string) => `/partner/stations/${id}`,
                remoteStart: (id: string) => `/partner/stations/${id}/remote-start`,
                remoteStop: (id: string) => `/partner/stations/${id}/remote-stop`,
                sessions: (id: string) => `/partner/stations/${id}/sessions`,
            },
            locations: {
                base: "/partner/locations",
                byId: (id: string) => `/partner/locations/${id}`,
            },
            sessions: {
                base: "/partner/sessions",
                stats: "/partner/sessions/stats",
                byId: (id: string) => `/partner/sessions/${id}`,
                byStation: (stationId: string) => `/partner/sessions/station/${stationId}`,
                active: (stationId: string) => `/partner/sessions/station/${stationId}/active`,
            },
            users: {
                base: "/partner/users",
                byId: (id: string) => `/partner/users/${id}`,
            },
            brands: {
                base: "/partner/brands",
                models: (brandId: string) => `/partner/brands/${brandId}/models`,
                connectorTypes: "/partner/brands/connector-types",
            },
        },
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
    TARIFF: "/tariff",
    TENANTS: "/tenants",
    WEBHOOKS: "/webhooks",
    WEBHOOKS_LOGS: (id: string) => `/webhooks/${id}`,
    OCPI: "/ocpi",
    REGISTER: "/register",
    LOGIN: "/login",
    PROFILE: "/profile",
    USERS: "/users",
    DRIVERS: "/drivers",
    DRIVER_DETAILS: (id: string) => `/drivers/${id}`,
    ID_TAGS: "/id-tags",
    VERIFY_EMAIL: "/verify-email",
    ACCEPT_INVITE: "/accept-invitation",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    LANDING_PAGE_ONE: "/landing-one",
    LANDING_PAGE_TWO: "/landing-two",
    LANDING_PAGE_THREE: "/landing-three",
    LANDING_PAGE_FOUR: "/landing-four",
    API_DOCS: "/docs",
    REPORTS: "/reports",
}

export const AUTH_CONFIG = {
    tokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || "csms_auth_token",
    userKey: process.env.NEXT_PUBLIC_AUTH_USER_KEY || "csms_user",
    tenantKey: process.env.NEXT_PUBLIC_AUTH_TENANT_KEY || "csms_tenant",
    docsCredentialsKey: "docs_auth_cred",
    docsTokenKey: "docs_auth_token",
}

export const WEBSOCKET_CONFIG = {
    url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000",
    ocppUrl: process.env.NEXT_PUBLIC_CSMS_WEBSOCKET_BASE_URL || "ws://localhost:9220/ocpp",
}

export const CONNECTOR_OPTIONS = [
    {
        type: "CHAdeMO",
        label: "CHAdeMO",
        description: "Japanese standard"
    },
    {
        type: "Mennekes",
        label: "Mennekes",
        description: "European AC"
    },
    {
        type: "CCS",
        label: "CCS",
        description: "Combined Charging System"
    },
    {
        type: "J1772",
        label: "J1772",
        description: "North American standard"
    },
    {
        type: "3Pin",
        label: "3-Pin",
        description: "Three-pin connector"
    },
    {
        type: "Schuko",
        label: "Schuko",
        description: "European standard"
    },
    {
        type: "NACS",
        label: "Tesla",
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
    },
    {
        type: "CCS2",
        label: "CCS2",
        description: "Combined Charging System"
    }
]

export const DEFAULT_PAGE_SIZE = 10;

export const IMAGE_DOMAIN_URL = "https://d39uw1u176mxxs.cloudfront.net"

export enum Environment {
    DEV = "dev",
    PROD = "prod"
}