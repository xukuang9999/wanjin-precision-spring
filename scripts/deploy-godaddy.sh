#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v expect >/dev/null 2>&1; then
  echo "expect is required but not installed."
  exit 1
fi

GODADDY_HOST="${GODADDY_HOST:-gzn.15a.myftpupload.com}"
GODADDY_USER="${GODADDY_USER:-client_2b981eee5f_1101247}"
GODADDY_PASS="${GODADDY_PASS:-}"
GODADDY_REMOTE_DIR="${GODADDY_REMOTE_DIR:-/html}"
GODADDY_HOME_DIR="${GODADDY_HOME_DIR:-/home/${GODADDY_USER}}"
GODADDY_SITE_URL="${GODADDY_SITE_URL:-https://wanjinspring.com}"

if [[ -z "$GODADDY_PASS" ]]; then
  echo "GODADDY_PASS is required."
  exit 1
fi

echo "Building site..."
npm run build

timestamp="$(date +%Y%m%d-%H%M%S)"
archive="/tmp/wanjin-dist-${timestamp}.tar.gz"
top_level_list="/tmp/wanjin-dist-top-level-${timestamp}.txt"

find dist -mindepth 1 -maxdepth 1 -exec basename {} \; | sort > "$top_level_list"

echo "Packing dist..."
COPYFILE_DISABLE=1 tar -C dist --exclude '._*' --no-xattrs -czf "$archive" .

run_expect() {
  local mode="$1"
  local payload="$2"

  MODE="$mode" PAYLOAD="$payload" GODADDY_PASS_VALUE="$GODADDY_PASS" GODADDY_USER_VALUE="$GODADDY_USER" GODADDY_HOST_VALUE="$GODADDY_HOST" /usr/bin/expect <<'EOF'
set timeout 600
set mode $env(MODE)
set payload $env(PAYLOAD)
if {$mode eq "scp"} {
  spawn {*}[concat [list scp -o StrictHostKeyChecking=no] [split $payload]]
} else {
  spawn ssh -o StrictHostKeyChecking=no $env(GODADDY_USER_VALUE)@$env(GODADDY_HOST_VALUE) $payload
}
expect {
  -re ".*yes/no.*" { send "yes\r"; exp_continue }
  -re ".*assword:.*" { send "$env(GODADDY_PASS_VALUE)\r"; exp_continue }
  eof
}
EOF
}

remote_archive="${GODADDY_HOME_DIR}/$(basename "$archive")"
remote_top_level="$(paste -sd' ' "$top_level_list" | sed "s#^#${GODADDY_REMOTE_DIR}/#; s# # ${GODADDY_REMOTE_DIR}/#g")"

echo "Creating remote backup..."
backup_cmd="set -e; BACKUP=${GODADDY_HOME_DIR}/wanjin-predeploy-\$(date +%Y%m%d-%H%M%S).tar.gz; tar -czf \$BACKUP ${remote_top_level} 2>/dev/null || true; echo \$BACKUP"
backup_output="$(run_expect ssh "$backup_cmd")"
backup_path="$(printf '%s\n' "$backup_output" | tail -n 1)"

echo "Uploading archive..."
run_expect scp "${archive} ${GODADDY_USER}@${GODADDY_HOST}:${GODADDY_HOME_DIR}/"

echo "Deploying to ${GODADDY_REMOTE_DIR}..."
deploy_items=("${(@f)$(cat "$top_level_list")}")
remote_delete_cmd=""
for item in "${deploy_items[@]}"; do
  remote_delete_cmd+="rm -rf '${GODADDY_REMOTE_DIR}/${item}'; "
done

remote_deploy_cmd="set -e; ${remote_delete_cmd} tar --no-same-owner --no-same-permissions --delay-directory-restore -xzf '${remote_archive}' -C '${GODADDY_REMOTE_DIR}' || true; find '${GODADDY_REMOTE_DIR}' -name '._*' -type f -delete; rm -f '${remote_archive}'; ls -lh '${GODADDY_REMOTE_DIR}/index.html'"
run_expect ssh "$remote_deploy_cmd"

echo "Verifying remote files..."
verify_cmd="set -e; ls -lh '${GODADDY_REMOTE_DIR}/index.html' '${GODADDY_REMOTE_DIR}/blog/index.html' '${GODADDY_REMOTE_DIR}/products/index.html'; ls -lh '${GODADDY_REMOTE_DIR}/assets/'*.css | head -n 3"
run_expect ssh "$verify_cmd"

echo "Verifying public URL..."
curl -k -I -s "${GODADDY_SITE_URL}/" | head -n 10

echo
echo "Deploy complete."
echo "Backup: ${backup_path}"
echo "Archive: ${archive}"
