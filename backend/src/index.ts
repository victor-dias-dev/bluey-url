import Fastify from 'fastify';
import { config } from './config';
import { registerPlugins } from './plugins';
import { registerRoutes } from './routes';

const server = Fastify({
  logger: config.nodeEnv === 'development' 
    ? {
        level: config.logLevel,
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      }
    : {
        level: config.logLevel,
      },
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
    server.log.error(err);
    process.exit(1);
  }
}

start();

