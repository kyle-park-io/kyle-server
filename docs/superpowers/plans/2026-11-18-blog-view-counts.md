# Blog View Counts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every listed post on jungho.dev/blog shows how many people have read it (`조회 1,234` / `1,234 views`), on the post page and in the lists.

**Architecture:** The counter server in `kyle-park-io/kyle-db` gains `VIEW` and `VIEWS` next to the presence commands and keeps the totals in the same Redis. The ingress proxy exposes them at `/api-views`, checks the slug against the blog's own `index.json`, and counts with the visitor ID it already derives for presence. The blog pages render a hidden span per post and one bundled script fills it.

**Tech Stack:** Go 1.27 + go-redis v9 (counter server), Go `net/http` (proxy), Astro 7 + TypeScript (blog-site), node:test, Playwright with system Chrome.

**Spec:** `docs/superpowers/specs/2026-11-18-blog-language-lists-and-view-counts-design.md`, Part 2 and the Rollout section.

## Global Constraints

- One view per visitor per post per 24 hours; a visitor is the proxy's visitor ID (`redis.IdentifyVisitor(r).ID`).
- Bot User-Agents (`/bot|crawl|spider|slurp|headless/i`) get the current count and are not counted.
- Only slugs in `/blog/index.json` (listed posts) are counted or reported; archived posts and unknown slugs get 404.
- Redis keys: `views:count` (hash, field = slug) and `views:seen:<slug>:<id>` (string, `EX 86400`).
- Slug syntax everywhere: `^[a-z0-9]+(-[a-z0-9]+)*$`. `VIEWS` takes at most 100 slugs.
- Every `/api-views` response carries `Cache-Control: no-store` and `Content-Type: application/json`.
- Counter server down: proxy answers 503 and logs once, then every 20th consecutive failure (the `presence.go` rule).
- Display: `COPY[lang].views(n)` from `packages/blog-site/src/lib/i18n.ts` (already there and tested). Nothing shows until the number arrives; any failure leaves the span hidden; archive pages show no count; `localhost`, `127.0.0.1` and `[::1]` make no requests.
- Deploy order: counter server, then proxy, then `site-app-server`.
- Branches: kyle-server `feat/blog-view-counts`, kyle-db `feat/view-counts` (both made 2026-11-18). No commits until Kyle approves (Task 5), as in part 1.
- Memory-heavy commands run under `systemd-run --user --scope -p MemoryMax=<n> -p MemorySwapMax=0`.

## Review Focus

1. A reader who reloads a post ten times, or opens it in two tabs at once: the count rises by one. (Task 1 `TestAVisitorCountsOncePerWindow`, `TestTwoTabsAtOnceCountOnce`.)
2. The site pod is restarting when the proxy first needs `index.json`: posts answer 503 and keep the count hidden, never 404 for every post. (Task 2 `TestBlogUnreachableBeforeTheFirstFetchIs503`.)
3. A post published a minute ago: it becomes countable within 60 s without a proxy restart, and a later blog outage keeps the last good list. (Task 2 `TestListedSlugsAreRefreshedAfter60Seconds`, `TestALaterBlogOutageKeepsTheLastList`.)
4. A crafted path (`/api-views/RFQ`, `/api-views/..%2Fx`, a slug that is not a post) creates no Redis key. (Task 2 `TestUnknownSlugIs404WithoutTouchingTheCounter`.)
5. The views API fails or is slow: the page shows no number, no `0`, no error, and the meta line does not jump. (Task 4 Playwright run with the API failing.)

---

### Task 1: `VIEW` and `VIEWS` in the counter server (kyle-db)

**Files** (under `~/code/kyle-db/db/redis/`):

- Create: `src/realtime/views.go`
- Create: `src/realtime/views_test.go` (pure), `src/realtime/views_redis_test.go` (Redis DB 13)
- Modify: `src/handler/handler.go` (`dispatch`, `RedisHandleConnection`, the unknown-command reply)
- Modify: `src/handler/protocol_test.go`
- Modify: `push2gke_artifact.sh` (version from `$1`)

**Interfaces:**

- Produces (wire, consumed by Task 2):
  - `VIEW {"slug":"<slug>","id":"<id>"}` → `{"slug":"<slug>","views":<n>}\n`
  - `VIEWS a,b` → `{"a":<n>,"b":<m>}\n` (a slug with no views is `0`)
  - any bad input → a line starting `ERR `
