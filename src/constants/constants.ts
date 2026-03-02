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
            ocppLogs: (id: string) => `/stations/${id}/ocpp-logs`,
        },
        locations: {
            base: "/locations",
            byId: (id: string) => `/locations/${id}`,
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
            regenerateSecret: (id: string) => `/tenants/${id}/regenerate-secret`,
        },
        webhooks: {
            base: "/webhooks",
            byId: (id: string) => `/webhooks/${id}`,
            secret: (id: string) => `/webhooks/${id}/secret`,
            deliveries: "/webhooks/deliveries",
            retry: (deliveryId: string) => `/webhooks/deliveries/${deliveryId}/retry`,
        },
    }
}

export const FRONTEND_ROUTES = {
    DASHBOARD: "/dashboard",
    LOCATIONS: "/locations",
    STATIONS: "/stations",
    SESSIONS: "/sessions",
    TENANTS: "/tenants",
    WEBHOOKS: "/webhooks",
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
}