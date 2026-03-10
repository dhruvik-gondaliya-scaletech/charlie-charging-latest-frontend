import { z } from 'zod';
import { ConnectorType } from '@/types';

export const stationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  chargePointId: z.string().min(1, 'Charge Point ID is required')
    .regex(/^[A-Za-z0-9_-]+$/, 'Only letters, numbers, underscores and hyphens allowed'),
  serialNumber: z.string().min(1, 'Serial Number is required'),
  model: z.string().min(1, 'Model is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  firmware: z.string().min(1, 'Firmware version is required'),
  maxPower: z.coerce.number().min(1, 'Max power must be at least 1kW').max(1000, 'Max power cannot exceed 1000kW').default(22),
  locationId: z.string().min(1, 'Location is required'),
  ocppVersion: z.enum(['1.6', '2.0.1']).default('1.6'),
  type: z.enum(['AC', 'DC'], { message: 'Station type is required' }),
  connectorTypes: z.array(z.string()).min(1, 'At least one connector type is required'),
});

export const remoteStartSchema = z.object({
  connectorId: z.number().min(1, 'Connector ID must be at least 1'),
  idTag: z.string().min(1, 'ID Tag is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export const remoteStopSchema = z.object({
  transactionId: z.number().min(1, 'Transaction ID is required'),
});

export const configurationKeySchema = z.object({
  key: z.string().min(1, 'Configuration key is required'),
  value: z.string().min(1, 'Configuration value is required'),
});

export type StationFormData = z.infer<typeof stationSchema>;
export type RemoteStartFormData = z.infer<typeof remoteStartSchema>;
export type RemoteStopFormData = z.infer<typeof remoteStopSchema>;
export type ConfigurationKeyFormData = z.infer<typeof configurationKeySchema>;
