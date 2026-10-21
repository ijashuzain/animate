# HyperFrames digest (for Jist of Stories)

A condensed reading of the installed HyperFrames skills, written for building narrated ~2-minute
explainers. Every section names its source files so you can look up the details. `SK` = `/root/.claude/skills`.
Notes marked **(ours)** are our own inference for this studio and are not taken from the docs.

---

## 1. Framework rules we must follow

Sources: `SK/hyperframes-core/SKILL.md`, `references/{minimal-composition,data-attributes,determinism-rules,sub-compositions,variables-and-media,full-screen-motion}.md`, `SK/hyperframes-animation/adapters/gsap*.md`, `SK/hyperframes-studio/SKILL.md`.

**Structure**
- Standalone `index.html`: the root `<div id="root" data-composition-id="main" data-width="1920" data-height="1080" data-duration="120">` sits directly in `<body>`. It has no `<template>`; wrapping it in one is a lint error. Give `#root` a width and height of 100%, not hard-coded pixels.
- Root `data-duration` sets the render length. It is fixed at compile time; a longer timeline is cut off, a shorter one holds its last frame. Do not pad with `tl.set({}, {}, T)`. Optional `data-fps` (render flag overrides).
- A clip is any element with `data-start`. `data-duration` is required on divs and sub-compositions. The visibility window is half-open, `[start, start+duration)`, so land the end state slightly before the end. Write `class="clip"` on visual clips, but never on `<audio>`/`<video>`. `data-track-index` is only a Studio lane and does not affect rendering.
- Root-level clips are auto-positioned as `absolute; top 0; left 0`. An untimed shared background must set its own `position:absolute; inset:0`, or it collapses to 0 px. The pattern: one shared `#bg` layer driven by the timeline, with transparent scene clips on top (`full-screen-motion.md`).
- Studio rule (`hyperframes-studio/SKILL.md` §1–4): one sub-composition per scene; captions on one host with `data-track-kind="captions"`; captions inside title-safe (10% inset).

**Timeline registration**
- Each composition has exactly one `gsap.timeline({ paused: true })`, registered as `window.__timelines["<data-composition-id>"] = tl`. Register it last, after every tween is added, which may be at the end of `document.fonts.ready`. Registering early is the lint error `gsap_timeline_registered_before_async_build`. Never call `tl.play()`.
- Sub-compositions are wired as a host `<div data-composition-id="s03" data-composition-src="compositions/s03.html" data-start=".." data-duration="..">`. Inside the file, the `<style>`, markup and `<script>` all go inside `<template>`, because `<head>` is discarded. Style the root as `#root`, never by class. The host id, the inner id and the `__timelines` key must all match; a mismatch is silent and causes a 45 s timeout followed by a frozen render. Don't `master.add()` child timelines, because the runtime seeks them itself. Inside sub-comps use `fromTo`, never `from`. A sub-comp timeline cannot reach host elements.

**Determinism** (`determinism-rules.md`)
- Banned: `Date.now`, `performance.now`, unseeded `Math.random`, network at render time, hover/scroll/input, timers, unregistered `requestAnimationFrame`, and bare `gsap.to()` outside `tl`. A standalone tween runs on wall-clock time and is missing from the render.
- `repeat:-1` is allowed only under a finite root `data-duration`. Otherwise use `repeat: Math.max(0, Math.floor(dur/cycle) - 1)`.
- Never tween `display`/`visibility`/`autoAlpha` on a `.clip` (`gsap_animates_clip_element`); animate a child instead. Don't add scene-exit `visibility:hidden` sets, because the runtime hides clips itself.
- Don't pair a CSS `transform` with a GSAP transform tween on the same node (`gsap_css_transform_conflict`). Center with flex/inset and set the start state inside `fromTo`.
- Animate `x/y/scale/rotation/opacity`. Layout properties (`left/top/width/height/fontSize/letterSpacing`) snap to whole pixels per frame and stutter on slow tails (`gsap-transforms-and-perf.md`).
- Don't let two concurrent tweens write the same transform on one element: they kill each other silently. Split the motion across a parent and a child, or merge it into one `fromTo` (`hyperframes-creative/references/motion-principles.md`, "Load-bearing GSAP rules").
- Precompute layout constants once at setup. Never call `getBoundingClientRect()` inside tweens.
- No `<br>` in body text; transformed elements must be block-level and sized.

