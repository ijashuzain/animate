# animate pieces

Videos made with the [animate](https://github.com/cth9191/animate) Claude Code skill: procedural cut-paper animation drawn in code and rendered to MP4.

## pieces/octopus-hearts: Why Does an Octopus Need Three Hearts?

16:9, 81 seconds, cut-paper style. The music and sound effects are composed in code. Bloo, a drop of blue (copper) blood, is carried through the octopus by its three hearts.

- `voice/script.md`: the narration script, with the time window for each line (record it in ElevenLabs, one file per line)
- `src/`: the scenes, props, bridges (shape morphs) and score
- `piece.json`: format and build settings

### Build and render

Requires Node 18+, Playwright with Chromium, ffmpeg, and the animate skill (`SKILL` below is its path).

```bash
SKILL=~/.claude/skills/animate
node $SKILL/tools/build.mjs pieces/octopus-hearts          # -> pieces/octopus-hearts/index.html (open it to preview)
node $SKILL/tools/export.mjs pieces/octopus-hearts         # -> renders/final.mp4, stem-music.wav, stem-sfx.wav, narration.srt
node $SKILL/tools/review.mjs pieces/octopus-hearts         # measured checks + contact sheets
```

### Adding the voice inside the tool (optional)

Instead of editing the voice in afterwards, put the takes in `voice/` (`open.mp3`, `why.mp3`, …, matching the ids in `src/head.html`),
write `voice/script.json`, run `node $SKILL/tools/voice.mjs pieces/octopus-hearts`, add `"voice": { "file": "voice/voice.wav", "music": -12 }`
to `piece.json`, then export again. The music is then ducked under the voice automatically.
