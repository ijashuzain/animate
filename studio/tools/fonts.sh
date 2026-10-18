#!/bin/bash
# Install the studio's Google Fonts (studio/fonts, OFL / Apache 2.0) for the headless renderer (fontconfig).
# Cloud containers start fresh, so smoke.mjs and finish.sh call this; it is a no-op once installed.
ROOT=$(cd "$(dirname "$0")/../.." && pwd); D="$HOME/.local/share/fonts/animate-studio"
mkdir -p "$D"; n=0
for f in "$ROOT"/studio/fonts/*.ttf; do b=$(basename "$f"); [ -f "$D/$b" ] || { cp "$f" "$D/"; n=$((n+1)); }; done
[ $n -gt 0 ] && fc-cache -f "$D" >/dev/null 2>&1
exit 0
