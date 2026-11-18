# Blog: Language Lists and View Counts (2026-11-18)

## Goal

Two changes to `jungho.dev/blog`, requested together and independent of each
other:

1. **Language lists.** A Korean reader lands on Korean posts and a foreign
   reader lands on English posts. Korean is the default. Each list shows only
   posts written in its language. Translating posts is explicitly later work,
   not part of this.
2. **View counts.** Show how many times each post has been read, so a reader
   can see which posts are read most. Showing popularity to readers is the
   main purpose; a private analytics view is not.

## Current state (read 2026-11-18)

- 9 posts in `~/code/blog/content/posts/`, 6 listed and 3 archived. Listed:
  4 Korean (`chain-communicator-v2`, `project-initial-setup-v2`,
  `mantle-rwa-h1-2026`, `rfq-deep-dive`), 2 English
  (`injective-orderbook-matching-engine`, `polymarket-flip-analysis`). All 3
  archived posts are Korean. Every post exists in one language only.
- `lang` (`ko` default, `en`) is already in the content schema
  (`packages/blog-site/src/content.config.ts`) and the repo validator
  (`~/code/blog/scripts/validate-frontmatter.ts`). It drives only an `EN`
  badge in list rows (`PostIndexRow.astro`) and `<article lang>` /
  `<html lang>`. The 2026-09-04 spec, section 10, put i18n routing and view
  counts out of scope.
- Blog UI copy is mixed: masthead, date line and `online` are English; reading
  time (`약 N분`), `수정:`, `목차`, `댓글`, the markdown download link, `← 글
목록`, empty state, tag page subtitle, archive notice and 404 are Korean.
  Dates are formatted `ko-KR` everywhere. giscus is `data-lang="ko"`.
- Serving: `blog-backend/src/blog/serve.ts` answers `GET /blog` explicitly
  (because `express.static` runs with `redirect: false`, which skips
  directory-index resolution at the mount root), then `express.static` with
  `extensions: ['html']`, then legacy 301s, then the blog 404.
- Edge: `curl -I https://jungho.dev/blog` returned `cache-control: public,
max-age=0` and `cf-cache-status: DYNAMIC` (2026-11-18 21:51 KST). Cloudflare
  does not cache the list HTML, so a per-request language decision is safe.
- Presence ("N online") already runs proxy → counter server → Redis:
  - Proxy derives a visitor ID as the first 8 bytes of
    `sha256(CF-Connecting-IP + "\0" + User-Agent)`
    (`ingress-reverse-proxy/redis/identity.go`).
  - Counter server is `kyle-park-io/kyle-db`, `db/redis/src`, a line-based TCP
    server (`handler/handler.go` `dispatch`) with commands `ADDUSER`,
    `DROPUSER`, `REAL-TIME`, backed by go-redis. Not checked out locally.
  - Redis is a `redis:latest` sidecar with `/data` on PVC `redis-pvc`
    (`~/code/kubenetes/kubenetes/redis/redis-tcp-app-k8s/redis-tcp-app-server.yaml`).
  - The proxy reaches the counter server through the `/redis-tcp` link's URL
    (`redis/presence.go` `counterAddr`). Routing keys on the first path
    segment (`handlers/prod.go`, `config/prod-links.yaml`); a link can carry a
    per-IP `writeLimit` (`redirect/ratelimit.go`).
- `site-app-server` has no volumes
  (`~/code/kubenetes/kubenetes/site/site-app-k8s/site-app-server.yaml`).

## Decisions

### Language: approaches considered

Each row is one way to split the blog by language, what it costs, and
whether it was taken.

| Approach                                                       | Trade-off                                                                                                                                                                     | Outcome    |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **A. Separate list URLs** (`/blog` Korean, `/blog/en` English) | A foreign reader can be sent a link that opens English directly; works without JS; search engines index each list. Costs one more explicit express route and a reserved slug. | **Chosen** |
| B. One `/blog` page, JS filter, choice in `localStorage`       | Smaller change, but a link sent to a foreign reader opens Korean first, and crawlers see one mixed page.                                                                      | Rejected   |

