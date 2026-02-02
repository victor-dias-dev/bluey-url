"use client"

import { useUrls } from '@/hooks/use-urls';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnalyticsCharts } from './analytics-charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AnalyticsOverview() {
  const { data: urls } = useUrls();
  const [selectedUrlId, setSelectedUrlId] = useState<string>('');

  if (!urls || urls.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <p className="text-muted-foreground">
            Crie URLs para ver analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selecione uma URL</CardTitle>
          <CardDescription>
            Escolha uma URL para visualizar suas estatísticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedUrlId} onValueChange={setSelectedUrlId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma URL" />
            </SelectTrigger>
            <SelectContent>
              {urls.map((url) => (
                <SelectItem key={url.id} value={url.id}>
                  {url.originalUrl} ({url.shortCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedUrlId && <AnalyticsCharts urlId={selectedUrlId} />}
    </div>
  );
}

