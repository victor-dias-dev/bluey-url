const HOSTNAME =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export function normalizeHostname(input: string): string {
  return input.trim().toLowerCase().replace(/\.$/, '');
}

export function isValidHostname(input: string): boolean {
  const value = normalizeHostname(input);
  if (!value || value.includes('://') || value.includes('/') || value.includes(':')) {
    return false;
  }
  return HOSTNAME.test(value);
}
