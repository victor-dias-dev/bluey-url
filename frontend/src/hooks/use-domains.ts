import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { domainsApi } from '@/services/api';
import { CreateDomainDto } from '@/types/api';
import { useToast } from './use-toast';

export function useDomains() {
  return useQuery({
    queryKey: ['domains'],
    queryFn: () => domainsApi.getAll(),
  });
}

export function useDomain(id: string) {
  return useQuery({
    queryKey: ['domains', id],
    queryFn: () => domainsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateDomain() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateDomainDto) => domainsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast({
        title: 'Domínio criado!',
        description: 'Configure o DNS para verificar o domínio.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar domínio',
        description: error.response?.data?.error || 'Tente novamente.',
        variant: 'destructive',
      });
    },
  });
}

export function useVerifyDomain() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => domainsApi.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast({
        title: 'Domínio verificado!',
        description: 'O domínio está pronto para uso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao verificar domínio',
        description: error.response?.data?.error || 'Tente novamente.',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteDomain() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => domainsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast({
        title: 'Domínio deletado!',
        description: 'O domínio foi removido com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao deletar domínio',
        description: error.response?.data?.error || 'Tente novamente.',
        variant: 'destructive',
      });
    },
  });
}

