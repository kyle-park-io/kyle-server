import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elapsedLabel, flagOf, parsePresence } from '../src/presence.ts';

test('a JSON message is read whole', () => {
  const got = parsePresence(
    '{"count":4,"countries":[{"key":"KR","n":3}],"pages":[{"key":"/blog","n":2}],' +
      '"you":{"country":"KR","browser":"Chrome","os":"macOS","ip":"203.0.113.9","since":1757000000}}',
  );
  assert.ok(got);
  assert.equal(got.count, 4);
  assert.deepEqual(got.countries, [{ key: 'KR', n: 3 }]);
  assert.equal(got.you?.browser, 'Chrome');
  assert.equal(got.you?.ip, '203.0.113.9');
});

test('a bare number is still read, because a rollout has two versions live', () => {
  // The proxy, the counter server and this page are three separate images.
  // While any of them is still the old one the message is a bare count, and
  // a count on its own beats a masthead stuck at zero.
  const got = parsePresence('7\n');
  assert.ok(got);
  assert.equal(got.count, 7);
  assert.deepEqual(got.countries, []);
  assert.deepEqual(got.pages, []);
  assert.equal(got.you, undefined);
});

test('anything unreadable is ignored rather than rendered', () => {
  for (const bad of ['', '   ', 'null', '{', '{"nope":1}', 'not a count']) {
    assert.equal(
      parsePresence(bad),
      null,
      `expected null for ${JSON.stringify(bad)}`,
    );
  }
});

test('a JSON message missing its breakdowns still renders', () => {
  // An older counter server answers with a count and nothing else.
  const got = parsePresence('{"count":2}');
  assert.ok(got);
  assert.deepEqual(got.countries, []);
  assert.deepEqual(got.pages, []);
});

test('a country code becomes its flag', () => {
  assert.equal(flagOf('KR'), '🇰🇷');
  assert.equal(flagOf('kr'), '🇰🇷');
  assert.equal(flagOf('US'), '🇺🇸');
});

test('a code that is not a country yields no flag rather than mojibake', () => {
  // Cloudflare sends XX for an address it cannot place, and T1 for Tor.
  for (const code of ['', 'X', 'KOR', '12', undefined]) {
    assert.equal(flagOf(code), '', `expected no flag for ${String(code)}`);
  }
});

test('elapsed time reads in the largest unit that fits', () => {
  const since = 1_757_000_000;
  const at = (seconds: number) => (since + seconds) * 1000;
  assert.equal(elapsedLabel(since, at(0)), '0s');
  assert.equal(elapsedLabel(since, at(45)), '45s');
  assert.equal(elapsedLabel(since, at(60)), '1m');
  assert.equal(elapsedLabel(since, at(187)), '3m');
  assert.equal(elapsedLabel(since, at(3600)), '1h');
  assert.equal(elapsedLabel(since, at(7400)), '2h');
  assert.equal(elapsedLabel(since, at(86_400 * 3)), '3d');
});

test('a clock that disagrees with the server does not produce a negative age', () => {
  // The timestamp comes from the server and the comparison happens in the
  // browser, so a skewed client clock can put "since" in the future.
  const since = 1_757_000_000;
  assert.equal(elapsedLabel(since, (since - 90) * 1000), '0s');
});
