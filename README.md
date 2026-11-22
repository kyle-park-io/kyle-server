**English** | [한국어](README.ko.md)

# kyle-server

The jungho.dev site (`packages/blog-frontend`, `packages/blog-backend`) and the reverse proxy in front of it (`packages/ingress-reverse-proxy`).

- Steps to edit and deploy the CV (in Korean): [`docs/cv-release.md`](docs/cv-release.md)
- Token setup for purging the CV cache (in Korean): [`docs/setup/cloudflare-cache-purge.md`](docs/setup/cloudflare-cache-purge.md)

## Layout

Every folder down to three levels and the non-standard root files. Paths are counted from the repo root.

```
.github/                  GitHub settings
  workflows/              image-build.yml builds both Docker images on every pull request and pushes nothing
.husky/                   Git hook scripts: commit-msg runs commitlint, pre-commit runs prettier-format, the rest are empty
docs/                     Procedures and design records
  setup/                  One-time account and token setup (Cloudflare cache purge)
  superpowers/            Plans and design specs written before each larger change
    plans/                Implementation plans, one file per change, named YYYY-MM-DD-<topic>.md
    specs/                Design specs behind those plans, named YYYY-MM-DD-<topic>-design.md
packages/                 Yarn workspaces, one folder per deployable or shared package
  blog-backend/           Express server in the site image: serves the built blog at /blog, the SPA bundle and /api; holds the Dockerfile and push scripts
    __tests__/            Tests for blog routes, language handling, legacy slugs and the blog build
    config/               dev.yaml and prod.yaml server settings (port)
    lib/                  Lerna package stub (blog-backend.js)
    production/           package.json and tsconfig.json the Dockerfile uses to compile src/
    scripts/              Container scripts: start-server.sh, build-blog.sh (cron rebuilds the blog every 10 minutes), init-script.sh (clones the blog content)
    src/                  TypeScript source of the server (app.ts, blog/, config/, routes/)
  blog-frontend/          React single-page app for jungho.dev (Vite and webpack builds)
    __tests__/            Tests of the single-page app
    lib/                  Lerna package stub (blog-frontend.js)
    public/               Static files: background images, cv/ (CV PDFs), devrel/ (campus images), kyle/ (profile images)
    src/                  App source, one folder per page section (about, chat, devrel, hero, profile, quant and others)
  blog-site/              Astro static blog served at jungho.dev/blog
    __tests__/            Tests for feeds, i18n, list and post pages, view counts and build output; fixtures/ holds sample posts
    src/                  Astro source: components, config, layouts, lib, pages, styles
  ingress-reverse-proxy/  Go reverse proxy in front of the site: TLS, routing, rate limits, visitor presence and view counts
    __tests__/            Lerna package stub test
    assets/               Serves the static files and caches them (separate file tables for dev and prod)
    config/               common.yaml and the dev and prod link lists (route to upstream URL)
    constants/            Fixed values: link file paths, ports, SSL paths
    cors/                 CORS handling
    cron/                 Cron table for certificate renewal (certbot-renew) and the scripts that install it
    handlers/             HTTP and HTTPS request handlers and proxying
    internal/             Packages only this module imports (config/ reads env and viper settings)
    lib/                  Lerna package stub (ingress-reverse-proxy.js)
    logger/               zap logger setup
    middleware/           HTTP middleware
    public/               Static files the proxy serves: images, cv/ (CV PDFs), devrel/, kyle/, root/ (favicon.ico, robots.txt, sitemap.xml, ads.txt)
    redirect/             Redirects, client IP lookup, rate limiting and tokens
    redis/                Talks to the counter server: visitor identity, presence and view counts
    scheduler/            Background job that keeps the presence snapshot fresh
    scripts/              Container start script and the SSL certificate issue, renew and copy scripts
    tls/                  Certificate loading and reload on renewal
    types/                Shared Go types
    utils/                File, OS, URL, YAML and volume copy helpers
  site-shell/             Navigation data, presence card and design tokens shared by the SPA and the Astro blog
    __tests__/            Navigation and presence tests
    src/                  Source (nav.ts, presence.ts, presence-card.ts) and styles/ (tokens.css, presence.css)
scripts/                  Release scripts: build.sh, build-cv.sh (CV PDFs), purge-cv.sh (Cloudflare cache), push.sh (image push), integration.sh (build then push)
.commitlintrc             commitlint rules (conventional commits)
.eslintignore             Paths ESLint skips
.puppeteerrc.cjs          Skips the Puppeteer Chrome download so yarn install works; the CV build uses the system Chrome
git.sh                    Sets up this clone: local git identity
init.sh                   First-time yarn and husky setup commands
lerna.json                Lerna workspace settings
```
