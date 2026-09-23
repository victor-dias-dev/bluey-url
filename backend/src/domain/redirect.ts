export interface LinkRecord {
  originalUrl: string;
  isActive: boolean;
  expiresAt: Date | string | null;
  redirectType: 'PERMANENT' | 'TEMPORARY';
}

export type RedirectDecision =
  | { outcome: 'redirect'; location: string; statusCode: 301 | 302 }
  | { outcome: 'not_found' }
  | { outcome: 'gone' };

export function decideRedirect(link: LinkRecord | null, now: Date = new Date()): RedirectDecision {
  if (!link || !link.isActive) {
    return { outcome: 'not_found' };
  }

  if (link.expiresAt && new Date(link.expiresAt).getTime() <= now.getTime()) {
    return { outcome: 'gone' };
  }

  return {
    outcome: 'redirect',
    location: link.originalUrl,
    statusCode: link.redirectType === 'TEMPORARY' ? 302 : 301,
  };
}
