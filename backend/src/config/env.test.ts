import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveAutoVerify, resolveCorsOrigin } from './env';

describe('environment policy', () => {
  it('allows every origin in development and requires an explicit list in production', () => {
    assert.equal(resolveCorsOrigin({ NODE_ENV: 'development' }), true);
    assert.deepEqual(resolveCorsOrigin({ CORS_ORIGIN: 'https://a.test, https://b.test' }), [
      'https://a.test',
      'https://b.test',
    ]);
    assert.deepEqual(resolveCorsOrigin({ NODE_ENV: 'production' }), [
      'https://bluey-short-url-frontend.vercel.app',
    ]);
  });

  it('refuses to auto-verify domains in production', () => {
    assert.equal(resolveAutoVerify({ NODE_ENV: 'development', DOMAIN_AUTO_VERIFY: 'true' }), true);
    assert.equal(resolveAutoVerify({ NODE_ENV: 'development' }), false);
    assert.equal(resolveAutoVerify({ NODE_ENV: 'production', DOMAIN_AUTO_VERIFY: 'true' }), false);
  });
});