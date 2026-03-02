import { API_CONFIG, AUTH_CONFIG } from "@/constants/constants";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class HttpService {
  private static instance: HttpService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.baseUrl,
      timeout: API_CONFIG.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
          
          if (token) {
            if (this.isTokenExpired(token)) {
              this.handleExpiredToken();
              return config;
            }
            
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Backend wraps responses in { success, statusCode, message, data, timestamp }
        // Extract the actual data payload
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          return response.data.data;
        }
        return response.data;
      },
      (error) => {
        if (error.response?.status === 401) {
          const url = error.config?.url || '';
          
          const shouldAutoLogout =
            url.includes('/auth/') ||
            url.includes('/users/profile') ||
            (url.includes('/users') && !url.includes('/change-password'));

          if (shouldAutoLogout && typeof window !== 'undefined') {
            this.handleUnauthorized();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch {
      return true;
    }
  }

  private handleExpiredToken(): void {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem(AUTH_CONFIG.tokenKey);
      localStorage.removeItem(AUTH_CONFIG.userKey);
      localStorage.removeItem(AUTH_CONFIG.tenantKey);
      
      // Clear cookies
      document.cookie = `${AUTH_CONFIG.tokenKey}=; path=/; max-age=0`;
      document.cookie = `${AUTH_CONFIG.userKey}=; path=/; max-age=0`;
      document.cookie = `${AUTH_CONFIG.tenantKey}=; path=/; max-age=0`;
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
  }

  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem(AUTH_CONFIG.tokenKey);
      localStorage.removeItem(AUTH_CONFIG.userKey);
      localStorage.removeItem(AUTH_CONFIG.tenantKey);
      
      // Clear cookies
      document.cookie = `${AUTH_CONFIG.tokenKey}=; path=/; max-age=0`;
      document.cookie = `${AUTH_CONFIG.userKey}=; path=/; max-age=0`;
      document.cookie = `${AUTH_CONFIG.tenantKey}=; path=/; max-age=0`;
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }

  public static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService();
    }
    return HttpService.instance;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get<T>(url, config) as Promise<T>;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post<T>(url, data, config) as Promise<T>;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put<T>(url, data, config) as Promise<T>;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete<T>(url, config) as Promise<T>;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.patch<T>(url, data, config) as Promise<T>;
  }
}

export default HttpService.getInstance();
