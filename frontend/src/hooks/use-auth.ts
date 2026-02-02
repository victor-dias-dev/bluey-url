import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginDto, RegisterDto } from '@/services/api';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getMe(),
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      router.push('/dashboard');
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao fazer login',
        description: error.response?.data?.error || 'Credenciais inválidas.',
        variant: 'destructive',
      });
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      router.push('/dashboard');
      toast({
        title: 'Conta criada!',
        description: 'Bem-vindo ao Bluey URL!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar conta',
        description: error.response?.data?.error || 'Tente novamente.',
        variant: 'destructive',
      });
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return () => {
    authApi.logout();
    queryClient.clear();
    router.push('/login');
    toast({
      title: 'Logout realizado!',
      description: 'Até logo!',
    });
  };
}

