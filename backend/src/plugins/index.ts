import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { config } from '../config';

export async function registerPlugins(server: FastifyInstance) {
  await server.register(jwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn,
    },
  });

  await server.register(helmet, {
    contentSecurityPolicy: false,
  });

  await server.register(cors, {
    origin: config.cors.origin,
    credentials: true,
  });

  await server.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
  });

  server.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
      const payload = request.user;
      if (
        !payload ||
        typeof payload !== 'object' ||
        !('userId' in payload) ||
        typeof payload.userId !== 'string'
      ) {
        return reply.code(401).send({ error: 'Invalid token' });
      }
    } catch {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });
}
