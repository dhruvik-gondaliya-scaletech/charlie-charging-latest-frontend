import httpService from '@/lib/http-service';
import { BrandResponse } from '@/types';
import { API_CONFIG } from '@/constants/constants';

export interface GetBrandsParams {
    search?: string;
    page?: number;
    limit?: number;
}

class BrandService {
    async getAllBrands(params?: GetBrandsParams): Promise<BrandResponse> {
        return httpService.get<BrandResponse>(API_CONFIG.endpoints.brands.base, { params });
    }

    async getModelsByBrand(brandId: number): Promise<any> {
        return httpService.get(`${API_CONFIG.endpoints.brands.base}/${brandId}/models`);
    }

    async getConnectorTypes(): Promise<any> {
        return httpService.get(`${API_CONFIG.endpoints.brands.base}/connector-types`);
    }
}

export const brandService = new BrandService();
