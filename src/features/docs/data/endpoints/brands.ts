import { PortalEndpoint } from '../portal-data';

export const brandsEndpoints: PortalEndpoint[] = [
  {
    id: 'partner-brands-list',
    method: 'GET',
    path: '/partner/brands',
    description: 'List Certified EVSE Hardware Brands',
    query: {
      search: { 
        type: 'string', 
        required: false, 
        description: 'Perform substring match on manufacturer brand name or unique identifier.' 
      },
      page: { 
        type: 'number', 
        required: false, 
        description: 'Pagination page index offset tracker (Default: 1).' 
      },
      limit: { 
        type: 'number', 
        required: false, 
        description: 'Maximum item rows returned per iterative request (Default: 10).' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Paginated Hardware Brands Catalog Retrieved',
        data: {
          success: true,
          statusCode: 200,
          data: {
            items: [
              {
                id: 1,
                identifier: 'easee',
                name: 'Easee',
                createdAt: '2026-01-01T00:00:00Z',
                updatedAt: '2026-01-01T00:00:00Z'
              },
              {
                id: 2,
                identifier: 'charge_amps',
                name: 'Charge Amps',
                createdAt: '2026-01-01T00:00:00Z',
                updatedAt: '2026-01-01T00:00:00Z'
              }
            ],
            meta: {
              total: 2,
              page: 1,
              limit: 10,
              totalPages: 1
            }
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-brands-models',
    method: 'GET',
    path: '/partner/brands/:brandId/models',
    description: 'Retrieve Certified Hardware Models for Brand',
    params: {
      brandId: { 
        type: 'number', 
        required: true, 
        description: 'Target assigned manufacturer brand integer ID.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Hardware Architecture Models Array Discovered',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 101,
              identifier: 'easee_home',
              name: 'Easee - Home',
              brandId: 1,
              connectorTypes: [
                {
                  id: 2,
                  identifier: 'type2',
                  name: 'Type 2',
                  createdAt: '2026-01-01T00:00:00Z',
                  updatedAt: '2026-01-01T00:00:00Z'
                }
              ],
              createdAt: '2026-01-01T00:00:00Z',
              updatedAt: '2026-01-01T00:00:00Z'
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-brands-connectors',
    method: 'GET',
    path: '/partner/brands/connector-types',
    description: 'List Validated Hardware Connector Types',
    responses: [
      {
        status: 200,
        description: 'Universal Sockets & Plugs Reference Enumerated',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 1,
              identifier: 'ccs2',
              name: 'CCS 2',
              createdAt: '2026-01-01T00:00:00Z',
              updatedAt: '2026-01-01T00:00:00Z'
            },
            {
              id: 2,
              identifier: 'type2',
              name: 'Type 2',
              createdAt: '2026-01-01T00:00:00Z',
              updatedAt: '2026-01-01T00:00:00Z'
            },
            {
              id: 3,
              identifier: 'chademo',
              name: 'CHAdeMO',
              createdAt: '2026-01-01T00:00:00Z',
              updatedAt: '2026-01-01T00:00:00Z'
            }
          ]
        }
      }
    ],
    requiresAuth: true
  }
];
