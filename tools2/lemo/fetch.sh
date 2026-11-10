#!/bin/sh
# Real-instrument sample libraries for tools2/lemo/sampler.py (CC0 / CC BY, see INSTRUMENTS.md section 4).
# From the lemo-opuscar "assets" release (MIT code; samples keep their own licences). Not in git.
#   sh tools2/lemo/fetch.sh vcsl vsco2ce        (mallets, harp, percussion + orchestra: ~700 MB)
#   libs: freepats karoryfer salamander vcsl vsco2ce
set -e
cd "$(dirname "$0")"
mkdir -p instruments
for lib in "$@"; do
  f=instruments-$lib.tar
  size=$(python3 -c "import json;print(json.load(open('assets.json'))['packs']['instruments-$lib']['size'])")
  sha=$(python3 -c "import json;print(json.load(open('assets.json'))['packs']['instruments-$lib']['sha256'])")
  curl -L --fail --retry 3 -C - -# -o "/tmp/$f" "https://github.com/lemomo-ai/lemo-opuscar/releases/download/assets/$f"
  echo "$sha  /tmp/$f" | sha256sum -c -
  tar -xf "/tmp/$f" -C instruments --strip-components=3 && rm "/tmp/$f"   # members are core/audio/instruments/...
done
ls instruments
