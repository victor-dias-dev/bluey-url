import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { cacheKey, cacheTtlSeconds, cachedLinkFromRecord, decodeCachedLink, encodeCachedLink } from '../domain/cache';
import { decideRedirect } from '../domain/redirect';
import { isReservedShortCode } from '../domain/short-code';
import { publishClickEvent } from '../services/analytics';

export async function redirectRoutes(server: FastifyInstance) {
  server.get('/*', async (request: FastifyRequest, reply: FastifyReply) => {
    const shortCode = (request.params as { '*': string })['*'];

    if (!shortCode || shortCode.includes('/') || isReservedShortCode(shortCode)) {
      return reply.code(404).send({ error: 'Not found' });
    }

    const host = request.headers.host || '';
    const domain = host.split(':')[0];

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

    const key = cacheKey(domainId, shortCode);
    let cachedRaw: string | null = null;
    try {
      cachedRaw = await redis.get(key);
    } catch (err) {
      server.log.warn({ err }, 'redirect cache read failed');
    }

    const cached = cachedRaw ? decodeCachedLink(cachedRaw) : null;
    if (cached) {
      const decision = decideRedirect({
        originalUrl: cached.url,
        isActive: true,
        expiresAt: cached.expiresAt,
        redirectType: cached.type === 302 ? 'TEMPORARY' : 'PERMANENT',
      });

      if (decision.outcome === 'gone') {
        await redis.del(key).catch(() => undefined);
        return reply.code(410).send({ error: 'URL has expired' });
      }

      if (decision.outcome === 'redirect') {
        publishClick(server, shortCode, domainId, request);
        return reply.redirect(decision.statusCode, decision.location);
      }
    }

    const url = await prisma.url.findFirst({
      where: {
        shortCode,
        domainId: domainId || null,
        isActive: true,
      },
    });

    const decision = decideRedirect(url);
    if (!url || decision.outcome === 'not_found') {
      return reply.code(404).send({ error: 'URL not found' });
    }

    if (decision.outcome === 'gone') {
      return reply.code(410).send({ error: 'URL has expired' });
    }

    const ttl = cacheTtlSeconds(url.expiresAt);
    if (ttl > 0) {
      try {
        await redis.setex(key, ttl, encodeCachedLink(cachedLinkFromRecord(url)));
      } catch (err) {
        server.log.warn({ err }, 'redirect cache write failed');
      }
    }

    publishClick(server, shortCode, domainId, request);
    return reply.redirect(decision.statusCode, decision.location);
  });
}

function publishClick(
  server: FastifyInstance,
  shortCode: string,
  domainId: string | null,
  request: FastifyRequest
) {
  publishClickEvent({
    shortCode,
    domainId,
    ip: request.ip,
    userAgent: request.headers['user-agent'],
  }).catch((err) => {
    server.log.error({ err }, 'Failed to publish click event');
  });
}
