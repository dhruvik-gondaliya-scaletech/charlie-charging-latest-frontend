import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';

export interface Tariff {
  id: string;
  name: string;
  pricePerKwh: number;
  serviceFeePercentage: number;
  connectionFee: number;
  idleFee: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTariffData {
  name: string;
  pricePerKwh: number;
  serviceFeePercentage: number;
  connectionFee: number;
  idleFee: number;
  currency: string;
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
}

class BillingService {
  async getTariffs() {
    return httpService.get<Tariff[]>(API_CONFIG.endpoints.billing.tariffs);
  }

  async getTariffById(id: string) {
    return httpService.get<Tariff>(API_CONFIG.endpoints.billing.tariffById(id));
  }

  async createTariff(data: CreateTariffData) {
    return httpService.post<Tariff>(API_CONFIG.endpoints.billing.tariffs, data);
  }

  async updateTariff(id: string, data: UpdateTariffData) {
    return httpService.patch<Tariff>(API_CONFIG.endpoints.billing.tariffById(id), data);
  }

  async deleteTariff(id: string) {
    return httpService.delete<void>(API_CONFIG.endpoints.billing.tariffById(id));
  }

  async estimateCost(data: EstimateCostData) {
    return httpService.post<EstimateCostResponse>(API_CONFIG.endpoints.billing.estimate, data);
  }
}

export const billingService = new BillingService();
