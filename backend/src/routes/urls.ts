import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import {
  cacheKey,
  cacheTtlSeconds,
  cachedLinkFromRecord,
  encodeCachedLink,
} from '../domain/cache';
import { hasReachedUrlLimit, planPolicy, Plan } from '../domain/plans';
import { generateShortCode, isReservedShortCode, isValidShortCode } from '../domain/short-code';
import { httpUrlSchema, optionalTimestampSchema } from '../domain/url';

const createUrlSchema = z.object({
  originalUrl: httpUrlSchema,
  shortCode: z.string().trim().optional(),
  domainId: z.string().uuid().optional(),
  expiresAt: optionalTimestampSchema,
  redirectType: z.enum(['PERMANENT', 'TEMPORARY']).optional(),
});

const updateUrlSchema = z.object({
  originalUrl: httpUrlSchema.optional(),
  expiresAt: z.union([z.null(), optionalTimestampSchema]).optional(),
  isActive: z.boolean().optional(),
  redirectType: z.enum(['PERMANENT', 'TEMPORARY']).optional(),
});

const MAX_ALLOCATION_ATTEMPTS = 5;

interface CacheableUrl {
  shortCode: string;
  domainId: string | null;
  originalUrl: string;
  redirectType: 'PERMANENT' | 'TEMPORARY';
  expiresAt: Date | null;
  isActive: boolean;
}

async function syncRedirectCache(server: FastifyInstance, url: CacheableUrl) {
  const key = cacheKey(url.domainId, url.shortCode);

  try {
    if (!url.isActive) {
      await redis.del(key);
      return;
    }

    const ttl = cacheTtlSeconds(url.expiresAt);
    if (ttl <= 0) {
      await redis.del(key);
      return;
    }

    await redis.setex(key, ttl, encodeCachedLink(cachedLinkFromRecord(url)));
  } catch (err) {
    server.log.warn({ err }, 'failed to update redirect cache');
  }
}

export async function urlRoutes(server: FastifyInstance) {
  server.post('/', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const body = createUrlSchema.parse(request.body);
    const requestedCode = body.shortCode || undefined;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    const policy = planPolicy(user.plan as Plan);

    if (policy.maxActiveUrls !== null) {
      const activeUrls = await prisma.url.count({
        where: { userId, isActive: true },
      });

      if (hasReachedUrlLimit(user.plan as Plan, activeUrls)) {
        return reply.code(403).send({
          error: 'Free plan limit reached. Upgrade to create more URLs.',
        });
      }
    }

    if (body.domainId) {
      if (!policy.customDomains) {
        return reply.code(403).send({ error: 'Custom domains are available on paid plans.' });
      }

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

    let shortCode = requestedCode;
    if (shortCode) {
      if (!policy.customAlias) {
        return reply.code(403).send({ error: 'Custom aliases are available on paid plans.' });
      }
      if (!isValidShortCode(shortCode) || isReservedShortCode(shortCode)) {
        return reply.code(400).send({
          error: 'Short code must be 3-20 letters or digits and must not use a reserved path.',
        });
      }

      const existing = await prisma.url.findFirst({
        where: {
          shortCode,
          domainId: body.domainId || null,
        },
      });

      if (existing) {
        return reply.code(409).send({ error: 'Short code already exists' });
      }
    } else {
      shortCode = undefined;
      for (let attempt = 0; attempt < MAX_ALLOCATION_ATTEMPTS; attempt += 1) {
        const candidate = generateShortCode();
        const existing = await prisma.url.findFirst({
          where: {
            shortCode: candidate,
            domainId: body.domainId || null,
          },
        });
        if (!existing) {
          shortCode = candidate;
          break;
        }
      }

      if (!shortCode) {
        return reply.code(503).send({ error: 'Could not allocate a short code. Try again.' });
      }
    }

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

    await syncRedirectCache(server, url);
    return reply.code(201).send(url);
  });

  server.get('/', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest) => {
    const { userId } = request.user as { userId: string };

    return prisma.url.findMany({
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
  });

  server.get('/:id', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };

    const url = await prisma.url.findFirst({
      where: { id, userId },
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

  server.patch('/:id', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };
    const body = updateUrlSchema.parse(request.body);

    const url = await prisma.url.findFirst({
      where: { id, userId },
    });

    if (!url) {
      return reply.code(404).send({ error: 'URL not found' });
    }

    const expiresAt = body.expiresAt === undefined
      ? undefined
      : body.expiresAt === null
        ? null
        : new Date(body.expiresAt);

    const updated = await prisma.url.update({
      where: { id },
      data: {
        originalUrl: body.originalUrl,
        expiresAt,
        isActive: body.isActive,
        redirectType: body.redirectType,
      },
    });

    await syncRedirectCache(server, updated);
    return updated;
  });

  server.delete('/:id', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };

    const url = await prisma.url.findFirst({
      where: { id, userId },
    });

    if (!url) {
      return reply.code(404).send({ error: 'URL not found' });
    }

    await prisma.url.update({
      where: { id },
      data: { isActive: false },
    });

    try {
      await redis.del(cacheKey(url.domainId, url.shortCode));
    } catch (err) {
      server.log.warn({ err }, 'failed to delete redirect cache');
    }

    return reply.code(204).send();
  });
}
