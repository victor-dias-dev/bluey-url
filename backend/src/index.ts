import Fastify from 'fastify';
import { ZodError } from 'zod';
import { config } from './config';
import { registerPlugins } from './plugins';
import { registerRoutes } from './routes';

const loggerConfig: {
  level: string;
  transport?: {
    target: string;
    options: {
      translateTime: string;
      ignore: string;
    };
  };
} = {
  level: config.logLevel,
};

if (config.nodeEnv === 'development') {
  loggerConfig.transport = {
    target: 'pino-pretty',
    options: {
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  };
}

const server = Fastify({
  logger: loggerConfig,
});

async function start() {
  try {
    // Register plugins
    await registerPlugins(server);

    await registerRoutes(server);

    server.setErrorHandler((error, request, reply) => {
      if (error instanceof ZodError) {
        return reply.code(400).send({
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }

      const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
      if (statusCode >= 500) {
        request.log.error({ err: error }, 'request failed');
      }

      const message = statusCode >= 500 && config.nodeEnv === 'production'
        ? 'Internal server error'
        : error.message;

      return reply.code(statusCode).send({ error: message });
    });

    // Start server
    await server.listen({ port: config.port, host: '0.0.0.0' });
    server.log.info(`Server running on http://localhost:${config.port}`);
  } catch (err) {
    const error = err as Error;
    server.log.error({ err: error }, 'Failed to start server');
    console.error('Error starting server:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  server.log.info('SIGTERM received, shutting down gracefully');
  await server.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  server.log.info('SIGINT received, shutting down gracefully');
  await server.close();
  process.exit(0);
});

start();

