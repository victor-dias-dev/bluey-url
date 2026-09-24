/**
 * Drops the host identifier before a click is queued.
 * IPv4 keeps the network prefix. IPv6 zeroes the last non-empty group.
 */
export function anonymizeIp(ip: string | undefined): string | undefined {
  if (!ip) {
    return undefined;
  }

  const value = ip.trim();
  if (!value) {
    return undefined;
  }

  const mapped = value.startsWith('::ffff:') ? value.slice('::ffff:'.length) : value;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(mapped)) {
    const parts = mapped.split('.');
    parts[3] = '0';
    const anonymized = parts.join('.');
    return value.startsWith('::ffff:') ? `::ffff:${anonymized}` : anonymized;
  }

  if (value.includes(':')) {
    const parts = value.split(':');
    for (let index = parts.length - 1; index >= 0; index -= 1) {
      if (parts[index] !== '') {
        parts[index] = '0';
        break;
      }
    }
    return parts.join(':');
  }

  return undefined;
}
