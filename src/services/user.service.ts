import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { User } from '@/types';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  phoneNumber?: string | null;
}

class UserService {
  async getAllUsers(params?: { search?: string }) {
    return httpService.get<User[]>(API_CONFIG.endpoints.users.base, { params });
  }

  async getUserProfile() {
    return httpService.get<User>(API_CONFIG.endpoints.users.profile);
  }

  async updateProfile(data: UpdateProfileData) {
    return httpService.patch<User>(API_CONFIG.endpoints.users.profile, data);
  }

  async changePassword(data: ChangePasswordData) {
    return httpService.post(API_CONFIG.endpoints.users.changePassword, data);
  }

  async deleteUser(id: string) {
    return httpService.delete(API_CONFIG.endpoints.users.byId(id));
  }
}

export const userService = new UserService();
