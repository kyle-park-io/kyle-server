# Blog Language Lists Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `jungho.dev/blog` into a Korean list at `/blog` and an English
list at `/blog/en`, with `/blog` switching to English by browser language
unless the reader picked a language.

**Architecture:** Astro builds both lists, per-language tag pages and feeds
from the existing `lang` frontmatter; one `src/lib/i18n.ts` module holds every
UI string and path helper. express decides Korean or English for `GET /blog`
from `?lang=`, a `blog_lang` cookie and `Accept-Language`, in a pure module
`src/blog/lang.ts` that `serve.ts` calls.

**Tech Stack:** Astro 7.3.1 (static, `build.format: 'file'`), express 4,
`node --test`, TypeScript.

**Spec:** `docs/superpowers/specs/2026-11-18-blog-language-lists-and-view-counts-design.md`
(Part 1 only; Part 2, view counts, gets its own plan after this ships).

## Global Constraints

- Korean is the default everywhere a language is not known.
- Only `GET /blog` (and `/blog/`) is ever redirected by language.
- Cookie: `blog_lang`, values `ko` | `en`, `Path=/blog`,
  `Max-Age=31536000`, `SameSite=Lax`, `Secure`, set only by `?lang=`.
- Every `/blog` response: `Vary: Accept-Language, Cookie`,
  `Cache-Control: private, no-cache`.
- UI strings are exactly the spec's section 1.4 table.
- Korean copy passes `python3 ~/code/writing-guides/scripts/check.py <file>`.
- No em/en dashes in any file (hook-enforced).
- Do not commit, push or deploy without Kyle's go-ahead. Work on branch
  `feat/blog-language-lists` in `kyle-server` and `feat/reserved-slugs` in
  `~/code/blog`; the checkpoint steps below list what each commit would hold.

## Review Focus

- Reader with an English browser clicks `한국어`, then later clicks the
  masthead `Blog` link: must stay on Korean (cookie beats header). Test in
  Task 4.
- `Accept-Language: ko;q=0, en` means "not Korean": must redirect to English;
  `KO-KR` (uppercase) must count as Korean. Test in Task 4.
- A garbage or duplicated `blog_lang` cookie (`blog_lang=fr`,
  `blog_lang=en; blog_lang=ko`) must not crash and must fall back to the
  header rule (first valid value wins). Test in Task 4.
- A tag used only by English posts must not get a Korean tag page, and the
  Korean tag bar must not link to it. Test in Task 3.
- An English post's tag links, back link and dates must all be English and
  point under `/blog/en`. Test in Task 2.

---

### Task 1: i18n module, language-aware reading time, post filter

**Files:**

- Create: `packages/blog-site/src/lib/i18n.ts`
- Modify: `packages/blog-site/src/lib/reading-time.ts`
- Modify: `packages/blog-site/src/lib/posts.ts`
- Test: `packages/blog-site/__tests__/i18n.test.ts`,
  `packages/blog-site/__tests__/reading-time.test.ts`

**Interfaces:**

- Produces (all from `src/lib/i18n.ts`):
  - `type Lang = 'ko' | 'en'`
  - `listPath(lang: Lang): string` → `'/blog'` | `'/blog/en'`
  - `tagPath(lang: Lang, tag: string): string` → `/blog/tags/x` | `/blog/en/tags/x`
  - `rssPath(lang: Lang): string` → `/blog/rss.xml` | `/blog/en/rss.xml`
  - `togglePath(lang: Lang): string` → `/blog?lang=ko` | `/blog?lang=en`
  - `formatDate(date: Date, lang: Lang): string` (`ko-KR` / `en-US`,
    `{year:'numeric',month:'long',day:'numeric',timeZone:'Asia/Seoul'}`)
  - `COPY: Record<Lang, Copy>` where `Copy` has: `readingTime(min: number)`,
    `updated(date: string)`, `contents`, `comments`, `download`, `back`,
    `progress`, `empty`, `postCount(n: number)`, `views(n: number)`,
    `listTitle`, `listDescription`, `giscusLang`, `langNav`
  - `isLang(value: unknown): value is Lang`
