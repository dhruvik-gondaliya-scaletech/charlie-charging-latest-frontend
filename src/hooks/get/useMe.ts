import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { User } from '@/types';

export const useMe = (options?: Partial<UseQueryOptions<User, Error>>) => {
  return useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
    staleTime: 60000,
    ...options,
  });
};
