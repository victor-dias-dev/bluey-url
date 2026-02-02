import axios, { AxiosError } from 'axios';
import { AuthResponse, CreateUrlDto, UpdateUrlDto, CreateDomainDto, LoginDto, RegisterDto, Url, Domain, Analytics, ClickEvent, User } from '@/types/api';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },
};

// URLs API
export const urlsApi = {
  getAll: async (): Promise<Url[]> => {
    const response = await api.get<Url[]>('/api/urls');
    return response.data;
  },

  getById: async (id: string): Promise<Url> => {
    const response = await api.get<Url>(`/api/urls/${id}`);
    return response.data;
  },

  create: async (data: CreateUrlDto): Promise<Url> => {
    const response = await api.post<Url>('/api/urls', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUrlDto): Promise<Url> => {
    const response = await api.patch<Url>(`/api/urls/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/urls/${id}`);
  },
};

// Domains API
export const domainsApi = {
  getAll: async (): Promise<Domain[]> => {
    const response = await api.get<Domain[]>('/api/domains');
    return response.data;
  },

  getById: async (id: string): Promise<Domain> => {
    const response = await api.get<Domain>(`/api/domains/${id}`);
    return response.data;
  },

  create: async (data: CreateDomainDto): Promise<Domain> => {
    const response = await api.post<Domain>('/api/domains', data);
    return response.data;
  },

  verify: async (id: string): Promise<Domain> => {
    const response = await api.post<Domain>(`/api/domains/${id}/verify`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/domains/${id}`);
  },
};

// Analytics API
export const analyticsApi = {
  getByUrlId: async (urlId: string): Promise<Analytics> => {
    const response = await api.get<Analytics>(`/api/analytics/urls/${urlId}`);
    return response.data;
  },

  getClicks: async (urlId: string, limit?: number): Promise<ClickEvent[]> => {
    const response = await api.get<ClickEvent[]>(`/api/analytics/urls/${urlId}/clicks`, {
      params: { limit },
    });
    return response.data;
  },
};

export default api;

