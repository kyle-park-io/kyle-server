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

const enHtml = () => readFileSync(join(SERVE_ROOT, 'en.html'), 'utf8');

test('the korean list holds only korean posts', () => {
  const page = html();
  assert.match(page, /첫 번째 글/);
  assert.ok(!page.includes('English Fixture'));
  assert.match(page, /<html lang="ko"/);
});

test('the english list holds only english posts', () => {
  const page = enHtml();
  assert.match(page, /English Fixture/);
  assert.ok(!page.includes('첫 번째 글'));
  assert.match(page, /<html lang="en"/);
  assert.match(page, /<title>Blog \(English\) \| jungho\.dev<\/title>/);
  assert.match(
    page,
    /<link rel="canonical" href="https:\/\/jungho\.dev\/blog\/en"/,
  );
  assert.match(page, /href="\/blog\/en\/tags\/astro"/);
  assert.match(page, /href="\/blog\/english-post"/);
  assert.match(page, /January 2, 2025/);
});

test('the korean list carries its own description', () => {
  assert.match(
    html(),
    /<meta name="description" content="블록체인, 퀀트 시스템, 데브렐을 다룬 기술 글입니다\.">/,
  );
});

test('both lists carry the toggle, pointing at the other language', () => {
  const ko = html();
  const en = enHtml();
  assert.match(ko, /class="lang-toggle"/);
  assert.match(en, /class="lang-toggle"/);
  assert.match(ko, /aria-current="page"[^>]*>한국어</);
  assert.match(ko, /href="\/blog\?lang=en"[^>]*>English</);
  assert.match(en, /aria-current="page"[^>]*>English</);
  assert.match(en, /href="\/blog\?lang=ko"[^>]*>한국어</);
});

test('both lists carry hreflang alternates', () => {
  for (const page of [html(), enHtml()]) {
    assert.match(
      page,
      /<link rel="alternate" hreflang="ko" href="https:\/\/jungho\.dev\/blog">/,
    );
    assert.match(
      page,
      /<link rel="alternate" hreflang="en" href="https:\/\/jungho\.dev\/blog\/en">/,
    );
    assert.match(
      page,
      /<link rel="alternate" hreflang="x-default" href="https:\/\/jungho\.dev\/blog">/,
    );
  }
});

test('each list links the feed of its own language', () => {
  assert.match(
    html(),
    /type="application\/rss\+xml"[^>]*href="\/blog\/rss\.xml"/,
  );
  assert.match(
    enHtml(),
    /type="application\/rss\+xml"[^>]*href="\/blog\/en\/rss\.xml"/,
  );
  assert.match(
    enHtml(),
    /class="list-header__rss" href="\/blog\/en\/rss\.xml"/,
  );
});

test('rows carry no EN badge', () => {
  assert.ok(!enHtml().includes('post-row__lang'));
  assert.ok(!html().includes('post-row__lang'));
});

test('the english tag bar starts at the english list', () => {
  assert.match(
    enHtml(),
    /class="tag-bar__item tag-bar__item--active"[^>]*>\s*All/,
  );
  assert.match(enHtml(), /href="\/blog\/en"[^>]*class="tag-bar__item/);
});

test('the korean tag bar starts at the korean list through the toggle', () => {
  assert.match(
    readFileSync(join(SERVE_ROOT, 'tags', 'astro.html'), 'utf8'),
    /href="\/blog\?lang=ko"[^>]*class="tag-bar__item/,
  );
});