**Assets, fonts, media**
- Fonts: 18 families are pre-bundled offline. (Montserrat, Oswald, League Gothic, Archivo Black and the monos are the non-generic ones). Other Google fonts are fetched at build time with a `font_family_without_font_face` warning. Safest is a local `@font-face` pointing to a shipped woff2, which fits `studio/fonts` (`hyperframes-creative/references/typography.md`).
- `<audio>` must have an `id`. Without one it is never mixed, so the render is silent (`media_missing_id`). Never put `crossorigin` on media. Never call `play()/pause()/currentTime`, because HyperFrames owns playback. Don't nest `<video data-start>` inside another timed plain element. Silent video gets `muted`.

**Commands and what they catch** (`SK/hyperframes-cli/SKILL.md`, `references/lint-validate-inspect.md`, `preview-render.md`; `SK/hyperframes-keyframes/SKILL.md`)
- `npx hyperframes lint` is a fast static check. It catches id/timeline mismatches, transform conflicts, missing audio ids, clip-visibility tweens, missing `@font-face`, and infinite repeats.
- `npx hyperframes check` is the final gate and runs lint first. If lint has errors, the browser is skipped and the "0 samples" result means nothing ran. It reports runtime JS errors and failed requests, layout problems (text overflow, held overlaps, clipping), WCAG contrast (with a suggested colour), and `sweep_static` (no visible change over 3 s+). Flags: `--snapshots`, `--samples 15`, `--at 1.5,4`, `--at-transitions`, `--strict`. Silence intentional cases with `data-layout-allow-overflow`/`-overlap`/`-occlusion` or `data-layout-ignore`, scoped as narrowly as possible.
- Motion intent: put a `*.motion.json` sidecar next to the HTML with `appearsBy`, `before`, `staysInFrame` and `keepsMoving` (default `maxStaticSec` 2 s; failure code `motion_frozen`). **This is our automated "no dead frames" gate.**
- `npx hyperframes snapshot --at t1,t2` or `--range 3:5 --frames 8` or `--composition s03 --frames 8` captures still PNGs. It is required for sub-comps, because mount bugs show up only in the pixels.
- `npx hyperframes keyframes . --selector X --shot f.png --layout strip` proves motion paths, ghosts and poses. `node SK/hyperframes-animation/scripts/animation-map.mjs <dir>` flags dead zones and stagger inconsistencies.
- Render: `--quality draft` while iterating, `looks` for the first real encode (the default, CRF 16), and `delivery` for the final. `--fps 24|30|60` (default 30; 60 doubles the time). Also `--workers N|auto` (about 256 MB of Chrome each), `--crf`, `--docker` for byte-identical output, and `--strict`. Read the second line of the render output: `beginframe` is the fast path, while `screenshot`+`software gpu` is slow. **(ours)** For our channel: 30 fps, draft while iterating, delivery for the upload.

---

## 2. Their creative method, condensed into steps we can adopt

Sources: `SK/hyperframes-creative/references/{story-spine,beat-direction,storyboard-recipe,prompt-expansion,design-spec,design-adherence,house-style,video-composition,narration}.md`.