- Produces (Go, package `realtime`): `ValidSlug(s string) bool`; `type ViewRequest struct { Slug, ID string }` with json tags `slug`, `id`; `ParseView(arg string) (ViewRequest, error)`; `ParseSlugs(arg string) ([]string, error)`; `NewViewStore(c *redis.Client, window time.Duration) *ViewStore`; `(*ViewStore).View(ctx, slug, id string) (int64, error)`; `(*ViewStore).Counts(ctx, slugs []string) (map[string]int64, error)`; constants `ViewsCountKey = "views:count"`, `ViewsSeenPrefix = "views:seen:"`, `MaxViewSlugs = 100`.

- [ ] **Step 1: Write the pure tests** in `views_test.go`

```go
func TestValidSlug(t *testing.T) {
	for _, s := range []string{"rfq-deep-dive", "a", "v2"} {
		if !ValidSlug(s) { t.Errorf("%q should be valid", s) }
	}
	for _, s := range []string{"", "RFQ", "a--b", "-a", "a-", "a/b", "../x", "a b"} {
		if ValidSlug(s) { t.Errorf("%q should be invalid", s) }
	}
}

func TestParseView(t *testing.T) {
	got, err := ParseView(`{"slug":"rfq-deep-dive","id":"0123456789abcdef"}`)
	// want ViewRequest{"rfq-deep-dive", "0123456789abcdef"}, nil
	// each of these is an error:
	//   `` / `rfq-deep-dive` (not JSON) / `{"slug":"rfq-deep-dive"}` (no id)
	//   `{"slug":"RFQ","id":"x"}` / `{"slug":"a","id":"has space"}`
	//   `{"slug":"a","id":"<65 x's>"}` (id is ^[A-Za-z0-9_-]{1,64}$)
}

func TestParseSlugs(t *testing.T) {
	// "a,b" -> [a b]; " a , b " -> [a b]; "a,b,a" -> [a b] (order kept, duplicates dropped)
	// errors: "" / "a,,b" / "a,RFQ" / 101 distinct valid slugs
}
```

- [ ] **Step 2: Write the Redis-backed tests** in `views_redis_test.go`, connecting like `session_redis_test.go`'s `store` helper but on **DB 13** (14 and 15 are taken by the existing files).

```go
func TestAVisitorCountsOncePerWindow(t *testing.T)      // View(a, v1) x3 -> 1, 1, 1
func TestASecondVisitorCounts(t *testing.T)             // View(a, v1), View(a, v2) -> 1, 2
func TestTwoTabsAtOnceCountOnce(t *testing.T)           // 20 goroutines View(a, v1) at once -> HGET views:count a == 1
func TestAnExpiredMarkerCountsAgain(t *testing.T)       // window 300ms: View, sleep 400ms, View -> 2
func TestTheMarkerExpiresWithTheWindow(t *testing.T)    // window 24h: PTTL views:seen:a:v1 in (23h59m, 24h]
func TestCountsReturnsZeroForUnknownSlugs(t *testing.T) // View(a, v1); Counts([a, b]) -> {a:1, b:0}
```

- [ ] **Step 3: Run them and watch them fail**

```bash
docker run -d --rm --name views-redis -p 6399:6379 redis:7-alpine
cd ~/code/kyle-db/db/redis/src && REDIS_ADDR=localhost:6399 go test ./realtime/
```

Expected: build failure, `undefined: ValidSlug` (and the other new names).

- [ ] **Step 4: Implement `views.go`.** `View` is `SET views:seen:<slug>:<id> 1 NX PX <window>`; when it was set, `HINCRBY views:count <slug> 1` and return the new total; otherwise `HGET` (missing = 0). `Counts` is one `HMGET`. Neither checks that a post exists; the proxy does.

- [ ] **Step 5: Run `go test ./realtime/` again.** Expected: PASS, no skips (REDIS_ADDR is set).

- [ ] **Step 6: Write the protocol tests** in `handler/protocol_test.go`, using its `serve`/`say` helpers:

```go
func TestViewIsCountedOncePerVisitor(t *testing.T) {
	c := serve(t)
	// say(`VIEW {"slug":"rfq-deep-dive","id":"v1"}`) twice -> `{"slug":"rfq-deep-dive","views":1}` both times
	// say(`VIEW {"slug":"rfq-deep-dive","id":"v2"}`)       -> `{"slug":"rfq-deep-dive","views":2}`
	// say("VIEWS rfq-deep-dive,chain-communicator-v2")     -> `{"chain-communicator-v2":0,"rfq-deep-dive":2}`
}

func TestBadViewCommandsAnswerErr(t *testing.T) {
	// "VIEW", "VIEW nonsense", `VIEW {"slug":"../x","id":"v1"}`, "VIEWS", "VIEWS a,,b"
	// -> each reply starts with "ERR ", and the connection still answers "PING" with "PONG"
}
```

Run `REDIS_ADDR=localhost:6399 go test ./handler/`. Expected: FAIL, the replies are the unknown-command line.

- [ ] **Step 7: Wire `dispatch`.** Add a `views *realtime.ViewStore` parameter; `RedisHandleConnection` builds it with `realtime.NewViewStore(client.RedisClient, viewWindow)` where `const viewWindow = 24 * time.Hour` sits under `sessionTTL` with one line on the spec's rule. Add `VIEW, VIEWS` to the unknown-command list. Log a bad `VIEW` at Warn like a bad `ADDUSER`; do not log each good view.

- [ ] **Step 8: Run the whole module.** `REDIS_ADDR=localhost:6399 go test ./...` and `go vet ./...`. Expected: PASS. Then `docker stop views-redis`.

- [ ] **Step 9: `push2gke_artifact.sh` takes the version.** Replace `TAG=0.0.1` with `TAG=${1:?usage: push2gke_artifact.sh <version>}`; production runs 0.0.3 (read 2026-11-18), so the script as written would build 0.0.1. Leave the cleanup block. Check with `sh -n push2gke_artifact.sh` and `sh push2gke_artifact.sh 2>&1 | head -1` (prints the usage line, builds nothing).

### Task 2: `/api-views` in the proxy

**Files** (under `packages/ingress-reverse-proxy/`):

- Create: `redis/views.go`, `redis/views_test.go`, `handlers/prod_test.go`
- Modify: `redis/presence.go` (split `command` so a caller can pass the address)
- Modify: `handlers/prod.go` (`case "api-views": redis.ViewsHandler(w, r, link)`)
- Modify: `config/prod-links.yaml`, `config/dev-links.yaml`

**Interfaces:**

- Consumes: the Task 1 wire protocol.
- Produces (HTTP, consumed by Task 3):

| Request                                    | Answer                                                                                             |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `POST /api-views/<slug>`, listed slug      | `200 {"slug":"<slug>","views":<n>}`; bot UA is answered from `VIEWS` without counting              |
| `GET /api-views?slugs=a,b,c`               | `200 {"a":<n>,...}` with only listed slugs; `{}` when none are listed, without calling the counter |
| unknown or malformed slug                  | `404 {"error":"not a listed post"}`                                                                |
| `GET /api-views/<slug>`, `POST /api-views` | `405` with `Allow`                                                                                 |
| `index.json` never fetched successfully    | `503 {"error":"post list unavailable"}`                                                            |
| counter unreachable                        | `503 {"error":"view counter unavailable"}`                                                         |
| counter answered `ERR …`                   | `502`, logged with the reply                                                                       |

- Produces (Go): `func ViewsHandler(w http.ResponseWriter, r *http.Request, link *types.Config)`; `func commandAt(addr, line string) (string, error)` (what `command` becomes; `command(line)` calls it with `counterAddr()`).

Decisions the spec left here:

- The counter address is the `api-views` link's own `url` host, so the link in the YAML is what routes it.
- The post list comes from `redirect.Redirects["/blog"].Url + "/blog/index.json"` with a 3 s client timeout, kept 60 s (`listedTTL`). A failed refresh keeps the last good list and tries again on the next request after 10 s; before the first success it is a 503.
- Package-level `viewsNow = time.Now` so tests move the clock.

- [ ] **Step 1: Write `redis/views_test.go`.** Two fakes: a TCP listener that records each line and answers a canned reply per verb (`VIEW` → `{"slug":"rfq-deep-dive","views":42}`, `VIEWS` → `{"rfq-deep-dive":42,"chain-communicator-v2":7}`), and an `httptest` server for `/blog/index.json` returning `[{"slug":"rfq-deep-dive"},{"slug":"chain-communicator-v2"}]` and counting hits. Set `redirect.Redirects["/blog"]` to it and pass an `api-views` link pointing at the TCP fake. Reset the list cache between tests.