- Produces (from `src/lib/posts.ts`): `inLang<T extends PostLike>(posts: T[], lang: Lang): T[]`;
  `PostLike.data` gains `lang: Lang`.
- Produces (from `src/lib/reading-time.ts`): `readingMinutes(markdown: string, lang: Lang = 'ko'): number`

- [ ] **Step 1: Write the failing tests**

`__tests__/i18n.test.ts` (imports `../src/lib/i18n.ts`; node strips types):

```ts
test('paths per language', () => {
  assert.equal(listPath('ko'), '/blog');
  assert.equal(listPath('en'), '/blog/en');
  assert.equal(tagPath('en', 'cosmos'), '/blog/en/tags/cosmos');
  assert.equal(rssPath('en'), '/blog/en/rss.xml');
  assert.equal(togglePath('ko'), '/blog?lang=ko');
});
test('copy matches the spec table', () => {
  assert.equal(COPY.ko.readingTime(7), '약 7분');
  assert.equal(COPY.en.readingTime(7), '7 min read');
  assert.equal(COPY.en.updated('November 3, 2026'), 'Updated November 3, 2026');
  assert.equal(COPY.ko.updated('2026년 11월 3일'), '수정: 2026년 11월 3일');
  assert.equal(COPY.en.back, '← All posts');
  assert.equal(COPY.en.postCount(1), '1 post');
  assert.equal(COPY.en.postCount(2), '2 posts');
  assert.equal(COPY.ko.postCount(2), '2편');
  assert.equal(COPY.ko.views(1234), '조회 1,234');
  assert.equal(COPY.en.views(1), '1 view');
  assert.equal(COPY.en.views(1234), '1,234 views');
  assert.equal(COPY.en.listTitle, 'Blog (English) | jungho.dev');
  assert.equal(COPY.en.giscusLang, 'en');
});
test('dates per language', () => {
  const d = new Date('2026-11-03T00:00:00Z');
  assert.equal(formatDate(d, 'en'), 'November 3, 2026');
  assert.equal(formatDate(d, 'ko'), '2026년 11월 3일');
});
```

Add to `reading-time.test.ts`:

````ts
test('english counts words at 238 per minute', () => {
  assert.equal(readingMinutes('word '.repeat(238), 'en'), 1);
  assert.equal(readingMinutes('word '.repeat(239), 'en'), 2);
});
test('english code fences do not count', () => {
  assert.equal(
    readingMinutes('```\n' + 'x '.repeat(5000) + '\n```\nhi', 'en'),
    1,
  );
});
````

- [ ] **Step 2: Run, expect failures**

Run: `cd packages/blog-site && node --test __tests__/i18n.test.ts __tests__/reading-time.test.ts`
Expected: FAIL, module not found / wrong minutes.

- [ ] **Step 3: Implement `src/lib/i18n.ts`, `inLang`, and the `lang` argument of `readingMinutes`**

English rate is 238 words per minute (Brysbaert 2019, non-fiction silent
reading); before writing it into the code comment, confirm the number in the
paper's abstract and cite it with the link. If the source says otherwise, use
the source's number and update the two tests. Word count = whitespace-split
tokens outside code fences. `COPY.ko.listDescription` is
`블록체인, 퀀트 시스템, 데브렐을 다룬 기술 글입니다.`;
`COPY.en.listDescription` is the current `BLOG_DESCRIPTION`;
`COPY.ko.listTitle` is the current `BLOG_TITLE`. `langNav` is the toggle's
`aria-label`: `언어` / `Language`.

- [ ] **Step 4: Run, expect pass**

Run: `node --test __tests__/i18n.test.ts __tests__/reading-time.test.ts`
Expected: PASS (existing reading-time tests unchanged).

