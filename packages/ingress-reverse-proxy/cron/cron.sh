#!/bin/sh

mkdir -p /etc/crontabs
# cp /app/cron/certbot-renew /etc/crontabs/root
cat /app/cron/certbot-renew >>/etc/crontabs/root
chmod 0644 /etc/crontabs/root
# crond -b -l 2
crond -f &
