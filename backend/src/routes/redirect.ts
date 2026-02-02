import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { publishClickEvent } from '../services/analytics';

export async function redirectRoutes(server: FastifyInstance) {
  // Redirect handler - matches any path
  server.get('/*', async (request: FastifyRequest, reply: FastifyReply) => {
    const shortCode = (request.params as { '*': string })['*'];
    
    if (!shortCode || shortCode === 'health' || shortCode.startsWith('api')) {
      return reply.code(404).send({ error: 'Not found' });
    }
    
    // Extract domain from host header
    const host = request.headers.host || '';
    const domain = host.split(':')[0]; // Remove port if present
    
    // Try to find domain in database
    let domainId: string | null = null;
    if (domain && domain !== 'localhost') {
      const customDomain = await prisma.domain.findFirst({
        where: {
          domain,
          verified: true,
        },
      });
      
      if (customDomain) {
        domainId = customDomain.id;
      }
    }
    
    // Try cache first
    const cacheKey = `short:${domainId || 'default'}:${shortCode}`;
    let originalUrl = await redis.get(cacheKey);
    let redirectType: 301 | 302 = 301; // Default
    
    if (!originalUrl) {
      // Cache miss - query database
      const url = await prisma.url.findFirst({
        where: {
          shortCode,
          domainId: domainId || null,
          isActive: true,
        },
      });
      
      if (!url) {
        return reply.code(404).send({ error: 'URL not found' });
      }
      
      // Check expiration
      if (url.expiresAt && url.expiresAt < new Date()) {
        return reply.code(410).send({ error: 'URL has expired' });
      }
      
      originalUrl = url.originalUrl;
      redirectType = url.redirectType === 'PERMANENT' ? 301 : 302;
      
      // Cache for 24h (store URL and redirect type)
      await redis.setex(cacheKey, 86400, JSON.stringify({ 
        url: originalUrl, 
        type: redirectType 
      }));
    } else {
      // Parse cached data
      try {
        const cached = JSON.parse(originalUrl);
        originalUrl = cached.url;
        redirectType = cached.type || 301;
      } catch {
        // Fallback: treat as plain URL string (backward compatibility)
        redirectType = 301;
      }
    }
    
    // Publish click event asynchronously (non-blocking)
    publishClickEvent({
      shortCode,
      domainId,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    }).catch((err) => {
      // Log error but don't block redirect
      server.log.error({ err }, 'Failed to publish click event');
    });
    
    // Redirect
    return reply.redirect(redirectType, originalUrl);
  });
}
