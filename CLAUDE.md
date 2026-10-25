# Animate Studio: how to make films for this YouTube channel

This repo makes short animated films entirely in code. **Read this file, then `studio/LEARNINGS.md` (it opens with the
user's taste), before every film.** The rules here are the user's standing instructions; LEARNINGS.md is what past films
taught us. Both get better after every film.

**Rebuilt 2026-10-21** after the user's verdict on the old pipeline ("completely disappointed": cheap-looking, static,
text-heavy, slow). The new method comes from the user's tutorial (`studio/references/js-animation-tutorial.md`):
one visual idea per film, every spoken line becomes a gag on screen, the camera never stops, words are spoken not
written, a plan and a draft before the final. Target feel: **Kurzgesagt** (rich flat vector, motion, metaphor).
The pilot `films/seed-to-giant` ("This look amazing", the user) is the reference build.

## The repo
```
kit/                   the shared drawing kit (plain JS, deterministic, canvas 2D):
                       motion.js (K: eases, tracks, logTrack for zooms, settle/squash, rng, noise),
                       paint.js (P: world camera from mm to km, gradients, rim light P.lit, glow, ribbons, blobs, sky, text),
                       cast.js (Cast.face with lids/brows/mouth moods, Cast.profileFace, Cast.person rig with poses and look-at),
                       nature.js (fish, schools, whale, jelly, bubbles, cloud, bird, palm, tree, rain),
                       creatures.js (water molecule hero + crowd, dino, anglerfish, crab, turtle),
                       props.js (volcano + plume + eruption, canoe, house, waterwheel, signpost, raindrop, conifer, tower, seeds),
                       animals.js (the house-style animal library from the user's style sheets: Animals.quad rig with 16 mammals,
                       the hero cat with a falling rig, 9 birds, lizard, snake, croc, frog, trilobite, insects, octopus, starfish, seal),
                       nature.js also has the faceted set (rock, mesa/canyon wall, peak, pine, cactus, shrub, flowers, mushroom, grass, stump, log).
                       See the gallery pages studio/references/kit-gallery.png, kit-animals.png, kit-small-creatures.png, kit-nature.png
                       + kit-cat-poses.png
                       (films/kit-gallery renders them: still 0.5 / 1.5 / 2.5 / 3.5 / 4.5) before pitching.
                       Grow it: anything a second film could use goes here, not in a film.
films/<slug>/          one folder per film: plan.md, script-timed.md, film.json, src/*.js, score.py, audio/ (wav ignored),
                       hf/ (generated HyperFrames project), stills/, renders/ (ignored)
tools2/                film.mjs (build, still, sheet, board = the storyboard check, thumb, draft/looks/final renders through
                       HyperFrames + a 1080p copy), synth.py (numpy synth: instruments + sound effects)
studio/references/     the tutorial notes, the HyperFrames digest (framework rules, motion, audio), peekaboo.md,
                       style/ = the user's style library for animals and nature (read style/NOTES.md before drawing any creature)
studio/LEARNINGS.md    taste + lessons, newest first; studio/voice.md: narration voice; studio/fonts: Google Fonts (OFL)
studio/vendor/         youtube-agent-skill scorers (hooks, titles), anatomy kit; studio/dashboard: the live page
topics/log.md          every topic suggested, picked and made (never repeat a made topic)
legacy (reference only, do not build new videos with them): engine/, studio/channel, studio/library, studio/templates,
                       studio/tools (except package.mjs / hook scorers), videos/, archive/
```
HyperFrames (HeyGen, Apache-2.0) is the harness: `npm install` at the root; its skills are installed in `~/.claude/skills`
(`/hyperframes`, `hyperframes-animation`, ...); read `studio/references/hyperframes-digest.md` first.