On top of A, Kyle chose **automatic switching on `/blog` by browser
language**, with Korean as the default.

Google's guidance is to avoid automatic language redirects: "Avoid
automatically redirecting users from one language version of a site to a
different language version of a site ... These redirections could prevent
users (and search engines) from viewing all the versions of your site." It
also says "the crawler sends HTTP requests without setting Accept-Language in
the request header."
([Managing Multi-Regional and Multilingual Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites),
read 2026-11-18 21:51 KST.) The design therefore redirects only when an
`Accept-Language` header is present and names no Korean; a request without
the header gets Korean. Googlebot receives the Korean list and reaches
`/blog/en` through the toggle link, `hreflang` alternates and the sitemap.

### View counts: approaches considered

Each row is one place to store and serve the counts, what it costs, and
whether it was taken.

| Approach                                     | Trade-off                                                                                                                        | Outcome    |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **A. Existing Redis via the counter server** | Persistence (`redis-pvc`), visitor identity and a known deploy order already exist. Costs changes in two repos and three images. | **Chosen** |
| B. express stores counts in a file           | One image, but `site-app-server` has no volume, so a new PVC and a second store to operate just for this.                        | Rejected   |
| C. Third-party counter (GoatCounter etc.)    | Adds a third-party script to every post and sends visitor data out.                                                              | Rejected   |

## Non-goals

- Translating posts, or linking a post to its translation.
- Auto-switching anything other than `/blog` (posts, tag pages, `/blog/en`
  are never redirected by language).
- A "popular posts" block or sorting by views. Revisit once counts have
  accumulated.
- Per-day view history or an analytics dashboard.
- Back-filling counts from before launch. Counting starts at 0 on deploy day.
- Changing the SPA homepage. It no longer reads `/blog/index.json` (commit
  b169c93, 2026-09-04, replaced its writing list with a blog card);
  `index.json` keeps listing both languages and gains `lang`.

## Part 1: Language lists

### 1.1 Pages and URLs

Every URL the blog serves after this change, and what it lists.

| URL                    | Content                                                                      |
| ---------------------- | ---------------------------------------------------------------------------- |
| `/blog`                | Korean list (`lang: ko`), featured block + rows, Korean UI                   |
| `/blog/en`             | English list (`lang: en`), featured block + rows, English UI                 |
| `/blog/tags/<tag>`     | Korean posts with that tag; generated only for tags used by a Korean post    |
| `/blog/en/tags/<tag>`  | English posts with that tag; generated only for tags used by an English post |
| `/blog/rss.xml`        | Korean posts only (was: all)                                                 |
| `/blog/en/rss.xml`     | English posts only                                                           |
| `/blog/<slug>`         | Unchanged. UI copy follows the post's `lang`                                 |
| `/blog/archive/<slug>` | Unchanged. UI copy follows the post's `lang`                                 |
| `/blog/index.json`     | Unchanged set (all listed posts), gains a `lang` field per item              |

The featured-block rule stays per list: the newest post **in that list** is
featured if it has a cover.

A tag link on a post goes to the tag page of the post's language. Tags shared
across languages (`cosmos` is on one Korean and one English post today) get a
page in each list.

Old tag addresses keep working. Before the split every tag page lived at
`/blog/tags/<tag>`; seven tags used only by English posts were in the
production sitemap on 2026-11-18. express answers `/blog/tags/<tag>` with a
301 to `/blog/en/tags/<tag>` when there is no Korean page for the tag and an
English one exists. `build-blog.sh` refuses to publish a build without
`en.html`, since express serves `/blog/en` from that file by name.

`/blog/rss.xml` turning Korean-only drops the two English posts from existing
subscribers' feed. Accepted: the English feed is linked from `/blog/en`.

