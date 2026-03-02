import { z } from 'zod';

export const stationSchema = z.object({
  name: z.string().min(2, 'Station name must be at least 2 characters'),
  serialNumber: z.string().min(3, 'Serial number must be at least 3 characters'),
  model: z.string().min(2, 'Model must be at least 2 characters'),
  vendor: z.string().min(2, 'Vendor must be at least 2 characters'),
  firmware: z.string().min(1, 'Firmware version is required'),
  isOccupied: z.boolean().default(false),
  isActive: z.boolean().default(true),
  maxPower: z.number().min(1, 'Max power must be at least 1 kW'),
  connectorTypes: z.array(z.string()).min(1, 'At least one connector type is required'),
  connectorCount: z.number().min(1, 'At least one connector is required'),
  locationId: z.string().min(1, 'Location is required'),
  chargePointId: z.string().min(1, 'Charge Point ID is required'),
  ocppVersion: z.string().min(1, 'OCPP version is required'),
  ocppConfiguration: z.record(z.string(), z.unknown()).optional(),
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
