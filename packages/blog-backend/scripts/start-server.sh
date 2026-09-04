#!/bin/sh
set -eu

# cron pulls content and rebuilds the blog every 10 minutes.
cron -f &

exec node dist/app.js