```go
func TestPostCountsAListedPost(t *testing.T)
// POST /api-views/rfq-deep-dive, UA "Mozilla/5.0", CF-Connecting-IP 203.0.113.7
// -> counter saw exactly `VIEW {"slug":"rfq-deep-dive","id":"<IdentifyVisitor(r).ID>"}`
// -> 200, body {"slug":"rfq-deep-dive","views":42}, Cache-Control no-store

func TestABotIsAnsweredButNotCounted(t *testing.T)
// UA "Mozilla/5.0 (compatible; Googlebot/2.1)" -> counter saw `VIEWS rfq-deep-dive`, no VIEW; 200 views 42

func TestUnknownSlugIs404WithoutTouchingTheCounter(t *testing.T)
// POST /api-views/not-a-post, /api-views/RFQ, /api-views/..%2Fx, /api-views/a/b -> 404, counter saw nothing

func TestGetDropsUnlistedSlugs(t *testing.T)
// GET ?slugs=rfq-deep-dive,nope,chain-communicator-v2,rfq-deep-dive -> counter saw `VIEWS rfq-deep-dive,chain-communicator-v2`

func TestGetWithNoListedSlugsAnswersEmpty(t *testing.T)
// GET ?slugs=nope and GET with no slugs -> 200 {} and the counter saw nothing

func TestWrongMethodIs405(t *testing.T)
// GET /api-views/rfq-deep-dive -> 405 Allow: POST; POST /api-views -> 405 Allow: GET

func TestCounterDownIs503(t *testing.T)
// api-views link url http://127.0.0.1:1 -> 503 {"error":"view counter unavailable"}

func TestCounterErrIs502(t *testing.T)
// fake answers `ERR boom` -> 502

func TestListedSlugsAreRefreshedAfter60Seconds(t *testing.T)
// two POSTs -> index.json hit once; add "new-post" to the index; viewsNow += 61s; POST /api-views/new-post -> 200, hits == 2

func TestBlogUnreachableBeforeTheFirstFetchIs503(t *testing.T)
// "/blog" link at http://127.0.0.1:1 -> POST /api-views/rfq-deep-dive is 503 {"error":"post list unavailable"}, not 404

func TestALaterBlogOutageKeepsTheLastList(t *testing.T)
// fetch once; close the blog server; viewsNow += 61s -> POST still 200

func TestProdLinksSendViewsToTheCounterServer(t *testing.T)
// yaml-decode ../config/prod-links.yaml into types.Configs: api-views url == redis-tcp url,
// WriteLimit == {Burst: 20, Every: 30 * time.Second}
```

- [ ] **Step 2: Write `handlers/prod_test.go`** (initialise the logger as `redis/httptotcp_test.go` does):

```go
func TestViewWritesAreRateLimitedButReadsAreNot(t *testing.T)
// Redirects["/api-views"] with WriteLimit{Burst: 2, Every: time.Hour} plus the two fakes;
// three POSTs from one CF-Connecting-IP through MainHandler -> 200, 200, 429;
// then a GET ?slugs=rfq-deep-dive -> 200
```

- [ ] **Step 3: Run and watch them fail.** `cd packages/ingress-reverse-proxy && go test ./redis/ ./handlers/`. Expected: build failure, `undefined: ViewsHandler`.

- [ ] **Step 4: Implement** `redis/views.go`, the `commandAt` split, the `prod.go` case, and the links. In `prod-links.yaml`, after `redis-tcp`:

```yaml
- name: api-views
  route: /api-views
  url: http://redis-tcp-app-server-service.default.svc.cluster.local:8080
  # Only POST counts, and one visitor (IP + browser) counts once per post
  # per day, so an honest reader spends one write per post they open. Six
  # posts are listed today: 20 at once covers reading all of them several
  # times, and one more every 30 seconds caps an address that rotates
  # User-Agents at about 120 extra views an hour.
  writeLimit:
    burst: 20
    every: 30s
```

In `dev-links.yaml`, the same entry with `url: http://localhost:3005` and no limit.

- [ ] **Step 5: Run** `go test ./...` and `go vet ./...` in `packages/ingress-reverse-proxy`. Expected: PASS.

### Task 3: View counts on the blog pages