- [ ] **Step 5: Checkpoint** `src/lib/i18n.ts src/lib/posts.ts src/lib/reading-time.ts __tests__/i18n.test.ts __tests__/reading-time.test.ts`
      (`feat(blog): add a language module for blog copy and paths`)

### Task 2: Post and archive pages follow the post's language

**Files:**

- Modify: `src/components/PostArticle.astro`, `src/components/Toc.astro`,
  `src/components/Giscus.astro`, `src/components/ProgressBar.astro`,
  `src/pages/[slug].astro`, `src/pages/archive/[slug].astro`
- Create: `__tests__/fixtures/posts/english-post/index.md`
- Test: `__tests__/post-page.test.ts`, `__tests__/giscus.test.ts`

**Interfaces:**

- Consumes: Task 1 `COPY`, `formatDate`, `tagPath`, `listPath`, `readingMinutes(md, lang)`.
- Produces: `Toc`, `Giscus`, `ProgressBar` take `lang: Lang` (default `'ko'`).

- [ ] **Step 1: Add the English fixture and failing tests**

Fixture `english-post/index.md`: `title: English Fixture`, `date: 2025-01-02`,
`summary: An English fixture post.`, `tags: [astro, english-only]`,
`lang: en`, body with three `##` headings (so the TOC renders) and ~300
words. `astro` is shared with the Korean `hello-world` fixture;
`english-only` is not.

Tests in `post-page.test.ts` against `dist/english-post.html`:

```ts
test('an english post renders english copy', () => {
  const page = read('english-post.html');
  assert.match(page, /<article class="post" lang="en"/);
  assert.match(page, /\d+ min read/);
  assert.match(page, />Contents</);
  assert.match(page, /← All posts/);
  assert.match(page, /href="\/blog\/en"/);
  assert.match(page, /January 2, 2025/);
  assert.match(page, /href="\/blog\/en\/tags\/astro"/);
  assert.match(page, /Download the Markdown source/);
  assert.match(page, /aria-label="Reading progress"/);
  assert.ok(!/약 \d+분|목차|글 목록/.test(page));
});
test('a korean post keeps korean copy and korean tag links', () => {
  const page = read('hello-world.html');
  assert.match(page, /약 \d+분/);
  assert.match(page, /href="\/blog\/tags\/astro"/);
  assert.match(page, /← 글 목록/);
});
```

In `giscus.test.ts`: English post has `data-lang="en"` and heading
`Comments`; Korean post keeps `data-lang="ko"`.

- [ ] **Step 2: Run, expect failures**

Run: `cd packages/blog-site && yarn test`
Expected: the new tests FAIL; existing tests still pass (the fixture adds a
post, so check `list-page`/`feeds` counts; any that now fail are fixed in
Task 3, note which).

- [ ] **Step 3: Thread `post.data.lang` through the components**

Every Korean literal in these six files is replaced by its `COPY[lang]`
entry. The archive notice and `(보관)` title suffix get English variants:
`Archived post. Kept as written on <date>; it is not in the blog list or in
search results.` / `New post:` / `(archived)`.

- [ ] **Step 4: Run, expect pass**

Run: `yarn test` (the `pretest` rebuilds with fixtures).
Expected: Task 2 tests PASS.

- [ ] **Step 5: Checkpoint** the six components/pages, the fixture, both test files
      (`feat(blog): render post pages in the post's language`)

### Task 3: Per-language lists, tag pages, feeds, toggle, SEO

**Files:**

- Create: `src/components/ListPage.astro` (header + toggle + tag bar +
  featured + rows + empty state, prop `lang`)
- Create: `src/components/LangToggle.astro` (prop `lang`)
- Create: `src/components/TagPage.astro` (props `lang`, `tag`)
- Create: `src/lib/feed.ts` exporting `feed(lang: Lang): Promise<Response>`
- Create: `src/pages/en.astro`, `src/pages/en/tags/[tag].astro`,
  `src/pages/en/rss.xml.ts`
