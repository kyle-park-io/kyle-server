import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  VIEWS_API,
  isLocalHost,
  listQuery,
  readCount,
  readCounts,
  viewsLabel,
} from '../src/lib/views.ts';

test('the views api lives on the proxy', () => {
  assert.equal(VIEWS_API, '/api-views');
});

test('local hosts make no requests', () => {
  for (const h of ['localhost', '127.0.0.1', '[::1]']) {
    assert.equal(isLocalHost(h), true);
  }
  assert.equal(isLocalHost('jungho.dev'), false);
  assert.equal(isLocalHost('jungho.test'), false);
});

test('one list request per page, each slug once', () => {
  assert.equal(listQuery(['a', 'b', 'a']), '/api-views?slugs=a,b');
});

test('a post reply is read only when it is about that post', () => {
  assert.equal(readCount({ slug: 'a', views: 3 }, 'a'), 3);
  assert.equal(readCount({ slug: 'a', views: 0 }, 'a'), 0);
  assert.equal(readCount({ slug: 'b', views: 3 }, 'a'), null);
  for (const v of [-1, 1.5, '3', null]) {
    assert.equal(readCount({ slug: 'a', views: v }, 'a'), null);
  }
  assert.equal(readCount('nope', 'a'), null);
  assert.equal(readCount(null, 'a'), null);
});

test('a list reply keeps only whole, non-negative counts', () => {
  assert.deepEqual(readCounts({ a: 1, b: -1, c: 'x', d: 0, e: 2.5 }), {
    a: 1,
    d: 0,
  });
  assert.deepEqual(readCounts(null), {});
  assert.deepEqual(readCounts([1, 2]), {});
});

test('the label a filled span shows', () => {
  assert.equal(viewsLabel(1234, 'ko'), '조회 1,234');
  assert.equal(viewsLabel(1, 'en'), '1 view');
  assert.equal(viewsLabel(1234, 'en'), '1,234 views');
  assert.equal(viewsLabel(3, 'fr'), null);
  assert.equal(viewsLabel(3, undefined), null);
});
