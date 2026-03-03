import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { WebhookConfiguration, WebhookDelivery } from '@/types';

export interface CreateWebhookData {
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  headers?: Record<string, string>;
  maxRetries?: number;
  timeoutSeconds?: number;
}

export type UpdateWebhookData = Partial<CreateWebhookData>;

export interface GetWebhookDeliveriesParams {
  webhookId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

class WebhookService {
  async getAll(name?: string) {
    return httpService.get<WebhookConfiguration[]>(API_CONFIG.endpoints.webhooks.base, {
      params: { name },
    });
  }

  async getById(id: string) {
    return httpService.get<WebhookConfiguration>(API_CONFIG.endpoints.webhooks.byId(id));
  }

  async create(data: CreateWebhookData) {
    return httpService.post<WebhookConfiguration>(API_CONFIG.endpoints.webhooks.base, data);
  }

  async update(id: string, data: UpdateWebhookData) {
    return httpService.patch<WebhookConfiguration>(API_CONFIG.endpoints.webhooks.byId(id), data);
  }

  async delete(id: string) {
    return httpService.delete(API_CONFIG.endpoints.webhooks.byId(id));
  }

  async getSecret(id: string) {
    return httpService.get<{ secretKey: string }>(API_CONFIG.endpoints.webhooks.secret(id));
  }

  async getDeliveries(params?: GetWebhookDeliveriesParams) {
    return httpService.get<WebhookDelivery[]>(API_CONFIG.endpoints.webhooks.deliveries, { params });
  }

  async retryDelivery(deliveryId: string) {
    return httpService.post(API_CONFIG.endpoints.webhooks.retry(deliveryId));
  }
}

export const webhookService = new WebhookService();
