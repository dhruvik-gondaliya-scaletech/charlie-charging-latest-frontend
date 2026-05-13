import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiDocsService } from '@/services/api-docs.service';
import { decryptCredentials } from '@/utils/decryption';
import { secureSave, secureLoad } from '@/utils/storage-utils';
import { AUTH_CONFIG } from '@/constants/constants';
import { toast } from 'sonner';

export interface PartnerCredentials {
  clientId: string;
  clientSecret: string;
}

/**
 * Hook to fetch, decrypt, and cache tenant credentials locally.
 */
export function useGetCredentials() {
  return useQuery<PartnerCredentials | null>({
    queryKey: ['docs', 'partner-credentials'],
    queryFn: async () => {
      try {
        const encryptedData = await apiDocsService.getCredentials();
        const decrypted = decryptCredentials(encryptedData) as PartnerCredentials | null;
        if (!decrypted || !decrypted.clientId) {
          throw new Error('Failed to decrypt valid Client ID payload');
        }
        
        // Persist securely to client localStorage wrapper
        secureSave(AUTH_CONFIG.docsCredentialsKey, decrypted);
        return decrypted as PartnerCredentials;
      } catch (err) {
        console.error('Credential Decryption pipeline error:', err);
        toast.error('Failed to disclose client identity keys securely.');
        throw err;
      }
    },
    initialData: () => secureLoad<PartnerCredentials>(AUTH_CONFIG.docsCredentialsKey),
    enabled: false,
    retry: false,
    staleTime: Infinity,
  });
}

/**
 * Hook to request and instantiate a fresh testing access token lease.
 */
export function useDocumentationToken() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, void>({
    mutationFn: async () => {
      const token = await apiDocsService.getDocumentationToken();
      // Store locally to auto-authorize playgrounds
      secureSave(AUTH_CONFIG.docsTokenKey, token);
      return token;
    },
    onSuccess: () => {
      toast.success('Successfully provisioned ephemeral Bearer testing access token.');
      // Invalidate token query key if needed
      queryClient.invalidateQueries({ queryKey: ['docs', 'stored-token'] });
    },
    onError: (error) => {
      console.error('Failed to fetch documentation access token lease:', error);
      toast.error(error.message || 'Failed to retrieve interactive console authentication keys.');
    }
  });
}

/**
 * Function to retrieve active documentation token string securely from storage.
 */
export function getStoredDocsToken(): string | null {
  const loaded = secureLoad<unknown>(AUTH_CONFIG.docsTokenKey);
  if (loaded && typeof loaded === 'object') {
    const obj = loaded as Record<string, unknown>;
    const token = obj.access_token || obj.token;
    if (typeof token === 'string') return token;
  }
  return typeof loaded === 'string' ? loaded : null;
}

/**
 * Function to retrieve disclosed partner credentials securely from storage.
 */
export function getStoredCredentials(): PartnerCredentials | null {
  return secureLoad<PartnerCredentials>(AUTH_CONFIG.docsCredentialsKey);
}
