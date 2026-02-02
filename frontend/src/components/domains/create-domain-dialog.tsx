"use client"

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateDomain } from '@/hooks/use-domains';

const createDomainSchema = z.object({
  domain: z.string().min(1, 'Domínio é obrigatório'),
});

type CreateDomainFormData = z.infer<typeof createDomainSchema>;

export function CreateDomainDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { mutate: createDomain, isPending } = useCreateDomain();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDomainFormData>({
    resolver: zodResolver(createDomainSchema),
  });

  const onSubmit = (data: CreateDomainFormData) => {
    createDomain(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Domínio</DialogTitle>
          <DialogDescription>
            Adicione um domínio customizado para suas URLs
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domínio</Label>
            <Input
              id="domain"
              type="text"
              placeholder="exemplo.com"
              {...register('domain')}
            />
            {errors.domain && (
              <p className="text-sm text-destructive">
                {errors.domain.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Criando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

