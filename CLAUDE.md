# Animate Studio: how to make videos for this YouTube channel

This repo makes short animated YouTube videos entirely in code. **Read this file, then `studio/LEARNINGS.md`, before every batch.**
The rules here are the user's standing instructions; LEARNINGS.md is what past videos taught us. Both get better after every batch.

## The repo
```
engine/animate/        the animate engine (vendored from github.com/cth9191/animate, MIT): kit, renderer, styles, tools, grammar.
                       Improve it in place when a lesson calls for it; note upstream-worthy changes in LEARNINGS.md.
studio/channel/        the channel layout (any style): head-top.html, channel.js (timeline, the explanation lettering, bridges, camera),
                       score-channel.js (mood-based score, motif, kick, risers, payoff hit, sfx)
studio/library/        reusable, style-agnostic characters and helpers (common.js: chFace, hero, personFull, squash;
                       machines.js: detailed machines from the anatomy kit, see studio/demos/machine)
studio/templates/      explainer/ = the starting point for a new video (copied by new-video.mjs)
studio/tools/          new-video, smoke, vo, metadata, thumbnail, finish.sh, status, cleanup (see "Tools")
studio/dashboard/      the live status page (Artifact) and its notes
studio/status.json     the local mirror of the dashboard's state
studio/LEARNINGS.md    lessons learned, newest first: read before building, append after every batch
studio/voice.md        the channel's narration voice (read before writing); studio/vendor/: youtube-agent-skill scorers (MIT),
                       anatomy/ (isometric machine geometry, MIT)
studio/formats.md      narrative formats; studio/sound.md: genres + sfx kits; studio/transitions.md: scene changes
topics/log.md          every topic suggested, picked and made (never repeat a made topic)
videos/<slug>/         one folder per video of the CURRENT batch (sources tracked; generated files ignored)
archive/<slug>/        finished videos' sources only (scripts, voice-over, metadata), kept small for learning
```

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

## The flow (the user asks for a topic, or for topics)
Keep the dashboard updated at **every** step (see "Dashboard"). Status lines say *what* is happening and *why*.

1. **Clean up the last batch.** `node studio/tools/cleanup.mjs` archives finished videos' sources to `archive/` and deletes
   their generated files (videos, frames, audio, thumbnails). The user has downloaded them. Do this before anything new.
   Also clear the dashboard's outputs: list its assets (Artifact `action: "list", scope: "assets"`), delete each one
   (`action: "delete"` with `path` = the asset id) and delete the `outputs/*` docs, so storage stays small.