### 1.2 Toggle

Both list pages show a language toggle in the list header, next to RSS:

```
Blog                        한국어 · English    RSS
───────────────────────────────────────────────────
```

The current language is marked (`aria-current="page"`, not a link). The links
are `/blog?lang=ko` and `/blog?lang=en`. Tag pages show the same toggle,
pointing at the lists (not at the other language's same tag, which may not
exist).

### 1.3 Automatic switching (express, `GET /blog` only)

Decision order:

1. `?lang=ko` or `?lang=en` → set cookie `blog_lang=<value>` (`Path=/blog`,
   `Max-Age=31536000`, `SameSite=Lax`, `Secure` in production) and `302` to
   `/blog` or `/blog/en`. Any other `lang` value is ignored.
2. Cookie `blog_lang=en` → `302` to `/blog/en`. Cookie `blog_lang=ko` → serve
   the Korean list.
3. No `Accept-Language` header, or an empty one → serve the Korean list.
4. `Accept-Language` lists any range whose primary subtag is `ko` with
   `q > 0` → serve the Korean list. A `*` range also serves Korean.
5. Otherwise → `302` to `/blog/en`.

Every `/blog` response (200 and 302) carries `Vary: Accept-Language, Cookie`
and `Cache-Control: private, no-cache`. Query strings other than `lang` are
dropped on the redirect.

Why the cookie exists: without it, a reader with an English browser who
clicks `한국어` lands on `/blog` and is sent straight back to `/blog/en`.

Only links that name the Korean list in Korean set the cookie, besides the
toggle: the back link under a Korean post, the Korean tag bar's `All` and the
404 page's `글 목록 보기` all go to `/blog?lang=ko`. Plain `/blog` would send a
Korean reader whose browser asks only for English to the English list right
after they finished a Korean post. Opening a shared `/blog/en` link does not
set the cookie, so a Korean reader who follows one English link is not
switched for good.

`/blog/en` gets its own explicit `app.get` route, for the same reason `/blog`
has one: once `en/tags/` exists, `dist/en` is a directory, and
`express.static` with `redirect: false` does not fall back to `en.html` for a
directory path. Confirmed in `send` 0.19.0 (`node_modules/send/index.js:722`,
used by `serve-static` 1.16.2): a path that stats as a directory goes to
`redirect()` before the extensions loop runs, and serve-static's
`redirect: false` listener turns that into a 404. The builder confirms the
actual output file name Astro emits for the English list page with
`build.format: 'file'`.

The 302 and `Set-Cookie` reach the browser unchanged: the Go proxy forwards
`/blog` with `httputil.NewSingleHostReverseProxy`
(`ingress-reverse-proxy/redirect/redirect.go:31`), which passes request
headers (`Accept-Language`, `Cookie`) upstream and response headers
(`Location`, `Set-Cookie`, `Vary`) back without following redirects.

`astro dev` has no express in front, so there is no automatic switching in
development; both URLs are reachable directly.

### 1.4 UI copy by language

Korean strings are unchanged unless listed. New English strings:

| Where              | Korean                          | English                          |
| ------------------ | ------------------------------- | -------------------------------- |
| Reading time       | `약 N분`                        | `N min read`                     |
| Updated date       | `수정: <date>`                  | `Updated <date>`                 |
| Dates              | `ko-KR`, e.g. `2026년 11월 3일` | `en-US`, e.g. `November 3, 2026` |
| Table of contents  | `목차`                          | `Contents`                       |
| Comments heading   | `댓글`                          | `Comments`                       |
| Markdown download  | `원문 마크다운 내려받기`        | `Download the Markdown source`   |
| Back link          | `← 글 목록` → `/blog?lang=ko`   | `← All posts` → `/blog/en`       |
| Progress bar label | `읽기 진행률`                   | `Reading progress`               |
| Empty list         | `아직 발행한 글이 없습니다.`    | `No posts yet.`                  |
| Tag page subtitle  | `N편`                           | `N posts` (`1 post`)             |
| Views              | `조회 1,234`                    | `1,234 views` (`1 view`)         |
| List page title    | `Blog \| jungho.dev`            | `Blog (English) \| jungho.dev`   |
| List description   | Korean description (new)        | current `BLOG_DESCRIPTION`       |
| giscus             | `data-lang="ko"`                | `data-lang="en"`                 |

