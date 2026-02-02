import Redis from 'ioredis';
import { config } from '../config';

export const redis = new Redis(config.redis.url, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  enableOfflineQueue: false, // Don't queue commands when disconnected
});

redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
  // Don't crash the app if Redis fails
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('close', () => {
  console.warn('⚠️ Redis connection closed');
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await redis.quit();
});

