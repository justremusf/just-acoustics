#!/usr/bin/env bash
# Downloads every site video from YouTube and compresses it for self-hosting.
# Needs yt-dlp + ffmpeg (brew install yt-dlp ffmpeg / pip install yt-dlp).
#
#   npm run videos               # fetch + compress all
#   SOURCE_DIR=~/raw npm run videos   # compress originals you already have
#                                     # (named <key>.mp4/.mov) instead of downloading
#
# Output: public/media/videos/<key>.mp4 + <key>.jpg, then set `src`/`poster`
# for that key in lib/videos.ts.
set -euo pipefail

OUT_DIR="public/media/videos"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT
mkdir -p "$OUT_DIR"

# key:youtubeId — keep in sync with lib/videos.ts
VIDEOS=(
  "meeting-room:8DURhlYt3wQ"
  "restaurant:bm-q3dQWB6g"
  "function-room:Y9b0NNTRnFw"
  "yoga-studio:-1WDATPou2Y"
)

for entry in "${VIDEOS[@]}"; do
  key="${entry%%:*}"
  id="${entry#*:}"
  raw=""

  if [[ -n "${SOURCE_DIR:-}" ]]; then
    raw="$(ls "$SOURCE_DIR"/"$key".* 2>/dev/null | head -1 || true)"
  fi
  if [[ -z "$raw" ]]; then
    echo "→ downloading $key ($id)"
    yt-dlp -q -f "bv*[height<=1080]+ba/b[height<=1080]" --merge-output-format mp4 \
      -o "$TMP_DIR/$key.%(ext)s" -- "$id"
    raw="$TMP_DIR/$key.mp4"
  fi

  echo "→ compressing $key"
  # H.264 + AAC plays everywhere (incl. iOS Safari). CRF 23 looks the same as
  # YouTube's 1080p at a fraction of the size; audio kept high because the whole
  # point is hearing the before/after. faststart lets playback begin instantly.
  ffmpeg -y -loglevel error -i "$raw" \
    -vf "scale='min(1080,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    -c:v libx264 -preset slow -crf 23 -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a 160k -ac 2 \
    -movflags +faststart \
    "$OUT_DIR/$key.mp4"

  ffmpeg -y -loglevel error -ss 1 -i "$OUT_DIR/$key.mp4" -frames:v 1 -q:v 4 "$OUT_DIR/$key.jpg"

  echo "  ✓ $OUT_DIR/$key.mp4 ($(du -h "$OUT_DIR/$key.mp4" | cut -f1))"
done
