import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { config } from '../config';
import { isValidHostname, normalizeHostname } from '../domain/hostname';
import { planPolicy, Plan } from '../domain/plans';

const createDomainSchema = z.object({
  domain: z.string().trim().min(1).refine(isValidHostname, {
    message: 'Domain must be a public hostname such as links.example.com',
  }),
});

export async function domainRoutes(server: FastifyInstance) {
  // List domains
  server.get('/', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest) => {
    const { userId } = request.user as { userId: string };
    
    const domains = await prisma.domain.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            urls: true,
          },
        },
      },
    });
    
    return domains;
  });
  
  // Create domain
  server.post('/', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const body = createDomainSchema.parse(request.body);
    const hostname = normalizeHostname(body.domain);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return reply.code(404).send({ 
        error: 'User not found' 
      });
    }

    if (!planPolicy(user.plan as Plan).customDomains) {
      return reply.code(403).send({ error: 'Custom domains are available on paid plans.' });
    }
    
    const existing = await prisma.domain.findUnique({
      where: { domain: hostname },
    });
    
    if (existing) {
      return reply.code(409).send({ error: 'Domain already registered' });
    }
    
    // Create domain (unverified initially)
    const domain = await prisma.domain.create({
      data: {
        domain: hostname,
        userId,
        verified: false,
      },
    });
    
    return reply.code(201).send({
      ...domain,
      verificationInstructions: verificationInstructions(domain.domain, domain.id),
    });
  });
  
  // Get domain by ID
  server.get('/:id', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };
    
    const domain = await prisma.domain.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        _count: {
          select: {
            urls: true,
          },
        },
      },
    });
    
    if (!domain) {
      return reply.code(404).send({ error: 'Domain not found' });
    }
    
    return domain;
  });
  
  // Verify domain
  server.post('/:id/verify', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };
    
    const domain = await prisma.domain.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!domain) {
      return reply.code(404).send({ error: 'Domain not found' });
    }
    
    if (!config.domain.autoVerify) {
      return reply.code(501).send({
        error: 'DNS verification is not implemented yet.',
        verificationInstructions: verificationInstructions(domain.domain, domain.id),
      });
    }

    // Local-only escape hatch. Production ignores DOMAIN_AUTO_VERIFY.
    const verified = await prisma.domain.update({
      where: { id },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });
    
    return verified;
  });
  
  // Delete domain
  server.delete('/:id', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };
    
    const domain = await prisma.domain.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!domain) {
      return reply.code(404).send({ error: 'Domain not found' });
    }
    
    // Check if domain has URLs
    const urlCount = await prisma.url.count({
      where: { domainId: id },
    });
    
    if (urlCount > 0) {
      return reply.code(400).send({ 
        error: 'Cannot delete a domain that still has links' 
      });
    }
    
    await prisma.domain.delete({
      where: { id },
    });
    
    return reply.code(204).send();
  });
}

function verificationInstructions(hostname: string, domainId: string) {
  return {
    type: 'TXT',
    name: `_bluey.${hostname}`,
    value: `bluey-verification=${domainId}`,
    status: 'DNS lookups are not implemented yet. The value above is the intended record.',
  };
}

