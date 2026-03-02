export enum StationStatus {
  AVAILABLE = 'available',
  CHARGING = 'charging',
  IN_USE = 'in_use',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  FAULTED = 'faulted',
}

export enum ChargingStatus {
  AVAILABLE = 'Available',
  PREPARING = 'Preparing',
  CHARGING = 'Charging',
  SUSPENDED_EVSE = 'SuspendedEVSE',
  SUSPENDED_EV = 'SuspendedEV',
  FINISHING = 'Finishing',
  RESERVED = 'Reserved',
  UNAVAILABLE = 'Unavailable',
  FAULTED = 'Faulted',
  OFFLINE = 'Offline',
  MAINTENANCE = 'Maintenance',
}

export interface Station {
  id: string;
  name: string;
  serialNumber: string;
  model: string;
  vendor: string;
  firmware: string;
  status: StationStatus | string;
  isOccupied: boolean;
  isActive: boolean;
  maxPower: number;
  lastActiveDate?: string;
  connectorTypes: string[];
  location?: Location | string;
  locationId: string;
  chargePointId: string;
  ocppVersion: string;
  connectorCount: number;
  ocppConfiguration?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  stationCount?: number;
  lastUpdated?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OcppLog {
  id: string;
  chargePointId: string;
  messageType: string;
  direction: 'INCOMING' | 'OUTGOING';
  messageId: string | null;
  message: Record<string, unknown>;
  createdAt: string;
}

export interface DashboardStats {
  totalStations: number;
  availableStations: number;
  energyDelivered: number;
  activeSessions: number;
  capacityUtilization: number;
  activeUsers: number;
}

export interface RecentActivity {
  event: string;
  station: string;
  user: string;
  eventTime: string;
  status: string;
  energyDelivered?: number;
  duration?: number;
  eventId?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
}

export interface Tenant {
  id: string;
  name: string;
  schemaName: string;
  isActive: boolean;
  description?: string;
  isDefault: boolean;
  apiSecret?: string;
  createdAt: string;
  users?: User[];
}

export interface TenantListResponse {
  id: string;
  name: string;
  schemaName: string;
  isActive: boolean;
  description: string | null;
  isDefault: boolean;
  createdAt: string;
  userCount: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  tenantId: string;
  tenant?: Tenant;
}

export enum WebhookEvent {
  START_TRANSACTION = 'StartTransaction',
  STOP_TRANSACTION = 'StopTransaction',
  METER_VALUES = 'MeterValues',
  STATUS_NOTIFICATION = 'StatusNotification',
}

export enum WebhookDeliveryStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  RETRYING = 'retrying',
}

export interface WebhookConfiguration {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  isActive: boolean;
  headers?: Record<string, string>;
  maxRetries: number;
  timeoutSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export enum ConfigurationKeyCategory {
  CORE = 'Core',
  LOCAL_AUTH_LIST = 'Local Auth List Management',
  RESERVATION = 'Reservation',
  SMART_CHARGING = 'Smart Charging',
  REMOTE_TRIGGER = 'Remote Trigger',
}

export interface ConfigurationKey {
  key: string;
  value?: string;
  readonly: boolean;
  category?: ConfigurationKeyCategory;
  description?: string;
  dataType?: string;
  defaultValue?: string;
}

export interface GetConfigurationResponse {
  configurationKey: ConfigurationKey[];
  unknownKey?: string[];
  station: {
    id: string;
    name: string;
    chargePointId: string;
    status: string;
  };
}

export interface SetConfigurationResponse {
  status: 'Accepted' | 'Rejected' | 'RebootRequired' | 'NotSupported';
  key: string;
  value: string;
  message?: string;
}

export interface BulkSetConfigurationResponse {
  results: SetConfigurationResponse[];
  success: boolean;
  summary: string;
}

export interface WebhookDelivery {
  id: string;
  eventType: string;
  payload: Record<string, any>;
  status: WebhookDeliveryStatus;
  responseStatus?: number;
  responseBody?: string | null;
  errorMessage?: string;
  attemptCount: number;
  deliveredAt?: string;
  nextRetryAt?: string;
  createdAt: string;
  webhookConfigName: string;
}

export interface Session {
  id: string;
  stationId: string;
  userId: string;
  connectorId: number;
  idTag: string;
  transactionId: number;
  status: string;
  startTime: string;
  endTime?: string;
  meterStart: number;
  meterStop?: number;
  energyDelivered?: number;
  createdAt: string;
  updatedAt: string;
}
