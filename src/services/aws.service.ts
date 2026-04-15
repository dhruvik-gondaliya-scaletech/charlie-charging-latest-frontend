import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';

class AwsService {
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return httpService.post<{ url: string }>(API_CONFIG.endpoints.aws.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const awsService = new AwsService();
