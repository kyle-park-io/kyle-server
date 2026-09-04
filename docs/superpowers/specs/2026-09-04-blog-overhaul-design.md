# Blog Overhaul — Astro at `/blog`, Content Repo Restructure (2026-09-04)

## Goal

Turn `jungho.dev/blog` from a client-rendered list of `marked` output into a real
blog: search-indexable, navigable, commentable, and readable on phone, tablet and
desktop. Promote it from the homepage's `Extra` section to a first-class entry
point. Restructure the separate content repo (`kyle-park-io/blog`) so frontmatter,
not shell scripts, is the source of truth.

Phase 1 (this spec) covers the blog and the shell it needs. Phase 2 (separate
spec) absorbs the remaining static pages into the same shell.

## Current state

| Layer    | Today                                                                                                                                                                                                                                                                                                                                                                 |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routing  | Go `ingress-reverse-proxy`, prefix table in `config/prod-links.yaml`. `utils/url.go:14` keys on the **first path segment only**, so `/blog`, `/blog-static`, `/api-blog` all resolve to `site-app-server:8080`                                                                                                                                                        |
| Serving  | `packages/blog-backend` (express) — SPA build at `/blog-static`, `app.get('*')` → `index.html`                                                                                                                                                                                                                                                                        |
| Frontend | `packages/blog-frontend` — SolidJS SPA, vite (`base: /blog-static`), tailwind (`tw-` prefix), NYT-inspired                                                                                                                                                                                                                                                            |
| Content  | Separate repo `kyle-park-io/blog`, `md/*.md`, 4 tracked files                                                                                                                                                                                                                                                                                                         |
| Pipeline | Pod-side cron every 10 min: `git pull` → `cp -r md /usr/src/app` → `cron-sort-blog.sh` derives title from `head -n 1 \| cut -c 3-` and date from `git log -1 --format=%ci` into `sort/sorted_md_files.txt` → backend converts **every** md with `marked` on boot and on a 10-minute `setInterval` → API returns an HTML string → frontend injects it with `innerHTML` |

What this produces, concretely:

- **No frontmatter.** No tags, summary, draft state, slug, updated date or cover.
- **Title breaks if the first line is not `# `.** `cut -c 3-` on any other first
  line yields garbage.
- **Fixing a typo moves a post to the top of the list**, because ordering comes
  from the last commit date.
- **No code highlighting** (`marked` has none), no table of contents, no image
  path convention.
- **No SEO.** Client-side rendering only; the hand-maintained
  `public/root/sitemap.xml` lists `/blog` but not a single post, so the posts are
  invisible to search engines.
- **No crawlable navigation.** Every `Header.tsx` nav item is
  `<button onClick={() => window.location.href = …}>`, so a crawler cannot follow
  the header to `/blog` at all, and a reader cannot middle-click it.
- **A dead feature.** `BlogDetail.tsx` renders a "Notes" `<textarea>` that
  persists nothing.
- **A public rebuild trigger.** The list page's `↻ Refresh` button calls
  `/api/blog/update`, which re-converts every markdown file server-side.
- `sort/sorted_md_files.txt` is a generated artifact committed to git, and the
  committed copy is stale — it omits `portfolio4.md`. Production is correct only
  because cron regenerates it in the pod.

## Decisions

Recorded with the reasoning, because several were close calls.

1. **Astro, blog first, shell shared.** Astro's content collections give
   frontmatter schema validation, Shiki highlighting, heading extraction, RSS and
   sitemap as built-ins. Migrating the whole site to SolidStart instead would mean
   hand-building all of that. Keeping the blog fully separate from the SPA would
   mean maintaining header/footer twice forever; instead the shell is authored
   once in Astro and Phase 2 moves the remaining pages onto it.
2. **No CMS, no Notion sync, no self-hosted comments.** Authoring is a local
   editor plus `git push`; mobile typo fixes go through `github.dev`. giscus
   carries comments so there is no database, no spam filtering and no moderation
   UI to operate.
3. **Publishing must not require a deploy.** The pod keeps pulling content and
   now builds it. Trading "push and it's live in 10 minutes" for "docker build and
   rollout per post" would kill the writing habit, which is the point of the work.
