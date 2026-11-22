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
| &emsp;&emsp;[`workflows/`](.github/workflows/) | image-build.yml builds both Docker images on every pull request and pushes nothing |
| [`.husky/`](.husky/) | Git hook scripts: commit-msg runs commitlint, pre-commit runs prettier-format, the rest are empty |
| [`docs/`](docs/) | Procedures and design records |
| &emsp;&emsp;[`setup/`](docs/setup/) | One-time account and token setup (Cloudflare cache purge) |
| &emsp;&emsp;[`superpowers/`](docs/superpowers/) | Plans and design specs written before each larger change |
| &emsp;&emsp;&emsp;&emsp;[`plans/`](docs/superpowers/plans/) | Implementation plans, one file per change, named `YYYY-MM-DD-<topic>.md` |
| &emsp;&emsp;&emsp;&emsp;[`specs/`](docs/superpowers/specs/) | Design specs behind those plans, named `YYYY-MM-DD-<topic>-design.md` |
| [`packages/`](packages/) | Yarn workspaces, one folder per deployable or shared package |
| &emsp;&emsp;[`blog-backend/`](packages/blog-backend/) | Express server in the site image: serves the built blog at /blog, the SPA bundle and /api; holds the Dockerfile and push scripts |
| &emsp;&emsp;&emsp;&emsp;[`__tests__/`](packages/blog-backend/__tests__/) | Tests for blog routes, language handling, legacy slugs and the blog build |
| &emsp;&emsp;&emsp;&emsp;[`config/`](packages/blog-backend/config/) | dev.yaml and prod.yaml server settings (port) |
| &emsp;&emsp;&emsp;&emsp;[`docker-image/`](packages/blog-backend/docker-image/) | package.json and tsconfig.json the Dockerfile uses to compile src/ |
| &emsp;&emsp;&emsp;&emsp;[`scripts/`](packages/blog-backend/scripts/) | Container scripts: start-server.sh, build-blog.sh (cron rebuilds the blog every 10 minutes), init-script.sh (clones the blog content) |
| &emsp;&emsp;&emsp;&emsp;[`src/`](packages/blog-backend/src/) | TypeScript source of the server (app.ts, blog/, config/, routes/) |
| &emsp;&emsp;[`blog-frontend/`](packages/blog-frontend/) | React single-page app for jungho.dev (Vite and webpack builds) |
| &emsp;&emsp;&emsp;&emsp;[`__tests__/`](packages/blog-frontend/__tests__/) | Tests of the single-page app |
| &emsp;&emsp;&emsp;&emsp;[`public/`](packages/blog-frontend/public/) | Static files: background images, cv/ (CV PDFs), devrel/ (campus images), kyle/ (profile images) |
| &emsp;&emsp;&emsp;&emsp;[`src/`](packages/blog-frontend/src/) | App source, one folder per page section (about, chat, devrel, hero, profile, quant and others) |
| &emsp;&emsp;[`blog-site/`](packages/blog-site/) | Astro static blog served at jungho.dev/blog |
| &emsp;&emsp;&emsp;&emsp;[`__tests__/`](packages/blog-site/__tests__/) | Tests for feeds, i18n, list and post pages, view counts and build output; fixtures/ holds sample posts |
| &emsp;&emsp;&emsp;&emsp;[`src/`](packages/blog-site/src/) | Astro source: components, config, layouts, lib, pages, styles |
| &emsp;&emsp;[`ingress-reverse-proxy/`](packages/ingress-reverse-proxy/) | Go reverse proxy in front of the site: TLS, routing, rate limits, visitor presence and view counts |
| &emsp;&emsp;&emsp;&emsp;[`assets/`](packages/ingress-reverse-proxy/assets/) | Serves the static files and caches them (separate file tables for dev and prod) |
| &emsp;&emsp;&emsp;&emsp;[`config/`](packages/ingress-reverse-proxy/config/) | common.yaml and the dev and prod link lists (route to upstream URL) |
| &emsp;&emsp;&emsp;&emsp;[`constants/`](packages/ingress-reverse-proxy/constants/) | Fixed values: link file paths, ports, SSL paths |
| &emsp;&emsp;&emsp;&emsp;[`cors/`](packages/ingress-reverse-proxy/cors/) | CORS handling |
| &emsp;&emsp;&emsp;&emsp;[`cron/`](packages/ingress-reverse-proxy/cron/) | Cron table for certificate renewal (certbot-renew) and the scripts that install it |
| &emsp;&emsp;&emsp;&emsp;[`handlers/`](packages/ingress-reverse-proxy/handlers/) | HTTP and HTTPS request handlers and proxying |
| &emsp;&emsp;&emsp;&emsp;[`internal/`](packages/ingress-reverse-proxy/internal/) | Packages only this module imports (config/ reads env and viper settings) |
| &emsp;&emsp;&emsp;&emsp;[`logger/`](packages/ingress-reverse-proxy/logger/) | zap logger setup |
| &emsp;&emsp;&emsp;&emsp;[`middleware/`](packages/ingress-reverse-proxy/middleware/) | HTTP middleware |
| &emsp;&emsp;&emsp;&emsp;[`public/`](packages/ingress-reverse-proxy/public/) | Static files the proxy serves: images, cv/ (CV PDFs), devrel/, kyle/, root/ (favicon.ico, robots.txt, sitemap.xml, ads.txt) |
| &emsp;&emsp;&emsp;&emsp;[`redirect/`](packages/ingress-reverse-proxy/redirect/) | Redirects, client IP lookup, rate limiting and tokens |
| &emsp;&emsp;&emsp;&emsp;[`redis/`](packages/ingress-reverse-proxy/redis/) | Talks to the counter server: visitor identity, presence and view counts |
| &emsp;&emsp;&emsp;&emsp;[`scheduler/`](packages/ingress-reverse-proxy/scheduler/) | Background job that keeps the presence snapshot fresh |
| &emsp;&emsp;&emsp;&emsp;[`scripts/`](packages/ingress-reverse-proxy/scripts/) | Container start script and the SSL certificate issue, renew and copy scripts |
| &emsp;&emsp;&emsp;&emsp;[`tls/`](packages/ingress-reverse-proxy/tls/) | Certificate loading and reload on renewal |
| &emsp;&emsp;&emsp;&emsp;[`types/`](packages/ingress-reverse-proxy/types/) | Shared Go types |
| &emsp;&emsp;&emsp;&emsp;[`utils/`](packages/ingress-reverse-proxy/utils/) | File, OS, URL, YAML and volume copy helpers |
| &emsp;&emsp;[`site-shell/`](packages/site-shell/) | Navigation data, presence card and design tokens shared by the SPA and the Astro blog |
| &emsp;&emsp;&emsp;&emsp;[`__tests__/`](packages/site-shell/__tests__/) | Navigation and presence tests |
| &emsp;&emsp;&emsp;&emsp;[`src/`](packages/site-shell/src/) | Source (nav.ts, presence.ts, presence-card.ts) and styles/ (tokens.css, presence.css) |
| [`scripts/`](scripts/) | Release scripts: build.sh, build-cv.sh (CV PDFs), purge-cv.sh (Cloudflare cache), push.sh (image push), integration.sh (build then push) |
| [`.commitlintrc`](.commitlintrc) | commitlint rules (conventional commits) |
| [`.eslintignore`](.eslintignore) | Paths ESLint skips |
| [`.puppeteerrc.cjs`](.puppeteerrc.cjs) | Skips the Puppeteer Chrome download so yarn install works; the CV build uses the system Chrome |
| [`git.sh`](git.sh) | Sets up this clone: local git identity |
| [`init.sh`](init.sh) | First-time yarn and husky setup commands |
| [`lerna.json`](lerna.json) | Lerna workspace settings |
