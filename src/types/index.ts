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
  J1772 = 'J1772',
  MENNEKES = 'Mennekes',
  CCS1 = 'CCS1',
  CCS2 = 'CCS2',
  CCS = 'CCS',
  CHADEMO = 'CHAdeMO',
  GB_T = 'GB/T',
  THREE_PIN = '3Pin',
  SCHUKO = 'Schuko',
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
  tariffId?: string;
  chargePointId: string;
  ocppVersion: string;
  password?: string;
  type: 'AC' | 'DC';
  visibility: 'public' | 'private';
  connectorCount: number;
  ocppConfiguration?: Record<string, unknown>;
  isFreeCharge?: boolean;
  connectors: Connector[];
  createdAt?: string;
  updatedAt?: string;
}

export enum LocationEnv {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
}

export enum AppEnvironment {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
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
  offlineStationCount?: number;
  lastUpdated?: string;
  isActive?: boolean;
  locationEnv?: LocationEnv;
  visibility?: 'public' | 'private';
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
  completedSessions: number;
  failedSessions: number;
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
  stationId?: string;
  startDate?: string;
  useMode?: SessionUseMode | null;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
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
  slug: string;
  schemaName: string;
  isActive: boolean;
  description: string | null;
  isDefault: boolean;
  createdAt: string;
  userCount: number;
  stripeAccountId?: string | null;
  stripeOnboarded?: boolean;
  stripeChargesEnabled?: boolean;
  stripePayoutsEnabled?: boolean;
}

// ─── RBAC Types ──────────────────────────────────────────────────────────────

export enum AppPermission {
  // OCPP
  OCPP_RESET = 'ocpp.reset',
  OCPP_REMOTE_START = 'ocpp.remote_start',
  OCPP_REMOTE_STOP = 'ocpp.remote_stop',
  OCPP_UNLOCK_CONNECTOR = 'ocpp.unlock_connector',
  OCPP_CHANGE_CONFIG = 'ocpp.change_config',

  // ID Tag
  ID_TAG_UPDATE = 'id_tag.update',
  ID_TAG_CREATE = 'id_tag.create',
  ID_TAG_DELETE = 'id_tag.delete',
  ID_TAG_READ = 'id_tag.read',

  // Driver
  DRIVER_UPDATE = 'driver.update',
  DRIVER_CREATE = 'driver.create',
  DRIVER_READ = 'driver.read',
  DRIVER_DELETE = 'driver.delete',

  // Webhook
  WEBHOOK_READ = 'webhook.read',
  WEBHOOK_RETRY = 'webhook.retry',
  WEBHOOK_DELETE = 'webhook.delete',
  WEBHOOK_UPDATE = 'webhook.update',
  WEBHOOK_CREATE = 'webhook.create',

  // Station
  STATION_READ = 'station.read',
  STATION_DELETE = 'station.delete',
  STATION_UPDATE = 'station.update',
  STATION_CREATE = 'station.create',

  // Connector
  CONNECTOR_READ = 'connector.read',
  CONNECTOR_UPDATE = 'connector.update',

  // Tariff
  TARIFF_DELETE = 'tariff.delete',
  TARIFF_CREATE = 'tariff.create',
  TARIFF_UPDATE = 'tariff.update',
  TARIFF_READ = 'tariff.read',

  // Users
  USERS_ASSIGN_ROLE = 'users.assign_role',
  USERS_ASSIGN_LOCATION = 'users.assign_location',
  USERS_DELETE = 'users.delete',
  USERS_UPDATE = 'users.update',
  USERS_READ = 'users.read',
  USERS_INVITE = 'users.invite',

  // Location
  LOCATION_DELETE = 'location.delete',
  LOCATION_CREATE = 'location.create',
  LOCATION_UPDATE = 'location.update',
  LOCATION_READ = 'location.read',

  // OCPI
  OCPI_COMMAND = 'ocpi.command',
  OCPI_READ = 'ocpi.read',
  OCPI_MANAGE = 'ocpi.manage',

  // Session
  SESSION_READ = 'session.read',

  // Reports
  REPORTS_UPDATE = 'reports.update',
  REPORTS_READ = 'reports.read',

  // Custom/Platform administration permissions
  RBAC_READ = 'rbac.read',
  API_DOCS_READ = 'api_docs.read',
  TENANTS_READ = 'tenants.read',
}