4. **Ship the featured-post layout with an automatic fallback**, rather than
   choosing between a plain index and a cover-image layout. A cover becomes a
   bonus instead of a publishing requirement.
5. **No search, no pagination yet.** With 4 posts both are decoration. Thresholds
   for revisiting are written down below.

## 1. Packages and serving

New package `packages/blog-site` — Astro, `output: 'static'`, `base: '/blog'`,
`build.format: 'file'`. `format: 'file'` emits `/blog/<slug>.html`, which express
serves with `extensions: ['html']`, so URLs keep their current shape
(`/blog/<slug>`, no trailing slash, no redirect hop).

`blog-backend/src/app.ts` gains, in order and **before** the SPA catch-all:

```
app.use('/blog', express.static(BLOG_DIST, { extensions: ['html'] }))
app.use('/blog', redirectLegacySlugs)      // 301 map, 4 entries
app.use('/blog', serveAstro404)            // /blog/** miss → blog 404.html
```

`/blog-static`, `/api`, and the SPA catch-all keep their current behaviour.

The Go proxy is **unchanged** — the first-segment routing already sends every
`/blog/**` path to `site-app-server`. `config/dev-links.yaml` changes one line:
`/blog` → `http://localhost:4321` (astro dev).

`public/root/robots.txt` gains a second `Sitemap:` line pointing at
`/blog/sitemap-index.xml`; multiple `Sitemap:` lines are valid. The root
`sitemap.xml` stays hand-maintained for the SPA pages until Phase 2.

## 2. Publish pipeline

```
local:  write md in ~/code/blog, git push
   ↓    pod cron, every 10 min
git pull → HEAD unchanged? → exit (no build)
                           → changed:
                              rsync /blog/content → blog-site/src/data/
                              astro build → dist.new
                              mv atomic swap → dist
```

- Content is **copied into the Astro project before building**, not read from an
  out-of-tree absolute path. A `glob({ base })` pointing outside the project
  leaves relative image references (`./cover.webp`) unresolvable by Vite; copying
  removes that whole class of problem and mirrors what `cron-update-blog.sh`
  already does with `cp -r md /usr/src/app`.
- A failed build never swaps, so the site keeps serving the previous `dist`.
- `flock` guards against overlapping runs.
- Cost: the runtime image carries the Astro toolchain. Measured (not estimated):
  761 MB → 1.33 GB, roughly +570 MB. Accepted for a single-replica personal
  site. The clean upgrade is a builder sidecar writing to a shared `emptyDir`,
  which needs changes in `~/code/kubenetes` and is deliberately out of scope.

**`blog-backend/Dockerfile` must move from `node:18` to `node:22`** — Astro 7.3.1
requires Node ≥ 22.12.0 (odd-numbered majors unsupported), and Node 18 is EOL.
The image also needs `sharp`'s native dependencies for image optimization.

## 3. Content repo (`kyle-park-io/blog`)

```
blog/
├─ content/posts/
│  ├─ project-initial-setup/
│  │  ├─ index.md
│  │  └─ cover.webp          # optional, colocated
│  └─ ethereum-event-object/
│     └─ index.md
├─ scripts/validate-frontmatter.mjs
├─ CONTRIBUTING.md            # frontmatter rules
└─ .husky/pre-commit          # runs the validator
```

Frontmatter schema, enforced by zod at build time:

| Field     | Required | Rule                                                                       |
| --------- | -------- | -------------------------------------------------------------------------- |
| `title`   | yes      | The body must **not** repeat it as `# `; the layout renders the title      |
| `date`    | yes      | `YYYY-MM-DD`, written by hand — editing a post no longer reorders the list |
| `updated` | no       | Shown as "수정: …"; does not affect ordering                               |
| `summary` | yes      | List card text, `<meta name="description">`, and OG description            |
| `tags`    | yes      | Lowercase kebab array; may be empty                                        |
| `cover`   | no       | `./cover.webp`, validated with `image()` so a missing file fails the build |
| `draft`   | no       | `true` excludes it from production builds, visible in dev                  |
| `lang`    | no       | `ko` (default) or `en` — list badge and `<article lang>`                   |

Rendering, all at build time:

