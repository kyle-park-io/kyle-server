import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  COPY,
  formatDate,
  isLang,
  listPath,
  rssPath,
  tagPath,
  togglePath,
  listLinkPath,
} from '../src/lib/i18n.ts';
import { inLang } from '../src/lib/posts.ts';

test('paths per language', () => {
  assert.equal(listPath('ko'), '/blog');
  assert.equal(listPath('en'), '/blog/en');
  assert.equal(tagPath('ko', 'cosmos'), '/blog/tags/cosmos');
  assert.equal(tagPath('en', 'cosmos'), '/blog/en/tags/cosmos');
  assert.equal(rssPath('ko'), '/blog/rss.xml');
  assert.equal(rssPath('en'), '/blog/en/rss.xml');
  assert.equal(togglePath('ko'), '/blog?lang=ko');
  assert.equal(togglePath('en'), '/blog?lang=en');
});

test('copy matches the spec table', () => {
  assert.equal(COPY.ko.readingTime(7), '약 7분');
  assert.equal(COPY.en.readingTime(7), '7 min read');
  assert.equal(COPY.en.updated('November 3, 2026'), 'Updated November 3, 2026');
  assert.equal(COPY.ko.updated('2026년 11월 3일'), '수정: 2026년 11월 3일');
  assert.equal(COPY.ko.contents, '목차');
  assert.equal(COPY.en.contents, 'Contents');
  assert.equal(COPY.ko.comments, '댓글');
  assert.equal(COPY.en.comments, 'Comments');
  assert.equal(COPY.ko.download, '원문 마크다운 내려받기');
  assert.equal(COPY.en.download, 'Download the Markdown source');
  assert.equal(COPY.ko.back, '← 글 목록');
  assert.equal(COPY.en.back, '← All posts');
  assert.equal(COPY.ko.progress, '읽기 진행률');
  assert.equal(COPY.en.progress, 'Reading progress');
  assert.equal(COPY.ko.empty, '아직 발행한 글이 없습니다.');
  assert.equal(COPY.en.empty, 'No posts yet.');
  assert.equal(COPY.ko.postCount(2), '2편');
  assert.equal(COPY.en.postCount(1), '1 post');
  assert.equal(COPY.en.postCount(2), '2 posts');
  assert.equal(COPY.ko.views(1234), '조회 1,234');
  assert.equal(COPY.en.views(1), '1 view');
  assert.equal(COPY.en.views(1234), '1,234 views');
  assert.equal(COPY.ko.listTitle, 'Blog | jungho.dev');
  assert.equal(COPY.en.listTitle, 'Blog (English) | jungho.dev');
  assert.equal(
    COPY.ko.listDescription,
    '블록체인, 퀀트 시스템, 데브렐을 다룬 기술 글입니다.',
  );
  assert.equal(
    COPY.en.listDescription,
    'Technical writings on blockchain, quant systems, and developer relations.',
  );
  assert.equal(COPY.ko.giscusLang, 'ko');
  assert.equal(COPY.en.giscusLang, 'en');
  assert.equal(COPY.ko.langNav, '언어');
  assert.equal(COPY.en.langNav, 'Language');
});

test('dates per language', () => {
  const d = new Date('2026-11-03T00:00:00Z');
  assert.equal(formatDate(d, 'en'), 'November 3, 2026');
  assert.equal(formatDate(d, 'ko'), '2026년 11월 3일');
});

test('isLang accepts only ko and en', () => {
  assert.equal(isLang('ko'), true);
  assert.equal(isLang('en'), true);
  assert.equal(isLang('fr'), false);
  assert.equal(isLang(undefined), false);
});

test('inLang keeps only posts in that language', () => {
  const post = (id: string, lang: 'ko' | 'en') => ({
    id,
    data: { title: id, date: new Date(), tags: [], draft: false, lang },
  });
  const posts = [post('a', 'ko'), post('b', 'en'), post('c', 'ko')];
  assert.deepEqual(
    inLang(posts, 'ko').map((p) => p.id),
    ['a', 'c'],
  );
  assert.deepEqual(
    inLang(posts, 'en').map((p) => p.id),
    ['b'],
  );
});

test('archive copy per language', () => {
  assert.equal(COPY.ko.archivedSuffix, '(보관)');
  assert.equal(COPY.en.archivedSuffix, '(archived)');
  assert.equal(
    COPY.ko.archivedNotice('2024년 9월 5일'),
    '보관한 글입니다. 2024년 9월 5일에 쓴 내용을 고치지 않고 그대로 두었고, 블로그 글 목록과 검색 엔진 결과에는 나오지 않습니다.',
  );
  assert.equal(
    COPY.en.archivedNotice('September 5, 2024'),
    'Archived post. Kept as written on September 5, 2024; it is not in the blog list or in search results.',
  );
  assert.equal(COPY.ko.newPost, '새로 쓴 글:');
  assert.equal(COPY.en.newPost, 'New post:');
});

test('a link that names a list in its own language', () => {
  assert.equal(listLinkPath('ko'), '/blog?lang=ko');
  assert.equal(listLinkPath('en'), '/blog/en');
});
