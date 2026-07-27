#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LABEL="com.remusfung.justacoustics-site.localhost"
HELPER_DIR="$HOME/Library/Application Support/JustAcoustics"
HELPER_SCRIPT="$HELPER_DIR/local-dev.sh"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG_DIR="$HOME/Library/Logs/JustAcoustics"

mkdir -p "$HOME/Library/LaunchAgents" "$HELPER_DIR" "$LOG_DIR"

cat > "$HELPER_SCRIPT" <<'EOF'
#!/bin/bash
set -euo pipefail

REPO_DIR="__REPO_DIR__"
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
EOF

perl -0pi -e 's|__REPO_DIR__|'"$REPO_DIR"'|g' "$HELPER_SCRIPT"
chmod +x "$HELPER_SCRIPT"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/osascript</string>
    <string>-e</string>
    <string>set repoDir to POSIX path of (path to home folder) &amp; "Desktop/AI Work/Just Acoustics Site"</string>
    <string>-e</string>
    <string>set helperScript to POSIX path of (path to home folder) &amp; "Library/Application Support/JustAcoustics/local-dev.sh"</string>
    <string>-e</string>
    <string>tell application "Terminal"</string>
    <string>-e</string>
    <string>set targetTab to do script "cd " &amp; quoted form of repoDir &amp; " &amp;&amp; exec bash " &amp; quoted form of helperScript</string>
    <string>-e</string>
    <string>repeat while busy of targetTab
  delay 2
end repeat</string>
    <string>-e</string>
    <string>end tell</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$LOG_DIR/local-dev.out.log</string>
  <key>StandardErrorPath</key>
  <string>$LOG_DIR/local-dev.err.log</string>
</dict>
</plist>
EOF

launchctl bootout gui/$(id -u) "$PLIST" 2>/dev/null || true
launchctl bootstrap gui/$(id -u) "$PLIST"
launchctl kickstart -k gui/$(id -u)/"$LABEL"

echo "Installed and started $LABEL"
echo "Logs: $LOG_DIR/local-dev.out.log"
echo "      $LOG_DIR/local-dev.err.log"
