import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { config } from '../config';
import { anonymizeIp } from '../domain/privacy';

// BullMQ requires maxRetriesPerRequest to be null. The cache client uses a
// different setting, so the queue gets its own connection.
const queueConnection = new Redis(config.redis.url, {
  maxRetriesPerRequest: null,
});

export const analyticsQueue = new Queue(config.queue.name, {
  connection: queueConnection,
});

interface ClickEventData {
  shortCode: string;
  domainId: string | null;
  ip?: string;
  userAgent?: string;
}

/**
 * Publishes a click event to the analytics queue.
 * The worker that persists these events is not implemented yet.
 */
export async function publishClickEvent(data: ClickEventData): Promise<void> {
  await analyticsQueue.add('click', {
    shortCode: data.shortCode,
    domainId: data.domainId,
    ip: anonymizeIp(data.ip),
    userAgent: data.userAgent,
    timestamp: new Date().toISOString(),
  });
}
