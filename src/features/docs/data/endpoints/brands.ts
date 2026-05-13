import { PortalEndpoint } from '../portal-data';

export const brandsEndpoints: PortalEndpoint[] = [
  {
    id: 'partner-brands-current',
    method: 'GET',
    path: '/partner/brands/current',
    description: 'Fetch White-Label App Customizations',
    responses: [
      {
        status: 200,
        description: 'Tenant Customization Configuration Discovered',
        data: {
          success: true,
          statusCode: 200,
          data: {
            tenantId: 'ten_master_001',
            brandName: 'VoltCharge Networks',
            primaryColor: '#00FF66',
            secondaryColor: '#0A0A0A',
            logoUrl: 'https://assets.scale-ev.com/logos/voltcharge.png',
            supportEmail: 'help@voltcharge.com',
            cnameDomain: 'portal.voltcharge.com',
            features: {
              enableApplePay: true,
              requireRfidLink: false
            }
          }
        }
      }
    ],
    requiresAuth: true
  },
  {
    id: 'partner-brands-update',
    method: 'PUT',
    path: '/partner/brands/current',
    description: 'Apply Theme & White-Label Overwrites',
    body: {
      brandName: { 
        type: 'string', 
        required: true, 
        description: 'Top-level enterprise tenant brand alias title.', 
        defaultValue: 'VoltCharge Premium' 
      },
      primaryColor: { 
        type: 'string', 
        required: true, 
        description: 'Hexadecimal visual highlight target color token.', 
        defaultValue: '#10B981' 
      },
      secondaryColor: { 
        type: 'string', 
        required: false, 
        description: 'Secondary or surface base contrast hex modifier.', 
        defaultValue: '#1F2937' 
      },
      logoUrl: { 
        type: 'string', 
        required: false, 
        description: 'Publicly reachable CDN source asset image path link.', 
        defaultValue: 'https://assets.scale-ev.com/logos/volt_v2.png' 
      },
      supportEmail: { 
        type: 'string', 
        required: false, 
        description: 'Forwarding contact route address published inside native apps.', 
        defaultValue: 'support@voltcharge.com' 
      },
      cnameDomain: { 
        type: 'string', 
        required: false, 
        description: 'Custom verified domain mapped to CSMS load balancers.', 
        defaultValue: 'dashboard.voltcharge.com' 
      }
    },
    responses: [
      {
        status: 200,
        description: 'Brand Identity Reloaded Successfully',
        data: {
          success: true,
          statusCode: 200,
          data: {
            brandName: 'VoltCharge Premium',
            primaryColor: '#10B981',
            updatedAt: '2026-05-13T12:05:00Z'
          }
        }
      }
    ],
    requiresAuth: true
  }
];
