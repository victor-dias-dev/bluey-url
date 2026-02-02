import Fastify from 'fastify';
import { config } from './config';
import { registerPlugins } from './plugins';
import { registerRoutes } from './routes';

// Configure logger based on environment
const loggerConfig: any = {
  level: config.logLevel,
};

// Only use pino-pretty in development (it's a dev dependency)
if (config.nodeEnv === 'development') {
  try {
    loggerConfig.transport = {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    };
  } catch (err) {
    // Fallback if pino-pretty is not available
    console.warn('pino-pretty not available, using default logger');
  }
}

const server = Fastify({
  logger: loggerConfig,
});

async function start() {
  try {
    // Register plugins
    await registerPlugins(server);

    // Register routes
    await registerRoutes(server);

    // Start server
    await server.listen({ port: config.port, host: '0.0.0.0' });
    server.log.info(`🚀 Server running on http://localhost:${config.port}`);
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

