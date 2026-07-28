#!/bin/bash
# ─────────────────────────────────────────────────────────────
# auto-fetch-products.sh
# Automatically captures screenshots & extracts metadata
# from all product website URLs.
#
# Usage:
#   bash scripts/auto-fetch-products.sh [output-dir] [json-output] [deal-repo-path]
#
# Examples:
#   bash scripts/auto-fetch-products.sh
#   bash scripts/auto-fetch-products.sh ./public/images/products ./product-data.json /home/z/deal
# ─────────────────────────────────────────────────────────────

set -euo pipefail

VIEWPORT_W=1920
VIEWPORT_H=1080
TIMEOUT=15000
WAIT_SEC=3
OUTPUT_DIR="${1:-./public/images/products}"
JSON_OUTPUT="${2:-./product-data.json}"
DEAL_REPO="${3:-}"
TMP_JS="/tmp/ab-eval.js"

PRODUCTS=(
  "proj_playbeat_live|PlayBeat.live|https://playbeat.live|playbeat-live"
  "proj_playbeat_digital|PlayBeat.digital|https://playbeat.digital|playbeat-digital"
  "proj_playbeatdigital_world|PlayBeatDigital.world|https://playbeatdigital.world|playbeatdigital-world"
  "proj_blockexchange|BlockExchange.buzz|https://blockexchange.buzz|blockexchange-buzz"
  "proj_brockexchange|BrockExchange.quest|https://brockexchange.quest|brockexchange-quest"
  "proj_buzzcryp|BuzzCryp.buzz|https://buzzcryp.buzz|buzzcryp-buzz"
  "proj_nextradepro|NexTradePro.top|https://nextradepro.top|nextradepro-top"
  "proj_playbeattv|PlayBeatTV.buzz|https://playbeattv.buzz|playbeattv-buzz"
  "proj_magxtv|MagxTV|https://magxtv.click|magxtv-click"
  "proj_malik_indol|Malik Indol|https://malik-indol-six.vercel.app|malik-indol"
  "proj_zxc_sigma|ZXC Sigma Ivory|https://zxc-sigma-ivory.vercel.app|zxc-sigma-ivory"
  "proj_propertyatlas|PropertyAtlas.lifestyle|https://propertyatlas.lifestyle|propertyatlas-lifestyle"
)

mkdir -p "$OUTPUT_DIR"

echo "========================================="
echo "  Auto Product Image & Data Fetcher"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "  Products: ${#PRODUCTS[@]}"
echo "  Output:   $OUTPUT_DIR"
echo "========================================="
echo ""

# ── Helper: safe JS eval via temp file ──
jeval() {
  local expr="$1"
  echo "$expr" > "$TMP_JS"
  local result
  result=$(agent-browser eval "$(cat $TMP_JS)" 2>/dev/null) || true
  echo "$result" | head -1
}

echo "[1/3] Launching browser (${VIEWPORT_W}x${VIEWPORT_H})..."
agent-browser set viewport $VIEWPORT_W $VIEWPORT_H 2>&1 | tail -1

echo "[2/3] Capturing screenshots & extracting data..."
echo ""

RESULTS="[]"
SUCCESS=0
FAILED=0

