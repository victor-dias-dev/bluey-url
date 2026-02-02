"use client"

import { Domain } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Trash2, RefreshCw } from 'lucide-react';
import { useVerifyDomain, useDeleteDomain } from '@/hooks/use-domains';
import { DomainActions } from './domain-actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DomainCardProps {
  domain: Domain;
}

export function DomainCard({ domain }: DomainCardProps) {
  const { mutate: verifyDomain, isPending: isVerifying } = useVerifyDomain();

  const handleVerify = () => {
    verifyDomain(domain.id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {domain.domain}
            </CardTitle>
            <CardDescription className="mt-1">
              {domain.verified ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Verificado em{' '}
                  {domain.verifiedAt &&
                    format(new Date(domain.verifiedAt), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-yellow-500" />
                  Aguardando verificação
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={domain.verified ? 'default' : 'secondary'}>
              {domain.verified ? 'Verificado' : 'Não Verificado'}
            </Badge>
            {domain._count && (
              <Badge variant="outline">
                {domain._count.urls} URLs
              </Badge>
            )}
          </div>

          {!domain.verified && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Instruções de Verificação:</p>
              <p className="text-muted-foreground">
                Adicione um registro TXT no DNS: <code className="bg-background px-1 rounded">_bluey.{domain.domain}</code>
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {!domain.verified && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleVerify}
                disabled={isVerifying}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isVerifying ? 'animate-spin' : ''}`} />
                Verificar
              </Button>
            )}
            <DomainActions domain={domain} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