- Modify: `src/pages/index.astro`, `src/pages/tags/[tag].astro`,
  `src/pages/rss.xml.ts`, `src/pages/index.json.ts`, `src/pages/404.astro`,
  `src/components/PostIndexRow.astro`, `src/components/FeaturedPost.astro`,
  `src/components/TagBar.astro`, `src/layouts/Shell.astro`,
  `src/styles/list.css`
- Test: `__tests__/list-page.test.ts`, `__tests__/feeds.test.ts`

**Interfaces:**

- Consumes: Task 1 helpers; Task 2 fixture.
- Produces: `Shell` props `alternates?: Array<{ hreflang: 'ko' | 'en' | 'x-default'; path: string }>`
  and `rss?: string` (defaults to `rssPath(lang)`).
  Build output: `dist/en.html`, `dist/en/tags/<tag>.html`, `dist/en/rss.xml`.

- [ ] **Step 1: Write the failing tests**

```ts
test('the korean list holds only korean posts', () => {
  const page = read('index.html');
  assert.match(page, /첫 번째 글/);
  assert.ok(!page.includes('English Fixture'));
});
test('the english list holds only english posts', () => {
  const page = read('en.html');
  assert.match(page, /English Fixture/);
  assert.ok(!page.includes('첫 번째 글'));
  assert.match(page, /<html lang="en"/);
  assert.match(
    page,
    /<link rel="canonical" href="https:\/\/jungho\.dev\/blog\/en"/,
  );
});
test('both lists carry the toggle and hreflang alternates', () => {
  for (const f of ['index.html', 'en.html']) {
    const page = read(f);
    assert.match(page, /class="lang-toggle"/);
    assert.match(page, /hreflang="ko" href="https:\/\/jungho\.dev\/blog"/);
    assert.match(page, /hreflang="en" href="https:\/\/jungho\.dev\/blog\/en"/);
    assert.match(
      page,
      /hreflang="x-default" href="https:\/\/jungho\.dev\/blog"/,
    );
  }
  assert.match(read('index.html'), /href="\/blog\?lang=en"/);
  assert.match(read('en.html'), /href="\/blog\?lang=ko"/);
});
test('rows carry no EN badge', () => {
  assert.ok(!read('en.html').includes('post-row__lang'));
});
test('tag pages split by language', () => {
  assert.ok(exists('tags/astro.html') && exists('en/tags/astro.html'));
  assert.ok(!exists('tags/english-only.html'));
  assert.ok(exists('en/tags/english-only.html'));
  assert.ok(!read('index.html').includes('/blog/tags/english-only'));
  assert.ok(!read('tags/astro.html').includes('English Fixture'));
  assert.match(read('en/tags/astro.html'), /1 post/);
});
test('feeds split by language', () => {
  assert.ok(!read('rss.xml').includes('English Fixture'));
  assert.match(read('en/rss.xml'), /English Fixture/);
  assert.match(
    read('en.html'),
    /type="application\/rss\+xml"[^>]*href="\/blog\/en\/rss\.xml"/,
  );
});
test('index.json keeps every listed post and adds lang', () => {
  const items = JSON.parse(read('index.json'));
  assert.ok(
    items.some((i) => i.lang === 'en') && items.some((i) => i.lang === 'ko'),
  );
});
test('the 404 page speaks both languages, korean first', () => {
  const page = read('404.html');
  const ko = page.indexOf('글을 찾을 수 없습니다');
  const en = page.indexOf('Page not found');
  assert.ok(ko > -1 && en > ko);
});
test('the sitemap lists the english list without a trailing slash', () => {
  assert.match(sitemap(), /<loc>https:\/\/jungho\.dev\/blog\/en<\/loc>/);
});
```

Update `feeds.test.ts` "rss lists every post" to "rss lists every Korean
post".

