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

### Response Format
All requests return a standard JSON object containing status and data:
\`\`\`json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-04-20T12:00:00Z"
}
\`\`\`
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

\`\`\`bash
# Example cURL
curl -X POST "https://api.scale-ev.com/partner/auth/token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "clientId": "your_client_id",
    "clientSecret": "your_client_secret"
  }'
\`\`\`

### 2. Use Bearer Token
Include the returned \`access_token\` in the \`Authorization\` header of all subsequent requests.

\`\`\`http
Authorization: Bearer <your_access_token>
\`\`\`

### 3. Refreshing Tokens
Tokens expire after 1 hour. Use the \`refresh_token\` to obtain a new access token via \`/partner/auth/refresh\`.
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
          clientId: { type: 'uuid', required: true, description: 'Your Client ID (Tenant ID)' },
          clientSecret: { type: 'string', required: true, description: 'Your Client Secret (API Secret)' }
        },
        responses: [
          {
            status: 200,
            description: 'Successful authentication',
            data: {
              access_token: 'eyJhbGciOiJIUzI1Ni...',
              refresh_token: 'def456...',
              expires_in: 3600
            }
          },
          {
            status: 401,
            description: 'Unauthorized - Invalid credentials',
            data: { success: false, statusCode: 401, message: 'Invalid credentials' }
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
              expires_in: 3600
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
        description: 'List all charging stations with optional filters',
        query: {
          name: { type: 'string', required: false, description: 'Search by station name' },
          locationId: { type: 'uuid', required: false, description: 'Filter by location ID' },
          status: { type: 'enum', required: false, description: 'Filter by charging status (Available, Charging, Occupied, Error, Offline)' },
          type: { type: 'enum', required: false, description: 'Filter by station type (AC or DC)' }
        },
        responses: [
          {
            status: 200,
            description: 'List of stations',
            data: [
              { id: '123e4567...', name: 'Main Street Station', serialNumber: 'SN001', model: 'Terra 54', vendor: 'ABB', type: 'DC', maxPower: 50, status: 'Available' }
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
          serialNumber: { type: 'string', required: true, description: 'Hardware serial number' },
          model: { type: 'string', required: true, description: 'Hardware model' },
          vendor: { type: 'string', required: true, description: 'Hardware manufacturer' },
          type: { type: 'enum', required: true, description: 'Charging type (AC / DC)' },
          maxPower: { type: 'number', required: true, description: 'Maximum power in kW' },
          connectorTypes: { type: 'array', required: true, description: 'List of connectors (Type2, CCS1, CCS2, CHAdeMO)' },
          chargePointId: { type: 'string', required: true, description: 'Unique OCPP Charge Point Identity' },
          locationId: { type: 'uuid', required: false, description: 'Optional: ID of the location where station is installed' },
          tariffId: { type: 'uuid', required: true, description: 'Billing tariff ID' }
        },
        responses: [
          { status: 201, description: 'Station created', data: { id: 'uuid-123...', name: 'New Station', chargePointId: 'ST_001' } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-stations-stats',
        method: 'GET',
        path: '/partner/stations/stats',
        description: 'Get charging station statistics across your ecosystem',
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
          id: { type: 'uuid', required: true, description: 'Station identifier' }
        },
        responses: [
          { status: 200, description: 'Station details', data: { id: 'st_1', name: 'Downtown Station 1', connectors: [] } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-stations-update',
        method: 'PATCH',
        path: '/partner/stations/:id',
        description: 'Update a charging station via Partner API',
        params: { id: { type: 'uuid', required: true, description: 'Station ID' } },
        body: {
          name: { type: 'string', required: false, description: 'Updated station name' },
          status: { type: 'enum', required: false, description: 'Override charging status' },
          isActive: { type: 'boolean', required: false, description: 'Enable/Disable station' },
          maxPower: { type: 'number', required: false, description: 'Update max power output' },
          locationId: { type: 'uuid', required: false, description: 'Move station to another location' },
          tariffId: { type: 'uuid', required: false, description: 'Update billing tariff' }
        },
        responses: [
          { status: 200, description: 'Station updated successfully', data: { id: 'st_1', name: 'Updated Name' } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-stations-delete',
        method: 'DELETE',
        path: '/partner/stations/:id',
        description: 'Delete a charging station',
        params: { id: { type: 'uuid', required: true, description: 'Station identifier' } },
        responses: [
          { status: 200, description: 'Station successfully deleted', data: { success: true } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-stations-remote-start',
        method: 'POST',
        path: '/partner/stations/:id/remote-start',
        description: 'Remotely start a charging session via Partner API',
        params: { id: { type: 'uuid', required: true, description: 'Station ID' } },
        body: {
          connectorId: { type: 'number', required: true, description: 'Connector index (usually 1 or 2)', defaultValue: 1 },
          userId: { type: 'uuid', required: false, description: 'Internal user ID for the session' },
          driverId: { type: 'string', required: false, description: 'Driver identifier for tracking' },
          estimatedCost: { type: 'number', required: false, description: 'Pre-auth amount in currency units' },
          targetKwh: { type: 'number', required: false, description: 'Target energy for auto-stop' },
          targetCost: { type: 'number', required: false, description: 'Target cost for auto-stop' },
          targetMinutes: { type: 'number', required: false, description: 'Target duration for auto-stop' }
        },
        responses: [
          { status: 200, description: 'Command accepted by Charge Point', data: { status: 'Accepted', transactionId: 54321 } },
          { status: 400, description: 'Invalid command or station offline', data: { status: 'Rejected', reason: 'StationOffline' } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-stations-remote-stop',
        method: 'POST',
        path: '/partner/stations/:id/remote-stop',
        description: 'Remotely stop an ongoing charging session',
        params: { id: { type: 'uuid', required: true, description: 'Station identifier' } },
        body: {
          transactionId: { type: 'number', required: true, description: 'The active transaction ID to stop' }
        },
        responses: [
          { status: 200, description: 'Stop command accepted', data: { status: 'Accepted' } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-stations-sessions',
        method: 'GET',
        path: '/partner/stations/:id/sessions',
        description: 'Get all charging sessions for this station (Logs)',
        params: { id: { type: 'uuid', required: true, description: 'Station identifier' } },
        query: {
          connectorId: { type: 'number', required: false, description: 'Filter by specific connector' },
          status: { type: 'enum', required: false, description: 'Filter by session status' },
          startFrom: { type: 'date', required: false, description: 'Filter by start date' }
        },
        responses: [
          { status: 200, description: 'List of sessions for the station', data: [{ id: 'sess_1', energyDeliveredKwh: 15.5, startTime: '2026-04-20T10:00:00Z' }] }
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
        description: 'Get all locations matching filter criteria',
        query: {
          name: { type: 'string', required: false, description: 'Filter by name' },
          city: { type: 'string', required: false, description: 'Filter by city' },
          isActive: { type: 'boolean', required: false, description: 'Filter by active status' }
        },
        responses: [
          {
            status: 200,
            description: 'List of locations',
            data: [{ id: 'loc_1', name: 'Main Hub', address: '123 Street', city: 'London', country: 'UK' }]
          }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-locations-create',
        method: 'POST',
        path: '/partner/locations',
        description: 'Create a new site location',
        body: {
          name: { type: 'string', required: true, description: 'Location name' },
          address: { type: 'string', required: false, description: 'Street address' },
          city: { type: 'string', required: false, description: 'City name' },
          country: { type: 'string', required: false, description: 'Country name' },
          latitude: { type: 'number', required: false, description: 'GPS Latitude' },
          longitude: { type: 'number', required: false, description: 'GPS Longitude' }
        },
        responses: [
          { status: 201, description: 'Location created', data: { id: 'loc_new', name: 'New Location' } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-locations-detail',
        method: 'GET',
        path: '/partner/locations/:id',
        description: 'Retrieve detailed information about a location',
        params: { id: { type: 'uuid', required: true, description: 'Location identifier' } },
        responses: [
          { status: 200, description: 'Location details', data: { id: 'loc_1', name: 'Main Hub', status: 'Active' } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-locations-update',
        method: 'PATCH',
        path: '/partner/locations/:id',
        description: 'Update location details (address, coordinates, etc.)',
        params: { id: { type: 'uuid', required: true, description: 'Location identifier' } },
        body: {
          name: { type: 'string', required: false, description: 'New name' },
          address: { type: 'string', required: false, description: 'Street address' },
          city: { type: 'string', required: false, description: 'City' },
          latitude: { type: 'number', required: false, description: 'GPS Lat' },
          longitude: { type: 'number', required: false, description: 'GPS Lng' }
        },
        responses: [
          { status: 200, description: 'Updated successfully', data: { id: 'loc_1', name: 'New Name' } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-locations-delete',
        method: 'DELETE',
        path: '/partner/locations/:id',
        description: 'Remove a location and its associated metadata',
        params: { id: { type: 'uuid', required: true, description: 'Location identifier' } },
        responses: [
          { status: 200, description: 'Deleted', data: { success: true } }
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
        description: 'Get all charging sessions with optional status and time filters',
        query: {
          stationId: { type: 'uuid', required: false, description: 'Filter by station' },
          status: { type: 'enum', required: false, description: 'Filter by session status (Charging, Completed, Pending)' },
          startFrom: { type: 'date', required: false, description: 'Filter by start date' }
        },
        responses: [
          { status: 200, description: 'List of sessions', data: [{ id: 'sess_1', stationId: 'st_1', status: 'Charging', energyDeliveredKwh: 12.5 }] }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-sessions-stats',
        method: 'GET',
        path: '/partner/sessions/stats',
        description: 'Get aggregate session analytics',
        query: { stationId: { type: 'uuid', required: false, description: 'Optionally filter stats by station' } },
        responses: [
          { status: 200, description: 'Operational stats', data: { totalSessions: 154, totalEnergyKwh: 4321.5, avgDurationMinutes: 45 } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-sessions-detail',
        method: 'GET',
        path: '/partner/sessions/:id',
        description: 'Get full session breakdown and telemetry',
        params: { id: { type: 'uuid', required: true, description: 'Session identifier' } },
        responses: [
          { status: 200, description: 'Session data', data: { id: 'sess_1', energy: 12.5, cost: 4.5, duration: 32 } }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-sessions-by-station',
        method: 'GET',
        path: '/partner/sessions/station/:stationId',
        description: 'List all sessions for a specific station (Shortcut)',
        params: { stationId: { type: 'uuid', required: true, description: 'Station ID' } },
        query: {
          status: { type: 'enum', required: false, description: 'Filter by session status' }
        },
        responses: [
          { status: 200, description: 'List of sessions', data: [{ id: 'sess_1', status: 'Completed' }] }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-sessions-active-by-station',
        method: 'GET',
        path: '/partner/sessions/station/:stationId/active',
        description: 'Get the currently active session on a specific station',
        params: { stationId: { type: 'uuid', required: true, description: 'Station ID' } },
        query: {
          connectorId: { type: 'number', required: false, description: 'Filter by connector' }
        },
        responses: [
          { status: 200, description: 'Active session (or null)', data: { id: 'sess_active', status: 'Charging' } }
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
        description: 'List all ecosystem users',
        query: {
          search: { type: 'string', required: false, description: 'Search by first name, last name, or email (fuzzy match)' }
        },
        responses: [
          { status: 200, description: 'List of users', data: [{ id: 'usr_1', email: 'user@example.com', name: 'John Doe' }] }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-users-detail',
        method: 'GET',
        path: '/partner/users/:id',
        description: 'Get user profile and account details',
        params: { id: { type: 'uuid', required: true, description: 'User identifier' } },
        responses: [
          { status: 200, description: 'User profile', data: { id: 'usr_1', email: 'user@example.com', credits: 100 } }
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
        description: 'List all supported hardware brands',
        responses: [
          { status: 200, description: 'List of brands', data: [{ id: 1, name: 'ABB' }, { id: 2, name: 'Tritium' }] }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-brands-models',
        method: 'GET',
        path: '/partner/brands/:id/models',
        description: 'List hardware models for a specific brand',
        params: { id: { type: 'number', required: true, description: 'Brand ID' } },
        responses: [
          { status: 200, description: 'Brand models', data: [{ id: 101, name: 'Terra 54' }, { id: 102, name: 'Terra 184' }] }
        ],
        requiresAuth: true
      },
      {
        id: 'partner-connector-types',
        method: 'GET',
        path: '/partner/brands/connector-types',
        description: 'List all supported connector standard types',
        responses: [
          { status: 200, description: 'Connector types', data: ['Type1', 'Type2', 'CCS1', 'CCS2', 'CHAdeMO'] }
        ],
        requiresAuth: true
      }
    ]
  }
];
