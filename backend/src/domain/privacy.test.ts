import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { anonymizeIp } from './privacy';

describe('anonymizeIp', () => {
  it('zeroes the last IPv4 octet and the last IPv6 group', () => {
    assert.equal(anonymizeIp('203.0.113.42'), '203.0.113.0');
    assert.equal(anonymizeIp('::ffff:203.0.113.42'), '::ffff:203.0.113.0');
    assert.equal(anonymizeIp('2001:db8::42'), '2001:db8::0');
  });

  it('drops empty and unrecognized values', () => {
    assert.equal(anonymizeIp(undefined), undefined);
    assert.equal(anonymizeIp('   '), undefined);
    assert.equal(anonymizeIp('not-an-ip'), undefined);
  });
});
