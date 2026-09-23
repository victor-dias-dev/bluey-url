import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isHttpUrl, optionalTimestampSchema, toIsoDateTime } from './url';

describe('destination URLs', () => {
  it('allows only http and https destinations', () => {
    assert.equal(isHttpUrl('https://example.com/path?q=1'), true);
    assert.equal(isHttpUrl('http://localhost:3000'), true);
    assert.equal(isHttpUrl('javascript:alert(1)'), false);
    assert.equal(isHttpUrl('data:text/html,hi'), false);
    assert.equal(isHttpUrl('not a url'), false);
  });

  it('normalizes datetime-local values to ISO-8601', () => {
    const iso = toIsoDateTime('2026-09-23T12:00:00.000Z');
    assert.equal(iso, '2026-09-23T12:00:00.000Z');
    assert.equal(toIsoDateTime('yesterday'), null);
    assert.equal(optionalTimestampSchema.parse(''), undefined);
    assert.equal(optionalTimestampSchema.parse(undefined), undefined);
    assert.equal(
      optionalTimestampSchema.parse('2026-09-23T12:00'),
      new Date('2026-09-23T12:00').toISOString()
    );
  });
});
