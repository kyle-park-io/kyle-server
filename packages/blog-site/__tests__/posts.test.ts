import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sortByDateDesc,
  excludeDrafts,
  tagCounts,
  postsWithTag,
  type PostLike,
} from '../src/lib/posts.ts';

const post = (
  id: string,
  date: string,
  tags: string[],
  draft = false,
): PostLike => ({
  id,
  data: { title: id, date: new Date(date), tags, draft },
});

const fixture = [
  post('old', '2023-12-01', ['ethereum']),
  post('new', '2024-09-05', ['ethereum', 'tooling']),
  post('middle', '2024-01-15', ['tooling']),
  post('hidden', '2026-01-01', ['tooling'], true),
];

test('sorts newest first', () => {
  assert.deepEqual(
    sortByDateDesc(fixture.filter((p) => !p.data.draft)).map((p) => p.id),
    ['new', 'middle', 'old'],
  );
});

test('sorting does not mutate the input', () => {
  const input = [...fixture];
  sortByDateDesc(input);
  assert.equal(input[0].id, 'old');
});

test('drafts are excluded unless explicitly included', () => {
  assert.deepEqual(
    excludeDrafts(fixture, false).map((p) => p.id),
    ['old', 'new', 'middle'],
  );
  assert.equal(excludeDrafts(fixture, true).length, 4);
});

test('tag counts are sorted by count then alphabetically', () => {
  assert.deepEqual(tagCounts(excludeDrafts(fixture, false)), [
    { tag: 'ethereum', count: 2 },
    { tag: 'tooling', count: 2 },
  ]);
});

test('postsWithTag filters and keeps newest first', () => {
  assert.deepEqual(
    postsWithTag(excludeDrafts(fixture, false), 'tooling').map((p) => p.id),
    ['new', 'middle'],
  );
});

test('postsWithTag returns empty for an unknown tag', () => {
  assert.deepEqual(postsWithTag(fixture, 'nope'), []);
});
