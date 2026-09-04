#!/bin/sh
set -eu

git clone --depth 1 https://github.com/kyle-park-io/blog.git /blog

chmod +x /blog/scripts/*.sh
/blog/scripts/cron-init.sh
