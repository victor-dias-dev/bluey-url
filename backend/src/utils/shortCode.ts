/**
 * Generates a random short code for URL shortening
 * Uses alphanumeric characters (a-z, A-Z, 0-9)
 * Default length: 6 characters
 */
export function generateShortCode(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Validates if a short code is valid format
 */
export function isValidShortCode(code: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(code) && code.length >= 3 && code.length <= 20;
}

