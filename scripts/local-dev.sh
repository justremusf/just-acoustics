#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_BIN=""

for candidate in \
  "$HOME/.nvm/versions/node/v22.15.0/bin/node" \
  "$HOME/.nvm/versions/node"/v22*/bin/node \
  "$HOME/.nvm/versions/node"/v20*/bin/node
do
  if [ -x "$candidate" ]; then
    NODE_BIN="$candidate"
    break
  fi
done

if [ -z "$NODE_BIN" ] && command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
fi

if [ -z "$NODE_BIN" ]; then
  echo "node was not found. Install Node 22.15.0 (nvm) before starting the site." >&2
  exit 1
fi

export PATH="$(dirname "$NODE_BIN"):$PATH"
export NODE_ENV=development
export NEXT_TELEMETRY_DISABLED=1
export PORT=3333

LOCK_FILE="$REPO_DIR/package-lock.json"
HASH_CACHE_DIR="$HOME/Library/Caches/just-acoustics-site"
HASH_CACHE_FILE="$HASH_CACHE_DIR/package-lock.sha256"

mkdir -p "$HASH_CACHE_DIR"

current_hash="$(shasum -a 256 "$LOCK_FILE" | awk '{print $1}')"
cached_hash=""

if [ -f "$HASH_CACHE_FILE" ]; then
  cached_hash="$(cat "$HASH_CACHE_FILE")"
fi

if [ ! -x "$REPO_DIR/node_modules/.bin/next" ] || [ "$current_hash" != "$cached_hash" ]; then
  echo "Installing dependencies..."
  (cd "$REPO_DIR" && npm ci)
  printf '%s\n' "$current_hash" > "$HASH_CACHE_FILE"
fi

cd "$REPO_DIR"
exec npm run dev
