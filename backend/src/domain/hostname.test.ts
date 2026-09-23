import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isValidHostname, normalizeHostname } from './hostname';

describe('hostnames', () => {
  it('normalizes a public hostname', () => {
    assert.equal(normalizeHostname(' Links.Example.com. '), 'links.example.com');
    assert.equal(isValidHostname('links.example.com'), true);
  });

  it('rejects URLs, ports, and single labels', () => {
    assert.equal(isValidHostname('https://links.example.com'), false);
    assert.equal(isValidHostname('links.example.com/path'), false);
    assert.equal(isValidHostname('links.example.com:443'), false);
    assert.equal(isValidHostname('localhost'), false);
  });
});