- [ ] **Step 2: Run, expect failures**

Run: `yarn test`
Expected: new tests FAIL.

- [ ] **Step 3: Build the pages**

`index.astro` and `en.astro` each render `<ListPage lang=…>` inside `Shell`
with `lang`, `title=COPY[lang].listTitle`,
`description=COPY[lang].listDescription`, `canonicalPath=listPath(lang)`,
and the three alternates. Featured = newest post of that language with a
cover. Tag pages are generated from `inLang(listed(...), lang)` only; the
tag bar's `All` goes to `listPath(lang)`. `LangToggle` renders
`<nav class="lang-toggle" aria-label={COPY[lang].langNav}>`: the current
language as `<span aria-current="page">`, the other as
`<a href={togglePath(other)} hreflang={other} lang={other}>`, separated by
`·`; tag pages show the same toggle. 404 English copy: `Page not found` /
`There is no post at this address. Find it in the post list or the recent
posts below.` / `Requested address` / `Korean posts` / `English posts` /
`Home` (buttons: `글 목록 보기` → `/blog`, `English posts` → `/blog/en`, `홈으로
가기`). `list.css`: `.lang-toggle` matches `.list-header__rss` type
(11px, 700, 0.15em, uppercase off for Hangul), muted, current item in
`--shell-fg`; header keeps `space-between` with toggle and RSS grouped on
the right.

- [ ] **Step 4: Confirm the output path and run tests**

Run: `yarn test && ls dist/en.html dist/en/tags dist/en/rss.xml`
Expected: PASS; files exist. If Astro emitted `dist/en/index.html` instead,
record that in the spec's Unverified section and use that path in Task 4.

- [ ] **Step 5: Look at it**

Run `yarn build && yarn preview`, open `/blog` and `/blog/en` at 1280, 834
and 390 px (Playwright screenshots), check the header row wraps cleanly and
nothing scrolls sideways; open one post per language. Note: preview has no
express, so `?lang=` links do not set cookies here.

- [ ] **Step 6: Checkpoint** all Task 3 files
      (`feat(blog): serve korean and english post lists separately`)

### Task 4: express chooses the list for `GET /blog`

**Files:**

- Create: `packages/blog-backend/src/blog/lang.ts`
- Modify: `packages/blog-backend/src/blog/serve.ts`
- Test: `packages/blog-backend/__tests__/blog-lang.test.ts` (unit),
  `packages/blog-backend/__tests__/blog-routes.test.ts` (routes)

**Interfaces:**

- Consumes: Task 3 build output file `en.html`.
- Produces (from `lang.ts`):
  - `type BlogLang = 'ko' | 'en'`, `LANG_COOKIE = 'blog_lang'`
  - `langFromCookie(cookieHeader: string | undefined): BlogLang | undefined`
  - `prefersKorean(acceptLanguage: string | undefined): boolean`
  - `chooseList(input: { query?: unknown; cookie?: string; acceptLanguage?: string }): { kind: 'set'; lang: BlogLang } | { kind: 'serve'; lang: BlogLang }`

- [ ] **Step 1: Write the failing unit tests** (`blog-lang.test.ts`, against `../dist/blog/lang.js`)

