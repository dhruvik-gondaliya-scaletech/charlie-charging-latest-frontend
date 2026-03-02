import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export const useUsers = (params?: { search?: string }) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAllUsers(params),
    staleTime: 30000,
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userService.getUserProfile(),
    staleTime: 60000,
  });
};
