# Studio fonts (Google Fonts, free)

Downloaded from github.com/google/fonts (raw.githubusercontent.com works from the cloud sessions; github.com/raw and
jsdelivr do not). Licences: SIL Open Font License (LICENSE-OFL.txt) for all but Chewy and Luckiest Guy (Apache 2.0,
LICENSE-Apache-2.0.txt). Both allow use in videos. `studio/tools/fonts.sh` installs them for the renderer (smoke.mjs and
finish.sh call it). Add more with: `curl -sSL -o X.ttf https://raw.githubusercontent.com/google/fonts/main/ofl/<family>/<File>.ttf`.

| family | feel | good for |
|---|---|---|
| Fredoka | round, bubbly, friendly | water, nature, kids' science, headings |
| Baloo 2 | round, warm, sturdy | body or headings for cheerful topics |
| Nunito | clean rounded sans | reading lines (the body) on almost anything |
| Quicksand | light, airy rounded | calm topics, night, space, the body |
| Lilita One | chunky poster caps | food, sports, loud headings |
| Luckiest Guy | comic-book caps | stamps, big numbers, action |
| Chewy | bouncy, playful | kitchens, candy, cartoon labels |
| Sniglet | soft, rounded, a little goofy | animals, bugs, gentle headings |
| Patrick Hand | neat handwriting | notes, diaries, sketchy labels |

Each video sets `CHANNEL.font` (+ `weight`) for the reading lines, `CHANNEL.titleFont` (+ `titleWeight`) for titles, big
numbers and stamps, and `CHANNEL.labelFont` for the scene's own labels (flat style). Pick by topic and by the scene's
colours, and vary them between videos.