## The channel
The videos are for the user's YouTube channel **Jist of Stories** (channel id `UCTj28GioLXloLYDY9V49arQ`; 25 subscribers
and 3 public videos on 2026-10-13). Its analytics are connected through the **Windsor.ai** connector (MCP tools
`mcp__Windsor_ai__*`, connector slug `youtube`, account `56502`). Read-only use: never run Windsor write actions.
- Per video (table "Video"): `video`, `video_title`, `views`, `average_view_duration`, `average_view_percentage`,
  `estimated_minutes_watched`, `likes`, `comments`, `shares`, `subscribers_gained`, by `date`; with `traffic_source`
  (YT_SEARCH, RELATED_VIDEO, SUBSCRIBER...) for how people found it; `creator_content_type` splits Shorts from videos.
- Channel: `channel_title`, `subscriber_count`, `video_count`, `view_count`; audience: `viewer_age_group`,
  `viewer_gender` + `viewer_percentage`; `country`.
- Not available there: the second-by-second retention curve. For that, ask for the Studio export and use retention.mjs.
Use it in the flow: before suggesting topics, pull the last 90 days per video (what got views, from where, how much was
watched) and lean toward what works; after a batch is uploaded, compare average view percentage per video and per
format/genre/style, and write what it teaches into LEARNINGS.md ("Viewer data" section). Log numbers with their dates.

## The flow (the user asks for topics, or picks one)
Keep the dashboard updated at every step (see "Dashboard"). Status lines say what is happening and why.

