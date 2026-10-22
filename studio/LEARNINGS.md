# Learnings

What past videos taught us. **Read before every batch; append after every batch** (newest batch on top).
When a lesson is general, also turn it into code (library, channel kit, tools, template) and say so here.

---

## 2026-10-22: film 2 "How a Volcano Builds an Island" (the fixed camera), storyboard notes
- **The user: "this fish is going backward (I notice the same in some previous videos)"**: a whale (and the raindrop
  film's whale and fish school) moved left while drawn facing right. Rule in CLAUDE.md: creatures face the way they
  travel; Nature.whale now takes `dir`. Raindrop source fixed too.
- **The user: "What's the blue thing on the crab?"** A nightcap drawn as a flat floating shape read as a blob. Rule: a
  prop must read in a small still; when in doubt leave it out (closed eyes + z's already say "asleep").
- **The user disliked the camera-on-a-tripod framing** (a sub placing a camera at the start, a second camera at the end):
  "start and end the story with a different hook". Now a rewind hook (the finished island, then time runs backwards to
  the empty sea floor) and a callback ending ("just a blink, for a planet"). Rule: don't build the frame device into the
  story (cameras, viewfinders, REC); let the film show the thing itself.

## 2026-10-21: film 1 "The 10-Day Trip of a Single Raindrop" (Drip's road trip, 117 s)
- **The user: "But I need 1080p"** (the draft went out as a 720p share copy). Rule: always deliver 1080p; film.mjs final
  now makes a 1080p copy under 30 MB itself (-tune animation, CRF 24 up to 33; the 117 s draft was 16.8 MB at CRF 25).
- **The user asked for my own named weak spots to be fixed** ("with fixes"), so the self-review list is the to-do list:
  coast as a block -> a shaped beach and the river running into the sea; a sparse surface -> island, sailboat, gulls,
  flying fish, steam; a muddy flashback -> warm bright sepia with a sun and a lake; outlined cloud blobs -> one soft
  shape (underside + body + highlight); identical molecules -> sizes, tints, sleepy ones, hats, glasses. All now rules
  in CLAUDE.md "Quality bar".
- **The user: "I don't like that stamp things"** (the passport stamps that slammed in and flew to a corner badge). Removed:
  numbers now sit in calm pills next to the action (`P.pill`, with an icon), and the twist is a glowing loop Drip laps
  faster and faster while the years spin up. Rule: no rubber stamps, badges or HUD collectibles; facts live in the scene.
- **The user asked for a verification step**: "send me all the major scenes snapshot as a single image so I can refer it and
  ask you to do the changes before generating entire video". Now step 7 of the flow: `film.mjs <slug> board` makes one
  numbered storyboard image (film.json `board`); send it and wait for notes before the draft render.
- **Dinosaur, the user's reference** (a sheet of flat cute dinosaurs): animals seen from the side get a side-view face, not a
  front-facing face on a side-view head: a smooth head that flows out of the neck, one eye with a highlight, a thin
  smile, a nostril, a pale underside along the neck and jaw. Now `Cast.profileFace` in kit/cast.js. Rule: when the user
  sends a reference, match its construction (silhouette, face placement, details), not just its colours.
  Follow-up ("what is this red brown thing on face?"): an open mouth drawn as a dark wedge read as a blob hanging off the
  jaw. Fix: no open mouths on simple flat characters (a closed smile), and clip face features to the head's outline.
- What worked: a character made of the subject (a water molecule with hydrogen ears), a passport stamped at each
  stop (a running gag that also carries the numbers), scene joins as camera moves (dive into a drop, rise, fall, slide).
- Gotchas: never read a value computed in the previous frame (a zoom target) - frames render out of order; compute it
  from t. Scene cross-fades need an offscreen layer (`P.layer`), because helpers set globalAlpha themselves.

## 2026-10-21: the rebuild and the pilot "Seed to Giant" (the user: "This look amazing")
- **What worked:** one continuous shot with a single idea (the camera falls with the seed, then rides the growing tip);
  a gag per line (the sleeping cone, a whale balancing on its tail, a cat on the roof); real-scale objects passing as
  the camera zooms out (`K.logTrack` for zooms: equal ratios feel like equal speed); a fire flash hiding the change from
  millimetres to metres; a score with a sound for every action. Draft render of 30 s: ~80 s (the old pipeline: ~25 min).
- **The user's follow-up: "Fix weak spots also in upcoming videos".** The weak spots I had named, and the fixes (now
  rules in CLAUDE.md "Quality bar"): simple faces -> `kit/cast.js` (faces with lids, highlights, brows, mouth moods;
  a person rig with poses and look-at); an empty fall -> branches rushing past, burning needles, ash at several depths;
  plain grey pebbles -> soil strata, shaded stones, roots, a worm; a small-looking hero at the end -> a grander crown,
  the tower moved aside, a sun behind the tree.
- Gotchas: a camera pan must scale with the zoom (pan in fractions of the visible height), or a tight shot pans the
  subject out of frame; `K.ease.backOut(0)` is 2e-16, not 0, so guard starts with `t < t0`; arm angles: one sign
  convention for both arms (positive = outward), or one arm folds across the body.

## 2026-10-21: the user asked for a full rebuild (decisions, before any code)
- **The user's verdict:** "completely disappointed" with the animation, the explanation, the visual style, the
  presentation and the workflow. All four pain points were picked: it looks cheap/basic, feels static, the explanation
  is unclear, and the workflow is too slow and opaque.
- **Target:** Kurzgesagt (rich flat vector worlds, constant camera motion, dense visual metaphors).
- **Artwork:** open-licence SVG packs AND drawing our own.
- **Rollout:** a full rebuild of the engine, styles and workflow. **First, analyse and learn completely from a YouTube
  tutorial the user will share.** The user wants a structured workflow and quality output.
- **"No more same style of presentation and animations with just topic and assets and element changes. I need more
  creative."** Every video gets its own visual idea, metaphors, shot design and motion; the template-swap approach is over.
- Diagnosis (mine): slideshow structure (10 scenes x 12 s, pop-ins), text doing the explaining (the right half of every
  frame), hand-coded primitives as a quality ceiling, checks that measure rules and not watchability, no storyboard,
  and no fast preview before a 25-minute render.

## The user's taste, in one place (from every conversation so far; update it whenever they react)
What they asked for or liked:
- **Soft, friendly flat vector** (their references: Headspace-style blobs, tone-on-tone rooms, a flat autumn landscape):
  no outlines, one hue family per scene, round shapes, a warm hero colour. `CHANNEL.look = 'soft'` is the default start
  (new-video.mjs gives flat videos the soft template).
- **Alive but calm:** parallax depth, gently animated detailed assets (trees sway, clouds drift, fish swim, smoke rises).
- **Fonts chosen per topic** from Google Fonts, matched to the scene's colours.
- **Peekaboo-style technique:** zoom-in lenses, cutaways, pointing labels, a sound per action.
- **Variety:** a different format, genre and transition set per video; 10 topic ideas to pick from.
- **Quiet music** (about 70% lower than composed); the voice leads.
What they disliked (each one came back as a complaint):
- **Busy texture behind words** ("not readable... you see the background"): halftone, hatching, grain.
- **Wobble/boil** on every line, and **grainy** colour (halftone dots, pencil fills) "used a lot".
- **The notepad/card** for the explanation: letter straight onto the scene.
- **The first flat visuals** ("not satisfied"): hard outlines and generic shapes read as clip art. The soft look replaced them.
- **An unreadable thumbnail:** light-outlined thin letters on a mid-tone scene.
How they give feedback: short notes plus screenshots/reference images. YouTube links can't be opened here, so ask for
screenshots. They don't answer every question (e.g. storybook grain): keep going on the safe default (their rules).
Working rule from this: **when the look changes, show a contact sheet or a 2-3 frame preview before the full render**
(one render costs ~25 minutes; a sheet costs one).

## Soft look (Oct 2026): the user's visual references
- **User feedback: "I am not satisfied with the visuals"**, with references: Headspace-style blob characters with noodle
  limbs, tone-on-tone flat vector rooms, a flat autumn landscape (round trees, cones, layered hills), a TV cartoon.
  Answer: `CHANNEL.look = 'soft'` in the flat kit. No outlines by default (fSoft), tone-on-tone palettes (fTint/fMix),
  fBlob characters (body pill/bean/ball/tall; pose stand/walk/wave/cheer/point/sit; mood; hair; extra callback),
  fNoodle limbs, fTreeRound, fCone, fBush, fHills (parallax ridges), fLeaves, fGlow. Firefly video rebuilt as the proof.
- Palette rule for soft night scenes: everything in one hue family (purples), and the hero in a warm complementary
  colour (orange #ff8f5e). The first try had a purple hero on a purple night: it vanished.
- Keep moving characters out of the lettering column (x < 1000): a flying bug drifted into the text at 1100.
- **User feedback: the thumbnail was "not readable".** Cream-outlined white Comic lettering on a mid-purple scene had no
  contrast. thumbnail.mjs now uses the video's title font (CHTF) at weight 800 with a thick dark outline (THUMB.ink) and
  a soft dark wash behind the words (THUMB.shade). Zoom covers the whole frame (no seam at x 1000), and scene labels
  (fLabel) hide in thumbnails. Pick THUMB.t at a moment when the hero is lit and doing the hook's action.
- Not done yet (asked, unanswered): the textured storybook grain. Default stays grain-free (the user's rule).

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
- `engine/animate/tools/still.mjs` used to read a stale index.html (cost an hour in batch 3 and again on the firefly
  colour). Fixed: it now rebuilds a piece dir before rendering (`--no-build` to skip).
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
- **No wobble, no grain** (feedback on the riso sea frames): the boil (every line re-wobbled 12x a second) is now off for
  channel videos (`BW` = the wobble seed, 0 unless `CHANNEL.boil`); B still drives timing (blinks). The halftone/grain
  look was "used a lot" and not liked: new style **flat** (engine/animate/styles/flat) built from the Peekaboo notes:
  flat colours, clean dark outlines, one-step cel shading, no texture; `fShape` uses straight edges (core `trace()`
  rounds every corner, which turned a glass into a capsule). Batch 4 uses flat for all three videos.
- **Parallax and living assets** (the user's next note): flat kit `fLayer(depth, fn)` slides far layers less than near
  ones as the scene drifts; detailed, gently animated assets: fMountain (lit/shade sides, snow cap, ridges), fTree and
  fPine (sway), fCloud2 (drifts), fBirds (flap), fSea2 (two swells, crests, sparkles, depth), fFish (tail wag, fin,
  bubbles), fVolcano (smoke puffs, glowing lava), fTufts. Keep drifting things on the scene side (x < ~1000): clouds
  wrap within 1350 px in channel videos so nothing passes under the lettering.
- **Fonts per topic** (the user's note): Google Fonts in studio/fonts (from raw.githubusercontent.com/google/fonts),
  installed for the renderer by studio/tools/fonts.sh; channel lettering takes `CHANNEL.font` / `titleFont` / `labelFont`.
  Sea video: Fredoka (headings, labels) + Nunito (reading lines).
- Dead beats in the flat style: gentle sway/drift alone measures as "still" (mean pixel change < 0.8 over 0.5 s) because
  flat areas don't change. The first render had 3-5 stretches per video (one at 13-21 s, right at the viewers' leak).
  Plan a visible beat every ~3 s (a pop, an entrance, a label, a jump); dark scenes need bigger or lighter movers.
- The two LoopyLuci animation skills the user suggested were empty boilerplate (generic package/test advice, no
  animation content); removed.
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
