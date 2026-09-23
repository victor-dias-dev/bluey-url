export const DEFAULT_CACHE_TTL_SECONDS = 60 * 60 * 24;

export interface CachedLink {
  url: string;
  type: 301 | 302;
  expiresAt: string | null;
}

export function cacheKey(domainId: string | null | undefined, shortCode: string): string {
  return `short:${domainId || 'default'}:${shortCode}`;
}

export function cachedLinkFromRecord(link: {
  originalUrl: string;
  redirectType: 'PERMANENT' | 'TEMPORARY';
  expiresAt: Date | null;
}): CachedLink {
  return {
    url: link.originalUrl,
    type: link.redirectType === 'TEMPORARY' ? 302 : 301,
    expiresAt: link.expiresAt ? link.expiresAt.toISOString() : null,
  };
}

export function encodeCachedLink(link: CachedLink): string {
  return JSON.stringify(link);
}

/**
 * Reads the current JSON payload and the legacy plain-URL values written
 * before the cache stored redirect type and expiration.
 */
export function decodeCachedLink(raw: string): CachedLink | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CachedLink>;
    if (typeof parsed.url === 'string' && parsed.url.length > 0) {
      return {
        url: parsed.url,
        type: parsed.type === 302 ? 302 : 301,
        expiresAt: typeof parsed.expiresAt === 'string' ? parsed.expiresAt : null,
      };
    }
  } catch {
    // Fall through to the legacy string format.
  }

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return { url: raw, type: 301, expiresAt: null };
  }

  return null;
}

export function cacheTtlSeconds(
  expiresAt: Date | null,
  now: Date = new Date(),
  maxTtl: number = DEFAULT_CACHE_TTL_SECONDS
): number {
  if (!expiresAt) {
    return maxTtl;
  }

  const remaining = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
  if (remaining <= 0) {
    return 0;
  }

  return Math.min(maxTtl, remaining);
}