2. **Suggest 10 topics** (the user's rule). Read `topics/log.md` (no repeats), the dashboard's `requests` collection (the user's ideas) and
   the channel's recent numbers from Windsor (see "The channel": what was watched, found by search, watched longest).
   Each topic: a title, a one-line hook, the best-fitting style, **narrative format** (studio/formats.md) and genre, and why
   it fits the channel and the tools.
   Mix categories (science why/how, space/what-if, history timeline, tech explained, money, nature). Prefer topics with a
   true process or timeline, one hero that can carry it, a twist or payoff, and visuals the styles draw well (shapes, diagrams,
   characters; not realistic people or footage). Write them to the dashboard (`board/topics`) and list them in chat.
   Animation reference: `studio/references/peekaboo.md` (zoom-ins, cutaways, flat bright shapes, pointing labels, a sound per action).
3. **The user picks up to 3** (in chat, or by tapping on the dashboard: read `board/topics.picked`). Don't ask anything else;
   use defaults: 16:9, about 2 minutes, voice-over by the user (ElevenLabs), music and sfx composed in code.
4. **Research each video** (stage `researching`). Web-check every claim that will be on screen or said; write
   `videos/<slug>/research.md` (the one true thing, facts with sources, visual references, style choice and why).
   Say "a", not "the first", unless sourced. Note claims you state from knowledge rather than a search.
5. **Pick the style** (stage `styling`) from `engine/animate/styles/` (flat (the default now), cut-paper, crosshatch, riso, sketchbook, math, pixel,
   isometric) or a new one via `engine/animate/new-style.md`. Match the subject: cut-paper for stories and histories, math for
   equations and graphs, pixel for computing/gaming history, isometric for products/infrastructure, riso/sketchbook for
   softer editorial topics, crosshatch for mechanisms. Read that style's STYLE.md and look at its sample.png first.
   Also pick, per video (the user's rule: vary them by topic, never the same recipe every time; a batch of three uses three
   different formats, genres and transition sets):
   - the **narrative format** from `studio/formats.md` (process, journey, timeline, countdown, myth vs fact, what if,
     mystery, versus, scale journey, question chain, day in the life); the scene tags follow it (years, #ranks, clues...);
   - the **music genre** from `studio/sound.md` (`SCORE.genre`: paper, lofi, synth, pizzicato, ambient, chiptune, folk,
     mystery); SFX follow the style automatically, scene cues add topic sounds (buzz, drip, coin, tick, flip...).
     The music sits about 70% quieter than composed (the user's rule; `SCORE.musicLevel`, default 0.25 = -10 dB);
   - **2–4 transitions** from `studio/transitions.md` that come out of the topic and the objects on screen (`tr` per scene:
     hex tiles for bees, a drop for water, a zoom into the cell, a page turn for history...).
   Write all three choices and why into research.md.
   **Fonts per video (the user's rule):** pick a heading font and a body font (Google Fonts in `studio/fonts`, README there)
   that match the topic and the scene's colours (`CHANNEL.font`, `titleFont`, `labelFont`); vary them between videos.
   **No notepad/card (the user's rule):** the explanation is written and drawn straight onto the scene, in the style's own
   lettering (layout 'open'). Each video sets `CHANNEL` in src/scenes.js: font, ink colours, halo, and how its step tag looks
   (isometric: sans + mono label; sketchbook: marker on tape; cut-paper: the paper tag). Keep the whole frame one world.
6. **Write the script** (stage `scripting`): `node studio/tools/new-video.mjs <slug> "<Title>" <style>`, then fill
   `src/script.js`: SCN (9–10 scenes, 11–15 s each, ~2 min), the hook, one true step per scene, a 2.5 s `silence` scene,
   the payoff (`cut: true`, mood `full`), and an ending that calls back to the opening. Also META (YouTube title, alternatives,
   hook, about, chapters, sources, hashtags, tags), THUMB (frame, panel colour, 2–4 big hook lines) and SCORE (motif).
   **Package while writing (studio/voice.md; rules and scorers from youtube-agent-skill):** META.hooks = 5 candidate
   opening lines from different hook formulas (studio/vendor/yt-agent/hooks.json); the first voice line opens with the
   best one (aim for STRONG >= 72, never below WORKABLE 55). META.title <= 60 characters with the subject in the first
   40 and a number, name or date; 2 alternatives. THUMB.lines = at most 3 words that do NOT repeat the title (same promise,
   different words). META.queries = the 3 searches the video should win; their words must appear in the title or the first
   two description lines (META.hook, the first sentence of META.about). Check with `node studio/tools/package.mjs <slug>`.
   **Voice lines fill their scene:** about 2.7 words per second of the window (d − 0.9 s). Check with `node studio/tools/vo.mjs <slug> --check`.
7. **Draw** (stage `building`): `src/scenes.js`, one scene function and one card function per scene. Use the style's kit for
   the scene, the channel helpers to letter the explanation onto it (write, title, bigNum, arrow, bubble, check, cbox, popAt,
   chTag; they draw in screen space on the right, x 1070..1810) and
   `studio/library` characters. For machines and mechanisms (engines, pumps, locks, gauges, pipes, gears) use
   `studio/library/machines.js` (add `../../studio/vendor/anatomy/anatomy.js` and `../../studio/library/machines.js` to piece.json
   `build` after `style`; the demo `studio/demos/machine` shows every part). Run `node studio/tools/smoke.mjs <slug>` and LOOK at `review/sheet.png` (and at 2–3 frames at
   0.5 scale with engine/animate/tools/still.mjs). Fix overlaps, clutter, still stretches, unreadable text.
8. **Render and package** (stages `rendering` → `reviewing` → `packaging`): `studio/tools/finish.sh <slug>` with
   `run_in_background`. It exports, runs the review, makes a < 30 MB share copy, a 720p subtitle preview, `voice/script.md`,
   `youtube/metadata.md` and `youtube/thumbnail.png`. Read `review.txt`. Fix real failures (payoff not loudest, text overlaps,
   dead beats over 3 s) and re-run (`--audio-only` when only the mix changed). Under 1 dB misses on arc rules are acceptable.
   Run videos one after another, not in parallel (4 CPU workers each).
9. **Deliver** (stage `done`): send each video's `-1080p.mp4`, `-script-preview-720p.mp4`, `voice/script.md`,
   `youtube/metadata.md` and `youtube/thumbnail.png` with SendUserFile, and summarise checks (incl. youtube/package.md:
   hook score, title score, searches), weakest spot and what you couldn't verify. Also suggest one **Short** per video in
   chat: a 20-55 s span that stands alone (opens on a complete thought, has a turn, ends on a line), a new first line
   scored with hookscore, on-screen text for its first 2 s, and a loop point.
   Put them on the dashboard too: upload `renders/<slug>-web-720p.mp4` (finish.sh makes it, ~13 MB; the upload cap is 15 MB)
   `renders/<slug>-1080p.part0.mp4`, `part1.mp4` (the 1080p share copy split under 15 MB; the page joins them into one file on
   download) and `youtube/thumbnail.png` with the Artifact tool (`url` = the dashboard, `asset: true`, `file_paths`), then
   `node studio/tools/outputs.mjs <slug> <videoId> <thumbId> <part0Id> <part1Id>` and write `renders/outputs.json` to `outputs/<slug>`
   (ArtifactData batch, `file_path`). The page then plays the video and offers downloads and copy buttons.
10. **Learn from viewers**: once videos are up, pull their numbers from Windsor (views, average view %, traffic source,
    subscribers gained) and compare by format, genre, style and title. When the user shares a Studio retention export (CSV), run
    `node studio/tools/retention.mjs <slug> <file.csv>` (works on archived videos: cleanup keeps voice/narration.srt).
    Name the single biggest leak (hook leak > 25%? a cliff at a line? a steep slide?) and turn it into a rule in
    LEARNINGS.md and, if it's general, into the template, voice.md or a tool.
11. **Learn** (always): append what this batch taught to `studio/LEARNINGS.md` (new rules, mistakes, what the user liked/disliked),
    and improve the repo itself when a lesson is general: a library character, a channel helper, a tool, a score mood, a template.
    Update `topics/log.md`. Commit and push everything except generated files.

## Dashboard
Live page: **https://claude.ai/artifact/N1dKeyKqmYkGV63YzWXZLw** (Artifact with a shared database; the user watches it).
Write with the `ArtifactData` tool (pin `if_version` on existing docs; batch several writes). Use the real time (`date -u +%FT%TZ`).
- `board/state`: { batch, phase, headline, updated }. Phase: topics | researching | scripting | styling | building | rendering | reviewing | packaging | done | failed
- `board/topics`: { items: [{ id, title, hook, category, style, format, why }], picked: [ids], theme, suggestedAt, source }
  The user can generate suggestions on the page itself ("Suggest 10 topics", optional theme; the page asks Claude via the `sample`
  capability; it asks for 10) and tap up to 3 to pick. When the user says "start" / "make the picked ones", read `board/topics` and use `picked`.
- `board/history`: { made: [titles], suggested: [titles] }: the page avoids these when suggesting. **After every batch add the
  made titles here** (and to topics/log.md).
- `videos/<slug>`: { order, title, style, length, stage, detail (what is happening), why, progress 0..1 or null (indeterminate), outputs: [paths] }
- `outputs/<slug>`: { title, ytTitle, description, video: {id}, thumb: {id}, full: { parts: [{id}], size }, script, metadata, note?, updated } (written by
  outputs.mjs; asset ids from the upload). The page shows a player, Download video 1080p (joined parts) / 720p / thumbnail/script/metadata, Copy title/description/lines.
  The page declares `assets`, so it is org-internal (never public).
- `log/<sortable id>`: { t, slug, note } (one line per meaningful step)
- `requests/*`: { text, created, status } written by the user from the page; set status 'picked' when used
Also mirror stages locally with `node studio/tools/status.mjs <slug> <stage> "<what>" "<why>"` (finish.sh does this itself).

## Tools
| command | does |
|---|---|
| `node studio/tools/new-video.mjs <slug> "<Title>" [style=flat]` | creates videos/<slug>/ from the explainer template (flat: soft look) |
| `node studio/tools/smoke.mjs <slug>` | build + one frame per scene (`review/sheet.png`) + score check; exit 1 on page or audio errors |
| `node studio/tools/vo.mjs <slug> [--check]` | voice-over: words vs window per line (SPARSE/DENSE), writes `voice/script.md` |
| `node studio/tools/metadata.mjs <slug>` | `youtube/metadata.md` from META + chapters |
| `node studio/tools/thumbnail.mjs <slug>` | `youtube/thumbnail.png` (1280×720) from THUMB |
| `studio/tools/finish.sh <slug> [--audio-only\|--skip-export]` | export → review → share copy → preview → vo → metadata → thumbnail → web copy |
| `studio/tools/web-copy.sh <slug>` | `renders/<slug>-web-720p.mp4` (~13 MB) and `<slug>-1080p.part<N>.mp4` (< 15 MB each) for the dashboard |
| `node studio/tools/outputs.mjs <slug> <videoId> <thumbId> [partIds…]` | `renders/outputs.json`, the dashboard's `outputs/<slug>` doc |
| `node studio/tools/package.mjs <slug>` | hooks scored, title + thumbnail linted, searches checked: `youtube/package.md` (finish.sh runs it) |
| `node studio/tools/retention.mjs <slug> <csv>` | reads a YouTube retention export: hook leak, cliffs with the line said there, slide |
| `node studio/tools/sampler.mjs <slug> [sec] [genres]` | renders the piece's score in every genre: `renders/genres.mp3` + one mp3 per genre |
| `node studio/tools/status.mjs <slug> <stage> "<what>" "<why>"` | local status mirror |
| `node studio/tools/cleanup.mjs [--dry-run]` | archive sources, delete generated files of finished videos |
| `node engine/animate/tools/still.mjs videos/<slug> 3,40 out.png --scale 0.5` | look at specific frames (rebuilds first) |
| `node studio/tools/anatomy-bundle.mjs` | rebuilds `studio/vendor/anatomy/anatomy.js` from the vendored anatomy sources |

## Rules that always hold
- Requirements: Node 18+, Playwright Chromium (`/opt/pw-browsers` in cloud sessions), ffmpeg. For the hand lettering install
  Comic Neue if missing (`apt-get install -y fonts-comic-neue`); without it captions fall back to a serif.
- **Calm behind words (the user's rule):** never put busy texture (halftone dots, hatching, heavy grain) under the lettering.
  Backgrounds where text sits are flat or near-flat; texture lives on the objects. Riso: `calmField()`, not a printed field.
- **No boil, little texture (the user's rule):** lines stay still (the wobble/boil is off for channel videos; `CHANNEL.boil = true`
  only when a scene needs it) and avoid grainy textures (halftone dots, grain, pencil fills). Default to the `flat` style
  (styles/flat: flat colours, clean outlines, cel shading, faces, lens zooms, pointing labels).
- **Soft look (the user's references):** prefer `CHANNEL.look = 'soft'` with the flat style: no outlines, tone-on-tone
  palettes, Headspace-like `fBlob` characters with noodle limbs, round trees/cones/layered hills; the hero in a warm colour
  that contrasts with the scene's hue family. videos/firefly-glow (archive later) is the reference build.
  `new-video.mjs` defaults to flat and starts flat videos from the soft template (templates/explainer/src/scenes-soft.js).
- **Show a new look before rendering it:** when the look changes (new style, palette or the user's references), send
  `review/sheet.png` or 2-3 frames first. A full render costs ~25 minutes.
- **Thumbnails must read on a phone:** heavy title font, thick dark outline, dark wash behind the words (thumbnail.mjs
  does this); THUMB.t at a moment when the hero does the hook's action; LOOK at youtube/thumbnail.png before delivering.
- `studio/LEARNINGS.md` opens with **the user's taste**: read it first and update it after every reaction.
- Deterministic drawing: `RNG(...)` and `B`/`TT`, never `Math.random()` or the clock. Don't fade kit textures with globalAlpha.
- Facts are checked; claims are hedged where science is uncertain ("could", "about").
- Never wait on a background job with `pgrep -f <pattern>` loops: the loop matches its own command line. Use `run_in_background`
  and the completion notice, or `until [ -f <file> ]`.
- Files over 30 MB can't be sent: send the share copies (finish.sh makes them).
- Generated files never go into git (`.gitignore`); sources, scripts, metadata and learnings always do.
- Commit and push to the working branch after each video and after the learning step.