1. **Strategy line.** Write one sentence: "This video tells [viewer] that [the one true thing]." Every frame's *Why* must trace back to it; if it can't, cut the frame (`story-spine.md` §3).
2. **Hook in outcome language.** The first beat answers "why should I care" with no jargon. The value lands by beat 2, and everything after it is evidence (the "reverse iceberg"). Vary the hook type: claim, question, contrast, or a number (`narration.md`).
3. **Props come from the source.** Mine the research for the subject's own nouns, verbs and metaphors. A prop that could appear unchanged in another video is generic, so replace it (§4). **(ours)** This is where the one visual conceit per video comes from.
4. **Design spec first.** Put a `frame.md` in each video folder with YAML tokens (colours, type, corners, motion easing and durations, atmosphere, transition) plus prose (mood, Do/Don't). Token values are binding; prose guides judgment (`design-spec.md`, `visual-styles.md` for the token shape). Declare background, foreground and one accent before writing any HTML. Use the same background family across scenes (`house-style.md`).
5. **Rhythm declaration.** Name the pattern before building, e.g. `hook-PUNCH-build-build-BREATHE-twist-SILENCE-PAYOFF-callback`. (`beat-direction.md`, "Rhythm Planning").
6. **Per-beat direction** (`beat-direction.md`). For each beat, write:
   - the **concept** as an experience, not pixels;
   - the **mood** as references, not hex codes;
   - **choreography**, with a verb for every element (SLAMS / DROPS / SLIDES / WIPES / DRAWS / GROWS / ASSEMBLES / FLOATS / DRIFTS / MORPHS / SNAPS / LOCKS IN — "if you can't name the verb, the element isn't designed");
   - the **transition out**, with type, duration and ease;
   - the **depth layers**: BG / MG / FG, at least 2;
   - **SFX cues**, i.e. which sound lands on which moment.
7. **Expansion** (`prompt-expansion.md`): add atmosphere layers, ambient motion per decorative, object-level transitions ("X expands and becomes Y") and a negative prompt.
8. **Storyboard as stills** (`storyboard-recipe.md`). Pose each shot at its key moment in the real composition and snapshot it: `npx hyperframes snapshot --at <times> --no-end -o boards/stills`. Build a board page (`.frame` > img + `.title` "NN: name" + `.time`) and a `STORYBOARD.md` (`## Frame N: name (a-bs)`). Present it as a proposal: echo line, then the table **Frame | Beat | On screen | Why**, then a style footer, then "approve or adjust". Notes change only those frames. A change costs 30 s here versus minutes after the build. **(ours)** This replaces our sheet.png review step before the ~25-minute render.
9. **Adherence pass** (`design-adherence.md`): every hex, font and Don't checked against the spec, plus the "lazy defaults" list in `house-style.md`.
10. **Video scale** (`video-composition.md`): two focal points, three layers, anchor to edges; heads 64–120 px; radial (not linear) gradients on dark backgrounds, which band under H.264.
11. **Narration** (`narration.md`). Aim for about 2.5 words/s and let the script feel shorter than the video. Write numbers as they should be spoken; the screen can show the exact figure. **(ours)** Keep our 2.7 w/s rule for the user's ElevenLabs reads, but treat 2.5 as the ceiling for dense scenes.

---

## 3. Motion principles and GSAP patterns

Sources: `SK/hyperframes-creative/references/motion-principles.md`; `SK/hyperframes-animation/adapters/gsap-easing-and-stagger.md`, `gsap-timeline-and-labels.md`; `SK/hyperframes-keyframes/SKILL.md` ("Timing", "Keyframe Forms"); `rules/{spring-pop-entrance,press-release-spring,scale-swap-transition,nudge-curve,sine-wave-loop,multi-phase-camera,viewport-change,coordinate-target-zoom,3d-camera-flight,depth-of-field-blur,depth-scatter-assemble,svg-path-draw}.md`; `blueprints/camera-journey.md`; `references/motion-blur.md`; `transitions/{overview,catalog}.md`.

**Guardrails**
- At most 2 tweens share an ease per scene; the slowest scene is ~3× slower than the fastest; vary entry directions; first motion 0.1–0.3 s in.
- Scenes go **build (0–30%) / breathe (30–70%, ONE ambient motion) / resolve (70–100%)**. Exits are faster than entrances; stagger by importance, under 0.5 s total.
- `.out` to enter, `.in` to leave, `.inOut` to move between places. 0.15–0.3 s urgent, 0.3–0.5 s neutral, 0.5–0.8 s grave, 0.8–2 s cinematic.

**Ease names**
- `power3.out` house entrance; `power2.out` secondary; `power4.out`/`expo.out` punch and landings; `sine.inOut` breathing, drift, loops; `expo.inOut` hero swaps; `circ.inOut` camera/orbits; `none` linear camera and path travel; `steps(N)` ticks.
- `back.out(≤2)`, `elastic.out(1,0.3)`, `bounce.out` are "explicitly playful" only. **(ours)** Our cartoon register qualifies; ration to one per scene.
- **Baked spring** `springEase({response, dampingFraction})` (`gsap-easing-and-stagger.md`): seek-safe. ζ=1 smooth, 0.8–0.85 "alive", 0.6–0.7 playful. Use its `duration` and `ease`; overshoot on transforms only, opacity in its own tween.

**Character acting** (no dedicated doc; assembled from the keyframes "Timing" section plus the rules above)
- Anticipation only to clarify cause or direction; follow-through sells energy; overshoot only for elastic things; the final frame is part of the animation (`hyperframes-keyframes/SKILL.md`).
- Pose ladder: `tl.to(el,{keyframes:[{scaleY:0.8,scaleX:1.15,duration:0.12,ease:"power2.in"},{scaleY:1.2,scaleX:0.88,y:-80,duration:0.18,ease:"power3.out"},{scaleY:1,scaleX:1,y:0,duration:0.35,ease:"power2.in"}],ease:"none"},t)`.
- **Squash** (`press-release-spring.md`): linear press to 0.92 over 0.1–0.3 s, spring release over 0.4–0.9 s starting exactly where the press ends. **(ours)** Pivot `50% 100%` for grounded characters.
- **Overlap:** body on a wrapper; head and limbs as children with their own tweens at `"<0.06"`. This is also the fix for two transforms on one node.
- **Holds** (`sine-wave-loop.md`): idle at 0.008–0.015 scale or 2–3 px, period 1.5–3 s, one long `ease:"none"` tween added to the rest pose; amplitude/√N for N idlers.
- **Rigs:** the docs use Lottie (`adapters/lottie.md` → Characters): `autoplay:false`, `window.__hfLottie.push(anim)`, no start offset, feet slide unless `x` matches the stride. **(ours)** For SVG characters, nested `<g>` with `svgOrigin` per joint, never mixed with `transformOrigin`.

**Camera** (one camera only, as a world wrapper)
- `viewport-change.md`: a single `.world` inside `.scene` (`overflow:hidden`, background on `.scene`, never on `.world`). Use one `cam={scale,x,y}` and one writer `applyCamera(){world.style.transform=`translate(${x}px,${y}px) scale(${s})`}`, with tweens on `cam` using `onUpdate:applyCamera`. To centre a target: `T = -offset × S`. Camera moves right means the world moves left.
  - Zoom 1.05–1.15 emphasis, 1.5–2.5 dramatic, over 1–2 s, then dwell ≥1 s. For big reveals build at 1× and open punched-in at 4–12×; never scale the world down.
- `multi-phase-camera.md` gives three phases (pull-back 0.88–0.96 → focus 1.0 → push 1.04–1.15, eased `power2.out`/`power3.out`/`power2.inOut`). It adds a sine micro-drift of 2–8 px horizontally and 1–4 px vertically, with a 1.3 frequency ratio, composed in the same single writer. Never put a spring on a camera.
- **Follow:** the doc's focus-lock reads `getBoundingClientRect` per frame, which conflicts with the precompute rule. **(ours)** Derive `cam.x` from the same proxy that moves the subject.
- **Multiplane parallax:** `3d-camera-flight.md` uses a static `.stage{perspective:800–1200px}` (never tweened) and `.world{transform-style:preserve-3d}`. Layers sit at static `translateZ` depths (props at 80–300 px). `cam={x,y,z,rx,ry}` is written as `translate3d() rotateX() rotateY()`, translate outside the rotations. Keep `.world` clean: any `filter`, `opacity<1`, `overflow` or `clip-path` on it flattens the 3D. Respect the Z budget `cam.z + PROP_Z ≤ 0.6 × perspective`. Use `power4.out` for dives and `power2.inOut` for repositioning.
  - **(ours)** For flat 2D multiplane without 3D, put the layers inside `.world` and multiply each layer's offset by a depth factor in the same writer (BG 0.3, MG 1, FG 1.6).
- DoF (`depth-of-field-blur.md`): tween `--dof` (`filter: blur(var(--dof))`) on non-focal layers, 3–6 px per depth step, ~16 px max, dim ~0.55; refocus before hand-offs.
- `camera-journey.md`: the camera is the storyteller (dive, beat fires, travel to the consequence, land), every leg motivated; `data-layout-allow-overflow` on `.world`. Fits one continuous world per video.

**Transitions between beats** (`transitions/overview.md`, `catalog.md`)
- Every scene change is a transition, but **exit animations are banned**: the transition *is* the exit. Outgoing and incoming animate at the same time T.
- One primary for 60–70% of cuts plus 1–2 accents; the boldest on the climax, the slowest on the outro.
- Match cuts and morphs are not automated ("no matching-frame discovery"). Build them on one subject that persists, with FLIP or a shared element (`keyframes/SKILL.md` "Mechanism Choice"); use `scale-swap-transition.md` (exit `power2.in` 0.3–0.5 s, entry springy 0.45–0.7 s, 0.1–0.2 s overlap, shared `transform-origin`); or use a morph circle (`tl.set(c,{scale:0}); tl.to(c,{scale:30,0.5,"power3.in"})`).
- Velocity-matched: exit `y:-150, blur 30px, 0.33s power2.in` → entry `y:150→0, 1.0s power2.out`. Whip: `x:-400, blur 24px, 0.3s power3.in/out`. Zoom-through: `1→1.2, 0.2s power3.in` → `0.75→1, 0.5s expo.out`.
- Wipes/irises: tween `clip-path` on an inner wrapper, not while it also scales. Avoid star iris, tilt-shift, lens flare, hinge, and repeating tile/hex patterns.

**No dead frames**
- One live element in every hold; `sweep_static` and `keepsMoving` (2 s) catch the rest. The classic trap is a reveal that finishes early; **(ours)** spread reveals across the scratch-script word times.
- Motion blur (`references/motion-blur.md`, `data-hf-motion-blur`) only on 1–3 snap beats; never on text, drifts or parallax.

---

## 4. Drawing, textures, performance

Sources: `SK/hyperframes-animation/techniques.md` (§1 SVG draw, §2 Canvas 2D, §9 MotionPath, §12 clip masks, §13 WebGL); `rules/svg-path-draw.md`; `adapters/{gsap-transforms-and-perf,css-animations,lottie,html-in-canvas-patterns}.md`; `SK/hyperframes-keyframes/SKILL.md` ("SVG", "Canvas/WebGL"); `SK/hyperframes-registry/references/discovery.md` (`grain-overlay`).

- **SVG draw:** dasharray/offset = `getTotalLength()` measured at setup, `fill:none`, `power2.out` or `none`, 0.3–0.8 s per segment, next at 70–80%. MorphSVG: convert to paths, split silhouettes. Path travel: `MotionPathPlugin`, `ease:"none"`.
- **Canvas 2D:** `tl.to(proxy,{t:dur,ease:"none",onUpdate:()=>draw(proxy.t)},0)`, each frame a pure function of t; seeded `hash(x,y)` (techniques §2) or `mulberry32` (`html-in-canvas-patterns.md` ~l.242). `check` can't see canvas text; use snapshots and `keyframes --ghost`.
- **Textures:** the docs have only grain (`house-style.md`), the registry `grain-overlay` (finite CSS keyframes, seekable) and WebGL FBM; `sine-wave-loop.md` prefers timeline-driven motion over CSS. **(ours)** Paper/crayon: bake once at setup with a seeded PRNG (or pre-render PNGs); static `feTurbulence` with a fixed `seed` on small groups only; "boil" as 2–3 baked variants stepped with `steps(1)`; sticker edge as a white dilated copy (`feMorphology`) or white path underneath, plus one offset shadow. Calm behind words still holds.
- **Performance:** filter cost = radius × area (≤24 px on big surfaces); motion blur = N+1 copies and seeks per target per frame (~3 targets fine); ~256 MB per worker; `will-change` only on moving nodes; WebGL can stall on software GL; shader transitions need literal colours and explicit `.scene` backgrounds (**(ours)** prefer CSS); camera-scaled images need resolution ≥ rendered × max scale.

---

## 5. Audio: placement, ducking, beats

Sources: `SK/hyperframes-audio/SKILL.md`, `references/{attributes,presets,fx-registry,diagnosis}.md`; `SK/hyperframes-core/references/{variables-and-media,creator-editing-recipes}.md` ("Volume fades / ducking"); `SK/hyperframes-cli/references/beats.md`; `SK/hyperframes-creative/references/audio-reactive.md`.

- **Placement:** `<audio id=".." src="assets/x.mp3" data-start="12.4" data-duration=".." data-volume="0.4">` (`data-media-start` trims; volume 1 = 0 dB, max 3.98); start is local inside sub-comps. SFX are short clips at the per-beat cue times.
- **Groups:** `data-audio-group="voiceover"`/`"music"`/`"sfx"`; an `<hf-audio-group>` is one bus (chain, fader, automation in composition time). Master chain on the root: `truepeak` last, ≥2 dB under the limit.
- **Fades and ducking:** use a volume lane, never a GSAP `volume` tween, because the lane wins when both exist. Example: `data-automation='{"version":1,"lanes":[{"target":"volume","points":[{"t":0,"v":0},{"t":1,"v":1},{"t":2.2,"v":0.3},{"t":3.2,"v":1}]}]}'`. Lane `t` is clip-local; on a group it is composition time. Write it double-quoted with `&quot;` so `carve.mjs` can read it.
- **Voice vs music:** carve, don't duck. `node SK/hyperframes-audio/scripts/carve.mjs --comp index.html` (strength 0.8) writes 250 Hz–2.5 kHz dips plus a slow-release gain that follows the voice; `sources` names the voice *group*; never carve the voice or put bed/SFX in its group. Needs ffmpeg and `@hyperframes/core`. **(ours)** Carve against a scratch track, re-run on the real voice-over.
- **Presets:** `voice-clean`, `voice-warm`, `room-gate`. Order: subtract → level → relationships → character/ceiling. Compressor/limiter can't be automated; automate a `gain` before them.
- **Beats:** `npx hyperframes beats` (music `<audio data-timeline-role="music">`) writes `beats/*.json`. Audio-reactive: bands from `SK/hyperframes-creative/scripts/extract-audio-data.py`, applied per frame via `tl.call`, ≤5% on text, no EQ bars. **(ours)** Share score cue times (payoff, risers) as timeline labels.
- **Verify by rendering:** lint checks only volume conflicts; a bad chain fails the render but plays dry in preview; reverb/delay tails run past `data-duration`.
