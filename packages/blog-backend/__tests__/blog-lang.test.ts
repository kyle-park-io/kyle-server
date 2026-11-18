import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  chooseList,
  langFromCookie,
  prefersKorean,
  LANG_COOKIE,
} from '../dist/blog/lang.js';

test('the cookie is named blog_lang', () => {
  assert.equal(LANG_COOKIE, 'blog_lang');
});

test('no header or an empty header is korean', () => {
  assert.equal(prefersKorean(undefined), true);
  assert.equal(prefersKorean(''), true);
  assert.equal(prefersKorean('   '), true);
});

test('korean anywhere with q > 0 is korean', () => {
  for (const header of [
    'ko-KR',
    'KO-KR',
    'ko',
    'en-US,ko;q=0.5',
    'en-US, ko-KR;q=0.1',
    '*',
    'en;q=0.9, *;q=0.1',
  ]) {
    assert.equal(prefersKorean(header), true, header);
  }
});

test('no korean, or korean at q=0, is not korean', () => {
  for (const header of [
    'en-US',
    'en-US,en;q=0.9,ja;q=0.8',
    'ko;q=0, en',
    'ko-KR;q=0.0,en',
    'kok',
    'en, *;q=0',
  ]) {
    assert.equal(prefersKorean(header), false, header);
  }
});

test('cookie parsing', () => {
  assert.equal(langFromCookie('blog_lang=en'), 'en');
  assert.equal(langFromCookie('a=1; blog_lang=ko; b=2'), 'ko');
  assert.equal(langFromCookie('blog_lang=fr'), undefined);
  assert.equal(langFromCookie('blog_lang=fr; blog_lang=ko'), 'ko');
  assert.equal(langFromCookie('blog_lang=en; blog_lang=ko'), 'en');
  assert.equal(langFromCookie('other_blog_lang=en'), undefined);
  assert.equal(langFromCookie(''), undefined);
  assert.equal(langFromCookie(undefined), undefined);
});

test('order: query, then cookie, then header', () => {
  assert.deepEqual(
    chooseList({ query: 'en', cookie: 'blog_lang=ko', acceptLanguage: 'ko' }),
    { kind: 'set', lang: 'en' },
  );
  assert.deepEqual(chooseList({ query: 'ko', acceptLanguage: 'en-US' }), {
    kind: 'set',
    lang: 'ko',
  });
  assert.deepEqual(chooseList({ query: 'xx', acceptLanguage: 'en-US' }), {
    kind: 'serve',
    lang: 'en',
  });
  assert.deepEqual(chooseList({ query: ['en', 'ko'], acceptLanguage: 'ko' }), {
    kind: 'serve',
    lang: 'ko',
  });
  assert.deepEqual(
    chooseList({ cookie: 'blog_lang=ko', acceptLanguage: 'en-US' }),
    { kind: 'serve', lang: 'ko' },
  );
  assert.deepEqual(
    chooseList({ cookie: 'blog_lang=en', acceptLanguage: 'ko-KR' }),
    { kind: 'serve', lang: 'en' },
  );
  assert.deepEqual(chooseList({}), { kind: 'serve', lang: 'ko' });
});
