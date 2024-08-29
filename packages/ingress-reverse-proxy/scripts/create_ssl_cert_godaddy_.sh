#!/bin/sh

# yes Y |
#     certbot delete --cert-name jungho.dev

/app/certbot_venv/bin/certbot certonly \
  --preferred-challenges dns-01 \
  -d jungho.dev \
  --authenticator dns-godaddy \
  --dns-godaddy-credentials /app/godaddy.ini \
  --dns-godaddy-propagation-seconds 60 \
  --non-interactive \
  --agree-tos \
  --email ponyoholics@gmail.com
# --staging
