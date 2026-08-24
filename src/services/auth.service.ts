import httpService from '@/lib/http-service';
import { API_CONFIG, AUTH_CONFIG } from '@/constants/constants';
import { User, Tenant, TenantMembership } from '@/types';

export interface LoginResponse {
  success?: boolean;
  access_token?: string;
  user?: User;
  tenant?: Tenant;
  requiresTenantSelection?: boolean;
  tenants?: TenantMembership[];
}

export interface SelectTenantData {
  email: string;
  password: string;
  tenantId: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface InviteUserData {
  email: string;
  firstName?: string;
  lastName?: string;
  roleId: string;
  locationIds?: string[];
}

export interface AcceptInvitationData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

class AuthService {
  async login(email: string, password: string) {
    return httpService.post<LoginResponse>(API_CONFIG.endpoints.auth.login, { email, password });
  }

  async googleLogin(idToken: string) {
    return httpService.post<LoginResponse>(API_CONFIG.endpoints.auth.googleLogin, { idToken });
  }

  async selectTenant(data: SelectTenantData) {
    return httpService.post<LoginResponse>(API_CONFIG.endpoints.auth.selectTenant, data);
  }

  async switchTenant(tenantId: string) {
    return httpService.post<LoginResponse>(API_CONFIG.endpoints.auth.switchTenant, { tenantId });
  }

  async register(data: RegisterData) {
    return httpService.post(API_CONFIG.endpoints.auth.register, data);
  }

  async verifyEmail(token: string) {
    return httpService.post(API_CONFIG.endpoints.auth.verifyEmail, { token });
  }

  async resendVerification(email: string) {
    return httpService.post(API_CONFIG.endpoints.auth.resendVerification, { email });
  }

  async inviteUser(data: InviteUserData) {
    return httpService.post(API_CONFIG.endpoints.auth.inviteUser, data);
  }

  async acceptInvitation(token: string, data: AcceptInvitationData) {
    return httpService.post(`${API_CONFIG.endpoints.auth.acceptInvitation}?token=${token}`, data);
  }

  async forgotPassword(email: string) {
    return httpService.post(API_CONFIG.endpoints.auth.forgotPassword, { email });
  }

  async resetPassword(data: ResetPasswordData) {
    return httpService.post(API_CONFIG.endpoints.auth.resetPassword, data);
  }

  async getMe() {
    return httpService.get<User>(API_CONFIG.endpoints.auth.me);
  }

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_CONFIG.tokenKey);
      localStorage.removeItem(AUTH_CONFIG.userKey);
      localStorage.removeItem(AUTH_CONFIG.tenantKey);
    }
  }
}

export const authService = new AuthService();
