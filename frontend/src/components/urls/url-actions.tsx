"use client"

import { Url } from '@/types/api';
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
import { useUpdateUrl, useDeleteUrl } from '@/hooks/use-urls';
import { Trash2, Edit } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

const updateUrlSchema = z.object({
  originalUrl: z.string().url('URL inválida').optional(),
  isActive: z.boolean().optional(),
  redirectType: z.enum(['PERMANENT', 'TEMPORARY']).optional(),
});

type UpdateUrlFormData = z.infer<typeof updateUrlSchema>;

interface UrlActionsProps {
  url: Url;
}

export function UrlActions({ url }: UrlActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: updateUrl, isPending: isUpdating } = useUpdateUrl();
  const { mutate: deleteUrl, isPending: isDeleting } = useDeleteUrl();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateUrlFormData>({
    resolver: zodResolver(updateUrlSchema),
    defaultValues: {
      originalUrl: url.originalUrl,
      isActive: url.isActive,
      redirectType: url.redirectType,
    },
  });

  const onSubmit = (data: UpdateUrlFormData) => {
    updateUrl(
      { id: url.id, data },
      {
        onSuccess: () => {
          setEditOpen(false);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteUrl(url.id, {
      onSuccess: () => {
        setDeleteOpen(false);
      },
    });
  };

  return (
    <>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar URL</DialogTitle>
            <DialogDescription>
              Atualize as informações da URL
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="originalUrl">URL Original</Label>
              <Input
                id="originalUrl"
                type="url"
                {...register('originalUrl')}
              />
              {errors.originalUrl && (
                <p className="text-sm text-destructive">
                  {errors.originalUrl.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={watch('isActive')}
                onCheckedChange={(checked) =>
                  setValue('isActive', checked as boolean)
                }
              />
              <Label htmlFor="isActive">URL Ativa</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="redirectType">Tipo de Redirecionamento</Label>
              <Select
                value={watch('redirectType')}
                onValueChange={(value: 'PERMANENT' | 'TEMPORARY') =>
                  setValue('redirectType', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERMANENT">301 - Permanente</SelectItem>
                  <SelectItem value="TEMPORARY">302 - Temporário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar URL</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar esta URL? Esta ação não pode ser desfeita.
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
    </>
  );
}

