import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEGACY_SLUGS, resolveLegacySlug } from '../dist/blog/legacy-slugs.js';

test('every old filename-based URL maps somewhere', () => {
  assert.deepEqual(Object.keys(LEGACY_SLUGS).sort(), [
    'eth',
    'portfolio1',
    'portfolio4',
    'test',
  ]);
});

test('maps an old slug to its new path', () => {
  assert.equal(resolveLegacySlug('/portfolio1'), '/blog/project-initial-setup');
  assert.equal(resolveLegacySlug('/eth'), '/blog/ethereum-event-object');
  assert.equal(resolveLegacySlug('/portfolio4'), '/blog/chain-communicator');
});

test('the deleted test post falls back to the list', () => {
  assert.equal(resolveLegacySlug('/test'), '/blog');
});

test('a current slug is not a legacy slug', () => {
  assert.equal(resolveLegacySlug('/ethereum-event-object'), undefined);
  assert.equal(resolveLegacySlug('/'), undefined);
});

test('trailing slashes are tolerated', () => {
  assert.equal(resolveLegacySlug('/eth/'), '/blog/ethereum-event-object');
});

test('inherited Object.prototype members are not mistaken for legacy slugs', () => {
  assert.equal(resolveLegacySlug('/constructor'), undefined);
  assert.equal(resolveLegacySlug('/toString'), undefined);
  assert.equal(resolveLegacySlug('/__proto__'), undefined);
  assert.equal(resolveLegacySlug('/hasOwnProperty'), undefined);
  assert.equal(resolveLegacySlug('/valueOf'), undefined);
});
