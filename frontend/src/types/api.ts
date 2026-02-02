export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  createdAt: string;
}

export interface Url {
  id: string;
  shortCode: string;
  originalUrl: string;
  userId: string | null;
  domainId: string | null;
  expiresAt: string | null;
  isActive: boolean;
  redirectType: 'PERMANENT' | 'TEMPORARY';
  createdAt: string;
  updatedAt: string;
  domain?: {
    domain: string;
  };
  _count?: {
    clickEvents: number;
  };
}

export interface Domain {
  id: string;
  domain: string;
  userId: string;
  verified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    urls: number;
  };
}

export interface ClickEvent {
  id: string;
  timestamp: string;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
}

export interface Analytics {
  totalClicks: number;
  clicksByDate: Array<{
    date: string;
    count: number;
  }>;
  clicksByCountry: Array<{
    country: string;
    count: number;
  }>;
  clicksByDevice: Array<{
    device: string;
    count: number;
  }>;
}

export interface CreateUrlDto {
  originalUrl: string;
  shortCode?: string;
  domainId?: string;
  expiresAt?: string;
  redirectType?: 'PERMANENT' | 'TEMPORARY';
}

export interface UpdateUrlDto {
  originalUrl?: string;
  expiresAt?: string | null;
  isActive?: boolean;
  redirectType?: 'PERMANENT' | 'TEMPORARY';
}

export interface CreateDomainDto {
  domain: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

