#!/usr/bin/env bash
# Regenerate public/cv.pdf from public/cv.html with headless Chrome.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME_BIN:-}"
if [ -z "$CHROME" ]; then
  for c in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "$(command -v google-chrome || true)" \
    "$(command -v chromium-browser || true)" \
    "$(command -v chromium || true)"; do
    if [ -n "$c" ] && [ -x "$c" ]; then CHROME="$c"; break; fi
  done
fi
[ -n "$CHROME" ] || { echo "Chrome/Chromium not found; set CHROME_BIN" >&2; exit 1; }

"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$(pwd)/public/cv.pdf" \
  "file://$(pwd)/public/cv.html"
echo "wrote public/cv.pdf"
