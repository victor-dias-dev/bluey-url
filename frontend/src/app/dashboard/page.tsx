"use client"

import { useUrls } from '@/hooks/use-urls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link2, TrendingUp, Globe, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { data: urls, isLoading } = useUrls();

  const stats = [
    {
      title: 'Total de URLs',
      value: urls?.length || 0,
      icon: Link2,
      description: 'URLs criadas',
    },
    {
      title: 'URLs Ativas',
      value: urls?.filter((url) => url.isActive).length || 0,
      icon: TrendingUp,
      description: 'Em uso',
    },
    {
      title: 'Total de Cliques',
      value: urls?.reduce((acc, url) => acc + (url._count?.clickEvents || 0), 0) || 0,
      icon: Clock,
      description: 'Todos os tempos',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas URLs e estatísticas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

