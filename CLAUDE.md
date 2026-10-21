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
                       cast.js (Cast.face with lids/brows/mouth moods, Cast.person rig with poses and look-at).
                       Grow it: anything a second film could use goes here, not in a film.
films/<slug>/          one folder per film: plan.md, script-timed.md, film.json, src/*.js, score.py, audio/ (wav ignored),
                       hf/ (generated HyperFrames project), stills/, renders/ (ignored)
tools2/                film.mjs (build, stills, sheet, draft/looks/final renders through HyperFrames), synth.py (numpy synth)
studio/references/     the tutorial notes, the HyperFrames digest (framework rules, motion, audio), peekaboo.md
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

1. **Clean up** the last film's generated files (`films/*/hf`, `renders`, `stills` and audio wavs are ignored by git;
   delete them once the user has the final) and the dashboard's outputs/assets.
2. **Suggest 10 topics** (the user's rule): read `topics/log.md`, the dashboard's `requests`, and the channel's numbers
   (Windsor). Each topic: title, one-line hook, **the visual idea** (one world or device that carries the whole film:
   a machine, a journey, a single continuous shot, a character's day...), category, why it fits. Write to `board/topics`.
3. **Pitch 3 ideas for the picked topic** (AskUserQuestion): each a different world/hero/camera, with 2-3 example gags.
   The user picks one. Never reuse a previous film's idea, look or structure: every film is designed fresh.
4. **Plan** (`films/<slug>/plan.md`): the idea; the reference look (Kurzgesagt-like vector by default; crayon, paper
   cut-out, doodle when the idea asks for it, built into `kit/` the first time); pacing (RETENTION: a new thing every
   1-2 s, or TEACHING: slower, for a hard step); **the script as a table, one line = one gag on screen**; the colour
   arc; facts with sources (web-check every claim; hedge where uncertain; note what is stated from knowledge); the sound
   plan (music arc + one sound per action). Package while writing (studio/voice.md): 5 hook candidates scored
   (`studio/vendor/yt-agent`), title <= 60 chars, 3 searches to win, thumbnail words that don't repeat the title.
5. **Build**: `film.json` + `src/world.js` (props, characters) + `src/film.js` (`FILM.draw(t)`: camera tracks and beats).
   Look all the time: `node tools2/film.mjs <slug> sheet 0.5 0.15` (a frame every 0.5 s) and
   `node tools2/film.mjs <slug> still 2,9,15 0.5`. Fix what you see before moving on (see "Quality bar").
6. **Score**: `films/<slug>/score.py` with `tools2/synth.py`: music that follows the film's arc and a sound for every
   action; `python3 films/<slug>/score.py` writes audio/music.wav and audio/sfx.wav. Music sits well under the voice.
7. **Draft**: `node tools2/film.mjs <slug> draft` (30 s ≈ 1.5 min) -> send `renders/<slug>-draft.mp4` + plan + script to
   the user, with the weak spots you see. **The user steers here**; change, re-draft if big.
8. **Final**: `node tools2/film.mjs <slug> final` (run_in_background). **Always deliver 1080p** (the user's rule): film.mjs
   makes `renders/<slug>-final-1080p.mp4` under 30 MB (never send a 720p copy). Thumbnail: `node tools2/film.mjs <slug> thumb`. Deliver
   `script-timed.md` (the voice script with a time window per line: the user records the voice AFTER the picture,
   with ElevenLabs), metadata and a thumbnail. When the voice arrives: drop it in `audio/`, add it to film.json, carve
   the music under it (hyperframes-audio), re-render.
9. **Learn** (always): what the user liked/disliked into `studio/LEARNINGS.md` (taste first), general fixes into `kit/`
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
