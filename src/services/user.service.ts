import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { User } from '@/types';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

class UserService {
  async getAllUsers(params?: { search?: string }) {
    return httpService.get<User[]>(API_CONFIG.endpoints.users.base, { params });
  }

  async getUserProfile() {
    return httpService.get<User>(API_CONFIG.endpoints.users.profile);
  }

  async updateProfile(data: UpdateProfileData) {
    return httpService.put<User>(API_CONFIG.endpoints.users.profile, data);
  }

  async changePassword(data: ChangePasswordData) {
    return httpService.put(API_CONFIG.endpoints.users.changePassword, data);
  }
}

export const userService = new UserService();
