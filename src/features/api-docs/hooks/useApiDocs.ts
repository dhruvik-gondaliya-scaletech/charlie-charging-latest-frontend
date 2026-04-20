import { useQuery, useMutation } from '@tanstack/react-query';
import { apiDocsService } from '@/services/api-docs.service';
import { decryptCredentials } from '@/utils/decryption';
import { toast } from 'sonner';

/**
 * Hook to fetch and decrypt tenant credentials.
 */
export function useGetCredentials() {
  return useQuery({
    queryKey: ['api-docs', 'credentials'],
    queryFn: async () => {
      const encryptedData = await apiDocsService.getCredentials();
      const decrypted = decryptCredentials(encryptedData);
      if (!decrypted) {
        throw new Error('Failed to decrypt credentials');
      }
      return decrypted;
    },
    enabled: false, // Only run on-demand (e.g. when 'Reveal' is clicked)
    retry: false,
  });
}

/**
 * Hook to fetch a temporary documentation token.
 */
export function useDocumentationToken() {
  return useMutation({
    mutationFn: () => apiDocsService.getDocumentationToken(),
    onError: (error: any) => {
      console.error('Failed to fetch documentation token:', error);
      toast.error('Failed to retrieve documentation token.');
    }
  });
}
