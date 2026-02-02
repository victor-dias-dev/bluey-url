export function formatShortUrl(shortCode: string, domain?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  if (domain) {
    return `https://${domain}/${shortCode}`;
  }
  return `${baseUrl}/${shortCode}`;
}