**Files** (under `packages/blog-site/`):

- Create: `src/lib/views.ts`, `__tests__/views.test.ts`
- Create: `src/components/ViewCount.astro` (the span), `src/components/ViewCounts.astro` (the one script)
- Modify: `src/components/PostArticle.astro` (prop `views?: boolean`, default `true`; span at the end of `.post__meta`)
- Modify: `src/pages/archive/[slug].astro` (`views={false}`)
- Modify: `src/components/PostIndexRow.astro`, `src/components/FeaturedPost.astro` (span right after `<time>`)
- Modify: `src/layouts/Shell.astro` (render `<ViewCounts />` once)
- Modify: `src/styles/list.css` and the post meta styles (span looks like the date beside it)
- Modify: `__tests__/post-page.test.ts`, `__tests__/list-page.test.ts`

**Interfaces:**

- Consumes: Task 2's HTTP table; `COPY[lang].views(n)` and `Lang` from `src/lib/i18n.ts`.
- Produces: `views.ts` exports `VIEWS_API = '/api-views'`, `isLocalHost(hostname: string): boolean`, `listQuery(slugs: string[]): string`, `readCount(body: unknown, slug: string): number | null`, `readCounts(body: unknown): Record<string, number>`.
- Markup, attribute order fixed so the build tests can match it:
  `<span class="views" data-views="<slug>" data-views-lang="<lang>" data-views-record hidden><span class="views__dot" aria-hidden="true">·</span><span data-views-text></span></span>`
  (`data-views-record` only on the post page).

- [ ] **Step 1: Write `__tests__/views.test.ts`.**

```ts
test('local hosts make no requests', () => {
  for (const h of ['localhost', '127.0.0.1', '[::1]'])
    assert.equal(isLocalHost(h), true);
  assert.equal(isLocalHost('jungho.dev'), false);
});
test('one list request per page, each slug once', () => {
  assert.equal(listQuery(['a', 'b', 'a']), '/api-views?slugs=a,b');
});
test('a post reply is read only when it is about that post', () => {
  assert.equal(readCount({ slug: 'a', views: 3 }, 'a'), 3);
  assert.equal(readCount({ slug: 'a', views: 0 }, 'a'), 0);
  assert.equal(readCount({ slug: 'b', views: 3 }, 'a'), null);
  for (const v of [-1, 1.5, '3', null])
    assert.equal(readCount({ slug: 'a', views: v }, 'a'), null);
  assert.equal(readCount('nope', 'a'), null);
});
test('a list reply keeps only whole, non-negative counts', () => {
  assert.deepEqual(readCounts({ a: 1, b: -1, c: 'x', d: 0 }), { a: 1, d: 0 });
  assert.deepEqual(readCounts(null), {});
});
```

- [ ] **Step 2: Add the build-output tests.**

```ts
// post-page.test.ts
test('a post carries a hidden view count that records the visit', () => {
  assert.match(
    read('hello-world.html'),
    /<span class="views" data-views="hello-world" data-views-lang="ko" data-views-record hidden>/,
  );
  assert.match(
    read('english-post.html'),
    /data-views="english-post" data-views-lang="en" data-views-record hidden/,
  );
});
test('an archived post shows no view count', () => {
  assert.ok(!read('archive/old-snippet.html').includes('data-views'));
});
// list-page.test.ts
test('list rows carry a hidden view count that does not record', () => {
  assert.match(html(), /data-views="second-post" data-views-lang="ko" hidden>/);
  assert.match(
    enHtml(),
    /data-views="english-post" data-views-lang="en" hidden>/,
  );
  assert.ok(!html().includes('data-views-record'));
});
test('the view script is bundled', () => {
  // some file in dist/_astro/*.js contains '/api-views'
});
```

- [ ] **Step 3: Run `yarn test` and watch them fail.** Expected: `astro check` error on the missing `views.ts` import, or the new assertions failing.

- [ ] **Step 4: Implement.** `ViewCounts.astro`'s script: stop when `isLocalHost(location.hostname)` or there is no `[data-views]`; `POST` `${VIEWS_API}/<slug>` for the `[data-views-record]` element and one `GET listQuery(...)` for the rest; for each number, write `COPY[lang].views(n)` into `[data-views-text]` and remove `hidden`. A failed fetch, a non-200 or an unreadable body changes nothing. No retries.

