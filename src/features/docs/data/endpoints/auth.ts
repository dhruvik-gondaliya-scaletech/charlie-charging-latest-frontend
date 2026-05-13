import { PortalEndpoint } from '../portal-data';

export const authEndpoints: PortalEndpoint[] = [
  {
    id: 'partner-auth-token',
    method: 'POST',
    path: '/partner/auth/token',
    description: 'Obtain Partner Access Token',
    body: {
      clientId: { 
        type: 'uuid', 
        required: true, 
        description: 'Your unique Tenant Client ID obtained from the Scale EV CSMS admin portal.' 
      },
      clientSecret: { 
        type: 'string', 
        required: true, 
        description: 'Your confidential API secret key for machine-to-machine handshakes.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Successful Authorization Lease Issued',
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZ...',
          refresh_token: 'rfr_7890abcdef1234567890abcdef12',
          expires_in: 3600,
          token_type: 'Bearer'
        }
      },
      {
        status: 401,
        description: 'Unauthorized — Invalid Client Credentials',
        data: { 
          success: false, 
          statusCode: 401, 
          message: 'Invalid client credentials or inactive tenant lease.' 
        }
      }
    ],
    requiresAuth: false
  },
  {
    id: 'partner-auth-refresh',
    method: 'POST',
    path: '/partner/auth/refresh',
    description: 'Refresh Access Token Lease',
    body: {
      refreshToken: { 
        type: 'string', 
        required: true, 
        description: 'The valid Refresh Token string issued during your initial token authorization.' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Lease Successfully Extended',
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZ...',
          refresh_token: 'rfr_new_7890abcdef1234567890abc',
          expires_in: 3600,
          token_type: 'Bearer'
        }
      },
      {
        status: 401,
        description: 'Unauthorized — Expired or Revoked Refresh Token',
        data: { 
          success: false, 
          statusCode: 401, 
          message: 'Refresh token expired or session terminated.' 
        }
      }
    ],
    requiresAuth: false
  }
];
