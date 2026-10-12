# Animate Studio: how to make videos for this YouTube channel

This repo makes short animated YouTube videos entirely in code. **Read this file, then `studio/LEARNINGS.md`, before every batch.**
The rules here are the user's standing instructions; LEARNINGS.md is what past videos taught us. Both get better after every batch.

## The repo
```
engine/animate/        the animate engine (vendored from github.com/cth9191/animate, MIT): kit, renderer, styles, tools, grammar.
                       Improve it in place when a lesson calls for it; note upstream-worthy changes in LEARNINGS.md.
studio/channel/        the channel layout (any style): head-top.html, channel.js (timeline, the explanation lettering, bridges, camera),
                       score-channel.js (mood-based score, motif, kick, risers, payoff hit, sfx)
studio/library/        reusable, style-agnostic characters and helpers (common.js: chFace, hero, personFull, squash)
studio/templates/      explainer/ = the starting point for a new video (copied by new-video.mjs)
studio/tools/          new-video, smoke, vo, metadata, thumbnail, finish.sh, status, cleanup (see "Tools")
studio/dashboard/      the live status page (Artifact) and its notes
studio/status.json     the local mirror of the dashboard's state
studio/LEARNINGS.md    lessons learned, newest first: read before building, append after every batch
topics/log.md          every topic suggested, picked and made (never repeat a made topic)
videos/<slug>/         one folder per video of the CURRENT batch (sources tracked; generated files ignored)
archive/<slug>/        finished videos' sources only (scripts, voice-over, metadata), kept small for learning
```

## The flow (the user asks for a topic, or for topics)
Keep the dashboard updated at **every** step (see "Dashboard"). Status lines say *what* is happening and *why*.

1. **Clean up the last batch.** `node studio/tools/cleanup.mjs` archives finished videos' sources to `archive/` and deletes
   their generated files (videos, frames, audio, thumbnails). The user has downloaded them. Do this before anything new.
   Also clear the dashboard's outputs: list its assets (Artifact `action: "list", scope: "assets"`), delete each one
   (`action: "delete"` with `path` = the asset id) and delete the `outputs/*` docs, so storage stays small.
2. **Suggest 6 topics.** Read `topics/log.md` (no repeats) and the dashboard's `requests` collection (the user's ideas).
   Each topic: a title, a one-line hook, the best-fitting style and format, and why it fits the channel and the tools.
   Mix categories (science why/how, space/what-if, history timeline, tech explained, money, nature). Prefer topics with a
   true process or timeline, one hero that can carry it, a twist or payoff, and visuals the styles draw well (shapes, diagrams,
   characters; not realistic people or footage). Write them to the dashboard (`board/topics`) and list them in chat.
3. **The user picks up to 3** (in chat, or by tapping on the dashboard: read `board/topics.picked`). Don't ask anything else;
   use defaults: 16:9, about 2 minutes, voice-over by the user (ElevenLabs), music and sfx composed in code.
4. **Research each video** (stage `researching`). Web-check every claim that will be on screen or said; write
   `videos/<slug>/research.md` (the one true thing, facts with sources, visual references, style choice and why).
   Say "a", not "the first", unless sourced. Note claims you state from knowledge rather than a search.