1. **Harvest, then clean up** (the user's rule): before deleting, move every character/prop/effect a second film could
   use from `films/<slug>/src` into `kit/` (no film constants; options instead), re-render `films/kit-gallery` and copy it
   to studio/references/kit-gallery.png, and note what made the film work in LEARNINGS. Then `node tools2/film.mjs <slug>
   clean` deletes the generated files (ask the user first if they haven't downloaded the final). Clean (`films/*/hf`, `renders`, `stills` and audio wavs are ignored by git;
   delete them once the user has the final) and the dashboard's outputs/assets.
2. **Suggest 10 topics** (the user's rule): read `topics/log.md`, the dashboard's `requests`, and the channel's numbers
   (Windsor). Each topic: title, one-line hook, **the visual idea** (one world or device that carries the whole film:
   a machine, a journey, a single continuous shot, a character's day...), category, why it fits. Write to `board/topics`.
3. **Pitch 3 ideas for the picked topic** (AskUserQuestion): each a different world/hero/camera, with 2-3 example gags.
   **Show the real process, never a metaphor** (the user's rule): real cross-sections, cutaways, real scale and time,
   slow motion, labels on the real parts; no stand-ins (knives, elevators, bumper cars, control rooms, forces as
   characters). Vary the framing, camera, hook and the small living characters in the real scene. The user picks one. Never reuse a previous film's idea, look or structure: every film is designed fresh.
4. **Plan** (`films/<slug>/plan.md`): the idea; the reference look (Kurzgesagt-like vector by default; crayon, paper
   cut-out, doodle when the idea asks for it, built into `kit/` the first time); pacing (RETENTION: a new thing every
   1-2 s, or TEACHING: slower, for a hard step); **the script as a table, one line = one gag on screen**; the colour
   arc; facts with sources (web-check every claim; hedge where uncertain; note what is stated from knowledge); the sound
   plan (music arc + one sound per action). Package while writing (studio/voice.md): 5 hook candidates scored
   (`studio/vendor/yt-agent`), title <= 60 chars, 3 searches to win, thumbnail words that don't repeat the title.
4b. **Ask for reference images (the user's rule)**: list every character, creature, object and place the plan needs; check
   each against the kit (studio/references/kit-gallery.png). For anything the kit doesn't have, or that I don't know
   well enough to draw convincingly (a specific animal, a character, a bottle, a plant, a machine, a landmark...), ask
   the user for reference images BEFORE building it: one message listing the missing items, what each is for, and what a
   good reference shows (side view? the face? the colours?). Build from the references (match their construction: the
   silhouette, where the face sits, the details, not just the colours), and save what's reusable into kit/.
   **Library pieces are a starting point, never dropped in as-is** (the user's rule): in every film, adapt each kit piece
   to the film's look, palette, situation and mood (proportions, colours, details, poses, light), through options or a
   film-side wrapper. The library itself stays generic: film-only details (a cutaway, a spine, labels) live in the film.
5. **Build**: `film.json` + `src/world.js` (props, characters) + `src/film.js` (`FILM.draw(t)`: camera tracks and beats).
   Look all the time: `node tools2/film.mjs <slug> sheet 0.5 0.15` (a frame every 0.5 s) and
   `node tools2/film.mjs <slug> still 2,9,15 0.5`. Fix what you see before moving on (see "Quality bar").
6. **Score**: `films/<slug>/score.py` with `tools2/synth.py`: music that follows the film's arc and a sound for every
   action; `python3 films/<slug>/score.py` writes audio/music.wav and audio/sfx.wav. Music sits well under the voice.
7. **Storyboard check (the user's rule; never skip)**: list the major scenes in film.json `board` ([t, label], one per beat
   plus the key gags, 12-20 tiles) and run `node tools2/film.mjs <slug> board`: one image, numbered tiles with time and
   label (`stills/board.png`). Look at it yourself first (every tile must show its gag; move a time if not), then send it
   with SendUserFile and **wait for the user's notes** ("#4: ..."). Apply them, re-send the board if the changes are big,
   and only then render the draft. Update the dashboard (stage `reviewing`, "storyboard sent").
8. **Draft**: `node tools2/film.mjs <slug> draft` (30 s ≈ 1.5 min) -> send `renders/<slug>-draft.mp4` + plan + script to
   the user, with the weak spots you see. **The user steers here**; change, re-draft if big.
9. **Final**: `node tools2/film.mjs <slug> final` (run_in_background). **Always deliver 1080p** (the user's rule): film.mjs
   makes `renders/<slug>-final-1080p.mp4` under 30 MB (never send a 720p copy). Thumbnail: `node tools2/film.mjs <slug> thumb`
   in the user's chosen style (**studio/references/thumbs/STYLE.md** + reference-grid.webp: a 1-3 word ALL-CAPS hook across
   the top with one accent word, one big dramatic hero, saturated colour on a dark background, a red arrow on the key
   detail; pills hidden). Use a dedicated `FILM.thumb()` composition when no frame is dramatic enough. **Always deliver YouTube metadata with the final** (the user's rule):
   `films/<slug>/youtube/metadata.md` in the format of films/cat/youtube/metadata.md: title + 2 alternatives, description
   (2 paragraphs, the main search phrase in the first line), chapters with timestamps that match the cut (first at 0:00),
   sources, searches to win, hashtags, tags, category, language, made-for-kids, pinned comment, thumbnail. Send the four
   files together: the 1080p final, `youtube/thumbnail.png`, `youtube/metadata.md`, and
   `script-timed.md` (the voice script with a time window per line: the user records the voice AFTER the picture,
   with ElevenLabs). Put title/description in the dashboard's `outputs/<slug>`. When the voice arrives: drop it in `audio/`, add it to film.json, carve
   the music under it (hyperframes-audio), re-render.
10. **Learn** (always): what the user liked/disliked into `studio/LEARNINGS.md` (taste first), general fixes into `kit/`
   or `tools2/`, the film into `topics/log.md` and `board/history`. Commit and push (generated files never).

## Quality bar (check every film before the draft goes out; from the pilot's weak spots)
- **Characters come from `kit/cast.js`**: faces with lids, highlights, brows and mouth moods; people with poses and a
  head that looks at the action. No dot-eye one-offs. New creatures reuse `Cast.face`.
- **No empty stretch**: every second of camera travel passes things at 2-3 depths (a near element rushing past, the
  subject, a far layer). A fall passes branches; a climb passes scale objects; a pan passes props.
- **No flat slabs**: any surface filling a third of the frame gets structure (bands, strata, shaded props via `P.lit`,
  small life: a worm, roots, dust).
- **The hero looks grand at the climax**: largest, central, lit (a sun or glow behind it); comparisons smaller and aside.
- **Readable without the voice**: each gag reads in a still; words on screen only for numbers, names, scale labels.
- **Faithful self-review**: send the draft with the weak spots you see named; fix them before the final.
- **No stamps, badges or HUD collectibles** (the user's dislike): numbers live in calm pills beside the action (`P.pill`).
- **Animals in profile get `Cast.profileFace`** (one eye, smile, nostril; the user's dino reference); front faces only
  for characters facing us.
- **Creatures face the way they travel** (the user caught a whale and fish swimming backwards, twice): whenever x moves,
  set the facing from the sign of the motion (`dir` on Nature.fish/school/whale/bird; or `P.at(x, y, 0, -1, 1, ...)`).
  Check every mover in the sheet: head first. Backing away is the only exception, and it must look deliberate.
- **Crowds vary**: repeated characters differ in size, tint, mood (some sleepy) and props (hats, glasses).
- **Every scene is a living place**: not a horizon and a sun; give it 3+ moving extras (a boat, gulls, steam, a fish).
- **Soft shapes are one shape**: clouds and bushes drawn as a dark underside layer + body + soft highlight, never as
  separately outlined blobs; flashbacks stay bright (warm sepia, a sun), not muddy brown.
- **Shorelines and joins are shaped**: no rectangles meeting at hard vertical edges.

## Dashboard
Live page: **https://claude.ai/artifact/N1dKeyKqmYkGV63YzWXZLw** (Artifact with a shared database; the user watches it).
Write with the `ArtifactData` tool (pin `if_version` on existing docs; batch several writes). Use the real time (`date -u +%FT%TZ`).
- `board/state`: { batch, phase, headline, updated }. Phase: topics | researching | scripting | styling | building | rendering | reviewing | packaging | done | failed
- `board/topics`: { items: [{ id, title, hook, category, style, format, why }], picked: [ids], theme, suggestedAt, source }
  The user can generate suggestions on the page itself ("Suggest 10 topics", optional theme; the page asks Claude via the `sample`
  capability; it asks for 10) and tap up to 3 to pick. When the user says "start" / "make the picked ones", read `board/topics` and use `picked`.
- `board/history`: { made: [titles], suggested: [titles] }: the page avoids these when suggesting. **After every batch add the
  made titles here** (and to topics/log.md).
- `videos/<slug>` (one per film): { order, title, style, length, stage, detail (what is happening), why, progress 0..1 or null (indeterminate), outputs: [paths] }
- `outputs/<slug>`: { title, ytTitle, description, video: {id}, thumb: {id}, full: { parts: [{id}], size }, script, metadata, note?, updated } (written by
  outputs.mjs; asset ids from the upload). The page shows a player, Download video 1080p (joined parts) / 720p / thumbnail/script/metadata, Copy title/description/lines.
  The page declares `assets`, so it is org-internal (never public).
- `log/<sortable id>`: { t, slug, note } (one line per meaningful step)
- `requests/*`: { text, created, status } written by the user from the page; set status 'picked' when used
For films, upload a < 15 MB web copy (`ffmpeg -i renders/<slug>-final.mp4 -vf scale=1280:-2 -crf 26 renders/<slug>-web.mp4`) and the
thumbnail as assets, and write `outputs/<slug>` directly (the legacy outputs.mjs/status.mjs expect videos/<slug>).

## Rules that always hold
- Requirements: Node 22+, ffmpeg, Python 3 + numpy, Playwright Chromium (`/opt/pw-browsers`; film.mjs points
  HyperFrames at its headless shell). `npm install` at the repo root for gsap + hyperframes.
- **Deterministic drawing**: everything is a function of t (HyperFrames seeks frames in any order): `K.rng`, `K.hash`,
  `K.noise`, never `Math.random()` or clocks. No network at render (fonts and scripts are local).
- **The user's taste** (LEARNINGS.md): calm, flat areas behind any text; no wobble/boil; no grain or halftone;
  fonts chosen per film (studio/fonts); music about 70% quieter than the voice; vary look, format, music and transitions.
- Facts are checked; claims are hedged where science is uncertain ("about", "can").
- Never wait on a background job with `pgrep -f` loops; use `run_in_background` and the completion notice.
- Files over 30 MB can't be sent; make a share copy with ffmpeg (`-crf 28`).
- Generated files never go into git; sources, plans, scripts, scores and learnings always do. Commit and push after each
  film and after the learning step.
