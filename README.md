# Animate Studio

A small studio for making animated YouTube explainers entirely in code. Claude runs it: you ask for topics, pick up to three,
and get back finished videos (16:9, about 2 minutes) with a timed voice-over script for ElevenLabs, YouTube metadata with
chapters, and a thumbnail. Progress shows live on the [studio dashboard](https://claude.ai/artifact/N1dKeyKqmYkGV63YzWXZLw).

- **How it works, step by step:** [CLAUDE.md](CLAUDE.md)
- **What it has learned so far:** [studio/LEARNINGS.md](studio/LEARNINGS.md)
- **Topics made and suggested:** [topics/log.md](topics/log.md)

```
engine/animate/   the animation engine (vendored from github.com/cth9191/animate, MIT licence in engine/animate/LICENSE)
studio/           the channel layout, characters, templates, tools, dashboard, learnings
videos/<slug>/    the current batch, one folder per video (generated files are removed before the next batch)
archive/<slug>/   finished videos' sources, kept small for learning
topics/           the topic log
```

Requirements: Node 18+, Playwright with Chromium, ffmpeg, and the Comic Neue font for the hand lettering.

Quick start for a video by hand:
```bash
node studio/tools/new-video.mjs why-cats-purr "Why Do Cats Purr?" cut-paper
# write videos/why-cats-purr/src/script.js and src/scenes.js
node studio/tools/smoke.mjs why-cats-purr          # look at videos/why-cats-purr/review/sheet.png
node studio/tools/vo.mjs why-cats-purr --check     # the voice-over fills every scene
studio/tools/finish.sh why-cats-purr               # render, check, package
```
