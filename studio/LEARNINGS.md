# Learnings

What past videos taught us. **Read before every batch; append after every batch** (newest batch on top).
When a lesson is general, also turn it into code (library, channel kit, tools, template) and say so here.

---

## Batch 1 (Oct 2026): internet history, why the sky is blue, what if the Moon disappeared (+ AI history 16:9, octopus hearts)

### What the user liked
- The channel look: a cut-paper scene on the left, a paper explainer card on the right with diagrams and numbers that pop in
  with the voice, the year/step tag on the card's edge. Keep it as the channel's identity in every style.
- One small hero per video that carries the story (Pip the envelope, Ray the sunbeam, Luna and Earth).
- A 2.5 s silence before the payoff, then the loudest hit and a hard cut.

### What to improve (user feedback)
- **Voice-over left gaps.** Lines averaged 1.7 words/s against windows a narrator fills at ~2.7. Now: write each line to
  ~2.7 words per second of (d − 0.9 s); `vo.mjs --check` flags SPARSE/DENSE lines. Windows are 0.4 s after the scene starts
  to 0.5 s before it ends.
- **Characters, sfx and music need more polish.** Done so far: library hero with arms, blink and squash; full-body person;
  score motif per video, soft kick under groove/full, risers into scene changes, a downlifter after the payoff.
  Next: characters that react (look toward what pops in), more varied sfx (paper rustle on pops, whooshes matched to motion),
  chord progressions that change per section, a short outro sting with the motif.

### Craft rules (proven)
- Story: a true process or timeline, one step per scene, a turn, a 2.5 s silence, the payoff, an ending that calls back to
  the opening (Turing's page, the 1969 lab, the meadow, the village).
- Loudness arc: the payoff scene must be the loudest act. Give it mood `full`; give the scene before the silence `groove`
  (not `full`), and keep sfx like `thud` out of other scenes (a thud at 71 s became the loudest moment once).
- The music swells back when a narration window ends: if a section's music ends right after a window, end it before the
  window closes or the release becomes the loudest moment (seen at 1:42.5 in the AI video).
- Dead beats: every scene needs constant small motion (bob, drift, birds, bubbles, waves, blinking lights). The tool flags
  > 3 s with nothing new; fix with ambient motion, not more text.
- Text: the card is the place for words; drop duplicate captions on the scene. Year tags belong on the card's top edge.
- Thumbnails: a real frame + a big hand-lettered hook on a torn panel over the card side. The character mid-reaction
  (the Moon mid-gasp) beats an empty or abstract frame.
- Facts: hedge where science is uncertain (the Moon's tilt effect: "could"); quote dated sources (ITU 2024).

### Pipeline lessons
- Long videos (25+ min): frames on disk need ~1.3 MB each; stream frames into ffmpeg per worker instead (see git history of
  the last-human piece for the approach), and pull the score out of the page in slices (a 28-minute WAV is too big for one string).
- Export takes ~4 min for frames and ~8 min for audio + stems per 2-minute video on 4 CPUs.
- Don't wait with `pgrep -f` loops: they match themselves and never end.
- Files over 30 MB can't be sent to the user: always make the 2-pass ~1.75 Mbps share copy.
- Re-render audio only (`finish.sh --audio-only`) when just the mix changes: ~8 min instead of ~15.
- The engine's build tool takes relative piece paths only.

### Style notes
- cut-paper: proven on all batch-1 videos. Its kit gives `cut`, `tag`, `face`, `person`, `mug`, `plant`, `clock`, `spark`.
- Other styles (riso, math, pixel, isometric, sketchbook, crosshatch) build and render with the channel kit (tested with the
  template). Their kits have their own drawing helpers; read each STYLE.md before the first video in that style.
