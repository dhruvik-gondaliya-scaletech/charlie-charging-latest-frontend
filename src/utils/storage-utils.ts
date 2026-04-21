import forge from 'node-forge';

const STORAGE_SECRET = process.env.NEXT_PUBLIC_STORAGE_SECRET || 'charlie-docs-obfuscation-key-2026';

/**
 * Encrypts and saves data to localStorage
 */
export function secureSave(key: string, data: any): void {
  if (typeof window === 'undefined') return;

  try {
    const jsonStr = JSON.stringify(data);
    const cipher = forge.cipher.createCipher('AES-CBC', forge.util.createBuffer(forge.util.encodeUtf8(STORAGE_SECRET.padEnd(16, '0').slice(0, 16))));
    const iv = forge.random.getBytesSync(16);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(jsonStr)));
    cipher.finish();

    const encrypted = {
      iv: forge.util.encode64(iv),
      data: forge.util.encode64(cipher.output.getBytes())
    };

    localStorage.setItem(key, JSON.stringify(encrypted));
  } catch (error) {
    console.error('Failed to securely save data:', error);
  }
}

/**
 * Loads and decrypts data from localStorage
 */
export function secureLoad<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const { iv, data } = JSON.parse(stored);
    const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.createBuffer(forge.util.encodeUtf8(STORAGE_SECRET.padEnd(16, '0').slice(0, 16))));

    decipher.start({ iv: forge.util.decode64(iv) });
    decipher.update(forge.util.createBuffer(forge.util.decode64(data)));
    decipher.finish();

    return JSON.parse(forge.util.decodeUtf8(decipher.output.toString())) as T;
  } catch (error) {
    console.error('Failed to securely load data:', error);
    return null;
  }
}

/**
 * Removes data from localStorage
 */
export function secureRemove(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}
