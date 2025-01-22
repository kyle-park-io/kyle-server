#!/bin/sh

# Copy the directory and check for success
# if cp -rL /etc/letsencrypt/* /data/letsencrypt; then
# if cp -rL /etc/letsencrypt /data; then
# if rsync -av --delete --copy-links /etc/letsencrypt/ /data/letsencrypt/; then
if cp -rL /etc/letsencrypt /data; then
  echo "Copy successful"
else
  echo "Copy failed" >&2
  exit 1
fi
