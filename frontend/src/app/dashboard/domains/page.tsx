"use client"

import { DomainList } from '@/components/domains/domain-list';
import { CreateDomainDialog } from '@/components/domains/create-domain-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DomainsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Domínios</h1>
          <p className="text-muted-foreground">
            Gerencie seus domínios customizados
          </p>
        </div>
        <CreateDomainDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Domínio
          </Button>
        </CreateDomainDialog>
      </div>

      <DomainList />
    </div>
  );
}

