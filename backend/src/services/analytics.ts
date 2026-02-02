import { Queue } from 'bullmq';
import { redis } from '../lib/redis';
import { config } from '../config';

// Initialize queue
export const analyticsQueue = new Queue(config.queue.name, {
  connection: redis,
});

interface ClickEventData {
  shortCode: string;
  domainId: string | null;
  ip?: string;
  userAgent?: string;
}

/**
 * Publishes a click event to the analytics queue
 * This is non-blocking and should be called asynchronously
 */
export async function publishClickEvent(data: ClickEventData): Promise<void> {
  await analyticsQueue.add('click', {
    shortCode: data.shortCode,
    domainId: data.domainId,
    ip: data.ip,
    userAgent: data.userAgent,
    timestamp: new Date().toISOString(),
  });
}