export enum AppRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SITE_MANAGER = 'SITE_MANAGER',
  VIEWER = 'VIEWER',
}

export interface Permission {
  id: string;
  module: string;
  action: string;
  code: string;
  description?: string | null;
}

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  isSystem: boolean;
  tenantId?: string | null;
  permissions?: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleAssignment {
  userId: string;
  roleId: string;
  role: Role;
}

export interface UserLocationAssignment {
  userId: string;
  locationId: string;
  location?: Location;
}

export interface UserEffectivePermissions {
  userId: string;
  permissions: AppPermission[];
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  phoneNumber?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt?: string;
  tenantId?: string;
  tenant?: Tenant;
  // RBAC JWT fields (populated from token payload)
  roles?: string[];        // e.g. ['ADMIN']
  permissions?: AppPermission[];  // e.g. ['station.read', 'session.read']
  modulePermissions?: Record<string, string[]>;
  locations: string[];    // location UUIDs; empty = unrestricted
}

export interface DriverSession {
  id: string;
  stationId: string;
  stationName: string;
  connectorId: number;
  connectorType: string | null;
  pluggedAt: string | null;
  startTime?: string | null;
  remoteStartTime?: string | null;
  remoteStopTime?: string | null;
  endTime: string | null;
  unpluggedAt: string | null;
  durationMinutes: number;
  energyDeliveredKwh: number;
  status: string;
  totalCost: number;
  currency: 'USD' | 'INR';
  createdAt: string;
}

export enum IdTagStatus {
  ACCEPTED = 'Accepted',
  BLOCKED = 'Blocked',
  EXPIRED = 'Expired',
  INVALID = 'Invalid',
}

export enum TokenType {
  RFID = 'RFID (ISO14443)',
  VICINITY = 'Vicinity (ISO15693)',
  PLUG_AND_CHARGE = 'Plug & Charge (eMAID)',
  AUTO_CHARGE = 'AutoCharge (MAC)',
  CUSTOM = 'Custom (OCPP 1.6)',
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IdTag {
  idTag: string;
  status: IdTagStatus;
  idTagType?: string | null;
  driverId?: string | null;
  stationId?: string | null;
  companyName?: string | null;
  driver?: Driver;
  station?: Station;
  locations?: Location[];
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDriverData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
}

export interface CreateIdTagData {
  idTag: string;
  status: IdTagStatus;
  idTagType?: string | null;
  driverId?: string | null;
  stationId?: string | null;
  locationIds?: string[];
  companyName?: string | null;
  expiryDate?: string;
}

export interface UpdateIdTagData {
  status?: IdTagStatus;
  idTagType?: string | null;
  driverId?: string | null;
  stationId?: string | null;
  locationIds?: string[];
  companyName?: string | null;
  expiryDate?: string;
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
  environment: AppEnvironment;
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

export type SessionUseMode = 'CSMS' | 'API';

export interface Session {
  id: string;
  stationId: string;
  stationName?: string;
  userId: string | null;
  userFirstName?: string | null;
  userLastName?: string | null;
  connectorId: number;
  connectorType?: string | null;
  connectorMaxPower?: number | null;
  idTag: string;
  transactionId: string | number;
  status: string;
  pluggedAt?: string;
  startTime?: string | null;
  remoteStartTime?: string | null;
  remoteStopTime?: string | null;
  endTime?: string;
  unpluggedAt?: string;
  meterStart?: number;
  meterStop?: number;
  energyDelivered?: number;
  energyDeliveredKwh?: number;
  durationMinutes?: number;
  currentSpeed?: number;
  peakKwh?: number;
  useMode?: SessionUseMode | null;
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

export type BrandResponse = PaginatedResponse<Brand>;

export interface StationChargingProfile {
  chargingRateUnit: 'A' | 'W';
  limitValue: number;
  syncStatus: 'synced' | 'pending' | 'failed';
  lastSyncedAt?: string;
}

export interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  failedSessions: number;
  totalEnergyDelivered: number;
}

// ─── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  /** Alias for items — both always present */
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FreeChargeKeyResult {
  key: string;
  value: string;
  status: 'Accepted' | 'Rejected' | string;
  message?: string;
}

export interface SetFreeChargeResponse {
  success: boolean;
  enabled: boolean;
  isFreeCharge?: boolean;
  manufacturer: string;
  configurationsUpdated: FreeChargeKeyResult[];
  summary: string;
}

