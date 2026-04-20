import forge from 'node-forge';

/**
 * Decrypts data using a private RSA key with OAEP SHA-256.
 * @param encryptedData Base64 encoded string from the backend.
 * @returns The decrypted object or string.
 */
export function decryptCredentials(encryptedData: string): any {
  const privateKeyPem = process.env.NEXT_PUBLIC_FRONTEND_PRIVATE_KEY || ''; 
  
  if (!privateKeyPem) {
    console.error('Frontend private key not found in environment variables.');
    return null;
  }

  // Handle literal '\n' if they come from environment variable incorrectly
  const formattedKey = privateKeyPem.replace(/\\n/g, '\n').trim();

  try {
    const privateKey = forge.pki.privateKeyFromPem(formattedKey);
    const encryptedBytes = forge.util.decode64(encryptedData);
    
    const decrypted = privateKey.decrypt(encryptedBytes, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create()
      }
    });
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt credentials. Verify your private key and padding.');
  }
}
