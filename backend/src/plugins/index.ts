import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { config } from '../config';

export async function registerPlugins(server: FastifyInstance) {
  // JWT
  await server.register(jwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn,
    },
  });

  // Security headers
  await server.register(helmet, {
    contentSecurityPolicy: false, // Ajustar conforme necessário
  });

  // CORS
  await server.register(cors, {
    origin: config.nodeEnv === 'production' 
      ? ['https://yourdomain.com'] // Configurar domínio de produção
      : true, // Permite todos em desenvolvimento
    credentials: true,
  });

  // Rate limiting
  await server.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
  });

  // Register auth middleware
  server.decorate('authenticate', async function(request: any, reply: any) {
    try {
      await request.jwtVerify();
      // jwtVerify already sets request.user with the decoded payload
      // Ensure it has the userId property
      if (!request.user || !request.user.userId) {
        return reply.code(401).send({ error: 'Invalid token' });
      }
    } catch (err) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });
}

