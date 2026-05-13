import { PortalEndpoint } from '../portal-data';

export const locationsEndpoints: PortalEndpoint[] = [
  {
    id: 'partner-locations-list',
    method: 'GET',
    path: '/partner/locations',
    description: 'List Charging Site Locations',
    query: {
      name: { 
        type: 'string', 
        required: false, 
        description: 'Filter target locations by case-insensitive partial match on display name.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Successfully Retrieved Site Catalog',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 'loc_a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
              name: 'Silicon Valley Supercharging Hub',
              address: '3500 Deer Creek Road',
              city: 'Palo Alto',
              state: 'CA',
              country: 'USA',
              zipCode: '94304',
              latitude: 37.394705,
              longitude: -122.150325,
              isActive: true,
              createdAt: '2026-01-15T08:30:00Z'
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-locations-create',
    method: 'POST',
    path: '/partner/locations',
    description: 'Provision a New Site Location',
    body: {
      name: { 
        type: 'string', 
        required: true, 
        description: 'Official physical display label for the site.', 
        defaultValue: 'Downtown Fast Hub' 
      },
      address: { 
        type: 'string', 
        required: false, 
        description: 'Street address line.', 
        defaultValue: '100 Main Street' 
      },
      city: { 
        type: 'string', 
        required: false, 
        description: 'Host city name.', 
        defaultValue: 'San Francisco' 
      },
      state: { 
        type: 'string', 
        required: false, 
        description: 'State, province, or primary administrative region.', 
        defaultValue: 'CA' 
      },
      country: { 
        type: 'string', 
        required: false, 
        description: 'ISO or full country descriptor.', 
        defaultValue: 'USA' 
      },
      zipCode: { 
        type: 'string', 
        required: false, 
        description: 'Postal routing code.', 
        defaultValue: '94105' 
      },
      latitude: { 
        type: 'number', 
        required: false, 
        description: 'GPS coordinate latitude.', 
        defaultValue: 37.774929 
      },
      longitude: { 
        type: 'number', 
        required: false, 
        description: 'GPS coordinate longitude.', 
        defaultValue: -122.419416 
      },
      isActive: { 
        type: 'boolean', 
        required: false, 
        description: 'Immediately toggles operational state visible to hardware clusters.', 
        defaultValue: true 
      }
    },
    responses: [
      {
        status: 201,
        description: 'Location Successfully Provisioned',
        data: {
          success: true,
          statusCode: 201,
          data: {
            id: 'loc_new_12345678-abcd-ef01-2345-6789abcdef01',
            name: 'Downtown Fast Hub',
            isActive: true
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-locations-detail',
    method: 'GET',
    path: '/partner/locations/:id',
    description: 'Retrieve Deep Location Details',
    params: {
      id: { 
        type: 'uuid', 
        required: true, 
        description: 'The target location unique identifier string.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Resolved Metadata Object',
        data: {
          success: true,
          statusCode: 200,
          data: {
            id: 'loc_a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
            name: 'Silicon Valley Supercharging Hub',
            stationsCount: 12,
            activeHardware: 10
          }
        }
      },
      {
        status: 404,
        description: 'Location Resource Not Found',
        data: {
          success: false,
          statusCode: 404,
          message: 'Location ID does not map to any provisioned infrastructure entity.'
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-locations-update',
    method: 'PATCH',
    path: '/partner/locations/:id',
    description: 'Update Location Metadata Attributes',
    params: {
      id: { 
        type: 'uuid', 
        required: true, 
        description: 'The target location ID to modify.' 
      }
    },
    body: {
      name: { type: 'string', required: false, description: 'Revised physical display label.' },
      isActive: { type: 'boolean', required: false, description: 'Toggle site operation accessibility.' }
    },
    responses: [
      {
        status: 200,
        description: 'Attributes Committed Successfully',
        data: {
          success: true,
          statusCode: 200,
          data: {
            id: 'loc_a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
            name: 'Updated Name Display',
            isActive: false
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-locations-delete',
    method: 'DELETE',
    path: '/partner/locations/:id',
    description: 'Archive or Decommission Site Location',
    params: {
      id: { 
        type: 'uuid', 
        required: true, 
        description: 'The target location ID to wipe.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Infrastructure Soft-Deleted',
        data: {
          success: true,
          statusCode: 200,
          message: 'Location successfully unlinked and archived.'
        }
      }
    ],
    requiresAuth: true
  }
];