Reading time for English counts words, not characters: the current rule
(characters / 500 per minute, `lib/reading-time.ts`) is calibrated for
Korean. English uses words / 200, rounded up, minimum 1. The builder may cite
a better-sourced rate; if so, write the source in the code comment.

The `EN` badge in list rows is removed: every row in a list now shares one
language.

The 404 page stays a single page and shows its message in both languages,
Korean first, since the reader's language is unknown there.

The archive notice is localized too (all archived posts are Korean today,
so the English variant is only exercised by tests).

Korean copy follows `~/code/writing-guides/product/general/screen-copy.md`
and must pass `python3 ~/code/writing-guides/scripts/check.py` on any file
that holds it.

### 1.5 SEO

- Each list's canonical is its own URL.
- Both list pages carry `hreflang` alternates: `ko` → `/blog`, `en` →
  `/blog/en`, `x-default` → `/blog`.
- The sitemap picks up `/blog/en` and the English tag pages automatically;
  confirm the trailing-slash serializer still holds.
- `<link rel="alternate" type="application/rss+xml">` points at the feed of
  the page's language.

### 1.6 Content repo (`~/code/blog`)

- Validator rejects slugs that collide with blog routes: `en`, `tags`,
  `archive`, `rss`, `index`.
- `CONTRIBUTING.md`: `lang` now decides which list a post appears in; list
  the reserved slugs.

## Part 2: View counts

### 2.1 What counts as a view

One view per visitor per post per 24 hours. A visitor is the proxy's existing
visitor ID (IP + User-Agent hash). Requests whose User-Agent matches
`/bot|crawl|spider|slurp|headless/i` are answered with the current count but
not counted. Only listed posts are counted; archived posts and unknown slugs
are rejected (see 2.3).

### 2.2 Counter server (`kyle-park-io/kyle-db`, `db/redis/src`)

Two new commands in `dispatch`; existing commands are untouched.

```
VIEW {"slug":"rfq-deep-dive","id":"<visitor id>"}
  -> {"slug":"rfq-deep-dive","views":42}

VIEWS rfq-deep-dive,chain-communicator-v2
  -> {"rfq-deep-dive":42,"chain-communicator-v2":7}
```

Redis keys:

| Key                      | Type               | Purpose        |
| ------------------------ | ------------------ | -------------- |
| `views:count`            | hash, field = slug | running totals |
| `views:seen:<slug>:<id>` | string, `EX 86400` | dedupe marker  |

`VIEW`: `SET views:seen:<slug>:<id> 1 NX EX 86400`; if it was set,
`HINCRBY views:count <slug> 1`; reply with the total either way. `VIEWS`
reads with `HMGET`; a missing field is `0`. The counter server checks slug
syntax (`^[a-z0-9]+(-[a-z0-9]+)*$`) and caps `VIEWS` at 100 slugs; it does not
know which posts exist.

Tests follow the repo's existing pattern (`REDIS_ADDR=<host:port> go test
./...` against `docker run -p 6399:6379 redis:7-alpine`): dedupe within the
window, a second visitor counts, an expired marker counts again, `VIEWS` with
unknown slugs returns 0, malformed input returns `ERR`.

### 2.3 Proxy (`packages/ingress-reverse-proxy`)

New link in `config/prod-links.yaml` and `config/dev-links.yaml`:

```yaml
- name: api-views
  route: /api-views
  url: <counter server URL, same as redis-tcp>
  writeLimit:
    burst: <builder's call>
    every: <builder's call>
