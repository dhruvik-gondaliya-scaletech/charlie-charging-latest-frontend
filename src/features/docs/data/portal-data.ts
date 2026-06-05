import { authEndpoints } from './endpoints/auth';
import { locationsEndpoints } from './endpoints/locations';
import { stationsEndpoints } from './endpoints/stations';
import { sessionsEndpoints } from './endpoints/sessions';
import { tariffsEndpoints } from './endpoints/tariffs';
import { brandsEndpoints } from './endpoints/brands';
import { usersEndpoints } from './endpoints/users';
import { ocpiEndpoints } from './endpoints/ocpi';
import { API_CONFIG } from '@/constants/constants';

export interface ResponseField {
  type: string;
  required: boolean;
  description: string;
  children?: Record<string, ResponseField>;
}

export interface PortalEndpoint {
  id: string; // URL slug for [endpoint]
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

export interface PortalGroup {
  name: string;
  categorySlug: string; // URL slug for [category]
  endpoints: PortalEndpoint[];
}

export interface GuideSection {
  id: string; // URL slug for [endpoint] under 'guides' category
  title: string;
  content: string;
}

export const GUIDE_DATA: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `
# Getting Started with Partner APIs

The Partner API allows trusted external third-party partners and tenant integrations to programmatically provision infrastructure, manage locations and hardware stations, control charging sessions (remote start/stop), configure pricing tariffs, and fetch real-time analytics.

### Environments
- **Production Base URL**: \`${API_CONFIG.baseUrl}\`
- **Dynamic API Target**: Configured via \`process.env.NEXT_PUBLIC_API_URL\`

### Standard Integration Sequence
To fully provision and control infrastructure programmatically, execute the following logical sequence:
1. **Authentication**: Request an access token using tenant client credentials.
2. **Pricing Structure**: Scaffold your billing tiers using the Tariffs API.
3. **Physical Site**: Provision a host location.
4. **Hardware Onboarding**: Register hardware assigning the parent Location ID and Tariff ID.
5. **Remote Operations**: Trigger dynamic charging sessions via over-the-air commands.

### Universal JSON Response Format
All endpoint interactions return standardized envelopes indicating status outcomes:
\`\`\`json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-05-13T12:00:00Z"
}
\`\`\`
    `
  },
  {
    id: 'authentication',
    title: 'Authentication Guide',
    content: `
# Authentication Protocol

Scale EV utilizes an OAuth2 Client Credentials pattern for service-to-service access. Trusted tenant clients request short-lived JSON Web Tokens (JWT) using unique Client IDs and API Secrets.

### 1. Requesting Tokens
Submit a POST request to \`/partner/auth/token\` supplying your confidential credentials.

\`\`\`bash
curl -X POST "${API_CONFIG.baseUrl}/partner/auth/token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "clientId": "your_tenant_client_id",
    "clientSecret": "your_confidential_secret"
  }'
\`\`\`

### 2. Bearer Authentication
Inject the returned \`access_token\` into the HTTP \`Authorization\` header for secure calls.

\`\`\`http
Authorization: Bearer <your_access_token>
\`\`\`

### 3. Automated Refreshing
Access tokens expire periodically. Invoke the refresh endpoint passing your active \`refresh_token\` to receive un-interrupted authorization leases.
    `
  }
];

export const PORTAL_GROUPS: PortalGroup[] = [
  {
    name: 'Authentication',
    categorySlug: 'auth',
    endpoints: authEndpoints
  },
  {
    name: 'Locations',
    categorySlug: 'locations',
    endpoints: locationsEndpoints
  },
  {
    name: 'Stations',
    categorySlug: 'stations',
    endpoints: stationsEndpoints
  },
  {
    name: 'Charging Sessions',
    categorySlug: 'sessions',
    endpoints: sessionsEndpoints
  },
  {
    name: 'Pricing & Tariffs',
    categorySlug: 'tariffs',
    endpoints: tariffsEndpoints
  },
  {
    name: 'Brands & Hardware',
    categorySlug: 'brands',
    endpoints: brandsEndpoints
  },
  {
    name: 'OCPI & Roaming',
    categorySlug: 'ocpi',
    endpoints: ocpiEndpoints
  },
  // {
  //   name: 'Drivers & Users',
  //   categorySlug: 'users',
  //   endpoints: usersEndpoints
  // }
];

// Helper utility to lookup an endpoint by categorySlug and endpointId
export function getPortalEndpoint(categorySlug: string, endpointId: string): PortalEndpoint | undefined {
  const group = PORTAL_GROUPS.find(g => g.categorySlug === categorySlug);
  if (!group) return undefined;
  return group.endpoints.find(e => e.id === endpointId);
}

// Helper utility to lookup a guide by id
export function getGuideSection(guideId: string): GuideSection | undefined {
  return GUIDE_DATA.find(g => g.id === guideId);
}
