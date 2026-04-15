import { useMutation } from '@tanstack/react-query';
import { awsService } from '@/services/aws.service';
import { toast } from 'sonner';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => awsService.uploadFile(file),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to upload image');
    },
  });
};
