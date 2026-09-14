#!/bin/sh

LE_DIR="${LETSENCRYPT_DIR:-/etc/letsencrypt}"
ARCHIVE="$LE_DIR/archive/jungho.dev"
LIVE="$LE_DIR/live/jungho.dev"

# certbot refuses a lineage whose live files are not symlinks, and after a
# restart they are plain files copied back from the PVC. Link them to the
# newest archived version, the one certbot itself would link.
latest=$(ls "$ARCHIVE" | sed -n 's/^cert\([0-9][0-9]*\)\.pem$/\1/p' | sort -n | tail -n 1)
if [ -n "$latest" ]; then
  for kind in cert privkey chain fullchain; do
    ln -sf "$ARCHIVE/$kind$latest.pem" "$LIVE/$kind.pem"
  done
fi

certbot renew --quiet
