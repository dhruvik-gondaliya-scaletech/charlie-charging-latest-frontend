import { PortalEndpoint } from '../portal-data';

export const usersEndpoints: PortalEndpoint[] = [
  {
    id: 'partner-users-list',
    method: 'GET',
    path: '/partner/users',
    description: 'Search & Ledger EV Drivers',
    query: {
      email: { 
        type: 'string', 
        required: false, 
        description: 'Locate user exact target email account record.' 
      },
      idTag: { 
        type: 'string', 
        required: false, 
        description: 'Search cross-indexed assigned physical RFID tokens or virtual application identifiers.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Driver Base Array Resolved',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 'usr_abc123-def456-ghi789',
              firstName: 'Alex',
              lastName: 'Mercer',
              email: 'alex.mercer@energygrid.com',
              idTags: ['RFID_DEADBEEF01'],
              status: 'Active',
              createdAt: '2026-03-10T14:22:00Z'
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-users-create',
    method: 'POST',
    path: '/partner/users',
    description: 'Provision Enterprise EV Driver',
    body: {
      email: { 
        type: 'string', 
        required: true, 
        description: 'Unique individual driver registration box email address.', 
        defaultValue: 'driver.alpha@scale-ev.com' 
      },
      firstName: { 
        type: 'string', 
        required: true, 
        description: 'Legal given identification string.', 
        defaultValue: 'Elena' 
      },
      lastName: { 
        type: 'string', 
        required: true, 
        description: 'Family surname token.', 
        defaultValue: 'Rostova' 
      },
      initialIdTag: { 
        type: 'string', 
        required: false, 
        description: 'Optional manual explicit string value assignment matching distributed offline physical card media.', 
        defaultValue: 'SCALE_VIRTUAL_TAG_777' 
      }
    },
    responses: [
      {
        status: 201,
        description: 'Driver Identity Account Provisioned',
        data: {
          success: true,
          statusCode: 201,
          data: {
            id: 'usr_new_99887766-5544-3322-1100',
            email: 'driver.alpha@scale-ev.com',
            idTags: ['SCALE_VIRTUAL_TAG_777'],
            status: 'Active'
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-users-detail',
    method: 'GET',
    path: '/partner/users/:id',
    description: 'Fetch Specific Driver Profile',
    params: {
      id: { 
        type: 'string', 
        required: true, 
        description: 'Unique internal platform user lookup key.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Target Record Evaluated',
        data: {
          success: true,
          statusCode: 200,
          data: {
            id: 'usr_abc123-def456-ghi789',
            firstName: 'Alex',
            lastName: 'Mercer',
            walletBalance: 45.50,
            currency: 'USD',
            activeSessionsCount: 0
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-users-delete',
    method: 'DELETE',
    path: '/partner/users/:id',
    description: 'Revoke Access or Purge Driver Profile',
    params: {
      id: { 
        type: 'string', 
        required: true, 
        description: 'Target platform user identifier to purge.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Access Revoked & Profile Soft-Archived',
        data: {
          success: true,
          statusCode: 200,
          message: 'User RFID authorization token pools purged successfully.'
        }
      }
    ],
    requiresAuth: true
  }
];