- **Shiki** for code blocks; unlabelled fences fall back to plaintext.
- `rehype-slug` + `rehype-autolink-headings` so headings are linkable.
- The table of contents comes from the `headings` that `render()` returns — no
  extra plugin. h2 and h3 only; deeper levels ignored.
- GFM tables, task lists and strikethrough.
- The raw markdown is copied to `/blog/<slug>.md`, replacing the `blogDownload`
  endpoint.
- Reading time is a character-count approximation — body characters excluding
  code fences, divided by 500 per minute, rounded up ("약 7분"). Word counting is
  wrong for Korean.

**Author feedback loop.** A frontmatter mistake must not surface as "silently
absent 10 minutes later". The blog repo already runs husky (`commit-msg`), so a
`pre-commit` hook runs `validate-frontmatter.mjs` — required keys, date format,
slug uniqueness, cover file existence, lowercase tags — failing at commit time
with no dependencies. Astro's zod schema remains the final gate.

**Migration and URL preservation.** Existing slugs come from filenames, so they
change; express holds the 301 map.

| Today              | New                               |
| ------------------ | --------------------------------- |
| `/blog/portfolio1` | `/blog/project-initial-setup`     |
| `/blog/eth`        | `/blog/ethereum-event-object`     |
| `/blog/portfolio4` | `/blog/chain-communicator`        |
| `/blog/test`       | `/blog` (`md/test.md` is deleted) |

`portfolio1.md` also has a hand-written `# # 목차` section in its body; it is
removed in favour of the generated table of contents.

## 4. Article page

Body column 720px (roughly 40–45 Korean characters per line; the current
`--blog-max-width: 900px` is too wide for Korean prose). The body and a 240px
table of contents are **centered as a group**, so the article does not read as
left-shifted.

- **≥ 1200px** — sticky table of contents in the right margin.
- **< 1200px** — it collapses into a `<details>` bar under the title; selecting an
  entry closes it.
- All widths — a scroll progress bar under the header. This is what tells the
  reader where they are once the table of contents is collapsed.
- Fewer than 3 headings — no table of contents block at all, so short posts don't
  show an empty rail.
- Code blocks, tables and wide images break out past the body column and each get
  their own `overflow-x` wrapper, so they never push the page sideways on a phone.
- Scroll spy uses `IntersectionObserver`.
- giscus sits below the body, lazily loaded, light theme.
- Breakpoints reuse the existing `global.css` scale (1200 / 992 / 768 / 576); no
  new scale is introduced.

The "Notes" textarea is deleted.

## 5. List page — `/blog`

One template, two states: if the newest post has a `cover` it renders as a
featured block above the index; otherwise it is just the first index row.

Each row carries number, title, summary, date and tags. Above the list: a tag
filter bar and an RSS link.

- **Tags** are static pages at `/blog/tags/<tag>`, so they work without
  JavaScript and each one is independently indexable. The filter bar is a list of
  those links.
- **No pagination.** All posts render on one page; introduce Astro's `paginate()`
  past ~20 posts.
- **No search.** Tags plus the browser's find is enough at this size; add Pagefind
  past ~20 posts.
- The `↻ Refresh` button is deleted along with the endpoint behind it.
- The markdown download moves from a per-row `↓` to the article page footer.

## 6. Root entry points

- **Header nav becomes real `<a href>` links**, in nav order
  `Home · Blog · DevRel · Quant · P.Quant · Profile · ☰`. This is half of what
  "make it a root entry point" means: today no crawler can follow the header.
- `About` moves into the `☰` offcanvas, so the nav does not wrap awkwardly on
  tablets.
- Nav items live in **one shared module** imported by both the Solid header and
  the Astro header, so a menu change is a single edit until Phase 2 deletes the
  Solid copy. The visitor-count WebSocket logic is shared the same way.
- **Homepage** keeps `Featured` (Quant Portfolio) at the top and gains
  `WRITING · 최근 글 3` directly below it, then `Introduce`, `Projects`. The
  `Extra` section's Blog card is removed; with only Chat left, Chat moves into the
  `Projects` grid and the `Extra` section is deleted.
  Putting writing at the very top was considered and rejected for now: the last
  post is dated 2024-09-05, so a stale top-of-homepage is a real risk. Reordering
  sections later is a five-minute change once the writing habit exists.
