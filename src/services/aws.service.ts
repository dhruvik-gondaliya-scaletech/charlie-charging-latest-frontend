import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import axios from 'axios';

class AwsService {
  async uploadFile(file: File) {
    // 1. Get pre-signed URL from our backend
    const { uploadUrl, fileUrl } = await httpService.get<{
      uploadUrl: string;
      fileUrl: string;
      key: string;
    }>(API_CONFIG.endpoints.aws.uploadUrl, {
      params: {
        fileName: file.name,
        fileType: file.type,
      },
    });

    // 2. Upload directly to S3
    // We use a clean axios instance to avoid our app's auth headers and interceptors
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    return { url: fileUrl };
  }
}

export const awsService = new AwsService();
