"use client"

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useMe } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isError) {
      router.push('/login');
    }
  }, [isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

