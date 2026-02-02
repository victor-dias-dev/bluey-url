"use client"

import { useUrls } from '@/hooks/use-urls';
import { UrlCard } from './url-card';
import { Skeleton } from '@/components/ui/skeleton';

export function UrlList() {
  const { data: urls, isLoading } = useUrls();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!urls || urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <p className="text-muted-foreground">Nenhuma URL criada ainda.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Clique em "Nova URL" para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {urls.map((url) => (
        <UrlCard key={url.id} url={url} />
      ))}
    </div>
  );
}

