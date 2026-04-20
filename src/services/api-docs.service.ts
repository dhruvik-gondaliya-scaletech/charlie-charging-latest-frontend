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
    return httpService.post<string>(API_CONFIG.endpoints.auth.documentationToken);
  }

  /**
   * Generic method to test a partner API endpoint.
   * Uses direct axios to avoid httpService auth interceptors while testing with doc tokens.
   */
  async testPartnerApi(method: string, url: string, token: string, data?: any, params?: any) {
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