```

New handler `redis.ViewsHandler`, dispatched from `handlers/prod.go`:

| Request                      | Behaviour                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| `POST /api-views/<slug>`     | Check slug is a listed post; bot UA → `VIEWS`; else `VIEW` with the visitor ID. `200 {"slug","views"}` |
| `GET /api-views?slugs=a,b,c` | Drop slugs that are not listed posts, `VIEWS` the rest. `200 {"a":1,...}`                              |
| unknown slug                 | `404`                                                                                                  |
| counter server down          | `503`, logged with the same once-per-outage throttling `presence.go` uses                              |

"Listed post" means a slug present in `/blog/index.json`, fetched from the
`blog` link's upstream and cached in memory for 60 s. This keeps arbitrary
slugs from creating Redis keys. A new post becomes countable within a minute
of the blog build swapping it in.

`writeLimit` applies per IP to `POST` only. A reader opening several posts in
a row must stay under it; the limit exists to cap count inflation from one
address rotating User-Agents. The builder picks the numbers and writes the
reasoning next to them, as the `api-quant` entry does.

Responses carry `Cache-Control: no-store`.

Built 2026-11-18 (`redis/views.go`):

- The handler talks to the counter server at the `api-views` link's own URL,
  so the YAML entry is what routes it.
- The post list is read through the `blog` link URL
  (`<blog url>/blog/index.json`, 3 s timeout) and kept 60 s. A failed refresh
  keeps the last good list and is retried after 10 s; before the first
  success every request is a 503, so a site pod that is still starting does
  not turn every post into a 404.
- `writeLimit` is burst 20, one more every 30 s. One reader spends one write
  per post opened and six posts are listed, so 20 covers reading all of them
  several times; an address rotating User-Agents gets about 120 extra views
  an hour.
- A `VIEW` reply that names another slug, or an `ERR` line, is a 502.
- Only a POST from a page on the same host counts (`Sec-Fetch-Site:
same-origin`, or the `Origin` host for browsers that do not send it; a
  request with neither, like curl, counts and meets the `writeLimit`). Any
  page on the web can make its visitors' browsers send a body-less POST
  without a CORS preflight, and each of those visitors brings a new address
  past the per-address limit. Such a POST is answered with the current
  count, like a crawler's.

### 2.4 Blog pages (`packages/blog-site`)

- **Post page** (`PostArticle.astro`): a `<span data-views hidden>` at the end
  of the meta line, after reading time / updated date, with its separator dot
  inside it. A bundled script `POST`s `/api-views/<slug>` on load and fills
  in `조회 1,234` / `1,234 views` with `Intl.NumberFormat`, then unhides it.
  On any failure it stays hidden. Skipped on `localhost`, as the presence
  script does.
- **List rows, featured block, tag pages**: each row gets the same hidden
  span in its meta line. One `GET /api-views?slugs=...` per page fills them.
- **Archive pages**: no count.
- No `0` flash: nothing is shown until the number arrives. A listed post
  with no views yet shows `조회 0` / `0 views` on the list once loaded.
- Built 2026-11-18: the wording lives in `lib/views.ts` (`viewsLabel`), and
  `COPY.views` calls it. Astro inlines the small script into every page, and
  importing `i18n.ts` from it put the whole Korean copy table into the HTML
  of English pages. List rows drop the separator dot: a row separates its
  date and tags by space alone.
- Built 2026-11-18: the count is laid out from the first paint and kept
  invisible until its number arrives. Its width is reserved for the widest
  five-digit label (`조회 99,999` / `99,999 views`, drawn by CSS from a
  `data-room` attribute so it is not text), so the meta line wraps the same
  way before and after. Measured with the real posts at 375 to 1280 px:
  0 px of movement when the number arrives or the request fails; before
  this, the English post with an update date and the list rows moved by
  27.2 to 54.4 px. In list rows the count sits at the right end of the meta
  line, flush right, so the unused part of its width is never a gap. When
  the request fails, the reserved width stays empty: on a 390 px phone the
  English post with an update date keeps one empty line under its date.

## Verification

What each test or check covers, by the part of the system it targets.

| Target            | Method                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language redirect | express route tests: no header → 200 Korean; `en-US` → 302 `/blog/en`; `en-US,ko;q=0.5` → 200; `ko-KR` → 200; `*` → 200; cookie `en` with `ko-KR` header → 302; cookie `ko` with `en-US` → 200; `?lang=en` → `Set-Cookie` + 302; `?lang=xx` ignored; `Vary` and `Cache-Control` on every response; `/blog/en` → 200                                                                                               |
| Lists             | blog-site build-output tests: `/blog` has only `lang: ko` rows, `/blog/en` only `lang: en`; tag pages split; both RSS feeds split; `hreflang` links present; `index.json` has `lang`. All three fixtures in `__tests__/fixtures/posts/` are `lang: ko` today, so add an English fixture that shares a tag with a Korean one; `feeds.test.ts` currently expects every listed post in `rss.xml` and changes with it |
| UI copy           | build-output tests assert the English strings on an English post page and the Korean strings on a Korean one                                                                                                                                                                                                                                                                                                      |
| Counter server    | Go tests in `kyle-db` (2.2)                                                                                                                                                                                                                                                                                                                                                                                       |
| Proxy             | Go tests: listed-slug cache, unknown slug 404, bot UA not counted, counter down → 503, rate limit on POST                                                                                                                                                                                                                                                                                                         |
| Visual            | Playwright at 1280 / 834 / 390, both lists and one post per language, with the views span filled and with the API failing. Look at the pages, not only computed styles                                                                                                                                                                                                                                            |
| Production        | After each deploy, fetch `/blog` with `Accept-Language: en-US` and with none, both lists, both feeds, and one post per language from `https://jungho.dev`; open a post twice from one browser and confirm the count rises once                                                                                                                                                                                    |

