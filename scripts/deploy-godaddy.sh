#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v expect >/dev/null 2>&1; then
  echo "expect is required but not installed."
  exit 1
fi

GODADDY_HOST="${GODADDY_HOST:-gzn.15a.myftpupload.com}"
GODADDY_PORT="${GODADDY_PORT:-22}"
GODADDY_USER="${GODADDY_USER:-client_eb6ee9feaa_1101247}"
GODADDY_PASS="${GODADDY_PASS:-}"
GODADDY_UPLOAD_RETRIES="${GODADDY_UPLOAD_RETRIES:-3}"
GODADDY_SFTP_REQUESTS="${GODADDY_SFTP_REQUESTS:-64}"
GODADDY_SSH_SERVER_ALIVE_INTERVAL="${GODADDY_SSH_SERVER_ALIVE_INTERVAL:-15}"
GODADDY_SSH_SERVER_ALIVE_COUNT_MAX="${GODADDY_SSH_SERVER_ALIVE_COUNT_MAX:-4}"
# This hosting account currently serves the site from this directory, not /html.
GODADDY_REMOTE_DIR="${GODADDY_REMOTE_DIR:-/home/${GODADDY_USER}/html-backup-20260323-170417}"
GODADDY_SITE_URL="${GODADDY_SITE_URL:-https://wanjinspring.com}"

if [[ -z "$GODADDY_PASS" ]]; then
  echo "GODADDY_PASS is required."
  exit 1
fi

echo "Building site..."
npm run build

staging_dir="$(mktemp -d /tmp/wanjin-dist-staging.XXXXXX)"
batch_file="$(mktemp /tmp/wanjin-sftp-batch.XXXXXX)"

cleanup() {
  rm -rf "$staging_dir"
  rm -f "$batch_file"
}

trap cleanup EXIT

if [[ ! -f dist/index.html ]]; then
  echo "Could not find dist/index.html after build."
  exit 1
fi

if [[ ! -f dist/app-runtime/index.html ]]; then
  echo "Could not find dist/app-runtime/index.html after build."
  exit 1
fi

echo "Snapshotting build output to ${staging_dir}..."
cp -R dist/. "$staging_dir"/

if ! grep -q '/app-runtime/runtime.js' "$staging_dir/index.html"; then
  echo "Staged index.html is missing the runtime entry script."
  exit 1
fi

if ! grep -q 'id="wanjin-runtime-script"' "$staging_dir/app-runtime/index.html"; then
  echo "Staged app-runtime/index.html is missing the inlined runtime script."
  exit 1
fi

if [[ ! -f "$staging_dir/app-runtime/runtime-manifest.json" ]]; then
  echo "Staged app-runtime/runtime-manifest.json is missing."
  exit 1
fi

{
  print -- "cd ${GODADDY_REMOTE_DIR}"
  print -- "lcd ${staging_dir}"
  print -- "put -r * ."

  print -- "ls -l index.html"
  print -- "ls -l zh/index.html"
  print -- "ls -l app-runtime/index.html"
} > "$batch_file"

run_sftp_batch() {
  local sftp_batch="$1"

  BATCH_FILE="$sftp_batch" \
  GODADDY_PASS_VALUE="$GODADDY_PASS" \
  GODADDY_USER_VALUE="$GODADDY_USER" \
  GODADDY_HOST_VALUE="$GODADDY_HOST" \
  GODADDY_PORT_VALUE="$GODADDY_PORT" \
  GODADDY_SFTP_REQUESTS_VALUE="$GODADDY_SFTP_REQUESTS" \
  GODADDY_SSH_SERVER_ALIVE_INTERVAL_VALUE="$GODADDY_SSH_SERVER_ALIVE_INTERVAL" \
  GODADDY_SSH_SERVER_ALIVE_COUNT_MAX_VALUE="$GODADDY_SSH_SERVER_ALIVE_COUNT_MAX" \
  /usr/bin/expect <<'EOF'
set timeout 1800
set fp [open $env(BATCH_FILE) r]
spawn sftp -R $env(GODADDY_SFTP_REQUESTS_VALUE) -P $env(GODADDY_PORT_VALUE) -o StrictHostKeyChecking=no -o ServerAliveInterval=$env(GODADDY_SSH_SERVER_ALIVE_INTERVAL_VALUE) -o ServerAliveCountMax=$env(GODADDY_SSH_SERVER_ALIVE_COUNT_MAX_VALUE) $env(GODADDY_USER_VALUE)@$env(GODADDY_HOST_VALUE)
expect {
  -re ".*yes/no.*" { send "yes\r"; exp_continue }
  -re ".*assword:.*" { send "$env(GODADDY_PASS_VALUE)\r"; exp_continue }
  -re "sftp> $" {}
  eof { close $fp; exit 1 }
}
while {[gets $fp line] >= 0} {
  if {$line eq ""} {
    continue
  }
  send -- "$line\r"
  expect {
    -re "sftp> $" {}
    eof { close $fp; exit 1 }
  }
}
close $fp
send -- "bye\r"
expect eof
catch wait result
set exit_status [lindex $result 3]
exit $exit_status
EOF
}

echo "Uploading dist to ${GODADDY_REMOTE_DIR}..."
attempt=1
until run_sftp_batch "$batch_file"; do
  if (( attempt >= GODADDY_UPLOAD_RETRIES )); then
    echo "Upload failed after ${attempt} attempts."
    exit 1
  fi
  echo "Upload attempt ${attempt} failed. Retrying resume upload..."
  attempt=$((attempt + 1))
  sleep 5
done

timestamp="$(date +%Y%m%d-%H%M%S)"

echo "Verifying public files..."
curl -fsSI "${GODADDY_SITE_URL}/index.html?deploy=${timestamp}" | head -n 10
curl -fsSI "${GODADDY_SITE_URL}/app-runtime/?deploy=${timestamp}" | head -n 10
curl -fsS "${GODADDY_SITE_URL}/app-runtime/?deploy=${timestamp}" | rg -n -m 2 'wanjin-runtime-(style|script)'

echo
echo "Deploy complete."
echo "Remote directory: ${GODADDY_REMOTE_DIR}"
echo "Runtime bridge: ${GODADDY_SITE_URL}/app-runtime/"
