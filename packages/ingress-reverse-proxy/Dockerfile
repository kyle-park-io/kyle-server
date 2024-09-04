# build stage
FROM golang:alpine AS builder

ARG PROGRAM_VER=dev-docker

## build gcsfuse v0.41.6 is latest release at point of writing (2022-09-11)
ARG GCSFUSE_VERSION=v0.41.6

# RUN go install github.com/googlecloudplatform₩/gcsfuse@${GCSFUSE_VERSION}

# RUN apt-get -qq update && \
#     apt-get install -yqq upx

COPY . /build
WORKDIR /build

RUN go build -ldflags "-X main.programVer=${PROGRAM_VER}" -o app
# RUN strip /build/app
# RUN upx -q -9 /build/app

# ---
FROM alpine:3.16

RUN apk add --update --no-cache \
  git \
  fuse \
  certbot \
  python3 py3-pip \
  dcron \
  busybox-initscripts \
  openssl \
  ca-certificates \
  && pip install --no-cache-dir certbot-dns-cloudflare

COPY . /build
COPY --from=builder /build/ini/godaddy.ini /app/ini/godaddy.ini
RUN chmod 600 /app/ini/godaddy.ini
COPY --from=builder /build/ini/cloudflare.ini /app/ini/cloudflare.ini
RUN chmod 600 /app/ini/cloudflare.ini

WORKDIR /build

# # godaddy
# COPY --from=builder /build/scripts/install_certbot_dns_godaddy.sh /app/scripts/install_certbot_dns_godaddy.sh
# RUN chmod +x /app/scripts/install_certbot_dns_godaddy.sh
# COPY --from=builder /build/scripts/create_ssl_cert_godaddy.sh /app/scripts/create_ssl_cert_godaddy.sh
# RUN chmod +x /app/scripts/create_ssl_cert_godaddy.sh

# cloudflare
COPY --from=builder /build/scripts/create_ssl_cert_cloudflare.sh /app/scripts/create_ssl_cert_cloudflare.sh
RUN chmod +x /app/scripts/create_ssl_cert_cloudflare.sh

# cron
COPY --from=builder /build/scripts/renew_ssl_cert.sh /app/scripts/renew_ssl_cert.sh
RUN chmod +x /app/scripts/renew_ssl_cert.sh
COPY --from=builder /build/scripts/sync_etc_to_data.sh /app/scripts/sync_etc_to_data.sh
RUN chmod +x /app/scripts/sync_etc_to_data.sh
COPY --from=builder /build/cron /app/cron
RUN chmod +x /app/cron/cron.sh
# RUN chmod +x /app/cron/cron.sh && /app/cron/cron.sh

# # try to renew letsencrypt ssl cert in every 12 hours
# RUN SLEEPTIME=$(awk 'BEGIN{srand(); print int(rand()*(3600+1))}'); \
#     echo "0 0,12 * * * root sleep $SLEEPTIME && certbot renew -q" | \
#     tee -a /etc/crontabs/root > /dev/null

COPY --from=builder /build/app /app/app
COPY --from=builder /build/config /app/config
COPY --from=builder /build/public /app/public

# ## install gcsfuse
# # COPY --from=builder /go/bin/gcsfuse /usr/bin

# ENV TELEGRAM_APITOKEN="secret"
# ENV TELEGRAM_ROOM_ID="secret"

EXPOSE 8080
EXPOSE 443
EXPOSE 80

# # RUN mkdir /bucket
# # RUN ln -s /bucket/cert /etc/letsencrypt

COPY --from=builder /build/scripts/start.sh /app/scripts/start.sh
RUN chmod +x /app/scripts/start.sh

WORKDIR /app
# ENTRYPOINT ["./app"]
ENTRYPOINT ["/app/scripts/start.sh"]

