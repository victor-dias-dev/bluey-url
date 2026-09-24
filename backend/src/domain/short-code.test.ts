import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generateShortCode, isReservedShortCode, isValidShortCode } from './short-code';

describe('short codes', () => {
  it('generates unguessable alphanumeric codes of the requested length', () => {
    const code = generateShortCode(8);
    assert.equal(code.length, 8);
    assert.match(code, /^[a-zA-Z0-9]+$/);

    const samples = new Set(Array.from({ length: 20 }, () => generateShortCode()));
    assert.ok(samples.size > 1);
  });

  it('rejects lengths outside the public alias range', () => {
    assert.throws(() => generateShortCode(2));
    assert.throws(() => generateShortCode(21));
  });

  it('accepts aliases contributors can type and share', () => {
    assert.equal(isValidShortCode('abc'), true);
    assert.equal(isValidShortCode('a'.repeat(20)), true);
    assert.equal(isValidShortCode('ab'), false);
    assert.equal(isValidShortCode('meu-link'), false);
    assert.equal(isValidShortCode('has space'), false);
  });

  it('keeps infrastructure paths out of the redirect namespace', () => {
    assert.equal(isReservedShortCode('health'), true);
    assert.equal(isReservedShortCode('API'), true);
    assert.equal(isReservedShortCode('docs'), false);
  });
});
