import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { decideRedirect, LinkRecord } from './redirect';

const now = new Date('2026-09-23T12:00:00.000Z');

function link(overrides: Partial<LinkRecord> = {}): LinkRecord {
  return {
    originalUrl: 'https://example.com/docs',
    isActive: true,
    expiresAt: null,
    redirectType: 'PERMANENT',
    ...overrides,
  };
}

describe('redirect decision', () => {
  it('issues a 301 for a permanent link', () => {
    assert.deepEqual(decideRedirect(link(), now), {
      outcome: 'redirect',
      location: 'https://example.com/docs',
      statusCode: 301,
    });
  });

  it('issues a 302 when the link is temporary', () => {
    const decision = decideRedirect(link({ redirectType: 'TEMPORARY' }), now);
    assert.equal(decision.outcome, 'redirect');
    if (decision.outcome === 'redirect') {
      assert.equal(decision.statusCode, 302);
    }
  });

  it('hides inactive and missing links', () => {
    assert.deepEqual(decideRedirect(null, now), { outcome: 'not_found' });
    assert.deepEqual(decideRedirect(link({ isActive: false }), now), { outcome: 'not_found' });
  });

  it('returns gone once the expiration instant has passed', () => {
    assert.deepEqual(
      decideRedirect(link({ expiresAt: '2026-09-23T12:00:00.000Z' }), now),
      { outcome: 'gone' }
    );
    assert.equal(
      decideRedirect(link({ expiresAt: '2026-09-23T12:00:01.000Z' }), now).outcome,
      'redirect'
    );
  });
});
