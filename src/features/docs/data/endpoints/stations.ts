import { PortalEndpoint } from '../portal-data';

export const stationsEndpoints: PortalEndpoint[] = [
  {
    id: 'partner-stations-list',
    method: 'GET',
    path: '/partner/stations',
    description: 'List EV Charging Stations',
    query: {
      locationId: { 
        type: 'uuid', 
        required: false, 
        description: 'Filter array to include hardware assigned under a specific parent location.' 
      },
      status: { 
        type: 'string', 
        required: false, 
        description: 'Filter by operational CSMS status enum (Available, Preparing, Charging, Faulted).' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Station Fleet Catalog Retrieved',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 'stat_9f8e7d6c-5b4a-3f2e-1d0c-b9a876543210',
              locationId: 'loc_a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
              name: 'Station 01 - Ultra DC 350kW',
              chargePointId: 'CP_HQ_001',
              tariffId: 'tar_11223344-5566-7788-9900-aabbccddeeff',
              status: 'Available',
              connectors: [
                { id: 1, type: 'CCS2', maxKw: 350, status: 'Available' }
              ]
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-stations-create',
    method: 'POST',
    path: '/partner/stations',
    description: 'Onboard Hardware Station',
    body: {
      locationId: { 
        type: 'uuid', 
        required: true, 
        description: 'Target assigned host location ID.', 
        defaultValue: 'loc_a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' 
      },
      name: { 
        type: 'string', 
        required: true, 
        description: 'Unique internal display label.', 
        defaultValue: 'Hypercharger Alpha' 
      },
      chargePointId: { 
        type: 'string', 
        required: true, 
        description: 'OCPP identity identifier hardcoded in station configuration interface.', 
        defaultValue: 'SCALE_EV_CP_009' 
      },
      tariffId: { 
        type: 'uuid', 
        required: true, 
        description: 'Default financial dynamic tier identifier.', 
        defaultValue: 'tar_11223344-5566-7788-9900-aabbccddeeff' 
      },
      model: { 
        type: 'string', 
        required: false, 
        description: 'Hardware model series.', 
        defaultValue: 'Terra 360' 
      },
      vendor: { 
        type: 'string', 
        required: false, 
        description: 'Manufacturer vendor brand.', 
        defaultValue: 'ABB' 
      },
      firmwareVersion: { 
        type: 'string', 
        required: false, 
        description: 'Initial provisioned boot ROM release.', 
        defaultValue: 'v4.2.1-OCPP16J' 
      }
    },
    responses: [
      {
        status: 201,
        description: 'Station Successfully Bootstrapped',
        data: {
          success: true,
          statusCode: 201,
          data: {
            id: 'stat_new_abcdef12-3456-7890-abcd-ef1234567890',
            chargePointId: 'SCALE_EV_CP_009',
            status: 'Offline'
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-stations-detail',
    method: 'GET',
    path: '/partner/stations/:id',
    description: 'Inspect Hardware Station Diagnostics',
    params: {
      id: { 
        type: 'uuid', 
        required: true, 
        description: 'Unique assigned primary identifier ID.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Diagnostic Object Returned',
        data: {
          success: true,
          statusCode: 200,
          data: {
            id: 'stat_9f8e7d6c-5b4a-3f2e-1d0c-b9a876543210',
            chargePointId: 'CP_HQ_001',
            lastHeartbeat: '2026-05-13T11:59:30Z',
            meterValues: { voltage: 402, current: 0, activePower: 0 }
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-stations-update',
    method: 'PATCH',
    path: '/partner/stations/:id',
    description: 'Update Hardware Configuration Variables',
    params: {
      id: { 
        type: 'uuid', 
        required: true, 
        description: 'Target hardware station ID.' 
      }
    },
    body: {
      name: { type: 'string', required: false, description: 'Revised visible alias.' },
      tariffId: { type: 'uuid', required: false, description: 'Switch applied calculation rates.' },
      status: { type: 'string', required: false, description: 'Manually force availability overriding hardware locks.' }
    },
    responses: [
      {
        status: 200,
        description: 'Hardware Configuration Synced',
        data: {
          success: true,
          statusCode: 200,
          data: {
            id: 'stat_9f8e7d6c-5b4a-3f2e-1d0c-b9a876543210',
            name: 'Renamed Alpha Unit'
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-stations-delete',
    method: 'DELETE',
    path: '/partner/stations/:id',
    description: 'Decommission Charge Point Hardware',
    params: {
      id: { 
        type: 'uuid', 
        required: true, 
        description: 'Target hardware station ID to delete.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Hardware Identity Expunged',
        data: {
          success: true,
          statusCode: 200,
          message: 'Station disconnected from message queues and successfully deleted.'
        }
      }
    ],
    requiresAuth: true
  }
];
