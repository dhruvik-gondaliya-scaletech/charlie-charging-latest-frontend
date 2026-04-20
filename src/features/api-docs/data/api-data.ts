export interface ResponseField {
  type: string;
  required: boolean;
  description: string;
  children?: Record<string, ResponseField>;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  body?: Record<string, { type: string; required: boolean; description: string; defaultValue?: any }>;
  query?: Record<string, { type: string; required: boolean; description: string; defaultValue?: any }>;
  params?: Record<string, { type: string; required: boolean; description: string; defaultValue?: any }>;
  responses: Array<{
    status: number;
    description: string;
    data: any;
    schema?: Record<string, ResponseField>;
  }>;
  requiresAuth?: boolean;
}

export interface ApiGroup {
  name: string;
  endpoints: ApiEndpoint[];
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
}

export const GUIDE_DATA: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `
# Getting Started with Partner APIs

The Partner API allows you to integrate Scale EV's charging management capabilities directly into your own systems. This guide will help you get started with authentication and basic integration.

### Environments
- **Production**: \`https://api.scale-ev.com\`
- **Sandbox**: \`https://api.sandbox.scale-ev.com\`

### API Structure
All partner endpoints are prefixed with \`/partner\`. For example: \`GET /partner/stations\`.

### Rate Limits
To ensure platform stability, we enforce rate limits:
- **Default**: 500 requests per 10 minutes per tenant.
    `
  },
  {
    id: 'authentication',
    title: 'Authentication',
    content: `
# Authentication Guide

Our Partner API uses OAuth2 client credentials flow. You will need your \`clientId\` and \`clientSecret\` to obtain an access token.

### 1. Obtain Access Token
Send a POST request to \`/partner/auth/token\` with your credentials.

\`\`\`http
POST /partner/auth/token
Content-Type: application/json

{
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret"
}
\`\`\`

### 2. Use Bearer Token
Include the returned \`access_token\` in the \`Authorization\` header of all subsequent requests.

\`\`\`http
Authorization: Bearer <your_access_token>
\`\`\`

### 3. Refreshing Tokens
Tokens have a limited lifespan. Use the \`refresh_token\` to obtain a new access token via \`/partner/auth/refresh\`.
    `
  }
];

export const API_DATA: ApiGroup[] = [
  {
    name: 'Partner API - Auth',
    endpoints: [
      {
        id: 'partner-auth-token',
        method: 'POST',
        path: '/partner/auth/token',
        description: 'Get partner access token using client credentials',
        body: {
          clientId: { type: 'string', required: true, description: 'Your Tenant ID' },
          clientSecret: { type: 'string', required: true, description: 'Your API Secret' }
        },
        responses: [
          {
            status: 200,
            description: 'Successful authentication',
            data: {
              access_token: 'eyJhbGciOiJIUzI1Ni...',
              refresh_token: 'def456...',
              access_token_expires_in: '1h',
              refresh_token_expires_in: '7d'
            }
          }
        ],
        requiresAuth: false
      },
      {
        id: 'partner-auth-refresh',
        method: 'POST',
        path: '/partner/auth/refresh',
        description: 'Refresh partner access token',
        body: {
          refreshToken: { type: 'string', required: true, description: 'The refresh token obtained during initial auth' }
        },
        responses: [
          {
            status: 200,
            description: 'Token refreshed successfully',
            data: {
              access_token: 'new_eyJhbGciOiJIUzI1Ni...',
              refresh_token: 'new_def456...',
              access_token_expires_in: '1h'
            }
          }
        ],
        requiresAuth: false
      }
    ]
  },
  {
    name: 'Partner API - Stations',
    endpoints: [
      {
        id: 'partner-stations-list',
        method: 'GET',
        path: '/partner/stations',
        description: 'List all charging stations',
        query: {
          name: { type: 'string', required: false, description: 'Search by station name' },
          locationId: { type: 'string', required: false, description: 'Filter by location ID' },
          status: { type: 'string', required: false, description: 'Filter by status (Available, Charging, etc.)' }
        },
        responses: [
          {
            status: 200,
            description: 'List of stations',
            data: [
              { id: 'st_1', name: 'Downtown Station 1', locationId: 'loc_1', status: 'Available', identity: 'CP001' }
            ]
          }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-stations-create',
        method: 'POST',
        path: '/partner/stations',
        description: 'Create a new charging station via Partner API',
        body: {
          name: { type: 'string', required: true, description: 'Station name', defaultValue: 'New Station' },
          locationId: { type: 'string', required: true, description: 'Target location ID' },
          identity: { type: 'string', required: true, description: 'OCPP identity string' }
        },
        responses: [
          { status: 201, description: 'Station created', data: { id: 'st_2', name: 'New Station' } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-stations-stats',
        method: 'GET',
        path: '/partner/stations/stats',
        description: 'Get charging station statistics',
        responses: [
          {
            status: 200,
            description: 'Station statistics',
            data: { total: 10, online: 8, charging: 2, error: 0 }
          }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-stations-detail',
        method: 'GET',
        path: '/partner/stations/:id',
        description: 'Get a charging station by ID',
        params: {
          id: { type: 'string', required: true, description: 'Station ID' }
        },
        responses: [
          { status: 200, description: 'Station details', data: { id: 'st_1', name: 'Downtown Station 1' } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-stations-remote-start',
        method: 'POST',
        path: '/partner/stations/:id/remote-start',
        description: 'Remotely start a charging session via Partner API',
        params: { id: { type: 'string', required: true, description: 'Station ID' } },
        body: {
          connectorId: { type: 'number', required: true, description: 'Connector index', defaultValue: 1 },
          idTag: { type: 'string', required: true, description: 'RFID / ID Tag', defaultValue: 'TAG_001' }
        },
        responses: [
          { status: 200, description: 'Command accepted', data: { status: 'Accepted' } }
        ],
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Partner API - Locations',
    endpoints: [
      {
        id: 'partner-locations-list',
        method: 'GET',
        path: '/partner/locations',
        description: 'Get all locations',
        responses: [
          {
            status: 200,
            description: 'List of locations',
            data: [{ id: 'loc_1', name: 'Main Hub', address: '123 Street' }]
          }
        ],
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Partner API - Sessions',
    endpoints: [
      {
        id: 'partner-sessions-list',
        method: 'GET',
        path: '/partner/sessions',
        description: 'Get all charging sessions with optional filters',
        query: {
          status: { type: 'string', required: false, description: 'Filter by session status' }
        },
        responses: [
          { status: 200, description: 'List of sessions', data: [{ id: 'sess_1', stationId: 'st_1', status: 'Charging' }] }
        ],
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Partner API - Users',
    endpoints: [
      {
        id: 'partner-users-list',
        method: 'GET',
        path: '/partner/users',
        description: 'List all users',
        responses: [
          { status: 200, description: 'List of users', data: [{ id: 'usr_1', email: 'user@example.com' }] }
        ],
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Partner API - Brands (Hardware Models)',
    endpoints: [
      {
        id: 'partner-brands-list',
        method: 'GET',
        path: '/partner/brands',
        description: 'List all hardware brands',
        responses: [
          { status: 200, description: 'List of brands', data: [{ id: 1, name: 'ABB' }] }
        ],
        requiresAuth: true
      }
    ]
  }
];
