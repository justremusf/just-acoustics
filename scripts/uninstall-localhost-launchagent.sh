#!/bin/bash
set -euo pipefail

LABEL="com.remusfung.justacoustics-site.localhost"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"

launchctl bootout gui/$(id -u) "$PLIST" 2>/dev/null || true
rm -f "$PLIST"

echo "Removed $LABEL"
