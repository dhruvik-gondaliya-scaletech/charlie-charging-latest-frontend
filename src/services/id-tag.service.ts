import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { IdTag, CreateIdTagData, UpdateIdTagData } from '@/types';

class IdTagService {
  async getAllIdTags() {
    return httpService.get<IdTag[]>(API_CONFIG.endpoints.idTags.base);
  }

  async getIdTagById(idTag: string) {
    return httpService.get<IdTag>(API_CONFIG.endpoints.idTags.byId(idTag));
  }

  async createIdTag(data: CreateIdTagData) {
    return httpService.post<IdTag>(API_CONFIG.endpoints.idTags.base, data);
  }

  async updateIdTag(idTag: string, data: UpdateIdTagData) {
    return httpService.patch<IdTag>(API_CONFIG.endpoints.idTags.byId(idTag), data);
  }

  async deleteIdTag(idTag: string) {
    return httpService.delete(API_CONFIG.endpoints.idTags.byId(idTag));
  }
}

export const idTagService = new IdTagService();
