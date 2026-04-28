import httpService from "@/lib/http-service";
import { API_CONFIG } from "@/constants/constants";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export class ContactService {
  static async submitForm(data: ContactFormData) {
    return httpService.post<{ success: boolean; message: string }>(API_CONFIG.endpoints.contact, data);
  }
}
