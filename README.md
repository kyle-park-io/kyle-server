**English** | [한국어](README.ko.md)

# kyle-server

The jungho.dev site (`packages/blog-frontend`, `packages/blog-backend`) and the reverse proxy in front of it (`packages/ingress-reverse-proxy`).

- Steps to edit and deploy the CV (in Korean): [`docs/cv-release.md`](docs/cv-release.md)
- Token setup for purging the CV cache (in Korean): [`docs/setup/cloudflare-cache-purge.md`](docs/setup/cloudflare-cache-purge.md)

## Layout

Every folder down to three levels and the non-standard root files. Paths are counted from the repo root.

| Path | Description |
|---|---|
| [`.github/`](.github/) | GitHub settings |
| &nbsp;&nbsp;&nbsp;&nbsp;[`workflows/`](.github/workflows/) | image-build.yml builds both Docker images on every pull request and pushes nothing |
| [`.husky/`](.husky/) | Git hook scripts: commit-msg runs commitlint, pre-commit runs prettier-format, the rest are empty |
| [`docs/`](docs/) | Procedures and design records |
| &nbsp;&nbsp;&nbsp;&nbsp;[`setup/`](docs/setup/) | One-time account and token setup (Cloudflare cache purge) |
| &nbsp;&nbsp;&nbsp;&nbsp;[`superpowers/`](docs/superpowers/) | Plans and design specs written before each larger change |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`plans/`](docs/superpowers/plans/) | Implementation plans, one file per change, named `YYYY-MM-DD-<topic>.md` |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`specs/`](docs/superpowers/specs/) | Design specs behind those plans, named `YYYY-MM-DD-<topic>-design.md` |
| [`packages/`](packages/) | Yarn workspaces, one folder per deployable or shared package |
| &nbsp;&nbsp;&nbsp;&nbsp;[`blog-backend/`](packages/blog-backend/) | Express server in the site image: serves the built blog at /blog, the SPA bundle and /api; holds the Dockerfile and push scripts |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`__tests__/`](packages/blog-backend/__tests__/) | Tests for blog routes, language handling, legacy slugs and the blog build |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`config/`](packages/blog-backend/config/) | dev.yaml and prod.yaml server settings (port) |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`docker-image/`](packages/blog-backend/docker-image/) | package.json and tsconfig.json the Dockerfile uses to compile src/ |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`scripts/`](packages/blog-backend/scripts/) | Container scripts: start-server.sh, build-blog.sh (cron rebuilds the blog every 10 minutes), init-script.sh (clones the blog content) |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`src/`](packages/blog-backend/src/) | TypeScript source of the server (app.ts, blog/, config/, routes/) |
| &nbsp;&nbsp;&nbsp;&nbsp;[`blog-frontend/`](packages/blog-frontend/) | React single-page app for jungho.dev (Vite and webpack builds) |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`__tests__/`](packages/blog-frontend/__tests__/) | Tests of the single-page app |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`public/`](packages/blog-frontend/public/) | Static files: background images, cv/ (CV PDFs), devrel/ (campus images), kyle/ (profile images) |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`src/`](packages/blog-frontend/src/) | App source, one folder per page section (about, chat, devrel, hero, profile, quant and others) |
| &nbsp;&nbsp;&nbsp;&nbsp;[`blog-site/`](packages/blog-site/) | Astro static blog served at jungho.dev/blog |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`__tests__/`](packages/blog-site/__tests__/) | Tests for feeds, i18n, list and post pages, view counts and build output; fixtures/ holds sample posts |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`src/`](packages/blog-site/src/) | Astro source: components, config, layouts, lib, pages, styles |
| &nbsp;&nbsp;&nbsp;&nbsp;[`ingress-reverse-proxy/`](packages/ingress-reverse-proxy/) | Go reverse proxy in front of the site: TLS, routing, rate limits, visitor presence and view counts |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`assets/`](packages/ingress-reverse-proxy/assets/) | Serves the static files and caches them (separate file tables for dev and prod) |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`config/`](packages/ingress-reverse-proxy/config/) | common.yaml and the dev and prod link lists (route to upstream URL) |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`constants/`](packages/ingress-reverse-proxy/constants/) | Fixed values: link file paths, ports, SSL paths |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`cors/`](packages/ingress-reverse-proxy/cors/) | CORS handling |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`cron/`](packages/ingress-reverse-proxy/cron/) | Cron table for certificate renewal (certbot-renew) and the scripts that install it |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`handlers/`](packages/ingress-reverse-proxy/handlers/) | HTTP and HTTPS request handlers and proxying |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`internal/`](packages/ingress-reverse-proxy/internal/) | Packages only this module imports (config/ reads env and viper settings) |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`logger/`](packages/ingress-reverse-proxy/logger/) | zap logger setup |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`middleware/`](packages/ingress-reverse-proxy/middleware/) | HTTP middleware |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`public/`](packages/ingress-reverse-proxy/public/) | Static files the proxy serves: images, cv/ (CV PDFs), devrel/, kyle/, root/ (favicon.ico, robots.txt, sitemap.xml, ads.txt) |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`redirect/`](packages/ingress-reverse-proxy/redirect/) | Redirects, client IP lookup, rate limiting and tokens |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`redis/`](packages/ingress-reverse-proxy/redis/) | Talks to the counter server: visitor identity, presence and view counts |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`scheduler/`](packages/ingress-reverse-proxy/scheduler/) | Background job that keeps the presence snapshot fresh |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`scripts/`](packages/ingress-reverse-proxy/scripts/) | Container start script and the SSL certificate issue, renew and copy scripts |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`tls/`](packages/ingress-reverse-proxy/tls/) | Certificate loading and reload on renewal |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`types/`](packages/ingress-reverse-proxy/types/) | Shared Go types |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`utils/`](packages/ingress-reverse-proxy/utils/) | File, OS, URL, YAML and volume copy helpers |
| &nbsp;&nbsp;&nbsp;&nbsp;[`site-shell/`](packages/site-shell/) | Navigation data, presence card and design tokens shared by the SPA and the Astro blog |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`__tests__/`](packages/site-shell/__tests__/) | Navigation and presence tests |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[`src/`](packages/site-shell/src/) | Source (nav.ts, presence.ts, presence-card.ts) and styles/ (tokens.css, presence.css) |
| [`scripts/`](scripts/) | Release scripts: build.sh, build-cv.sh (CV PDFs), purge-cv.sh (Cloudflare cache), push.sh (image push), integration.sh (build then push) |
| [`.commitlintrc`](.commitlintrc) | commitlint rules (conventional commits) |
| [`.eslintignore`](.eslintignore) | Paths ESLint skips |
| [`.puppeteerrc.cjs`](.puppeteerrc.cjs) | Skips the Puppeteer Chrome download so yarn install works; the CV build uses the system Chrome |
| [`git.sh`](git.sh) | Sets up this clone: local git identity |
| [`init.sh`](init.sh) | First-time yarn and husky setup commands |
| [`lerna.json`](lerna.json) | Lerna workspace settings |
