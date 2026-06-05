import { PortalEndpoint } from '../portal-data';

export const ocpiEndpoints: PortalEndpoint[] = [
  {
    id: 'partner-ocpi-stats',
    method: 'GET',
    path: '/partner/ocpi/stats',
    description: 'Get OCPI Summary Statistics',
    responses: [
      {
        status: 200,
        description: 'OCPI statistics successfully retrieved',
        data: {
          success: true,
          statusCode: 200,
          data: {
            activeConnectionsCount: 3,
            totalTokensCount: 154,
            totalSessionsCount: 42,
            totalCdrsCount: 120
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-credentials-list',
    method: 'GET',
    path: '/partner/ocpi/credentials',
    description: 'List OCPI Connections',
    query: {
      page: {
        type: 'number',
        required: false,
        description: 'Page number for pagination.',
        defaultValue: 1
      },
      pageSize: {
        type: 'number',
        required: false,
        description: 'Number of items per page.',
        defaultValue: 10
      },
      search: {
        type: 'string',
        required: false,
        description: 'Search filter for CPO name or party ID.'
      }
    },
    responses: [
      {
        status: 200,
        description: 'OCPI connection credentials list retrieved',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 'conn_1',
              status: 'CONNECTED',
              cpoName: 'e-mobility-cpo',
              partyId: 'CPO',
              countryCode: 'NL',
              url: 'https://cpo.example.com/ocpi',
              email: 'admin@cpo.example.com',
              createdAt: '2026-06-01T12:00:00Z'
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-credentials-generate',
    method: 'POST',
    path: '/partner/ocpi/credentials/generate-token',
    description: 'Generate Registration Token A',
    body: {
      url: {
        type: 'string',
        required: true,
        description: 'The endpoint URL of the external partner node.',
        defaultValue: 'https://partner-msp.com/ocpi/versions'
      },
      email: {
        type: 'string',
        required: false,
        description: 'The contact email address of the partner operator.',
        defaultValue: 'noc@partner-msp.com'
      }
    },
    responses: [
      {
        status: 201,
        description: 'A registration Token A has been successfully generated',
        data: {
          success: true,
          statusCode: 201,
          data: {
            token: 'tok_a_12345abcdef67890',
            url: 'https://partner-msp.com/ocpi/versions',
            email: 'noc@partner-msp.com',
            expiresAt: '2026-06-06T18:00:00Z'
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-credentials-delete',
    method: 'POST',
    path: '/partner/ocpi/credentials/:id/delete',
    description: 'Delete OCPI Connection',
    params: {
      id: {
        type: 'string',
        required: true,
        description: 'The unique credential/connection ID to delete.'
      }
    },
    responses: [
      {
        status: 200,
        description: 'OCPI connection successfully deleted',
        data: {
          success: true,
          statusCode: 200,
          message: 'OCPI connection successfully deleted.'
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-sync-all',
    method: 'POST',
    path: '/partner/ocpi/sync-all',
    description: 'Push Locations & Tariffs',
    responses: [
      {
        status: 200,
        description: 'Synchronization triggered successfully',
        data: {
          success: true,
          statusCode: 200,
          message: 'Locations and tariffs push sync process triggered.'
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-sync-tokens',
    method: 'POST',
    path: '/partner/ocpi/sync-tokens',
    description: 'Pull Roaming Tokens',
    responses: [
      {
        status: 200,
        description: 'Pulling roaming tokens successfully triggered',
        data: {
          success: true,
          statusCode: 200,
          message: 'Tokens pull sync process triggered.'
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-tokens-list',
    method: 'GET',
    path: '/partner/ocpi/tokens',
    description: 'List Roaming Tokens',
    query: {
      page: {
        type: 'number',
        required: false,
        description: 'Page number for pagination.',
        defaultValue: 1
      },
      pageSize: {
        type: 'number',
        required: false,
        description: 'Number of items per page.',
        defaultValue: 10
      },
      search: {
        type: 'string',
        required: false,
        description: 'Search filter by Token UID, Contract ID, or Visual Number.'
      }
    },
    responses: [
      {
        status: 200,
        description: 'Roaming tokens list retrieved',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 'tok_1',
              uid: '04A1B2C3D4E5F6',
              type: 'RFID',
              contractId: 'NL-MSP-C00000001',
              visualNumber: '123456',
              issuer: 'eMSP Partner',
              valid: true,
              createdAt: '2026-06-01T12:00:00Z'
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-sessions-list',
    method: 'GET',
    path: '/partner/ocpi/sessions',
    description: 'List Roaming Sessions',
    query: {
      page: {
        type: 'number',
        required: false,
        description: 'Page number for pagination.',
        defaultValue: 1
      },
      pageSize: {
        type: 'number',
        required: false,
        description: 'Number of items per page.',
        defaultValue: 10
      },
      search: {
        type: 'string',
        required: false,
        description: 'Search filter by session ID or EVSE ID.'
      }
    },
    responses: [
      {
        status: 200,
        description: 'Roaming sessions list retrieved',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 'sess_ocpi_1',
              startDateTime: '2026-06-05T10:00:00Z',
              endDateTime: null,
              kwh: 12.5,
              status: 'ACTIVE',
              locationId: 'loc_1',
              evseUid: 'NL-CHG-E001',
              authorizationId: 'auth_1',
              kwhPrice: 6.25,
              currency: 'EUR'
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-cdrs-list',
    method: 'GET',
    path: '/partner/ocpi/cdrs',
    description: 'List Roaming CDRs',
    query: {
      page: {
        type: 'number',
        required: false,
        description: 'Page number for pagination.',
        defaultValue: 1
      },
      pageSize: {
        type: 'number',
        required: false,
        description: 'Number of items per page.',
        defaultValue: 10
      },
      search: {
        type: 'string',
        required: false,
        description: 'Search filter by CDR ID or EVSE ID.'
      }
    },
    responses: [
      {
        status: 200,
        description: 'Roaming CDRs list retrieved',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 'cdr_ocpi_1',
              startDateTime: '2026-06-04T10:00:00Z',
              endDateTime: '2026-06-04T11:30:00Z',
              kwh: 22.4,
              totalCost: 10.75,
              currency: 'EUR',
              locationId: 'loc_1',
              evseUid: 'NL-CHG-E001',
              authorizationId: 'auth_1'
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-tariffs-list',
    method: 'GET',
    path: '/partner/ocpi/tariffs',
    description: 'List Roaming Tariffs',
    query: {
      page: {
        type: 'number',
        required: false,
        description: 'Page number for pagination.',
        defaultValue: 1
      },
      pageSize: {
        type: 'number',
        required: false,
        description: 'Number of items per page.',
        defaultValue: 10
      },
      search: {
        type: 'string',
        required: false,
        description: 'Search filter by tariff ID.'
      }
    },
    responses: [
      {
        status: 200,
        description: 'Roaming tariffs list retrieved',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 'tar_ocpi_1',
              currency: 'EUR',
              pricePerKwh: 0.35,
              flatFee: 1.5,
              minPrice: 2.0,
              maxPrice: 50.0
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-locations-list',
    method: 'GET',
    path: '/partner/ocpi/locations',
    description: 'List Mapped Locations',
    query: {
      page: {
        type: 'number',
        required: false,
        description: 'Page number for pagination.',
        defaultValue: 1
      },
      pageSize: {
        type: 'number',
        required: false,
        description: 'Number of items per page.',
        defaultValue: 10
      },
      search: {
        type: 'string',
        required: false,
        description: 'Search filter by location name or address.'
      }
    },
    responses: [
      {
        status: 200,
        description: 'Mapped locations list retrieved',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 'loc_ocpi_1',
              name: 'Downtown Central Station',
              address: '123 Main St',
              city: 'Amsterdam',
              country: 'NLD',
              coordinates: {
                latitude: '52.370216',
                longitude: '4.895168'
              },
              status: 'ACTIVE'
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-commands-start',
    method: 'POST',
    path: '/partner/ocpi/commands/start',
    description: 'Remote Start Command',
    body: {
      responseUrl: {
        type: 'string',
        required: true,
        description: 'Callback URL to receive command execution updates.',
        defaultValue: 'https://partner-msp.com/ocpi/callback/commands/start'
      },
      token: {
        type: 'object',
        required: true,
        description: 'The roaming token authorizing the command execution.',
        defaultValue: {
          uid: '04A1B2C3D4E5F6',
          type: 'RFID',
          contractId: 'NL-MSP-C00000001'
        }
      },
      locationId: {
        type: 'string',
        required: true,
        description: 'Target location ID where the charging station is situated.',
        defaultValue: 'loc_ocpi_1'
      },
      evseId: {
        type: 'string',
        required: false,
        description: 'Target EVSE ID on the station.',
        defaultValue: 'NL-CHG-E001'
      }
    },
    responses: [
      {
        status: 200,
        description: 'Remote start command accepted',
        data: {
          success: true,
          statusCode: 200,
          data: {
            result: 'ACCEPTED',
            timeout: 30
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-commands-stop',
    method: 'POST',
    path: '/partner/ocpi/commands/stop',
    description: 'Remote Stop Command',
    body: {
      responseUrl: {
        type: 'string',
        required: true,
        description: 'Callback URL to receive command execution updates.',
        defaultValue: 'https://partner-msp.com/ocpi/callback/commands/stop'
      },
      sessionId: {
        type: 'string',
        required: true,
        description: 'The active OCPI session ID to terminate.',
        defaultValue: 'sess_ocpi_1'
      }
    },
    responses: [
      {
        status: 200,
        description: 'Remote stop command accepted',
        data: {
          success: true,
          statusCode: 200,
          data: {
            result: 'ACCEPTED',
            timeout: 30
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-ocpi-commands-unlock',
    method: 'POST',
    path: '/partner/ocpi/commands/unlock',
    description: 'Unlock Connector Command',
    body: {
      responseUrl: {
        type: 'string',
        required: true,
        description: 'Callback URL to receive command execution updates.',
        defaultValue: 'https://partner-msp.com/ocpi/callback/commands/unlock'
      },
      locationId: {
        type: 'string',
        required: true,
        description: 'Target location ID where the station is situated.',
        defaultValue: 'loc_ocpi_1'
      },
      evseId: {
        type: 'string',
        required: true,
        description: 'Target EVSE ID on the station.',
        defaultValue: 'NL-CHG-E001'
      },
      connectorId: {
        type: 'string',
        required: true,
        description: 'Connector ID to unlock.',
        defaultValue: '1'
      }
    },
    responses: [
      {
        status: 200,
        description: 'Unlock connector command accepted',
        data: {
          success: true,
          statusCode: 200,
          data: {
            result: 'ACCEPTED',
            timeout: 30
          }
        }
      }
    ],
    requiresAuth: true
  }
];
