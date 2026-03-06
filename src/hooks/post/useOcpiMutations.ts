import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ocpiService } from '@/services/ocpi.service';
import { toast } from 'sonner';

export const useGenerateOcpiToken = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (url: string) => ocpiService.generateRegistrationToken(url),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ocpi-credentials'] });
            queryClient.invalidateQueries({ queryKey: ['ocpi-stats'] });
            toast.success('Registration token (Token A) generated successfully');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to generate token';
            toast.error(errorMessage);
        },
    });
};
