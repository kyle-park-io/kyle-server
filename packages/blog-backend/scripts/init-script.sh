#!/bin/sh

git clone https://github.com/kyle-park-io/blog.git

mkdir -p /usr/src/app

cp -r /blog/md /usr/src/app/md
cp -r /blog/sort /usr/src/app/sort

# init cron
chmod +x /blog/scripts/*
./blog/scripts/cron-init.sh
