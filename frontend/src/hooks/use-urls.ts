import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { urlsApi } from '@/services/api';
import { Url, CreateUrlDto, UpdateUrlDto } from '@/types/api';
import { useToast } from './use-toast';

export function useUrls() {
  return useQuery({
    queryKey: ['urls'],
    queryFn: () => urlsApi.getAll(),
  });
}

export function useUrl(id: string) {
  return useQuery({
    queryKey: ['urls', id],
    queryFn: () => urlsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateUrl() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateUrlDto) => urlsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      toast({
        title: 'URL criada com sucesso!',
        description: 'Sua URL encurtada está pronta para uso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar URL',
        description: error.response?.data?.error || 'Tente novamente.',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateUrl() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUrlDto }) =>
      urlsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      queryClient.invalidateQueries({ queryKey: ['urls', variables.id] });
      toast({
        title: 'URL atualizada!',
        description: 'As alterações foram salvas.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar URL',
        description: error.response?.data?.error || 'Tente novamente.',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteUrl() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => urlsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      toast({
        title: 'URL deletada!',
        description: 'A URL foi removida com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao deletar URL',
        description: error.response?.data?.error || 'Tente novamente.',
        variant: 'destructive',
      });
    },
  });
}

