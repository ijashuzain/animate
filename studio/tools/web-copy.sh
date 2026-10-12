#!/bin/bash
# A 720p web copy (< 14 MB) for the dashboard's asset store (its uploads cap at ~15 MB): renders/<slug>-web-720p.mp4,
# and the 1080p share copy split into renders/<slug>-1080p.part<N>.mp4 for the dashboard's 1080p download
#   usage: studio/tools/web-copy.sh <slug>
set -e
SLUG=$1; ROOT=$(cd "$(dirname "$0")/../.." && pwd); R=$ROOT/videos/$SLUG/renders
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $R/final.mp4)
VB=$(python3 -c "print(int(13.2e6*8/float('$DUR')/1000) - 96)")   # kbit/s that lands near 13.2 MB with 96k audio
ffmpeg -y -loglevel error -i $R/final.mp4 -vf scale=1280:720:flags=lanczos -c:v libx264 -preset slow -b:v ${VB}k -pass 1 -passlogfile $R/wp -an -f mp4 /dev/null
ffmpeg -y -loglevel error -i $R/final.mp4 -vf scale=1280:720:flags=lanczos -c:v libx264 -preset slow -b:v ${VB}k -pass 2 -passlogfile $R/wp -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart $R/$SLUG-web-720p.mp4
rm -f $R/wp*
echo "web copy: videos/$SLUG/renders/$SLUG-web-720p.mp4 $(du -h $R/$SLUG-web-720p.mp4 | cut -f1) (${VB}k video)"
# the 1080p share copy, byte-split into < 15 MB parts the dashboard joins back on download
if [ -f "$R/$SLUG-1080p.mp4" ]; then
  rm -f "${R:?}/${SLUG:?}"-1080p.part*; split -b 14500000 -d -a 1 "$R/$SLUG-1080p.mp4" "$R/$SLUG-1080p.part"
  for f in "$R/$SLUG"-1080p.part?; do mv "$f" "$f.mp4"; done
  echo "1080p parts: $(ls "$R/$SLUG"-1080p.part*.mp4 | xargs -n1 basename | tr '\n' ' ')"
fi
