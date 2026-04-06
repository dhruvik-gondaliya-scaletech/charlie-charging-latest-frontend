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
    id: 'integration-notes',
    title: 'Integration Notes',
    content: `
# Integration Notes

Welcome to the Scale EV API. This documentation will help you integrate your application with our charging management platform.

### Environments
- **Sandbox**: \`https://api.sandbox.scale-ev.com\`
- **Production**: \`https://api.scale-ev.com\`

### Rate Limiting
To ensure platform stability, we enforce rate limits on all API requests:
- **Authenticated Requests**: 1000 requests per minute.
- **Public Requests**: 100 requests per minute.

If you exceed these limits, the API will return a \`429 Too Many Requests\` response.

### Pagination
For list endpoints, we use cursor-based pagination. You can control this via the \`page\` and \`limit\` query parameters.
- Default limit: 20
- Max limit: 100
    `
  },
  {
    id: 'authentication-guide',
    title: 'Authentication',
    content: `
# Authentication

All private endpoints require a Bearer Token. You can obtain this token via the \`/auth/login\` endpoint.

### Header Format
\`\`\`http
Authorization: Bearer <your_access_token>
\`\`\`

Tokens are valid for 24 hours. After expiration, you must re-authenticate.
    `
  }
];

export const API_DATA: ApiGroup[] = [
  {
    name: 'Authentication',
    endpoints: [
      {
        id: 'auth-login',
        method: 'POST',
        path: '/auth/login',
        description: 'Authenticate user and return JWT token.',
        body: {
          email: { type: 'string', required: true, description: 'User email address', defaultValue: 'admin@scale-ev.com' },
          password: { type: 'string', required: true, description: 'User password', defaultValue: 'admin123' },
        },
        responses: [
          { 
            status: 200, 
            description: 'Successfully authenticated', 
            data: { 
              accessToken: 'eyJhbGciOiJIUzI1Ni...', 
              expiresIn: 86400,
              user: { id: 'usr_1', email: 'admin@scale-ev.com', firstName: 'Admin', lastName: 'User' } 
            },
            schema: {
              accessToken: { type: 'string', required: true, description: 'JWT access token used for subsequent requests.' },
              expiresIn: { type: 'number', required: true, description: 'Time in seconds until the token expires.' },
              user: { 
                type: 'object', 
                required: true, 
                description: 'The authenticated user object.',
                children: {
                  id: { type: 'string', required: true, description: 'Unique user identifier.' },
                  email: { type: 'string', required: true, description: 'User email address.' },
                  firstName: { type: 'string', required: true, description: 'User\'s first name.' },
                  lastName: { type: 'string', required: true, description: 'User\'s last name.' }
                }
              }
            }
          },
          { 
            status: 401, 
            description: 'Invalid credentials', 
            data: { message: 'Unauthorized' },
            schema: {
              message: { type: 'string', required: true, description: 'Error message explaining the failure.' }
            }
          }
        ],
        requiresAuth: false
      }
    ]
  },
  {
    name: 'Stations',
    endpoints: [
      {
        id: 'stations-list',
        method: 'GET',
        path: '/stations',
        description: 'List all charging stations with optional filtering.',
        query: {
          name: { type: 'string', required: false, description: 'Partial name match', defaultValue: '' },
          status: { type: 'string', required: false, description: 'Filter by ChargingStatus enum', defaultValue: '' },
        },
        responses: [
          { 
            status: 200, 
            description: 'List of stations retrieved', 
            data: [
              { 
                id: '550e8400-e29b-41d4-a716-446655440000', 
                name: 'Downtown Hub', 
                status: 'Available', 
                type: 'DC',
                connectors: 2
              }
            ],
            schema: {
              id: { type: 'string', required: true, description: 'UUID of the station.' },
              name: { type: 'string', required: true, description: 'Display name.' },
              status: { type: 'string', required: true, description: 'Current operational status.' },
              type: { type: 'string', required: true, description: 'Station power type (AC/DC).' },
              connectors: { type: 'number', required: true, description: 'Number of available connectors.' }
            }
          }
        ]
      },
      {
        id: 'remote-start',
        method: 'POST',
        path: '/stations/:id/remote-start',
        description: 'Remotely start a charging session on a specific station.',
        params: {
          id: { type: 'string', required: true, description: 'Station UUID', defaultValue: 'st_1' }
        },
        body: {
          connectorId: { type: 'number', required: true, description: 'Connector index (starting 1)', defaultValue: 1 },
          idTag: { type: 'string', required: true, description: 'RFID tag identifier', defaultValue: 'TAG_001' },
          userId: { type: 'string', required: true, description: 'Target user UUID', defaultValue: 'usr_123' },
        },
        responses: [
          { 
            status: 200, 
            description: 'Operation accepted by station', 
            data: { status: 'Accepted', transactionId: 1045 },
            schema: {
              status: { type: 'string', required: true, description: 'OCPP response status (Accepted/Rejected).' },
              transactionId: { type: 'number', required: true, description: 'ID of the initiated transaction.' }
            }
          },
          { status: 404, description: 'Station not found', data: { message: 'Station not found' } }
        ]
      }
    ]
  },
  {
    name: 'Sessions',
    endpoints: [
      {
        id: 'sessions-list',
        method: 'GET',
        path: '/sessions',
        description: 'Retrieve charging session history.',
        query: {
          status: { type: 'string', required: false, description: 'Filter by SessionStatus', defaultValue: 'Completed' },
          stationId: { type: 'string', required: false, description: 'Filter by station UUID', defaultValue: '' },
        },
        responses: [
          { 
            status: 200, 
            description: 'Sessions retrieved', 
            data: [
              { 
                id: 'sess_1', 
                stationName: 'Downtown Hub', 
                energyDeliveredKwh: 45.2, 
                durationMinutes: 42,
                status: 'Completed',
                startTime: '2024-04-06T10:00:00Z'
              }
            ],
            schema: {
              id: { type: 'string', required: true, description: 'Session identifier.' },
              stationName: { type: 'string', required: true, description: 'Name of the station.' },
              energyDeliveredKwh: { type: 'number', required: true, description: 'Total kWh delivered.' },
              durationMinutes: { type: 'number', required: true, description: 'Session duration in minutes.' },
              status: { type: 'string', required: true, description: 'Final session status.' },
              startTime: { type: 'string', required: true, description: 'ISO timestamp of start.' }
            }
          }
        ]
      }
    ]
  },
  {
    name: 'Locations',
    endpoints: [
      {
        id: 'locations-list',
        method: 'GET',
        path: '/locations',
        description: 'Get all locations with optional name filter.',
        query: {
          name: { type: 'string', required: false, description: 'Partial name match', defaultValue: '' }
        },
        responses: [
          { status: 200, description: 'List retrieved', data: [{ id: 'loc_1', name: 'West Hub' }] }
        ]
      },
      {
        id: 'locations-create',
        method: 'POST',
        path: '/locations',
        description: 'Create a new charging location.',
        body: {
          name: { type: 'string', required: true, description: 'Location name', defaultValue: 'East Hub' },
          address: { type: 'string', required: true, description: 'Full address', defaultValue: '456 East St' }
        },
        responses: [
          { status: 201, description: 'Location created', data: { id: 'loc_2', name: 'East Hub' } }
        ],
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Tenants',
    endpoints: [
      {
        id: 'tenants-list',
        method: 'GET',
        path: '/tenants',
        description: 'Get all tenants (Super Admin only).',
        responses: [
          { status: 200, description: 'List retrieved', data: [{ id: 'ten_1', name: 'Charlie Corp' }] }
        ],
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Users',
    endpoints: [
      {
        id: 'users-profile',
        method: 'GET',
        path: '/users/profile',
        description: 'Retrieve current user profile.',
        responses: [
          { status: 200, description: 'Profile retrieved', data: { id: 'usr_1', email: 'admin@scale-ev.com' } }
        ],
        requiresAuth: true
      },
      {
        id: 'users-list',
        method: 'GET',
        path: '/users',
        description: 'List all users in the tenant.',
        responses: [
          { status: 200, description: 'Users retrieved', data: [{ id: 'usr_1', email: 'admin@scale-ev.com' }] }
        ],
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Webhooks',
    endpoints: [
      {
        id: 'webhooks-list',
        method: 'GET',
        path: '/webhooks',
        description: 'Get all webhook configurations.',
        responses: [
          { status: 200, description: 'List of webhooks', data: [{ id: 'wh_1', url: 'https://mysite.com/webhook' }] }
        ],
        requiresAuth: true
      }
    ]
  }
];
