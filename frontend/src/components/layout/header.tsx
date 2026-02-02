"use client"

import { useMe } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function Header() {
  const { data: user, isLoading } = useMe();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        {isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <>
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Badge variant="secondary">
              {user?.plan === 'FREE' && 'Free'}
              {user?.plan === 'PRO' && 'Pro'}
              {user?.plan === 'ENTERPRISE' && 'Enterprise'}
            </Badge>
          </>
        )}
      </div>
    </header>
  );
}

