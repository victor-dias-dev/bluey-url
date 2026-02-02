import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const createDomainSchema = z.object({
  domain: z.string().min(1),
});

export async function domainRoutes(server: FastifyInstance) {
  // List domains
  server.get('/', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
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
    
    // Check user plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return reply.code(404).send({ 
        error: 'User not found' 
      });
    }
    
    // Check if domain already exists
    const existing = await prisma.domain.findUnique({
      where: { domain: body.domain },
    });
    
    if (existing) {
      return reply.code(409).send({ error: 'Domain already registered' });
    }
    
    // Create domain (unverified initially)
    const domain = await prisma.domain.create({
      data: {
        domain: body.domain,
        userId,
        verified: false,
      },
    });
    
    // TODO: Generate DNS verification token
    // TODO: Return verification instructions
    
    return reply.code(201).send({
      ...domain,
      verificationInstructions: {
        type: 'TXT',
        name: `_bluey.${body.domain}`,
        value: `verification-token-${domain.id}`, // TODO: Generate proper token
      },
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
    
    // TODO: Implement DNS verification logic
    // Check TXT record: _bluey.{domain}
    // If verified, update domain
    
    // For now, return mock verification
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
        error: 'Cannot delete domain with active URLs' 
      });
    }
    
    await prisma.domain.delete({
      where: { id },
    });
    
    return reply.code(204).send();
  });
}

