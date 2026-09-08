#!/usr/bin/env bash
set -euo pipefail

# Build, then publish. Arguments are forwarded to push.sh, so this needs the
# same per-image versions:
#
#   ./integration.sh --ingress 0.0.4
#   ./integration.sh --site 0.1.4 --ingress 0.0.4

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

"$SCRIPT_DIR/build.sh"

"$SCRIPT_DIR/push.sh" "$@"
