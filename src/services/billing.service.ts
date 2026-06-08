import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { AppEnvironment } from '@/types';

export type Currency = 'USD' | 'INR';

export interface Tariff {
  id: string;
  name: string;
  pricePerKwh: number;
  serviceFeePercentage: number;
  connectionFee: number;
  idleFeePerMinute: number;
  isIdleFeeEnabled: boolean;
  idleGracePeriodMinutes: number;
  maxIdleFee: number;
  currency: Currency;
  environment?: AppEnvironment;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTariffData {
  name: string;
  pricePerKwh: number;
  serviceFeePercentage: number;
  connectionFee: number;
  idleFeePerMinute: number;
  isIdleFeeEnabled: boolean;
  idleGracePeriodMinutes: number;
  maxIdleFee: number;
  currency: Currency;
  environment?: AppEnvironment;
}

export type UpdateTariffData = Partial<CreateTariffData>;

export interface EstimateCostData {
  stationId: string;
  flowType: 'kwh' | 'price' | 'time' | 'KWH' | 'PRICE' | 'TIME';
  value: number;
}

export interface EstimateCostResponse {
  priceperKwh: number;
  energycost: number;
  servicefee: number;
  connectionfee: number;
  total_cost: number;
  isIdleFeeEnabled?: boolean;
  idleFeePerMinute?: number;
  idleGracePeriodMinutes?: number;
  maxIdleFee?: number;
}

class BillingService {
  async getTariffs(env: string) {
    return httpService.get<Tariff[]>(API_CONFIG.endpoints.billing.tariffs(env));
  }

  async getTariffById(env: string, id: string) {
    return httpService.get<Tariff>(API_CONFIG.endpoints.billing.tariffById(env, id));
  }

  async createTariff(env: string, data: CreateTariffData) {
    return httpService.post<Tariff>(API_CONFIG.endpoints.billing.create(env), data);
  }

  async updateTariff(env: string, id: string, data: UpdateTariffData) {
    return httpService.patch<Tariff>(API_CONFIG.endpoints.billing.update(env, id), data);
  }

  async deleteTariff(id: string) {
    return httpService.delete<void>(API_CONFIG.endpoints.billing.delete(id));
  }

  async estimateCost(data: EstimateCostData) {
    return httpService.post<EstimateCostResponse>(API_CONFIG.endpoints.billing.estimate, data);
  }
}

export const billingService = new BillingService();
