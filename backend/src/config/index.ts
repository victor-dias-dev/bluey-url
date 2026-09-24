import dotenv from 'dotenv';
import { resolveAutoVerify, resolveCorsOrigin } from './env';

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'REDIS_URL'];
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    console.error('Set these variables before starting the application.');
    process.exit(1);
  }

  if (process.env.JWT_SECRET === 'change-me-in-production' || process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
    console.warn('WARNING: Using a placeholder JWT_SECRET. Change it before serving real users.');
  }
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',

  database: {
    url: process.env.DATABASE_URL || '',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    timeWindow: parseInt(process.env.RATE_LIMIT_TIME_WINDOW || '60000', 10),
  },

  queue: {
    name: process.env.QUEUE_NAME || 'analytics-queue',
  },

  apiUrl: process.env.API_URL || 'http://localhost:3000',

  cors: {
    origin: resolveCorsOrigin(process.env),
  },

  domain: {
    autoVerify: resolveAutoVerify(process.env),
  },
};
