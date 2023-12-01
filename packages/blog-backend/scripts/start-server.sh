#!/bin/sh

# start cron
cron -f &

# start server
exec node dist/app.js
