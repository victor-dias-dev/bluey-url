import { randomInt } from 'node:crypto';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const SHORT_CODE_MIN_LENGTH = 3;
export const SHORT_CODE_MAX_LENGTH = 20;
export const DEFAULT_SHORT_CODE_LENGTH = 6;

const RESERVED_SHORT_CODES = new Set(['health', 'api', 'favicon.ico', 'robots.txt']);

export function generateShortCode(length: number = DEFAULT_SHORT_CODE_LENGTH): string {
  if (length < SHORT_CODE_MIN_LENGTH || length > SHORT_CODE_MAX_LENGTH) {
    throw new Error(
      `Short code length must be between ${SHORT_CODE_MIN_LENGTH} and ${SHORT_CODE_MAX_LENGTH}`
    );
  }

  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += ALPHABET[randomInt(ALPHABET.length)];
  }
  return result;
}

export function isValidShortCode(code: string): boolean {
  return (
    /^[a-zA-Z0-9]+$/.test(code) &&
    code.length >= SHORT_CODE_MIN_LENGTH &&
    code.length <= SHORT_CODE_MAX_LENGTH
  );
}

export function isReservedShortCode(code: string): boolean {
  const normalized = code.toLowerCase();
  return RESERVED_SHORT_CODES.has(normalized) || normalized.startsWith('api');
}