```ts
test('no header or empty header is korean', () => {
  assert.equal(prefersKorean(undefined), true);
  assert.equal(prefersKorean(''), true);
});
test('korean anywhere with q > 0 is korean', () => {
  for (const h of [
    'ko-KR',
    'KO-KR',
    'en-US,ko;q=0.5',
    'ko',
    '*',
    'en;q=0.9, *;q=0.1',
  ])
    assert.equal(prefersKorean(h), true, h);
});
test('no korean, or korean at q=0, is not korean', () => {
  for (const h of ['en-US', 'en-US,en;q=0.9,ja;q=0.8', 'ko;q=0, en', 'kok'])
    assert.equal(prefersKorean(h), false, h);
});
test('cookie parsing', () => {
  assert.equal(langFromCookie('blog_lang=en'), 'en');
  assert.equal(langFromCookie('a=1; blog_lang=ko; b=2'), 'ko');
  assert.equal(langFromCookie('blog_lang=fr'), undefined);
  assert.equal(langFromCookie('blog_lang=en; blog_lang=ko'), 'en');
  assert.equal(langFromCookie(undefined), undefined);
});
test('order: query, cookie, header', () => {
  assert.deepEqual(
    chooseList({ query: 'en', cookie: 'blog_lang=ko', acceptLanguage: 'ko' }),
    { kind: 'set', lang: 'en' },
  );
  assert.deepEqual(chooseList({ query: 'xx', acceptLanguage: 'en-US' }), {
    kind: 'serve',
    lang: 'en',
  });
  assert.deepEqual(
    chooseList({ cookie: 'blog_lang=ko', acceptLanguage: 'en-US' }),
    { kind: 'serve', lang: 'ko' },
  );
  assert.deepEqual(
    chooseList({ cookie: 'blog_lang=en', acceptLanguage: 'ko-KR' }),
    { kind: 'serve', lang: 'en' },
  );
});
```

Note `kok` (Konkani) must not match: compare the primary subtag exactly.

- [ ] **Step 2: Write the failing route tests** (`blog-routes.test.ts`)

Fixture gains `en.html` (`<h1>English list</h1>`) and `en/tags/astro.html`.
Node's `fetch` sends `accept-language: *` unless told otherwise, so every
new test sets the header explicitly.

```ts
const get = (path, headers = {}) =>
  fetch(`${base}${path}`, { redirect: 'manual', headers });
test('english browser is sent to /blog/en', async () => {
  const r = await get('/blog', { 'accept-language': 'en-US' });
  assert.equal(r.status, 302);
  assert.equal(r.headers.get('location'), '/blog/en');
});
test('korean browser gets the korean list', async () => {
  const r = await get('/blog', { 'accept-language': 'ko-KR,ko;q=0.9' });
  assert.equal(r.status, 200);
  assert.match(await r.text(), /Blog list/);
});
test('cookie beats the header both ways', async () => {
  assert.equal(
    (await get('/blog', { 'accept-language': 'en-US', cookie: 'blog_lang=ko' }))
      .status,
    200,
  );
  assert.equal(
    (await get('/blog', { 'accept-language': 'ko', cookie: 'blog_lang=en' }))
      .status,
    302,
  );
});
test('?lang sets the cookie and redirects to the canonical list', async () => {
  const r = await get('/blog?lang=ko', { 'accept-language': 'en-US' });
  assert.equal(r.status, 302);
  assert.equal(r.headers.get('location'), '/blog');
  const c = r.headers.get('set-cookie') ?? '';
  for (const part of [
    'blog_lang=ko',
    'Path=/blog',
    'Max-Age=31536000',
    'SameSite=Lax',
    'Secure',
  ])
    assert.ok(c.includes(part), part);
});
test('every /blog response varies on language and cookie and is not shared-cached', async () => {
  for (const h of [
    { 'accept-language': 'en-US' },
    { 'accept-language': 'ko' },
  ]) {
    const r = await get('/blog', h);
    assert.match(r.headers.get('vary') ?? '', /Accept-Language/);
    assert.match(r.headers.get('vary') ?? '', /Cookie/);
    assert.equal(r.headers.get('cache-control'), 'private, no-cache');
  }
});
test('trailing slash and HEAD follow the same rule', async () => {
  assert.equal(
    (await get('/blog/', { 'accept-language': 'en-US' })).status,
    302,
  );
  const h = await fetch(`${base}/blog`, {
    method: 'HEAD',
    redirect: 'manual',
    headers: { 'accept-language': 'en-US' },
  });
  assert.equal(h.status, 302);
});
test('/blog/en serves the english list and is never redirected', async () => {
  const r = await get('/blog/en', {
    'accept-language': 'ko',
    cookie: 'blog_lang=ko',
  });
  assert.equal(r.status, 200);
  assert.match(await r.text(), /English list/);
});
test('/blog/en/tags/<tag> is served', async () => {
  assert.equal((await get('/blog/en/tags/astro')).status, 200);
});
```

