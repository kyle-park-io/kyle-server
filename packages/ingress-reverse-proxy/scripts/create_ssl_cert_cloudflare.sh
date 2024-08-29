#!/bin/sh

certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /app/cloudflare.ini \
  --email andy3638@naver.com \
  --domains jungho.dev \
  --agree-tos \
  --non-interactive
# --staging \
