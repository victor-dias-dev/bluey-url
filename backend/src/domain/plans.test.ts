import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hasReachedUrlLimit, planPolicy } from './plans';

describe('plan policy', () => {
  it('caps the free plan and keeps paid plans unlimited', () => {
    assert.equal(planPolicy('FREE').maxActiveUrls, 10);
    assert.equal(planPolicy('PRO').maxActiveUrls, null);
    assert.equal(planPolicy('ENTERPRISE').maxActiveUrls, null);
  });

  it('reserves custom aliases and domains for paid plans', () => {
    assert.equal(planPolicy('FREE').customAlias, false);
    assert.equal(planPolicy('FREE').customDomains, false);
    assert.equal(planPolicy('PRO').customAlias, true);
    assert.equal(planPolicy('ENTERPRISE').customDomains, true);
  });

  it('detects the free-plan cap without blocking paid plans', () => {
    assert.equal(hasReachedUrlLimit('FREE', 9), false);
    assert.equal(hasReachedUrlLimit('FREE', 10), true);
    assert.equal(hasReachedUrlLimit('PRO', 10_000), false);
  });
});
