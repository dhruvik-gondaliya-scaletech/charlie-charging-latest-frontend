import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import axios from 'axios';

export interface CredentialsResponse {
  encryptedData: string;
}

class ApiDocsService {
  /**
   * Fetches the encrypted credentials for the current tenant.
   */
  async getCredentials(): Promise<string> {
    const response = await httpService.get<CredentialsResponse>(API_CONFIG.endpoints.auth.getCredentials);
    return response.encryptedData;
  }

  /**
   * Fetches a temporary documentation token for testing APIs.
   */
  async getDocumentationToken(): Promise<string> {
    const response = await httpService.post<unknown>(API_CONFIG.endpoints.auth.documentationToken);
    if (response && typeof response === 'object') {
      const resObj = response as Record<string, unknown>;
      const token = resObj.access_token || resObj.token;
      if (typeof token === 'string') {
        return token;
      }
      return JSON.stringify(response);
    }
    return typeof response === 'string' ? response : String(response);
  }

  /**
   * Generic method to test a partner API endpoint.
   * Uses direct axios to avoid httpService auth interceptors while testing with doc tokens.
   */
  async testPartnerApi(method: string, url: string, token: string, data?: unknown, params?: unknown) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const response = await axios({
      method,
      url: `${baseUrl}${url}`,
      data,
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}

export const apiDocsService = new ApiDocsService();
