import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// The fixture `old-snippet` is archived and superseded by `hello-world`.
const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const read = (file: string) => readFileSync(join(SERVE_ROOT, file), 'utf8');
const TITLE = '보관한 픽스처 글';

test('an archived post is served as written under /blog/archive', () => {
  const page = read(join('archive', 'old-snippet.html'));
  assert.match(page, /보관한 글의 본문입니다/);
  assert.match(page, /보관한 글입니다/);
  assert.match(page, /검색 엔진 결과에는 나오지 않습니다/);
  assert.match(page, /<meta name="robots" content="noindex, follow"/);
});

test('the archived notice links the post that replaces it', () => {
  const page = read(join('archive', 'old-snippet.html'));
  assert.match(page, /새로 쓴 글:/);
  assert.match(page, /href="\/blog\/hello-world"/);
});

test('the old address forwards to the archive copy', () => {
  const page = read('old-snippet.html');
  assert.match(page, /\/blog\/archive\/old-snippet/);
  assert.ok(
    !page.includes('보관한 글의 본문입니다'),
    'old address must not serve the body',
  );
});

test('the archived markdown sits next to the archive page only', () => {
  assert.ok(existsSync(join(SERVE_ROOT, 'archive', 'old-snippet.md')));
  assert.ok(!existsSync(join(SERVE_ROOT, 'old-snippet.md')));
});

test('an archived post leaves the list, tags and feeds', () => {
  assert.ok(!read('index.html').includes(TITLE), 'blog index');
  assert.ok(!read(join('tags', 'ethereum.html')).includes(TITLE), 'tag page');
  assert.ok(
    !existsSync(join(SERVE_ROOT, 'tags', 'archive-only.html')),
    'a tag only an archived post carries gets no page',
  );
  assert.ok(!read('rss.xml').includes(TITLE), 'rss');
  const items = JSON.parse(read('index.json')) as Array<{ slug: string }>;
  assert.ok(!items.some((item) => item.slug === 'old-snippet'), 'index.json');
});

test('neither archived address is in the sitemap', () => {
  const xml = read('sitemap-0.xml');
  assert.ok(!xml.includes('/blog/old-snippet<'), 'old address');
  assert.ok(!xml.includes('/blog/archive/'), 'archive copy');
  assert.match(xml, /\/blog\/hello-world</);
});
