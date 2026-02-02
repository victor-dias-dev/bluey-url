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
import { useCreateUrl } from '@/hooks/use-urls';
import { useDomains } from '@/hooks/use-domains';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const createUrlSchema = z.object({
  originalUrl: z.string().url('URL inválida'),
  shortCode: z.string().optional(),
  domainId: z.string().optional(),
  expiresAt: z.string().optional(),
});

type CreateUrlFormData = z.infer<typeof createUrlSchema>;

export function CreateUrlDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { mutate: createUrl, isPending } = useCreateUrl();
  const { data: domains } = useDomains();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUrlFormData>({
    resolver: zodResolver(createUrlSchema),
  });

  const domainId = watch('domainId');

  const onSubmit = (data: CreateUrlFormData) => {
    createUrl(
      {
        ...data,
        domainId: data.domainId || undefined,
        expiresAt: data.expiresAt || undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova URL</DialogTitle>
          <DialogDescription>
            Crie uma nova URL encurtada
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="originalUrl">URL Original</Label>
            <Input
              id="originalUrl"
              type="url"
              placeholder="https://example.com"
              {...register('originalUrl')}
            />
            {errors.originalUrl && (
              <p className="text-sm text-destructive">
                {errors.originalUrl.message}
              </p>
            )}
          </div>

          {domains && domains.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="domainId">Domínio (opcional)</Label>
              <Select
                value={domainId}
                onValueChange={(value) => setValue('domainId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um domínio" />
                </SelectTrigger>
                <SelectContent>
                  {domains
                    .filter((d) => d.verified)
                    .map((domain) => (
                      <SelectItem key={domain.id} value={domain.id}>
                        {domain.domain}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="shortCode">Código Personalizado (opcional)</Label>
            <Input
              id="shortCode"
              type="text"
              placeholder="meu-link"
              {...register('shortCode')}
            />
            {errors.shortCode && (
              <p className="text-sm text-destructive">
                {errors.shortCode.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Data de Expiração (opcional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              {...register('expiresAt')}
            />
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

