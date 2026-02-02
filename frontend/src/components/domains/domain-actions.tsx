"use client"

import { Domain } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteDomain } from '@/hooks/use-domains';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DomainActionsProps {
  domain: Domain;
}

export function DomainActions({ domain }: DomainActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteDomain, isPending: isDeleting } = useDeleteDomain();

  const handleDelete = () => {
    deleteDomain(domain.id, {
      onSuccess: () => {
        setDeleteOpen(false);
      },
    });
  };

  return (
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar Domínio</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar este domínio? Esta ação não pode ser desfeita.
            {domain._count && domain._count.urls > 0 && (
              <span className="block mt-2 text-destructive">
                Atenção: Este domínio possui {domain._count.urls} URLs associadas.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeleteOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

