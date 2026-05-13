import { PortalEndpoint } from '../portal-data';

export const tariffsEndpoints: PortalEndpoint[] = [
  {
    id: 'partner-tariffs-list',
    method: 'GET',
    path: '/partner/tariffs',
    description: 'List Pricing Tariffs',
    query: {
      currency: { 
        type: 'string', 
        required: false, 
        description: 'Filter result collection by standard three-letter ISO currency descriptor.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Tariff Array Retrieved Successfully',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 'tar_11223344-5566-7788-9900-aabbccddeeff',
              name: 'Standard DC Fast Peak Rate',
              currency: 'USD',
              pricePerKwh: 0.48,
              connectionFee: 1.00,
              createdAt: '2026-02-01T10:00:00Z'
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-tariffs-create',
    method: 'POST',
    path: '/partner/tariffs',
    description: 'Configure Pricing Tariff Tier',
    body: {
      name: { 
        type: 'string', 
        required: true, 
        description: 'Descriptive title summarizing the calculation logic.', 
        defaultValue: 'Ultra Fast Base USD Tier' 
      },
      currency: { 
        type: 'string', 
        required: true, 
        description: 'Standard 3-letter target ISO transaction currency representation.', 
        defaultValue: 'USD' 
      },
      pricePerKwh: { 
        type: 'number', 
        required: true, 
        description: 'Baseline flat transactional rate calculated against metered kilowatt hours consumed.', 
        defaultValue: 0.52 
      },
      connectionFee: { 
        type: 'number', 
        required: false, 
        description: 'Static activation surplus added at initial successful socket connection handshake.', 
        defaultValue: 1.50 
      }
    },
    responses: [
      {
        status: 201,
        description: 'Tariff Schema Successfully Formulated',
        data: {
          success: true,
          statusCode: 201,
          data: {
            id: 'tar_new_8899aabb-ccdd-eeff-0011-223344556677',
            name: 'Ultra Fast Base USD Tier',
            pricePerKwh: 0.52
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-tariffs-detail',
    method: 'GET',
    path: '/partner/tariffs/:id',
    description: 'Inspect Explicit Tariff Structure',
    params: {
      id: { 
        type: 'uuid', 
        required: true, 
        description: 'Target unique price profile identifier.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Resolved Metadata Profile Envelope',
        data: {
          success: true,
          statusCode: 200,
          data: {
            id: 'tar_11223344-5566-7788-9900-aabbccddeeff',
            name: 'Standard DC Fast Peak Rate',
            currency: 'USD',
            pricePerKwh: 0.48,
            connectionFee: 1.00
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-tariffs-update',
    method: 'PATCH',
    path: '/partner/tariffs/:id',
    description: 'Modify Specific Active Prices',
    params: {
      id: { 
        type: 'uuid', 
        required: true, 
        description: 'Target pricing blueprint identifier.' 
      }
    },
    body: {
      name: { type: 'string', required: false, description: 'Revised label tag string.' },
      pricePerKwh: { type: 'number', required: false, description: 'Adjust calculation scale multiplier.' }
    },
    responses: [
      {
        status: 200,
        description: 'Pricing Updates Committed',
        data: {
          success: true,
          statusCode: 200,
          data: {
            id: 'tar_11223344-5566-7788-9900-aabbccddeeff',
            pricePerKwh: 0.55
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-tariffs-delete',
    method: 'DELETE',
    path: '/partner/tariffs/:id',
    description: 'Deprecate Calculation Tariff Model',
    params: {
      id: { 
        type: 'uuid', 
        required: true, 
        description: 'Target blueprint ID to eliminate.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Model Unassigned & Dropped',
        data: {
          success: true,
          statusCode: 200,
          message: 'Tariff successfully detached from hardware defaults and archived.'
        }
      }
    ],
    requiresAuth: true
  }
];
