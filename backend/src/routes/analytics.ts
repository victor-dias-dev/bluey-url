import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

export async function analyticsRoutes(server: FastifyInstance) {
  // Get analytics for a URL
  server.get('/urls/:urlId', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const { urlId } = request.params as { urlId: string };
    
    // Verify URL belongs to user
    const url = await prisma.url.findFirst({
      where: {
        id: urlId,
        userId,
      },
    });
    
    if (!url) {
      return reply.code(404).send({ error: 'URL not found' });
    }
    
    // Get total clicks
    const totalClicks = await prisma.clickEvent.count({
      where: { urlId },
    });
    
    // Get clicks by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const clicksByDate = await prisma.clickEvent.groupBy({
      by: ['timestamp'],
      where: {
        urlId,
        timestamp: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });
    
    // Get clicks by country
    const clicksByCountry = await prisma.clickEvent.groupBy({
      by: ['country'],
      where: { urlId },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });
    
    // Get clicks by device
    const clicksByDevice = await prisma.clickEvent.groupBy({
      by: ['device'],
      where: { urlId },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });
    
    return {
      totalClicks,
      clicksByDate: clicksByDate.map((item) => ({
        date: item.timestamp.toISOString().split('T')[0],
        count: item._count.id,
      })),
      clicksByCountry: clicksByCountry.map((item) => ({
        country: item.country || 'Unknown',
        count: item._count.id,
      })),
      clicksByDevice: clicksByDevice.map((item) => ({
        device: item.device || 'Unknown',
        count: item._count.id,
      })),
    };
  });
  
  // Get recent clicks
  server.get('/urls/:urlId/clicks', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = request.user as { userId: string };
    const { urlId } = request.params as { urlId: string };
    const limit = parseInt((request.query as { limit?: string })?.limit || '50', 10);
    
    // Verify URL belongs to user
    const url = await prisma.url.findFirst({
      where: {
        id: urlId,
        userId,
      },
    });
    
    if (!url) {
      return reply.code(404).send({ error: 'URL not found' });
    }
    
    const clicks = await prisma.clickEvent.findMany({
      where: { urlId },
      orderBy: { timestamp: 'desc' },
      take: limit,
      select: {
        id: true,
        timestamp: true,
        country: true,
        city: true,
        device: true,
        browser: true,
        os: true,
      },
    });
    
    return clicks;
  });
}