5. **Pick the style** (stage `styling`) from `engine/animate/styles/` (cut-paper, crosshatch, riso, sketchbook, math, pixel,
   isometric) or a new one via `engine/animate/new-style.md`. Match the subject: cut-paper for stories and histories, math for
   equations and graphs, pixel for computing/gaming history, isometric for products/infrastructure, riso/sketchbook for
   softer editorial topics, crosshatch for mechanisms. Read that style's STYLE.md and look at its sample.png first.
   **No notepad/card (the user's rule):** the explanation is written and drawn straight onto the scene, in the style's own
   lettering (layout 'open'). Each video sets `CHANNEL` in src/scenes.js: font, ink colours, halo, and how its step tag looks
   (isometric: sans + mono label; sketchbook: marker on tape; cut-paper: the paper tag). Keep the whole frame one world.
6. **Write the script** (stage `scripting`): `node studio/tools/new-video.mjs <slug> "<Title>" <style>`, then fill
   `src/script.js`: SCN (9–10 scenes, 11–15 s each, ~2 min), the hook, one true step per scene, a 2.5 s `silence` scene,
   the payoff (`cut: true`, mood `full`), and an ending that calls back to the opening. Also META (YouTube title, alternatives,
   hook, about, chapters, sources, hashtags, tags), THUMB (frame, panel colour, 2–4 big hook lines) and SCORE (motif).
   **Voice lines fill their scene:** about 2.7 words per second of the window (d − 0.9 s). Check with `node studio/tools/vo.mjs <slug> --check`.
7. **Draw** (stage `building`): `src/scenes.js`, one scene function and one card function per scene. Use the style's kit for
   the scene, the channel helpers to letter the explanation onto it (write, title, bigNum, arrow, bubble, check, cbox, popAt,
   chTag; they draw in screen space on the right, x 1070..1810) and
   `studio/library` characters. Run `node studio/tools/smoke.mjs <slug>` and LOOK at `review/sheet.png` (and at 2–3 frames at
   0.5 scale with engine/animate/tools/still.mjs). Fix overlaps, clutter, still stretches, unreadable text.
8. **Render and package** (stages `rendering` → `reviewing` → `packaging`): `studio/tools/finish.sh <slug>` with
   `run_in_background`. It exports, runs the review, makes a < 30 MB share copy, a 720p subtitle preview, `voice/script.md`,
   `youtube/metadata.md` and `youtube/thumbnail.png`. Read `review.txt`. Fix real failures (payoff not loudest, text overlaps,
   dead beats over 3 s) and re-run (`--audio-only` when only the mix changed). Under 1 dB misses on arc rules are acceptable.
   Run videos one after another, not in parallel (4 CPU workers each).
9. **Deliver** (stage `done`): send each video's `-1080p.mp4`, `-script-preview-720p.mp4`, `voice/script.md`,
   `youtube/metadata.md` and `youtube/thumbnail.png` with SendUserFile, and summarise checks, weakest spot and what you couldn't verify.
   Put them on the dashboard too: upload `renders/<slug>-web-720p.mp4` (finish.sh makes it, ~13 MB; the upload cap is 15 MB)
   `renders/<slug>-1080p.part0.mp4`, `part1.mp4` (the 1080p share copy split under 15 MB; the page joins them into one file on
   download) and `youtube/thumbnail.png` with the Artifact tool (`url` = the dashboard, `asset: true`, `file_paths`), then
   `node studio/tools/outputs.mjs <slug> <videoId> <thumbId> <part0Id> <part1Id>` and write `renders/outputs.json` to `outputs/<slug>`
   (ArtifactData batch, `file_path`). The page then plays the video and offers downloads and copy buttons.
10. **Learn** (always): append what this batch taught to `studio/LEARNINGS.md` (new rules, mistakes, what the user liked/disliked),
    and improve the repo itself when a lesson is general: a library character, a channel helper, a tool, a score mood, a template.
    Update `topics/log.md`. Commit and push everything except generated files.

## Dashboard
Live page: **https://claude.ai/artifact/N1dKeyKqmYkGV63YzWXZLw** (Artifact with a shared database; the user watches it).
Write with the `ArtifactData` tool (pin `if_version` on existing docs; batch several writes). Use the real time (`date -u +%FT%TZ`).
- `board/state`: { batch, phase, headline, updated }. Phase: topics | researching | scripting | styling | building | rendering | reviewing | packaging | done | failed
- `board/topics`: { items: [{ id, title, hook, category, style, format, why }], picked: [ids], theme, suggestedAt, source }
  The user can generate suggestions on the page itself ("Suggest 6 topics", optional theme; the page asks Claude via the `sample`
  capability) and tap up to 3 to pick. When the user says "start" / "make the picked ones", read `board/topics` and use `picked`.
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
| `node studio/tools/new-video.mjs <slug> "<Title>" <style>` | creates videos/<slug>/ from the explainer template |
| `node studio/tools/smoke.mjs <slug>` | build + one frame per scene (`review/sheet.png`) + score check; exit 1 on page or audio errors |
| `node studio/tools/vo.mjs <slug> [--check]` | voice-over: words vs window per line (SPARSE/DENSE), writes `voice/script.md` |
| `node studio/tools/metadata.mjs <slug>` | `youtube/metadata.md` from META + chapters |
| `node studio/tools/thumbnail.mjs <slug>` | `youtube/thumbnail.png` (1280×720) from THUMB |
| `studio/tools/finish.sh <slug> [--audio-only\|--skip-export]` | export → review → share copy → preview → vo → metadata → thumbnail → web copy |
| `studio/tools/web-copy.sh <slug>` | `renders/<slug>-web-720p.mp4` (~13 MB) and `<slug>-1080p.part<N>.mp4` (< 15 MB each) for the dashboard |
| `node studio/tools/outputs.mjs <slug> <videoId> <thumbId> [partIds…]` | `renders/outputs.json`, the dashboard's `outputs/<slug>` doc |
| `node studio/tools/status.mjs <slug> <stage> "<what>" "<why>"` | local status mirror |
| `node studio/tools/cleanup.mjs [--dry-run]` | archive sources, delete generated files of finished videos |
| `node engine/animate/tools/still.mjs videos/<slug> 3,40 out.png --scale 0.5` | look at specific frames |

## Rules that always hold
- Requirements: Node 18+, Playwright Chromium (`/opt/pw-browsers` in cloud sessions), ffmpeg. For the hand lettering install
  Comic Neue if missing (`apt-get install -y fonts-comic-neue`); without it captions fall back to a serif.
- Deterministic drawing: `RNG(...)` and `B`/`TT`, never `Math.random()` or the clock. Don't fade kit textures with globalAlpha.
- Facts are checked; claims are hedged where science is uncertain ("could", "about").
- Never wait on a background job with `pgrep -f <pattern>` loops: the loop matches its own command line. Use `run_in_background`
  and the completion notice, or `until [ -f <file> ]`.
- Files over 30 MB can't be sent: send the share copies (finish.sh makes them).
- Generated files never go into git (`.gitignore`); sources, scripts, metadata and learnings always do.
- Commit and push to the working branch after each video and after the learning step.
