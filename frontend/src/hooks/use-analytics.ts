import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/services/api';

export function useAnalytics(urlId: string) {
  return useQuery({
    queryKey: ['analytics', urlId],
    queryFn: () => analyticsApi.getByUrlId(urlId),
    enabled: !!urlId,
  });
}

export function useClicks(urlId: string, limit?: number) {
  return useQuery({
    queryKey: ['analytics', urlId, 'clicks', limit],
    queryFn: () => analyticsApi.getClicks(urlId, limit),
    enabled: !!urlId,
  });
}

