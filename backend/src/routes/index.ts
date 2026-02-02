import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth';
import { urlRoutes } from './urls';
import { redirectRoutes } from './redirect';
import { analyticsRoutes } from './analytics';
import { domainRoutes } from './domains';

export async function registerRoutes(server: FastifyInstance) {
  // Health check
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API Routes
  await server.register(authRoutes, { prefix: '/api/auth' });
  await server.register(urlRoutes, { prefix: '/api/urls' });
  await server.register(domainRoutes, { prefix: '/api/domains' });
  await server.register(analyticsRoutes, { prefix: '/api/analytics' });
  
  // Redirect routes (sem prefixo)
  await server.register(redirectRoutes);
}

