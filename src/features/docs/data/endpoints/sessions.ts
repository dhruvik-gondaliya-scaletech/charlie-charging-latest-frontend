import { PortalEndpoint } from '../portal-data';

export const sessionsEndpoints: PortalEndpoint[] = [
  {
    id: 'partner-sessions-start',
    method: 'POST',
    path: '/partner/sessions/remote-start',
    description: 'Trigger Over-the-Air Remote Start',
    body: {
      stationId: { 
        type: 'uuid', 
        required: true, 
        description: 'Target parent hardware station identifier ID.', 
        defaultValue: 'stat_9f8e7d6c-5b4a-3f2e-1d0c-b9a876543210' 
      },
      connectorId: { 
        type: 'integer', 
        required: true, 
        description: 'Physical hardware socket/cable port integer index (typically 1 or 2).', 
        defaultValue: 1 
      },
      idTag: { 
        type: 'string', 
        required: true, 
        description: 'Authorized RFID identity tag or Virtual API User Hash authorization token.', 
        defaultValue: 'RFID_PARTNER_AUTH_99' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'RemoteStartTransaction Issued to CSMS',
        data: {
          success: true,
          statusCode: 200,
          data: {
            status: 'Accepted',
            transactionId: 10045,
            message: 'Remote start command acknowledged by charge point hardware queue.'
          }
        }
      },
      {
        status: 400,
        description: 'Station Offline or Occupied',
        data: {
          success: false,
          statusCode: 400,
          message: 'Hardware state returns Rejected. Connector is currently occupied or unreachable.'
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-sessions-stop',
    method: 'POST',
    path: '/partner/sessions/remote-stop',
    description: 'Terminate Real-Time Charging Session',
    body: {
      sessionId: { 
        type: 'string', 
        required: true, 
        description: 'Active database charging session identifier or target OCPP transactionId.', 
        defaultValue: '10045' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'RemoteStopTransaction Dispatched',
        data: {
          success: true,
          statusCode: 200,
          data: {
            status: 'Accepted',
            message: 'Session interrupt signal transmitted successfully.'
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-sessions-list',
    method: 'GET',
    path: '/partner/sessions',
    description: 'Query Active & Historical Sessions',
    query: {
      stationId: { 
        type: 'uuid', 
        required: false, 
        description: 'Filter scope targeting a unique parent station entity.' 
      },
      status: { 
        type: 'string', 
        required: false, 
        description: 'Filter transactions matching explicit workflow flags (CHARGING, COMPLETED, FAULTED).' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Fetched Session Ledger Arrays',
        data: {
          success: true,
          statusCode: 200,
          data: [
            {
              id: 'sess_55667788-9900-aabb-ccdd-eeff11223344',
              stationId: 'stat_9f8e7d6c-5b4a-3f2e-1d0c-b9a876543210',
              connectorId: 1,
              status: 'CHARGING',
              kwhDelivered: 42.5,
              durationSeconds: 1420,
              startedAt: '2026-05-13T11:30:00Z'
            }
          ]
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-sessions-detail',
    method: 'GET',
    path: '/partner/sessions/:id',
    description: 'Retrieve Detailed Session Metrics',
    params: {
      id: { 
        type: 'string', 
        required: true, 
        description: 'The target specific charging session unique key string.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Live Session Metrics Package',
        data: {
          success: true,
          statusCode: 200,
          data: {
            id: 'sess_55667788-9900-aabb-ccdd-eeff11223344',
            status: 'CHARGING',
            kwhDelivered: 42.5,
            currentKw: 120.4,
            costAccrued: 18.25,
            currency: 'USD',
            meterValuesInterval: [
              { timestamp: '2026-05-13T11:35:00Z', powerKw: 118 },
              { timestamp: '2026-05-13T11:40:00Z', powerKw: 122 }
            ]
          }
        }
      }
    ],
    requiresAuth: true
  }
];
