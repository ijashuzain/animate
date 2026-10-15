#!/bin/bash
# Finish a video: export (frames + score + stems), review, a < 30 MB share copy, a 720p subtitle timing preview,
# the voice-over script, the YouTube metadata and the thumbnail. Records each stage in studio/status.json.
#   usage: studio/tools/finish.sh <slug> [--skip-export | --audio-only]
#   (run it with run_in_background; never wait on it with a pgrep loop: the loop matches its own command line)
set -u
SLUG=$1; MODE=${2:-}
ROOT=$(cd "$(dirname "$0")/../.." && pwd); cd "$ROOT"
E=engine/animate/tools; V=videos/$SLUG; R=$V/renders
st() { node studio/tools/status.mjs "$SLUG" "$1" "$2" "$3" >/dev/null; }
node $E/build.mjs $V | tail -1 || exit 1
if [ "$MODE" = "--audio-only" ]; then
  st rendering "Re-rendering the score and remuxing it into the master" "The picture is unchanged; only the mix moved"
  node $E/export.mjs $V --only-audio 2>&1 | tail -1
elif [ "$MODE" != "--skip-export" ]; then
  st rendering "Rendering frames, the score and its stems (4 workers)" "Frames are drawn in a headless browser; the score is synthesized offline"
  node $E/export.mjs $V --workers 4 2>&1 | grep -v "frames  " | tail -3
fi
st reviewing "Measured checks: cuts on the beat, story arc loudness, text overlaps, dead beats" "Done means measured, not eyeballed"
node $E/review.mjs $V > $V/review.txt 2>&1
grep -E "story arc|FAIL|WARN|loudest|LUFS|silence before|text:|dead beats|all cuts|MORPHS|narration:" $V/review.txt | grep -v "^ *[0-9]"
# the share copy's bitrate: 1750k, or less so a longer video still lands under ~28.5 MB (files over 30 MB can't be sent)
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $R/final.mp4)
SB=$(python3 -c "print(min(1750, int(28.5e6*8/float('$DUR')/1000) - 170))")
st packaging "Share copy (< 30 MB), subtitle preview, voice-over script, metadata, thumbnail" "Everything needed to upload, in one folder"
ffmpeg -y -loglevel error -i $R/final.mp4 -c:v libx264 -preset slow -b:v ${SB}k -pass 1 -passlogfile $R/p2 -an -f mp4 /dev/null && \
ffmpeg -y -loglevel error -i $R/final.mp4 -c:v libx264 -preset slow -b:v ${SB}k -pass 2 -passlogfile $R/p2 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart $R/$SLUG-1080p.mp4
rm -f $R/p2* $R/final-captions.mp4
ffmpeg -y -loglevel error -i $R/$SLUG-1080p.mp4 -vf "scale=1280:720,subtitles=$R/narration.srt:force_style='Fontname=DejaVu Sans,Fontsize=13,PrimaryColour=&H00FFFFFF,BackColour=&H99000000,BorderStyle=3,Outline=5,Shadow=0,Alignment=2,MarginV=14'" -c:v libx264 -preset medium -crf 27 -maxrate 1500k -bufsize 3000k -c:a aac -b:a 128k -movflags +faststart $R/$SLUG-script-preview-720p.mp4
node studio/tools/vo.mjs $SLUG | tail -2
node studio/tools/metadata.mjs $SLUG
node studio/tools/thumbnail.mjs $SLUG
node studio/tools/package.mjs $SLUG | grep -v wrote   # hooks, title + thumbnail, search (youtube/package.md)
studio/tools/web-copy.sh $SLUG
st done "Ready: $R/$SLUG-1080p.mp4, voice/script.md, youtube/" "Delivered; generated files stay until the next batch's cleanup"
ls -la $R/*.mp4
