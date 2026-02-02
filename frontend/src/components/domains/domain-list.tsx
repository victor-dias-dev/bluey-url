"use client"

import { useDomains } from '@/hooks/use-domains';
import { DomainCard } from './domain-card';
import { Skeleton } from '@/components/ui/skeleton';

export function DomainList() {
  const { data: domains, isLoading } = useDomains();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!domains || domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <p className="text-muted-foreground">Nenhum domínio cadastrado.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Clique em "Novo Domínio" para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {domains.map((domain) => (
        <DomainCard key={domain.id} domain={domain} />
      ))}
    </div>
  );
}