## Rollout

Part 1 and Part 2 ship as separate PRs. Part 1 touches only `site-app-server`
(blog-site + blog-backend) and the content repo validator, so it can ship
first.

Part 2 deploy order, chosen so no step breaks a running piece:

1. Counter server (`redis-tcp-app-server`): new commands, nothing calls them
   yet.
2. Proxy (`ingress-reverse-proxy-app-server`): `/api-views` exists, nothing
   calls it yet.
3. `site-app-server`: pages start calling `/api-views`.

Redis persistence was read on the production pod at 2026-11-18 21:59 KST
(`kubectl exec ... redis-cli CONFIG GET`, read only): `save 3600 1 300 100 60
10000`, `appendonly no`, `dir /data`; `/data/dump.rdb` last written 12:54 UTC
that day, `rdb_last_bgsave_status:ok`. Snapshots land on `redis-pvc`. A crash
can lose up to the last hour of counts; accepted, so the manifest is not
changed.

## Checked after this spec was written

- **Astro output path** for the English list page: `dist/en.html`, confirmed
  in the part 1 build (2026-11-18).
- **English reading speed:** 238 words per minute, from Brysbaert 2019
  (Journal of Memory and Language 109, 104047), read from the paper on
  2026-11-18. The 200 placeholder is not used.

## Left to the builder

- `writeLimit` numbers for `/api-views` (with reasoning in the YAML comment).
- Exact file layout of the English pages in `src/pages/` and how the copy
  table is stored (one module keyed by `lang` is the expected shape).
- Whether the listed-slug cache in the proxy reads `index.json` through the
  `blog` link URL or a dedicated config key.
- Korean list description text (follow `screen-copy.md`; it is a sentence
  shown in search results, so 합쇼체).
