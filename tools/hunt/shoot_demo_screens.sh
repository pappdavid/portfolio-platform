#!/usr/bin/env bash
# ============================================================================
# Deterministic evidence screenshot capture — davidpapp.dev role pages.
#
# Usage: shoot_demo_screens.sh <role> [<role> ...]     (roles: ai-engineering,
#        ai-integration, automation, product-engineering)
#
# Requires: chromium/chrome binary ($CHROME or auto-detected), 3 independent
# temp profiles per shot (isolation = no session/localStorage carryover).
#
# Determinism protocol (REQUIRED for evidence):
#   1. Every capture uses ?capture=1  -> animations frozen at final state
#      (src/lib/capture-mode.ts + html[data-capture] CSS in globals.css).
#   2. Per role: 3 consecutive captures with INDEPENDENT temp profiles must
#      be hash-identical (sha256 of the PNG, or of the normalized PNG if
#      $PNG_NORMALIZE is set) before the shot counts as proof.
#   3. Server-side personalization proof stays with curl REFERRAL_CONTEXT
#      checks — screenshots are layout evidence, not personalization proof.
#
# Exit 0 only if every role passed the 3x byte-identical check.
# ============================================================================
set -euo pipefail

BASE_URL="${BASE_URL:-https://davidpapp.dev}"
OUT_DIR="${OUT_DIR:-$PWD/screenshots}"
CHROME="${CHROME:-$(command -v chromium || command -v chromium-browser || command -v google-chrome-stable || true)}"
VIEWPORT="${VIEWPORT:-1280,900}"
SHOT_DIR="$(mktemp -d)"
trap 'rm -rf "$SHOT_DIR"' EXIT

if [[ -z "$CHROME" ]]; then
  echo "ERROR: no chrome/chromium binary found (set \$CHROME)" >&2
  exit 2
fi

shot() { # shot <role> <index> -> prints png path
  local role="$1" idx="$2"
  local profile="$SHOT_DIR/profile-$role-$idx"
  local out="$SHOT_DIR/$role-$idx.png"
  mkdir -p "$profile"
  "$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size="$VIEWPORT" \
    --virtual-time-budget=15000 \
    --user-data-dir="$profile" \
    --screenshot="$out" \
    "$BASE_URL/roles/$role?capture=1" >/dev/null 2>&1
  echo "$out"
}

# Guard: a capture of an error/404 page must never count as proof. The DOM
# of every shot must contain the hero terminal marker of a real role page
# before the PNG is accepted into the hash comparison.
dom_is_valid() { # dom_is_valid <role>
  local html
  html="$("$CHROME" --headless=new --no-sandbox --disable-gpu \
    --virtual-time-budget=15000 \
    --user-data-dir="$SHOT_DIR/profile-check-$1" \
    --dump-dom "$BASE_URL/roles/$1?capture=1" 2>/dev/null || true)"
  echo "$html" | grep -q 'hero-role' && \
  ! echo "$html" | grep -qi 'This page could not be found'
}

verify_role() {
  local role="$1"
  if ! dom_is_valid "$role"; then
    echo "FAIL $role  page DOM is not a valid role page (error/404 capture guard)" >&2
    return 1
  fi
  local hashes=()
  for i in 1 2 3; do
    local png
    png="$(shot "$role" "$i")"
    hashes+=("$(sha256sum "$png" | cut -d' ' -f1)")
  done
  if [[ "${hashes[0]}" == "${hashes[1]}" && "${hashes[1]}" == "${hashes[2]}" ]]; then
    cp "${SHOT_DIR}/$role-1.png" "$OUT_DIR/$role-rolepage.png"
    echo "PASS $role  sha256=${hashes[0]}"
    return 0
  fi
  echo "FAIL $role  hashes: ${hashes[*]}" >&2
  return 1
}

mkdir -p "$OUT_DIR"
if [[ $# -eq 0 ]]; then
  echo "Usage: $0 <role> [<role> ...] — refusing a zero-argument vacuous run" >&2
  exit 2
fi
fail=0
for role in "$@"; do
  verify_role "$role" || fail=1
done
exit "$fail"