The existing `GET /blog serves the static list page` keeps passing because
`*` counts as Korean.

- [ ] **Step 3: Run, expect failures**

Run: `cd packages/blog-backend && yarn test`
Expected: new tests FAIL.

- [ ] **Step 4: Implement `lang.ts` and wire it into `serve.ts`**

`app.get('/blog')` calls `chooseList`, sets `Vary` and `Cache-Control`
before any response, then: `set` → `res.cookie(LANG_COOKIE, lang, {...})`
and `res.redirect(302, lang === 'en' ? '/blog/en' : '/blog')`; `serve` with
`en` → `302 /blog/en`; `serve` with `ko` → `sendBlogFile(index.html)`.
Add `app.get('/blog/en', …)` → `sendBlogFile(en.html)` before
`express.static`. Comment both routes with why (directory vs `.html`, the
`send` 0.19.0 line from the spec).

- [ ] **Step 5: Run, expect pass**

Run: `yarn test`
Expected: all PASS.

- [ ] **Step 6: Checkpoint** `src/blog/lang.ts src/blog/serve.ts __tests__/blog-lang.test.ts __tests__/blog-routes.test.ts`
      (`feat(blog-backend): choose the korean or english list for /blog`)

### Task 5: Content repo reserves route slugs

**Files (repo `~/code/blog`):**

- Modify: `scripts/validate-frontmatter.ts`, `CONTRIBUTING.md`
- Test: `__tests__/validate-frontmatter.test.ts`

- [ ] **Step 1: Failing test**: a post directory named `en`, `tags`,
      `archive`, `rss` or `index` fails validation with
      `slug "<name>" is reserved for a blog route`. Follow the file's existing
      temp-directory pattern.
- [ ] **Step 2: Run** `yarn test` → FAIL.
- [ ] **Step 3: Add `RESERVED_SLUGS`** next to `KEBAB` and check it where
      `KEBAB` is checked. `CONTRIBUTING.md`: in the `lang` row, say `lang`
      decides whether the post is listed at `/blog` or `/blog/en`; add a line
      under the slug paragraph listing the reserved names.
- [ ] **Step 4: Run** `yarn test && yarn typecheck && yarn validate` → PASS,
      and the current nine posts still validate.
- [ ] **Step 5: Checkpoint** (`feat: reserve slugs that collide with blog routes`)

### Task 6: End-to-end check before asking to ship

- [ ] **Step 1:** In `kyle-server`, run `yarn test` in `packages/blog-site`
      and `packages/blog-backend`, and the repo's prettier check on changed files.
- [ ] **Step 2:** Build the real content (`~/code/blog/content/posts` copied
      into `src/data/posts` the way `build-blog.sh` does), run blog-backend
      against that `dist` locally, and with `curl -sI` confirm: no
      `Accept-Language` → 200; `en-US` → 302 `/blog/en`; `?lang=ko` with `en-US`
      → `Set-Cookie` + 302 `/blog`. Open both lists and one post per language
      in a browser at 1280/834/390 and look at them (header row, toggle, empty
      rows, TOC label, comments heading).
- [ ] **Step 3:** Run `python3 ~/code/writing-guides/scripts/check.py` on
      every changed file that holds Korean copy.
- [ ] **Step 4:** Report to Kyle with the diff summary and ask for the
      go-ahead to commit, push, open PRs and deploy `site-app-server`. After
      deploy: fetch `https://jungho.dev/blog` with and without
      `Accept-Language: en-US`, `/blog/en`, both feeds, one post per language,
      and compare against the repo build.
