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

export enum ConnectorType {
  TYPE_1 = 'TYPE1',
  TYPE_2 = 'TYPE2',
  CCS1 = 'CCS1',
  CCS2 = 'CCS2',
  CCS = 'CCS',
  CHADEMO = 'CHADEMO',
  TESLA = 'TESLA',
  GB_T = 'GB_T',
  COMMANDO = 'COMMANDO',
  THREE_PIN = '3PIN',
  SCHUKO = 'SCHUKO',
  TYPE_3 = 'TYPE3',
  NACS = 'NACS',
  MCS = 'MCS',
}

export interface Connector {
  id: string;
  connectorId: number;
  type: ConnectorType;
  status: ChargingStatus;
  maxPower: number;
  stationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Station {
  id: string;
  name: string;
  serialNumber: string;
  model: string;
  vendor: string;
  firmware: string;
  status: ChargingStatus;
  isOccupied: boolean;
  isActive: boolean;
  maxPower: number;
  lastActiveDate?: string;
  connectorTypes: string[];
  location?: Location;
  locationId: string;
  chargePointId: string;
  ocppVersion: string;
  type: 'AC' | 'DC';
  connectorCount: number;
  ocppConfiguration?: Record<string, unknown>;
  connectors: Connector[];
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

export interface OcppLogResponse {
  logs: OcppLog[];
  total: number;
  limit: number;
  offset: number;
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
  phoneNumber?: string | null;
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
  payload: Record<string, unknown>;
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

export enum SessionStatus {
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface Session {
  id: string;
  stationId: string;
  stationName?: string;
  userId: string | null;
  userFirstName?: string | null;
  userLastName?: string | null;
  connectorId: number;
  connectorTypes?: string | null;
  connectorMaxPower?: number | null;
  idTag: string;
  transactionId: number;
  status: string;
  pluggedAt?: string;
  startTime: string;
  endTime?: string;
  unpluggedAt?: string;
  meterStart?: number;
  meterStop?: number;
  energyDelivered?: number;
  energyDeliveredKwh?: number;
  durationMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SessionFilterParams {
  status?: string;
  connectorId?: number;
  startFrom?: string;
  startTo?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface Brand {
  id: number;
  identifier: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface BrandResponse extends PaginatedResponse<Brand> { }