for ENTRY in "${PRODUCTS[@]}"; do
  IFS='|' read -r ID NAME URL FILENAME <<< "$ENTRY"
  IMG_PATH="$OUTPUT_DIR/${FILENAME}.png"

  printf "  %-30s " "$NAME"

  # Navigate
  agent-browser open "$URL" --timeout $TIMEOUT 2>/dev/null || true
  sleep $WAIT_SEC

  # Screenshot (full page)
  SS_OUTPUT=$(agent-browser screenshot "$IMG_PATH" --full 2>&1) || true
  SS_OK=$(echo "$SS_OUTPUT" | grep -c "Screenshot saved" || echo "0")

  # Extract metadata via JS
  PAGE_TITLE=$(jeval "document.title")
  META_DESC=$(jeval "(document.querySelector(\"meta[name=\\\"description\\\"]\") || {}).content || \"\"")
  META_KW=$(jeval "(document.querySelector(\"meta[name=\\\"keywords\\\"]\") || {}).content || \"\"")
  OG_IMG=$(jeval "(document.querySelector(\"meta[property=\\\"og:image\\\"]\") || {}).content || \"\"")
  THEME=$(jeval "document.documentElement.classList.contains('dark') ? 'dark' : 'light'")

  # Tech stack detection
  TECH=""
  [ "$(jeval "!!document.querySelector('[data-next-router]') || !!window.__next")" = "true" ] && TECH="${TECH}Next.js, "
  [ "$(jeval "[...document.scripts].some(s => s.src && s.src.includes('turbopack'))")" = "true" ] && TECH="${TECH}Turbopack, "
  [ "$(jeval "!!document.querySelector('[class*=\"antialiased\"]')")" = "true" ] && TECH="${TECH}Tailwind CSS, "
  [ "$(jeval "!!document.querySelector('[data-slot]')")" = "true" ] && TECH="${TECH}shadcn/ui, "
  [ "$(jeval "!!document.querySelector('[data-sonner-toaster]')")" = "true" ] && TECH="${TECH}Sonner, "
  [ "$(jeval "!!document.querySelector('svg[class*=\"lucide\"]')")" = "true" ] && TECH="${TECH}Lucide React, "
  [ "$(jeval "document.body && document.body.innerText.includes('MongoDB')")" = "true" ] && TECH="${TECH}MongoDB, "
  [ "$(jeval "!!document.querySelector('iframe[src*=\"recaptcha\"]')")" = "true" ] && TECH="${TECH}reCAPTCHA, "
  TECH=$(echo "$TECH" | sed 's/, $//')

  # Body text (first 1500 chars)
  BODY=$(jeval "document.body ? document.body.innerText.substring(0, 1500) : ''")

  # File size
  SIZE="0"
  [ -f "$IMG_PATH" ] && SIZE=$(du -h "$IMG_PATH" | cut -f1)
  [ "$SS_OK" -lt 1 ] && SIZE="0" && SS_OK=0

  if [ "$SS_OK" -ge 1 ]; then
    printf "✅ %-50s [%s]\n" "${PAGE_TITLE:0:50}" "$SIZE"
    SUCCESS=$((SUCCESS + 1))
  else
    printf "❌ Failed\n"
    FAILED=$((FAILED + 1))
  fi

  # Build JSON entry
  ENTRY_JSON=$(jq -n \
    --arg id "$ID" \
    --arg name "$NAME" \
    --arg url "$URL" \
    --arg image "${FILENAME}.png" \
    --arg imageSize "$SIZE" \
    --arg pageTitle "$PAGE_TITLE" \
    --arg metaDescription "$META_DESC" \
    --arg metaKeywords "$META_KW" \
    --arg ogImage "$OG_IMG" \
    --arg theme "$THEME" \
    --arg techStack "$TECH" \
    --arg bodyText "$BODY" \
    --arg capturedAt "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)" \
    '{
      id: $id, name: $name, url: $url, image: $image, imageSize: $imageSize,
      pageTitle: $pageTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords,
      ogImage: $ogImage, theme: $theme, techStack: $techStack, bodyText: $bodyText,
      capturedAt: $capturedAt
    }'
  )

  RESULTS=$(echo "$RESULTS" | jq --argjson entry "$ENTRY_JSON" '. + [$entry]')
done

echo ""
echo "[3/3] Closing browser..."
agent-browser close 2>&1 | tail -1

# Write JSON
mkdir -p "$(dirname "$JSON_OUTPUT")"
echo "$RESULTS" | jq '.' > "$JSON_OUTPUT"

echo ""
echo "========================================="
echo "  Done! $SUCCESS succeeded, $FAILED failed"
echo "  Screenshots: $OUTPUT_DIR/"
echo "  Data JSON:  $JSON_OUTPUT"
echo "========================================="

# Optional: copy to deal repo
if [ -n "$DEAL_REPO" ] && [ -d "$DEAL_REPO" ]; then
  DEAL_IMG="$DEAL_REPO/public/images/products"
  mkdir -p "$DEAL_IMG"
  cp -f "$OUTPUT_DIR"/*.png "$DEAL_IMG/" 2>/dev/null || true
  cd "$DEAL_REPO"
  git add public/images/products/ 2>/dev/null || true
  git commit -m "Auto-update product screenshots ($(date '+%Y-%m-%d'))" 2>/dev/null || true
  echo ""
  echo "  📦 Committed to deal repo. Push when ready."
  cd - > /dev/null
fi

rm -f "$TMP_JS"