## build stage
# node version
FROM node:16 AS builder

# set dir
WORKDIR /usr/src/app

# copy package.json
COPY production/package*.json ./

# copy tsconfig.json
COPY production/tsconfig.json ./

# install dependency
RUN npm install

# copy code
COPY src ./src

# build
RUN npm run build

## prod stage
# node version
FROM node:16-slim

# install cron
RUN apt-get update && apt-get install -y cron \
  git \
  vim \
  locales fonts-nanum  && \
  echo "ko_KR.UTF-8 UTF-8" > /etc/locale.gen && \
  locale-gen ko_KR.UTF-8 && \
  update-locale LANG=ko_KR.UTF-8

# kor
ENV LANG=ko_KR.UTF-8
ENV LC_ALL=ko_KR.UTF-8


# run initial script
COPY scripts ./scripts
RUN chmod +x scripts/init-script.sh && ./scripts/init-script.sh

# set dir
WORKDIR /usr/src/app

# copy builder package.json
COPY --from=builder /usr/src/app/package*.json ./

# install prod dependency
RUN npm install --only=production

# copy build stage files
COPY --from=builder /usr/src/app/dist ./dist
COPY static ./static
COPY config ./config
COPY scripts ./scripts

# set env
ENV NODE_ENV="production"

# alarm port
EXPOSE 8080

# run server
RUN chmod +x scripts/start-server.sh
ENTRYPOINT ["scripts/start-server.sh"]
