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
    name: 'Dashboard',
    endpoints: [
      {
        id: 'dashboard-all',
        method: 'GET',
        path: '/dashboard',
        description: 'Get complete dashboard data including stats and recent activity.',
        query: {
          limit: { type: 'number', required: false, description: 'Number of recent activities', defaultValue: 10 }
        },
        responses: [
          { 
            status: 200, 
            description: 'Dashboard data retrieved', 
            data: { 
              stats: { totalStations: 15, availableStations: 12, energyDelivered: 1250.5, activeSessions: 4, capacityUtilization: 0.82, activeUsers: 45 },
              recentActivity: [
                { event: 'Transaction Started', station: 'Downtown Hub', user: 'John Doe', eventTime: '2024-03-20T10:00:00Z', status: 'In Progress' }
              ]
            },
            schema: {
              stats: { 
                type: 'object', 
                required: true, 
                description: 'Global statistics summary.',
                children: {
                  totalStations: { type: 'number', required: true, description: 'Total provisioned stations.' },
                  availableStations: { type: 'number', required: true, description: 'Stations currently available.' },
                  energyDelivered: { type: 'number', required: true, description: 'Cumulative energy in kWh.' },
                  activeSessions: { type: 'number', required: true, description: 'Count of ongoing charging sessions.' },
                  capacityUtilization: { type: 'number', required: true, description: '0-1 scale of fleet usage.' },
                  activeUsers: { type: 'number', required: true, description: 'Users with sessions in the last 24h.' }
                }
              },
              recentActivity: {
                type: 'array',
                required: true,
                description: 'List of latest system events.',
                children: {
                  event: { type: 'string', required: true, description: 'Type of activity.' },
                  station: { type: 'string', required: true, description: 'Target station name.' },
                  user: { type: 'string', required: true, description: 'Initiator name.' },
                  eventTime: { type: 'string', required: true, description: 'ISO timestamp.' },
                  status: { type: 'string', required: true, description: 'Outcome status.' }
                }
              }
            }
          }
        ],
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Brands & Models',
    endpoints: [
      {
        id: 'brands-list',
        method: 'GET',
        path: '/brands',
        description: 'Get all vehicle brands with pagination.',
        responses: [
          { 
            status: 200, 
            description: 'List of brands', 
            data: {
              items: [{ id: 1, identifier: 'tesla', name: 'Tesla', createdAt: '2024-01-01T00:00:00Z' }],
              meta: { total: 45, page: 1, limit: 10, totalPages: 5 }
            },
            schema: {
              items: { type: 'array', required: true, description: 'List of brand objects.' },
              meta: { 
                type: 'object', 
                required: true, 
                description: 'Pagination metadata.',
                children: {
                  total: { type: 'number', required: true, description: 'Total records.' },
                  page: { type: 'number', required: true, description: 'Current page.' },
                  limit: { type: 'number', required: true, description: 'Records per page.' },
                  totalPages: { type: 'number', required: true, description: 'Total pages available.' }
                }
              }
            }
          }
        ],
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Authentication',
    endpoints: [
      {
        id: 'auth-register',
        method: 'POST',
        path: '/auth/register',
        description: 'New user registration. Triggers a verification email.',
        body: {
          email: { type: 'string', required: true, description: 'User email address', defaultValue: 'newuser@scale-ev.com' },
          firstName: { type: 'string', required: true, description: 'User first name', defaultValue: 'John' },
          lastName: { type: 'string', required: true, description: 'User last name', defaultValue: 'Doe' },
          password: { type: 'string', required: true, description: 'User password (min 6 characters)', defaultValue: 'securePass123' },
          apiSecret: { type: 'string', required: false, description: 'Optional API secret for tenant-specific registration' }
        },
        responses: [
          { 
            status: 201, 
            description: 'Registration successful', 
            data: { message: 'Registration successful. Please check your email for verification.', userId: 'usr_123' },
            schema: {
              message: { type: 'string', required: true, description: 'Success message.' },
              userId: { type: 'string', required: true, description: 'ID of the created user.' }
            }
          },
          { 
            status: 400, 
            description: 'Bad Request', 
            data: { statusCode: 400, message: ['email must be an email'], error: 'Bad Request' },
            schema: {
              statusCode: { type: 'number', required: true, description: 'HTTP status code.' },
              message: { type: 'string[]', required: true, description: 'List of validation errors.' },
              error: { type: 'string', required: true, description: 'Error category.' }
            }
          },
          { 
            status: 409, 
            description: 'Conflict', 
            data: { statusCode: 409, message: 'A user with this email already exists', error: 'Conflict' },
            schema: {
              statusCode: { type: 'number', required: true, description: 'HTTP status code.' },
              message: { type: 'string', required: true, description: 'Error message.' },
              error: { type: 'string', required: true, description: 'Error category.' }
            }
          }
        ],
        requiresAuth: false
      },
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
              access_token: 'eyJhbGciOiJIUzI1Ni...', 
              user: { id: 'usr_1', email: 'admin@scale-ev.com', firstName: 'Admin', lastName: 'User', role: 'admin', isActive: true, isEmailVerified: true },
              tenant: { id: 'ten_1', name: 'Scale Corp' }
            },
            schema: {
              access_token: { type: 'string', required: true, description: 'JWT access token.' },
              user: { 
                type: 'object', 
                required: true, 
                description: 'User details.',
                children: {
                  id: { type: 'string', required: true, description: 'User UUID.' },
                  email: { type: 'string', required: true, description: 'Email address.' },
                  firstName: { type: 'string', required: true, description: 'First name.' },
                  lastName: { type: 'string', required: true, description: 'Last name.' },
                  role: { type: 'string', required: true, description: 'User role.' },
                  isActive: { type: 'boolean', required: true, description: 'Account status.' },
                  isEmailVerified: { type: 'boolean', required: true, description: 'Verification status.' }
                }
              },
              tenant: {
                type: 'object',
                required: true,
                description: 'Tenant details.',
                children: {
                  id: { type: 'string', required: true, description: 'Tenant UUID.' },
                  name: { type: 'string', required: true, description: 'Tenant name.' }
                }
              }
            }
          },
          { 
            status: 401, 
            description: 'Unauthorized', 
            data: { statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' },
            schema: {
              statusCode: { type: 'number', required: true, description: 'HTTP status code.' },
              message: { type: 'string', required: true, description: 'Error message.' }
            }
          }
        ],
        requiresAuth: false
      },
      {
        id: 'auth-verify',
        method: 'GET',
        path: '/auth/verify',
        description: 'Verify email address via token received in email.',
        query: {
          token: { type: 'string', required: true, description: 'The verification token', defaultValue: 'token_123' }
        },
        responses: [
          { status: 302, description: 'Redirect to frontend success/error page', data: null },
          { 
            status: 404, 
            description: 'Not Found', 
            data: { statusCode: 404, message: 'Invalid or expired verification token', error: 'Not Found' },
            schema: {
              message: { type: 'string', required: true, description: 'Error details.' }
            }
          }
        ],
        requiresAuth: false
      },
      {
        id: 'auth-me',
        method: 'GET',
        path: '/auth/me',
        description: 'Get current user profile information.',
        responses: [
          { 
            status: 200, 
            description: 'Profile retrieved', 
            data: { id: 'usr_1', email: 'admin@scale.com', firstName: 'Admin', lastName: 'User', role: 'admin', isActive: true, isEmailVerified: true, tenant: { id: 'ten_1', name: 'Scale Corp' } },
            schema: {
              id: { type: 'string', required: true, description: 'User UUID.' },
              email: { type: 'string', required: true, description: 'Email address.' },
              tenant: { type: 'object', required: true, description: 'Tenant details.', children: {
                id: { type: 'string', required: true, description: 'Tenant identifier.' },
                name: { type: 'string', required: true, description: 'Name of the organization.' }
              }}
            }
          }
        ],
        requiresAuth: true
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
        description: 'List all charging stations with advanced filtering.',
        query: {
          name: { type: 'string', required: false, description: 'Partial name match', defaultValue: '' },
          locationId: { type: 'string', required: false, description: 'Filter by location ID', defaultValue: '' },
          status: { type: 'string', required: false, description: 'Charging status enum', defaultValue: 'Available' }
        },
        responses: [
          { 
            status: 200, 
            description: 'Stations retrieved', 
            data: {
              items: [
                { 
                  id: 'st_1', name: 'Downtown Hub', serialNumber: 'SN001', model: 'UltraCharge', vendor: 'ABB', 
                  status: 'Available', isOccupied: false, isActive: true, maxPower: 150, 
                  connectorCount: 2, chargePointId: 'CP001', ocppVersion: '1.6j', type: 'DC',
                  connectors: [
                    { id: 'conn_1', connectorId: 1, type: 'CCS2', status: 'Available', maxPower: 150 }
                  ]
                }
              ],
              meta: { total: 15, page: 1, limit: 10, totalPages: 2 }
            },
            schema: {
              items: {
                type: 'array',
                required: true,
                description: 'List of station objects.',
                children: {
                  id: { type: 'string', required: true, description: 'Station UUID.' },
                  name: { type: 'string', required: true, description: 'Display name.' },
                  status: { type: 'string', required: true, description: 'Current charging status.' },
                  isOccupied: { type: 'boolean', required: true, description: 'Whether any connector is in use.' },
                  connectors: {
                    type: 'array',
                    required: true,
                    description: 'Hardware connectors on this station.',
                    children: {
                      connectorId: { type: 'number', required: true, description: 'Station-local index.' },
                      type: { type: 'string', required: true, description: 'Socket type (CCS2, Type2, etc).' },
                      status: { type: 'string', required: true, description: 'Connector status.' }
                    }
                  }
                }
              }
            }
          }
        ],
        requiresAuth: true
      },
      {
        id: 'stations-create',
        method: 'POST',
        path: '/stations',
        description: 'Provision a new charging station.',
        body: {
          name: { type: 'string', required: true, description: 'Station name', defaultValue: 'North Station' },
          locationId: { type: 'string', required: true, description: 'UUID of location', defaultValue: 'loc_1' },
          identity: { type: 'string', required: true, description: 'OCPP identity string', defaultValue: 'CP_001' }
        },
        responses: [
          { status: 201, description: 'Station created', data: { id: 'st_2', name: 'North Station' } }
        ],
        requiresAuth: true
      },
      {
        id: 'stations-remote-start',
        method: 'POST',
        path: '/stations/:id/remote-start',
        description: 'Trigger a remote start transaction request.',
        params: { id: { type: 'string', required: true, description: 'Station UUID', defaultValue: 'st_1' } },
        body: {
          connectorId: { type: 'number', required: true, description: 'Connector index', defaultValue: 1 },
          idTag: { type: 'string', required: true, description: 'RFID tag', defaultValue: 'RFID_123' },
          userId: { type: 'string', required: true, description: 'User UUID', defaultValue: 'usr_1' }
        },
        responses: [
          { 
            status: 200, 
            description: 'Request accepted', 
            data: { status: 'Accepted', transactionId: 501 },
            schema: {
              status: { type: 'string', required: true, description: 'OCPP response status (Accepted/Rejected).' },
              transactionId: { type: 'number', required: false, description: 'ID of the started transaction.' }
            }
          }
        ],
        requiresAuth: true
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
        description: 'Get all charging sessions with filtering.',
        query: {
          status: { type: 'string', required: false, description: 'in-progress/completed/failed', defaultValue: '' }
        },
        responses: [
          { 
            status: 200, 
            description: 'Sessions retrieved', 
            data: {
              items: [
                { 
                  id: 'sess_1', stationId: 'st_1', stationName: 'Downtown Hub', userId: 'usr_1', 
                  connectorId: 1, transactionId: 501, status: 'completed', 
                  startTime: '2024-03-20T10:00:00Z', endTime: '2024-03-20T11:00:00Z', 
                  energyDeliveredKwh: 22.5, durationMinutes: 60 
                }
              ],
              meta: { total: 150, page: 1, limit: 10, totalPages: 15 }
            },
            schema: {
              items: {
                type: 'array',
                required: true,
                description: 'List of session records.',
                children: {
                  id: { type: 'string', required: true, description: 'Session UUID.' },
                  status: { type: 'string', required: true, description: 'Session state.' },
                  energyDeliveredKwh: { type: 'number', required: true, description: 'Energy delivered in kWh.' },
                  durationMinutes: { type: 'number', required: true, description: 'Total session duration.' }
                }
              }
            }
          }
        ],
        requiresAuth: true
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
        description: 'Get all charging locations.',
        query: { name: { type: 'string', required: false, description: 'Search by name', defaultValue: '' } },
        responses: [
          { 
            status: 200, 
            description: 'List retrieved', 
            data: {
              items: [{ id: 'loc_1', name: 'West Hub', address: '123 Main St', city: 'San Jose', state: 'CA', zipCode: '95112', country: 'USA', isActive: true }],
              meta: { total: 5, page: 1, limit: 10, totalPages: 1 }
            },
            schema: {
              items: { type: 'array', required: true, description: 'List of location objects.' },
              meta: { type: 'object', required: true, description: 'Pagination metadata.' }
            }
          }
        ],
        requiresAuth: true
      },
      {
        id: 'locations-create',
        method: 'POST',
        path: '/locations',
        description: 'Create a new location.',
        body: {
          name: { type: 'string', required: true, description: 'Location name', defaultValue: 'East Hub' },
          address: { type: 'string', required: true, description: 'Full address', defaultValue: '456 Side St' },
          city: { type: 'string', required: true, description: 'City', defaultValue: 'San Jose' },
          state: { type: 'string', required: true, description: 'State', defaultValue: 'CA' },
          zipCode: { type: 'string', required: true, description: 'Zip Code', defaultValue: '95113' },
          country: { type: 'string', required: true, description: 'Country', defaultValue: 'USA' }
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
        description: 'List all active tenants with user counts.',
        responses: [
          { 
            status: 200, 
            description: 'List retrieved', 
            data: {
              items: [{ id: 'ten_1', name: 'Scale Corp', slug: 'scale-corp', isActive: true, userCount: 12 }],
              meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
            },
            schema: {
              items: {
                type: 'array',
                required: true,
                description: 'List of tenant summaries.',
                children: {
                  id: { type: 'string', required: true, description: 'Tenant UUID.' },
                  name: { type: 'string', required: true, description: 'Company name.' },
                  slug: { type: 'string', required: true, description: 'URL-friendly identifier.' },
                  userCount: { type: 'number', required: true, description: 'Number of associated users.' }
                }
              }
            }
          }
        ],
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Users',
    endpoints: [
      {
        id: 'users-list',
        method: 'GET',
        path: '/users',
        description: 'List all users in your tenant.',
        responses: [
          { 
            status: 200, 
            description: 'Users retrieved', 
            data: {
              items: [{ id: 'usr_1', email: 'admin@scale.com', firstName: 'Admin', lastName: 'User', role: 'admin', isActive: true, isEmailVerified: true }],
              meta: { total: 45, page: 1, limit: 10, totalPages: 5 }
            },
            schema: {
              items: { type: 'array', required: true, description: 'List of user objects.' }
            }
          }
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
        description: 'List all active webhook configurations.',
        responses: [
          { 
            status: 200, 
            description: 'List retrieved', 
            data: {
              items: [{ id: 'wh_1', name: 'Billing Hook', url: 'https://site.com/hook', events: ['StartTransaction', 'StopTransaction'], isActive: true }],
              meta: { total: 2, page: 1, limit: 10, totalPages: 1 }
            },
            schema: {
              items: {
                type: 'array',
                required: true,
                description: 'Webhook configurations.',
                children: {
                  url: { type: 'string', required: true, description: 'Target endpoint.' },
                  events: { type: 'string[]', required: true, description: 'Subscribed OCPP events.' }
                }
              }
            }
          }
        ],
        requiresAuth: true
      }
    ]
  }
];
