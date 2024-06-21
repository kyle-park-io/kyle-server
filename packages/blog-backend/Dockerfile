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
  vim

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
ENV NODE_ENV="prod"

# alarm port
EXPOSE 8080

# run server
RUN chmod +x scripts/start-server.sh
ENTRYPOINT ["scripts/start-server.sh"]
