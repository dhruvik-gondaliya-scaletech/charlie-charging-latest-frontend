import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiDocsService } from '@/services/api-docs.service';
import { decryptCredentials } from '@/utils/decryption';
import { secureSave, secureLoad } from '@/utils/storage-utils';
import { AUTH_CONFIG } from '@/constants/constants';
import { toast } from 'sonner';

/**
 * Hook to fetch and decrypt tenant credentials.
 */
export function useGetCredentials() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['api-docs', 'credentials'],
    queryFn: async () => {
      const encryptedData = await apiDocsService.getCredentials();
      const decrypted = decryptCredentials(encryptedData);
      if (!decrypted) {
        throw new Error('Failed to decrypt credentials');
      }
      
      // Save to secure storage
      secureSave(AUTH_CONFIG.docsCredentialsKey, decrypted);
      return decrypted;
    },
    initialData: () => secureLoad(AUTH_CONFIG.docsCredentialsKey),
    enabled: false,
    retry: false,
    staleTime: Infinity, // Keep credentials fresh as they rarely change
  });
}

/**
 * Hook to fetch a temporary documentation token.
 */
export function useDocumentationToken() {
  return useMutation({
    mutationFn: async () => {
        const token = await apiDocsService.getDocumentationToken();
        // Save to secure storage
        secureSave(AUTH_CONFIG.docsTokenKey, token);
        return token;
    },
    onError: (error: any) => {
      console.error('Failed to fetch documentation token:', error);
      toast.error('Failed to retrieve documentation token.');
    }
  });
}

/**
 * Hook to get the current stored documentation token.
 */
export function useStoredToken() {
    return secureLoad<string>(AUTH_CONFIG.docsTokenKey);
}
