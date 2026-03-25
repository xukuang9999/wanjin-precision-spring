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
# This hosting account currently serves the site from this directory, not /html.
GODADDY_REMOTE_DIR="${GODADDY_REMOTE_DIR:-/home/${GODADDY_USER}/html-backup-20260323-170417}"
GODADDY_SITE_URL="${GODADDY_SITE_URL:-https://wanjinspring.com}"
GODADDY_COMPAT_JS_NAMES="${GODADDY_COMPAT_JS_NAMES:-index-D_T-v_k8.js,index-DDbV8HHO.js,index--nbCFyX8.js}"
GODADDY_COMPAT_CSS_NAMES="${GODADDY_COMPAT_CSS_NAMES:-style-BpTPA4Tz.css,index-D_ncdTRu.css}"

if [[ -z "$GODADDY_PASS" ]]; then
  echo "GODADDY_PASS is required."
  exit 1
fi

echo "Building site..."
node scripts/generate-runtime-translations.mjs
npx vite build
node generate-prerender-pages.mjs

main_js_candidates=("${(@f)$(find dist/assets -maxdepth 1 -type f -name 'index-*.js' | sort)}")
main_css_candidates=("${(@f)$(find dist/assets -maxdepth 1 -type f -name '*.css' | sort)}")

main_js_path="${main_js_candidates[1]:-}"
main_css_path="${main_css_candidates[1]:-}"

if [[ -z "$main_js_path" || ! -f "$main_js_path" ]]; then
  echo "Could not find the main JS bundle in dist/assets."
  exit 1
fi

if [[ -z "$main_css_path" || ! -f "$main_css_path" ]]; then
  echo "Could not find the main CSS bundle in dist/assets."
  exit 1
fi

main_js="${main_js_path:t}"
main_css="${main_css_path:t}"

staging_dir="$(mktemp -d /tmp/wanjin-dist-staging.XXXXXX)"
batch_file="$(mktemp /tmp/wanjin-sftp-batch.XXXXXX)"

cleanup() {
  rm -rf "$staging_dir"
  rm -f "$batch_file"
}

trap cleanup EXIT

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

echo "Snapshotting build output to ${staging_dir}..."
cp -R dist/. "$staging_dir"/

main_js_candidates=("${(@f)$(find "$staging_dir/assets" -maxdepth 1 -type f -name 'index-*.js' | sort)}")
main_css_candidates=("${(@f)$(find "$staging_dir/assets" -maxdepth 1 -type f -name '*.css' | sort)}")

main_js_path="${main_js_candidates[1]:-}"
main_css_path="${main_css_candidates[1]:-}"

if [[ -z "$main_js_path" || ! -f "$main_js_path" ]]; then
  echo "Could not find the main JS bundle in staged assets."
  exit 1
fi

if [[ -z "$main_css_path" || ! -f "$main_css_path" ]]; then
  echo "Could not find the main CSS bundle in staged assets."
  exit 1
fi

main_js="${main_js_path:t}"
main_css="${main_css_path:t}"

{
  print -- "cd ${GODADDY_REMOTE_DIR}"

  for dir_path in "${(@f)$(cd "$staging_dir" && find . -mindepth 1 -type d | sed 's#^\./##' | sort)}"; do
    remote_dir="${dir_path}"
    print -- "-mkdir ${remote_dir}"
  done

  for file_path in "${(@f)$(cd "$staging_dir" && find . -type f | sed 's#^\./##' | sort)}"; do
    remote_file="${file_path}"
    print -- "put ${staging_dir}/${file_path} ${remote_file}"
  done

  for legacy_js in ${(s:,:)GODADDY_COMPAT_JS_NAMES}; do
    legacy_js="$(trim "$legacy_js")"
    [[ -z "$legacy_js" || "$legacy_js" == "$main_js" ]] && continue
    print -- "put ${staging_dir}/assets/${main_js} assets/${legacy_js}"
  done

  for legacy_css in ${(s:,:)GODADDY_COMPAT_CSS_NAMES}; do
    legacy_css="$(trim "$legacy_css")"
    [[ -z "$legacy_css" || "$legacy_css" == "$main_css" ]] && continue
    print -- "put ${staging_dir}/assets/${main_css} assets/${legacy_css}"
  done

  print -- "ls -l index.html"
  print -- "ls -l zh/index.html"
  print -- "ls -l assets/${main_js}"
} > "$batch_file"

run_sftp_batch() {
  local sftp_batch="$1"

  BATCH_FILE="$sftp_batch" \
  GODADDY_PASS_VALUE="$GODADDY_PASS" \
  GODADDY_USER_VALUE="$GODADDY_USER" \
  GODADDY_HOST_VALUE="$GODADDY_HOST" \
  GODADDY_PORT_VALUE="$GODADDY_PORT" \
  /usr/bin/expect <<'EOF'
set timeout 1800
set fp [open $env(BATCH_FILE) r]
spawn sftp -P $env(GODADDY_PORT_VALUE) -o StrictHostKeyChecking=no $env(GODADDY_USER_VALUE)@$env(GODADDY_HOST_VALUE)
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
run_sftp_batch "$batch_file"

timestamp="$(date +%Y%m%d-%H%M%S)"

echo "Verifying public files..."
curl -fsSI "${GODADDY_SITE_URL}/index.html?deploy=${timestamp}" | head -n 10
curl -fsSI "${GODADDY_SITE_URL}/assets/${main_js}?deploy=${timestamp}" | head -n 10

echo
echo "Deploy complete."
echo "Remote directory: ${GODADDY_REMOTE_DIR}"
echo "Main JS: ${main_js}"
echo "Main CSS: ${main_css}"
