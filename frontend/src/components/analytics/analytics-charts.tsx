"use client"

import { useAnalytics, useClicks } from '@/hooks/use-analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ClicksChart } from './clicks-chart';
import { CountryChart } from './country-chart';
import { DeviceChart } from './device-chart';
import { ClicksTable } from './clicks-table';

interface AnalyticsChartsProps {
  urlId: string;
}

export function AnalyticsCharts({ urlId }: AnalyticsChartsProps) {
  const { data: analytics, isLoading } = useAnalytics(urlId);
  const { data: clicks } = useClicks(urlId, 10);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total de Cliques</CardTitle>
          <CardDescription>Número total de cliques nesta URL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{analytics.totalClicks}</div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <ClicksChart data={analytics.clicksByDate} />
        <CountryChart data={analytics.clicksByCountry} />
        <DeviceChart data={analytics.clicksByDevice} />
        {clicks && clicks.length > 0 && (
          <div className="md:col-span-2">
            <ClicksTable clicks={clicks} />
          </div>
        )}
      </div>
    </div>
  );
}

