# Learnings

What past videos taught us. **Read before every batch; append after every batch** (newest batch on top).
When a lesson is general, also turn it into code (library, channel kit, tools, template) and say so here.

---

## Batch 3 (Oct 2026): Earth stops spinning (riso, what-if, ambient), why we dream (sketchbook, question chain, lofi),
## who killed the dinosaurs (crosshatch, mystery, mystery)

### Pipeline lessons
- **User feedback (Earth, riso): "not readable and visually bad for eyes because you see the background".** The full-frame
  halftone field sat behind the lettering. Fix: riso `calmField(top, bottom)` lays the inks flat on the paper (grain, no
  dots); dots stay on the globe, sun and hero. Now a rule in CLAUDE.md: calm, flat backgrounds wherever text sits.
- Side effect: the halftone field had been "moving" (the dots shimmer as the camera pushes), which hid 4 still stretches.
  With calm fields, motion has to come from the story: turning sun rays and drifting clouds, meridians that sweep while
  Earth spins and stop as the spin fades, water chevrons flowing to the poles. `calmField(top, bottom, box)` also takes a
  box (the night half of the frame).
- The subtitle preview of a riso video came out 38 MB (halftone compresses badly); finish.sh now caps it at 1.5 Mbps.
- `engine/animate/tools/still.mjs` does NOT rebuild index.html: after editing sources run smoke.mjs or build.mjs first,
  or you debug a stale page (cost an hour on a "bug" in the riso day scene that was already fixed).
- Riso: plates ignore ctx transforms (rotate points yourself); bold print lettering reads over halftone only at weight 700,
  so CHANNEL.weight sets a default weight for the whole video.
- Crosshatch: put the clue-card tag above the title (y ~82, size 44) or it overlaps.
- package.mjs now scores the opening up to ~9+ words (a short first sentence plus its follow-up), not just sentence one.
  Spoken hooks score higher with: "you" early, a stake word (die, never, lost), a number, under 24 words.
- package.mjs now scores the WHOLE first voice line (the hook scene), exactly like the candidates. Scoring only the first
  sentence gave 44-47 for lines whose full text scored 68. Write the first line as one of the META.hooks candidates.
