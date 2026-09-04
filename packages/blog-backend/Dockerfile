## build stage — compile the express server
# Astro 7 requires Node >= 22.12.0 and rejects odd majors; node:18 is EOL.
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY packages/blog-backend/production/package*.json ./
COPY packages/blog-backend/production/tsconfig.json ./

RUN npm install

COPY packages/blog-backend/src ./src

RUN npm run build

## prod stage
FROM node:22-slim

# cron for the content pull, git to clone the content repo, ca-certificates
# so git's https transport can verify GitHub's certificate (git only
# *recommends* it, and --no-install-recommends below skips recommends),
# Korean locale and fonts for the markdown content.
RUN apt-get update && apt-get install -y --no-install-recommends \
  cron \
  git \
  ca-certificates \
  vim \
  locales fonts-nanum && \
  echo "ko_KR.UTF-8 UTF-8" > /etc/locale.gen && \
  locale-gen ko_KR.UTF-8 && \
  update-locale LANG=ko_KR.UTF-8 && \
  rm -rf /var/lib/apt/lists/*

ENV LANG=ko_KR.UTF-8
ENV LC_ALL=ko_KR.UTF-8

# Clone the content repo to /blog and install its cron entry.
COPY packages/blog-backend/scripts ./scripts
RUN chmod +x scripts/init-script.sh && ./scripts/init-script.sh

## the astro project, installed so cron can rebuild in place
WORKDIR /usr/src/blog-site
# `site-shell: "*"` resolves through the workspace on a dev machine; inside
# the image there is no workspace root, so point the manifest at a local
# copy before installing rather than at the (nonexistent) public package.
COPY packages/site-shell /usr/src/site-shell
COPY packages/blog-site/package.json ./
# The npm download cache is useless at runtime — cron rebuilds reuse the
# installed node_modules, never the tarball cache — but it lands in this layer
# and measured 284MB against 185MB of actual node_modules. Clean it in the same
# RUN, or it is baked in permanently.
RUN npm pkg set dependencies.site-shell=file:/usr/src/site-shell && \
    npm install --no-audit --no-fund && \
    npm cache clean --force
COPY packages/blog-site/astro.config.mjs packages/blog-site/tsconfig.json ./
COPY packages/blog-site/src ./src

## the express server
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY packages/blog-backend/static ./static
COPY packages/blog-backend/config ./config
COPY packages/blog-backend/scripts ./scripts

RUN chmod +x scripts/build-blog.sh scripts/start-server.sh

# Set before the bake so a single edit governs both the initial publish
# below and every cron rebuild after the pod starts — build-blog.sh only
# falls back to its own default when this is unset.
ENV BLOG_DIST="/usr/src/app/blog-dist"

# Bake an initial blog build so a fresh pod serves /blog before the first
# cron tick.
RUN ./scripts/build-blog.sh

ENV NODE_ENV="production"

EXPOSE 8080

ENTRYPOINT ["scripts/start-server.sh"]
