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
  async getAll(env: string, name?: string) {
    return httpService.get<WebhookConfiguration[]>(API_CONFIG.endpoints.webhooks.base(env), {
      params: { name },
    });
  }

  async getById(env: string, id: string) {
    return httpService.get<WebhookConfiguration>(API_CONFIG.endpoints.webhooks.byId(env, id));
  }

  async create(env: string, data: CreateWebhookData) {
    return httpService.post<WebhookConfiguration>(API_CONFIG.endpoints.webhooks.create(env), data);
  }

  async update(env: string, id: string, data: UpdateWebhookData) {
    return httpService.patch<WebhookConfiguration>(API_CONFIG.endpoints.webhooks.update(env, id), data);
  }

  async delete(id: string) {
    return httpService.delete(API_CONFIG.endpoints.webhooks.delete(id));
  }

  async getSecret(env: string, id: string) {
    return httpService.get<{ secretKey: string }>(API_CONFIG.endpoints.webhooks.secret(env, id));
  }

  async getDeliveries(env: string, params?: GetWebhookDeliveriesParams) {
    return httpService.get<WebhookDelivery[]>(API_CONFIG.endpoints.webhooks.deliveries(env), { params });
  }

  async retryDelivery(deliveryId: string) {
    return httpService.post(API_CONFIG.endpoints.webhooks.retry(deliveryId));
  }
}

export const webhookService = new WebhookService();