- Openings that score: question formula + "you" + stakes ("Earth is spinning you east at more than one thousand
  kilometres an hour. If it stopped suddenly, you'd be flung sideways and die in seconds. What would really happen?" = 68).
  Keep the facts exact anyway: "more than 1,000 km/h" is true for anyone below ~50 degrees latitude; 1,670 is only the equator.
- textcheck flagged ~30 "overlaps" in the sketchbook video: hand lettering draws one glyph at a time and neighbours touch.
  The checker now ignores pairs of single glyphs.
- Score bug (all genres): each scene's note loops ran 0.05 s past the cut, so on scenes starting on an even second the old
  scene's timpani/kick and the new scene's first one landed together (+6 dB): the loudest moment of the dinosaur video
  was a scene change, not the payoff. Note loops now stop at the scene boundary.
- Score bug: the genre texture (the mystery drone) ran under the whole video, so the 2.5 s hush sat at -21 dB instead of
  near silence. The texture now stops for silence scenes.
- The default camera was a sine swell (1 -> 1.035 -> 1), which stands still mid-scene, exactly where crosshatch got
  6 dead beats. It is now a steady push (CHANNEL.push, default 0.06 per scene).
- Earth map scene: 3.5 s with nothing new between two lettering beats. When a scene's lettering pauses for > 3 s, give the
  picture a slow change (here the polar oceans swell over the scene).

### New tool: machines (from wheresryan22/anatomy, MIT)
- The user asked for a way to draw complex things. We vendored anatomy's geometry kit (iso-kit, lathe, tube) into
  studio/vendor/anatomy and wrote studio/library/machines.js. Its solids come back as SVG path strings, which we paint
  with Path2D in the piece's palette (`anPal(paper, ink)`), so machines match the style.
  Demo: studio/demos/machine (a pump with a flywheel, piston, gauge, pipe and spring, all moving from TT).
- Animate by recomputing parts from TT: `spokesOf`/`ribsOf` take `phase`, a piston is a cylinder whose height
  changes, a needle is a line to `pointOf(frame, s, r, angle)`. Order the parts with `anDraw` (anchor = a corner nearest the viewer).
- `coil` only runs along x or y (not z). `ringBand` fills its hole; draw spokes on top for a wheel.
- The build forbids URLs, so the bundle drops iso-kit's SVG/HTML writers. Regenerate it with anatomy-bundle.mjs.
- Best fit: isometric (as is) and crosshatch (`anPaint(..., { tex })` hatches inside a solid). Next "how it works"
  topics this opens up: engines, locks, toilets, pumps, clocks, cameras.

---

## User requests (2026-10-18)
- Suggest **10** topics, not 6 (CLAUDE.md step 2, the dashboard button and its prompt).
- **Background music 70% quieter.** score-head: the music bus runs at `MUSIC_LEVEL` (0.25, measured -9.7 dB on the
  machine demo after the master compressor; SCORE.musicLevel overrides). The loudness stage now normalises with the gain
  of a full-music reference render, otherwise the -17 dBFS RMS normalise would push the quieter mix back up.
- Study **Peekaboo Kidz** (Dr. Binocs) for animation technique, not narration: studio/references/peekaboo.md.

## Viewer data (Jist of Stories, via Windsor.ai)
- **2026-10-18 (last 90 days; 29 subscribers, 6 public videos, 197 views):**
  | video | views | avg view % | avg s | subs |
  |---|---|---|---|---|
  | The Internet's First Word Was "LO", Then It Crashed (cut-paper, timeline) | 102 | 16% | 18 | +2 |
  | What If the Moon Disappeared Tonight? (what if) | 34 | 20% | 19 | +1 |
  | 1 Bee, 6 Weeks, 1/12 Teaspoon: How Honey Is Made (sketchbook) | 23 | 18% | 12 | 0 |
  | Why Is the Sky Blue? | 22 | 14% | 12 | 0 |
  | How 1 Shot Trains Your Body for Years (cut-paper) | 5 | 46% | 60 | 0 |
  | GPS Is 10 km Wrong Without Einstein (isometric) | 2 | 5% | 0 | 0 |
  Traffic: subscribers 115, channel page 50, related videos 8, other 6, search 5. Almost everything comes from the
  existing audience; search and suggested barely work yet.
  **Biggest leak: the hook.** People watch 12-19 s of a 2-minute video, so most leave during the first scene.
  Rules from this: the first 5 s must show the payoff image and say the strangest true fact (the "LO" title won);
  titles with one concrete odd detail beat "explained" titles; make the Shorts (they reach non-subscribers) and ask the
  user for a Studio retention export of the internet video to find the exact second people leave.
- 2026-10-13: connected. Channel snapshot: 25 subscribers, 3 public videos, 0 views reported; no per-video analytics
  rows yet in the last 2 years (new channel or a reporting delay). Re-check after the next uploads.

---

## Before batch 3: the user's suggestions, built in
- **Vary the music and sfx by topic and style.** score-channel.js now has 8 genres (SCORE.genre) with their own key,
  chords, instruments (e-piano, pizzicato, marimba, bells, square, saw, guitar), drums, swing and texture (vinyl, air,
  drone); moods set the energy inside a genre. SFX kits follow the style (paper taps, pencil, digital, 8-bit) plus topic
  cues (buzz, drip, coin, tick, flip, shutter). Hear them: `sampler.mjs`. Research: keep music under the voice, no busy
  lead; genre by topic (lo-fi/electronic for tech, ambient for wonder, acoustic for stories, dark for mysteries).
- **Not always "step 1, step 2".** studio/formats.md lists 11 narrative formats with their tags, lettering helpers
  (stamp, rank, timeline, versus, meter, clue in channel.js), genres and transitions. A batch uses three formats.
- **Transitions that match the topic.** studio/channel/transitions.js: 20 kinds (shape with topic shapes, zoom into an
  object, hex/square/triangle tiles, wipe with torn/wave edges, push, whip, slideOver, pageTurn, clock, doors, blinds,
  pixel, ink bleed, shutter, scatter, spin, fade, dip, flash) + the old morph, each with its own sound. Engine hook:
  morph.js renders both scenes and calls the bridge's fx. Rule: the transition comes out of something on screen.
- **youtube-agent-skill (MIT) brought in** (studio/vendor/yt-agent): hook scoring + 21 hook formulas, the title/thumbnail
  linter, the retention reader. First run on batch 2 found real problems: titles 77-83 chars (YouTube cuts at ~60),
  thumbnails repeating title words, every opening line WEAK (34-42: no stakes, numbers spelled out), no target searches.
  Fixed batch 2's packaging (titles 37-48 chars, 3-word thumbnails, hooks to 69-72, 3/3 searches). The scorer counts
  digits, so package.mjs converts spoken numbers first. Rules now in CLAUDE.md step 6 and studio/voice.md.
- Lab reel (videos/lab-reel) shows every transition; its genre samples are in renders/genres.mp3.

---

## Batch 2 (Oct 2026): GPS (isometric), vaccines (cut-paper), honey bees (sketchbook)

### What the user asked for
- **No notepad/card.** "Directly write things, draw things, animate things in the main video; blend the explanation with it."
  Done in code: channel.js layout 'open' (the default). The explanation is lettered straight onto the scene in the style's
  own type (CHANNEL in each scenes.js); scene backgrounds and floors must span the full frame (W), not stop at x 990.
  Busy backgrounds get a soft halo behind the lettering; dark scenes set `dark: true` for light ink.

### Pipeline lessons
- Thumbnails: no paper panel either (same rule as the video). thumbnail.mjs hides the on-scene lettering (NO_LETTERING)
  and writes the hook lines big with a thick cream outline and a soft shadow straight onto the frame.
- The score's arc is now built in: the payoff ('full') plays ~2 dB up and the last scene ~7 dB down. All three videos
  passed the story-arc check 6/6 after this (before: the goodbye never decayed 6 dB below the gift).
- A 2:15 video at 1.75 Mbps was 32 MB (too big to send): finish.sh now picks the share-copy bitrate from the duration.
- The dead-beat check works on tiny downscaled frames: hairline styles (isometric) read as "still" even when things move.
  A slow camera push did not change that. For isometric, judge motion by eye, or add bigger moving shapes (filled slabs,
  wide rings) on purpose; don't chase the number with fake motion.
  Checked by eye on GPS (t 54/58/63): circles, satellites and the bot all arrive while the check said "still".
- Thumbnail frames: pick the most graphic moment (Earth + satellites), not a sparse diagram; a plain grid read as empty.
- A container restart kills background renders: re-run finish.sh; sources were safe because they were committed first.
- First real videos in isometric and sketchbook: both work with the channel kit. The sketchbook marker font fell back to a
  serif on Linux; fixed in the kit (Comic Neue before the generic cursive).
- Easing names in core are EZ.o2/o3/i2/i3/io/back (not EZ.out / EZ.in).
- Isometric worlds need u ≈ 0.7 for big ground plates in a 990-wide area; satellites/objects read better large (s ≥ 0.7).

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
- Dashboard outputs: artifact asset uploads cap at 15 MB per file, so the page gets a 2-pass ~790 kbps 720p copy (~13 MB),
  for playback; the 1080p share copy goes up byte-split (`split -b 14500000`) and the page joins the parts into one Blob
  on download (verified byte-identical; downloads have no 15 MB limit). Test the page with a mocked `window.claude` served through `page.route` (addInitScript
  doesn't run on `setContent`).

### Style notes
- cut-paper: proven on all batch-1 videos. Its kit gives `cut`, `tag`, `face`, `person`, `mug`, `plant`, `clock`, `spark`.
- Other styles (riso, math, pixel, isometric, sketchbook, crosshatch) build and render with the channel kit (tested with the
  template). Their kits have their own drawing helpers; read each STYLE.md before the first video in that style.
