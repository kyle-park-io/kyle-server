#!/bin/sh

# set symbolic link
ln -sf /etc/letsencrypt/archive/jungho.dev/cert1.pem /etc/letsencrypt/live/jungho.dev/cert.pem
ln -sf /etc/letsencrypt/archive/jungho.dev/privkey1.pem /etc/letsencrypt/live/jungho.dev/privkey.pem
ln -sf /etc/letsencrypt/archive/jungho.dev/chain1.pem /etc/letsencrypt/live/jungho.dev/chain.pem
ln -sf /etc/letsencrypt/archive/jungho.dev/fullchain1.pem /etc/letsencrypt/live/jungho.dev/fullchain.pem

certbot renew --quiet
