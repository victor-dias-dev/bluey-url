import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  cacheKey,
  cacheTtlSeconds,
  cachedLinkFromRecord,
  decodeCachedLink,
  encodeCachedLink,
} from './cache';

describe('redirect cache', () => {
  it('scopes a code by domain so the same alias can exist twice', () => {
    assert.equal(cacheKey(null, 'abc'), 'short:default:abc');
    assert.equal(cacheKey('domain-1', 'abc'), 'short:domain-1:abc');
  });

  it('round-trips redirect type and expiration', () => {
    const encoded = encodeCachedLink(
      cachedLinkFromRecord({
        originalUrl: 'https://example.com',
        redirectType: 'TEMPORARY',
        expiresAt: new Date('2026-10-01T00:00:00.000Z'),
      })
    );

    assert.deepEqual(decodeCachedLink(encoded), {
      url: 'https://example.com',
      type: 302,
      expiresAt: '2026-10-01T00:00:00.000Z',
    });
  });

  it('still understands the legacy plain-URL cache entries', () => {
    assert.deepEqual(decodeCachedLink('https://example.com/old'), {
      url: 'https://example.com/old',
      type: 301,
      expiresAt: null,
    });
    assert.equal(decodeCachedLink('not-a-url'), null);
  });

  it('never caches a link for longer than it remains valid', () => {
    const now = new Date('2026-09-23T12:00:00.000Z');
    assert.equal(cacheTtlSeconds(null, now), 86400);
    assert.equal(cacheTtlSeconds(new Date('2026-09-23T12:10:00.000Z'), now), 600);
    assert.equal(cacheTtlSeconds(new Date('2026-09-23T11:00:00.000Z'), now), 0);
    assert.equal(cacheTtlSeconds(new Date('2027-01-01T00:00:00.000Z'), now), 86400);
  });
});
