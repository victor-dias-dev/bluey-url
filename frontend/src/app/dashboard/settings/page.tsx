"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMe } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { data: user, isLoading } = useMe();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas configurações de conta
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>
            Dados da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                <p className="text-lg">{user?.name || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plano</p>
                <Badge variant="secondary" className="mt-1">
                  {user?.plan === 'FREE' && 'Free'}
                  {user?.plan === 'PRO' && 'Pro'}
                  {user?.plan === 'ENTERPRISE' && 'Enterprise'}
                </Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

