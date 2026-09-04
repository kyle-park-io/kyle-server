import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const html = () => readFileSync(join(SERVE_ROOT, 'index.html'), 'utf8');

test('lists both fixture posts, newest first', () => {
  const page = html();
  const first = page.indexOf('첫 번째 글');
  const second = page.indexOf('두 번째 글');
  assert.ok(first > -1 && second > -1, 'both titles must appear');
  assert.ok(first < second, '2024 post must precede the 2023 post');
});

test('each row links to the extension-less post URL', () => {
  assert.match(html(), /href="\/blog\/hello-world"/);
});

test('rows carry summary, date and tags', () => {
  const page = html();
  assert.match(page, /스키마와 목차 렌더링을 확인하기 위한 픽스처 글입니다/);
  assert.match(page, /2024/);
  assert.match(page, /href="\/blog\/tags\/tooling"/);
});

test('no featured block while no post has a cover', () => {
  assert.ok(
    !html().includes('data-featured'),
    'featured block must not render',
  );
});

test('the RSS link is exposed on the list page', () => {
  assert.match(html(), /href="\/blog\/rss\.xml"/);
});

test('no pagination controls', () => {
  const page = html();
  assert.ok(!page.includes('«'), 'pagination was removed');
});