- The homepage's recent-posts data comes from `/blog/index.json`, generated by the
  Astro build, fetched with native `fetch`. It replaces
  `/api-blog/api/blog/sorted-by-date/top-10` and adds no backend code.
- Footer gains an RSS link.

## 7. Deletions

**`blog-backend`** — `services/blog.ts` entirely (6 handlers), `utils/md.ts`, the
blog routes in `routes/api.ts`, `initialize()` and the 10-minute
re-conversion `setInterval` in `app.ts`, the `md-to-html3` dependency in
`production/package.json`.

**`blog-frontend`** — all of `src/blog/` (`BlogList.tsx` 232 lines,
`BlogDetail.tsx`, `BlogDetail(old).tsx`, `BlogNotFound.tsx`, `Test.tsx`,
`Blog.css` 589 lines), the `/blog`, `/blog/:id`, `/blog/not-found` and `/test`
routes in `index.tsx`, the `Extra` section in `App.tsx`, and the `axios` and
`file-saver` dependencies — both are used only by the blog components.

**`~/code/blog`** — `scripts/cron-sort-blog.sh`, `scripts/cron-sort-blog.old.sh`,
`sort/` (plus a `.gitignore` entry), `md/test.md`.

**`packages/md-to-html`** — the whole package. `md-to-html3` has exactly one
consumer, `blog-backend`, which stops using it. (The root `md-to-pdf`
devDependency is unrelated — `scripts/build-cv.sh` uses it for the CV PDFs and it
stays.)

## 8. Verification

| Target          | Method                                                                                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| frontmatter     | husky `pre-commit` validator (immediate) + Astro zod (build gate; a failure leaves the previous `dist` serving)                                                                            |
| express routing | Smoke script in `__tests__`: `/blog` 200, `/blog/<slug>` 200, `/blog/eth` 301, `/blog/<missing>` 404 with the Astro 404 page, `/blog/rss.xml` 200, `/blog-static/assets/*.js` 200, `/` 200 |
| swap script     | Unit tests in a temp directory: successful build swaps; **failed build keeps the previous dist**; concurrent runs are excluded by `flock`                                                  |
| responsive      | Playwright at 1280 / 834 / 390 — table of contents sticky vs collapsed, no horizontal overflow on code blocks and tables. Used during implementation, not frozen as a regression suite     |
| performance     | Budget: article first load ships under 10 KB of JavaScript. Today reading one post downloads the whole solid + router + axios + solid-bootstrap bundle                                     |
| Go proxy        | No code change; confirm the existing tests still pass                                                                                                                                      |

## 9. Rollout order

Changing the content repo's shape breaks the old pipeline, which reads `md/`, so
the order matters:

1. Add `content/posts/` to the blog repo **while keeping `md/`**. The old pipeline
   keeps working; the live site is unaffected.
2. Build and roll out one image containing both the Astro `dist` and the SPA with
   its blog routes removed, so the switch is atomic.
3. After verifying, delete `md/` and `sort/` from the blog repo.

Rollback is removing the `app.use('/blog', …)` lines, reverting the commits and
rebuilding — `push2gke_artifact.sh` runs `gcloud artifacts docker images delete
… --delete-tags` before every push, so no previous image tag survives to
redeploy. This is precisely why the old content layout (`md/`, `sort/`) stays in
the content repo until production is verified.

## 10. Out of scope

Search (Pagefind past ~20 posts), pagination (past ~20 posts), view counts,
browser-based CMS, Notion sync, i18n routing (`lang` is a badge only), and
splitting the build into a sidecar container.

## 11. Prerequisites

giscus is installed on the content repo. Implementation needs its `repoId` and
`categoryId` from giscus.app, and the repo must be public for giscus to work.

## Phase 2 (separate spec)

Move `About`, `Profile`, `DevRel`, `Quant` and `PersonalQuant` onto the Astro
shell, delete the Solid header and footer, and keep `Chat` as the one Solid
island. This is what removes the duplicated shell and extends SEO to the pages a
recruiter would search for.
