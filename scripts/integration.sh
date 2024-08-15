SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

${SCRIPT_DIR}/build.sh

${SCRIPT_DIR}/push.sh