- [ ] **Step 5: Run `yarn test`.** Expected: all pass, `astro check` 0 errors.

### Task 4: End-to-end check before any deploy

- [ ] **Step 1: Run every suite.** kyle-db with Redis up (`REDIS_ADDR=localhost:6399 go test ./...`), proxy `go test ./...`, blog-site and blog-backend `yarn test`, and `prettier --check` on the changed TS/Astro files.
- [ ] **Step 2: Proxy against the real counter server.** The proxy's `main.go` is fixed to `prod` (port 80, TLS), so it is not run locally; the wire between the two Go programs is checked by a test that runs only on request. Add to `redis/views_test.go`:

```go
func TestViewsAgainstALocalCounterServer(t *testing.T)
// skips unless VIEWS_COUNTER_ADDR is set; fake index.json as above, api-views link at that address;
// POST rfq-deep-dive twice with one visitor -> views 1 and 1; a second visitor -> 2;
// Googlebot POST -> 2; GET ?slugs=rfq-deep-dive,nope -> {"rfq-deep-dive":2}
```

Run it against the real counter server: Redis on the port its config names (`docker run -d --rm --name views-redis-e2e -p 6379:6379 redis:7-alpine`, `port.redis: 6379` in `configs/config.yaml`), then in `~/code/kyle-db/db/redis/src` `APP_ENV=dev ROOT_PATH=$PWD go run .` (listens on 3005), then `VIEWS_COUNTER_ADDR=localhost:3005 go test ./redis/ -run AgainstALocal -v`. Expected: PASS, and `docker exec views-redis-e2e redis-cli HGETALL views:count` shows one field `rfq-deep-dive` = `2`. Stop both afterwards.

- [ ] **Step 3: Look at the pages.** Build the real posts, serve them with blog-backend, and open them in Playwright with `--host-resolver-rules="MAP jungho.test 127.0.0.1"` so `isLocalHost` is false. `/api-views` is answered by `page.route` with fixed counts (`{"slug":"rfq-deep-dive","views":1234}` and a list reply), then aborted for the second pass. At 1280/834/390: both lists and one post per language. Read the screenshots: counts sit on the meta line in the date's style; with the API failing nothing shows and the meta line looks as it does today.
- [ ] **Step 4: Update the spec.** Part 2 notes the decisions made here (link URL, list refresh rule, writeLimit 20 / 30s); the "Unverified" section loses its two items (`dist/en.html` and 238 wpm were confirmed in part 1). `python3 ~/code/writing-guides/scripts/check.py` on the spec.

### Task 5: Review, PRs and rollout (each outward step after Kyle approves)

- [ ] **Step 1: Final review** of both branches by a fresh reviewer, fix pass, ledger.
- [ ] **Step 2: Commit and open PRs.** kyle-db `feat(redis): count post views once per visitor per day`; kyle-server one commit per package (`feat(ingress): …`, `feat(blog-site): …`) plus the plan.
- [ ] **Step 3: Counter server.** After the kyle-db PR merges: `sh db/redis/push2gke_artifact.sh 0.0.4`, `kubectl set image deployment/redis-tcp-app-server-deployment redis-tcp-app-server=me-west1-docker.pkg.dev/kyle-server-402706/kyle-registry/redis-tcp-app-server:0.0.4`, `kubectl rollout status`. Presence must still work: the masthead shows a count on jungho.dev.
- [ ] **Step 4: Proxy.** `push.sh --ingress` stops while the CV copies differ from `packages/blog-frontend/public/cv/` (on 2026-11-18 all four live PDFs differed: CV PRs #96 to #98 are merged but not released). Releasing the proxy therefore releases the CV too: `scripts/build.sh`, a `chore(ingress): copy the CV from PR #98` PR, merge, then `push.sh --ingress 0.0.43`, rollout, `scripts/purge-cv.sh` (`docs/cv-release.md` sections 2 and 3). Check: `curl -X POST -A Googlebot https://jungho.dev/api-views/rfq-deep-dive` → 200 with a count and `cf-cache-status: DYNAMIC`.
- [ ] **Step 5: Site.** After the kyle-server PR merges: `scripts/build.sh`, `push.sh --site 0.1.37`, rollout.
- [ ] **Step 6: Production check.** Open a Korean and an English post in Chrome, reload each, and read that the number rose once; both lists show counts; `/blog` language routing still answers as after 0.1.36.
