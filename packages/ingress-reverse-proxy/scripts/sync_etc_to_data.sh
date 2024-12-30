#!/bin/sh

# Copy the directory and check for success
if cp -r /etc/letsencrypt /data/letsencrypt; then
  echo "Copy successful"
else
  echo "Copy failed" >&2
  exit 1
fi