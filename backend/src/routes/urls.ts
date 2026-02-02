import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { generateShortCode } from '../utils/shortCode';
import { config } from '../config';

const createUrlSchema = z.object({
  originalUrl: z.string().url(),
  shortCode: z.string().optional(),
  domainId: z.string().uuid().optional(),
  expiresAt: z.string().datetime().optional(),
  redirectType: z.enum(['PERMANENT', 'TEMPORARY']).optional(),
});

const updateUrlSchema = z.object({
  originalUrl: z.string().url().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
  redirectType: z.enum(['PERMANENT', 'TEMPORARY']).optional(),
});

export async function urlRoutes(server: FastifyInstance) {
  // Create URL
  server.post('/', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const body = createUrlSchema.parse(request.body);
    
    // Get user to check plan limits
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    
    // Check plan limits (FREE plan)
    if (user.plan === 'FREE') {
      const activeUrlsCount = await prisma.url.count({
        where: {
          userId,
          isActive: true,
        },
      });
      
      // TODO: Configurar limite via variável de ambiente
      if (activeUrlsCount >= 10) {
        return reply.code(403).send({ 
          error: 'Free plan limit reached. Upgrade to create more URLs.' 
        });
      }
    }
    
    // Check custom domain access
    if (body.domainId) {
      // Verify domain belongs to user
      const domain = await prisma.domain.findFirst({
        where: {
          id: body.domainId,
          userId,
          verified: true,
        },
      });
      
      if (!domain) {
        return reply.code(404).send({ error: 'Domain not found or not verified' });
      }
    }
    
    // Generate or use custom short code
    let shortCode = body.shortCode;
    if (!shortCode) {
      shortCode = generateShortCode();
    } else {
      const existing = await prisma.url.findFirst({
        where: {
          shortCode,
          domainId: body.domainId || null,
        },
      });
      
      if (existing) {
        return reply.code(409).send({ error: 'Short code already exists' });
      }
    }
    
    // Create URL
    const url = await prisma.url.create({
      data: {
        shortCode,
        originalUrl: body.originalUrl,
        userId,
        domainId: body.domainId,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        redirectType: body.redirectType || 'PERMANENT',
      },
    });
    
    // Cache in Redis
    const cacheKey = `short:${body.domainId || 'default'}:${shortCode}`;
    await redis.setex(cacheKey, 86400, body.originalUrl); // 24h TTL
    
    return reply.code(201).send(url);
  });
  
  // List URLs
  server.get('/', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    
    const urls = await prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        domain: {
          select: {
            domain: true,
          },
        },
      },
    });
    
    return urls;
  });
  
  // Get URL by ID
  server.get('/:id', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };
    
    const url = await prisma.url.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        domain: {
          select: {
            domain: true,
          },
        },
        _count: {
          select: {
            clickEvents: true,
          },
        },
      },
    });
    
    if (!url) {
      return reply.code(404).send({ error: 'URL not found' });
    }
    
    return url;
  });
  
  // Update URL
  server.patch('/:id', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };
    const body = updateUrlSchema.parse(request.body);
    
    const url = await prisma.url.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!url) {
      return reply.code(404).send({ error: 'URL not found' });
    }
    
    const updated = await prisma.url.update({
      where: { id },
      data: {
        originalUrl: body.originalUrl,
        expiresAt: body.expiresAt === null ? null : body.expiresAt ? new Date(body.expiresAt) : undefined,
        isActive: body.isActive,
        redirectType: body.redirectType,
      },
    });
    
    // Update cache if URL changed
    if (body.originalUrl) {
      const cacheKey = `short:${url.domainId || 'default'}:${url.shortCode}`;
      await redis.setex(cacheKey, 86400, body.originalUrl);
    }
    
    return updated;
  });
  
  // Delete URL
  server.delete('/:id', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };
    
    const url = await prisma.url.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!url) {
      return reply.code(404).send({ error: 'URL not found' });
    }
    
    // Soft delete (mark as inactive)
    await prisma.url.update({
      where: { id },
      data: { isActive: false },
    });
    
    // Remove from cache
    const cacheKey = `short:${url.domainId || 'default'}:${url.shortCode}`;
    await redis.del(cacheKey);
    
    return reply.code(204).send();
  });
}

