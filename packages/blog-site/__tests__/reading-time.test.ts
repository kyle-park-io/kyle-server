import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readingMinutes } from '../src/lib/reading-time.ts';

test('500 characters is one minute', () => {
  assert.equal(readingMinutes('가'.repeat(500)), 1);
});

test('rounds up to the next minute', () => {
  assert.equal(readingMinutes('가'.repeat(501)), 2);
});

test('never returns zero for a short post', () => {
  assert.equal(readingMinutes('짧다'), 1);
});

test('fenced code blocks do not count', () => {
  const md = '가'.repeat(100) + '\n\n```js\n' + 'x'.repeat(5000) + '\n```\n';
  assert.equal(readingMinutes(md), 1);
});

test('whitespace does not count', () => {
  assert.equal(readingMinutes('가 '.repeat(500)), 1);
});
