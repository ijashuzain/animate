# What the "2D animation with Claude + JavaScript" tutorial teaches (studied 2026-10-21)

Source: a ~14-min YouTube tutorial the user shared as 7 screen recordings (parts 1, 3-8) plus its transcript.
Showcased work: Kevin Ngo's JavaScript animations (a Rube Goldberg morning, a paper-collage genie story), a crayon deer
story, a doodle dinosaur, a music video. Everything is drawn by code (canvas/SVG + GSAP), captured by headless Chrome and
encoded by FFmpeg; HyperFrames (HeyGen, HTML compositions -> video) or Remotion adds a timeline and rendering harness.

## The three levels
1. **Prompt only** ("use JavaScript to animate a black hole"): random quality, sometimes "ridiculous".
2. **Reference + research:** a reference video for the style to match, *style + pacing research* (a slider:
   FAST / RETENTION ... SLOW / TEACHING: hook fast to keep viewers, or slow down to teach?), a full story outline,
   strict creative direction, the model composes original music in Python. Optional harness: HyperFrames or Remotion.
3. **Orchestrate:** the human still supplies **the plan: the idea, a reference video, the pacing research** (the three
   things the model can't do well alone). The model writes the JS animation (titles, charts, diagrams, characters) and uses
   MCP tools for AI clips/B-roll, narration in any voice (ElevenLabs/Higgsfield) and music. "Code for the motion,
   MCPs for the video and sound." Instruction: *don't stop until it matches the quality of the reference video.*

## What makes the showcased videos good (from the frames)
- **One visual conceit per video, and every line becomes a physical gag.** The morning video is one continuous Rube
  Goldberg machine: a blue ball is "me". "I roll out of bed" = the ball rolls off a hammock; "coffee picks me up" = a cup
  lifts the ball; "the toast pops, so do I" = the toaster launches it; "my commute is uphill" = a bus on a ramp; "I climb
  the corporate ladder" = a bar chart becomes stairs; "someone hits reply all" = a stack of papers explodes. The pun is
  the animation. Nothing is explained in text.
- **Continuous camera:** the camera follows the hero through one connected world (a long vertical scroll), so there are
  almost no cuts and no dead moments: cause leads to effect leads to the next line.
- **Or many short shots:** the genie story is 12 compositions in 34 s (about 3 s each), each one a single staged gag.
- **Minimal text, spoken words only:** handwritten captions that type on as the words are said, or speech bubbles that
  show each word as it is spoken. Never an explanation panel.
- **The medium lives on the objects:** crayon/marker fills and paper-cutout characters with a white sticker edge;
  backgrounds are calm (cream paper, flat colour fields with a little paper tooth).
- **Depth:** stacked paper planes (a multiplane camera), not flat 2D. The tutorial calls "no depth" a fault to fix.
- **Dramatic framing:** an extreme close-up (the tiger's eye fills the frame) for the scare beat; wide shots for calm.
- **Audio:** the voice comes first and drives the picture (mouths lip-synced to the real speech, bubbles word by word);
  the music changes mood by section (whimsical, then sad violin, then lo-fi) and dips 10-13 dB under dialogue; SFX are
  synthesized in Python.

## Their project structure (level 3, from the agent's summary)
- `lib/paper.js` (the paper/cut-out renderer), `cast.js` (the characters), `sfx.py`, `film.js`, `index.html`.
- **All timing in one file, `tools/timeline.json`**; `tools/build.py` regenerates the HyperFrames project from it.
- One HyperFrames composition per beat (dream, code, wish, poof, build, launch, days, cry, lesson, clones...), with a
  timeline of scene, voice-line, music and FX tracks.
- `hyperframes check` (lint) passes with zero findings; a **draft render** (`*-draft.mp4`) is shown to the user, who
  approves the "final delivery-quality render" or asks for changes first.

## What this means for us (the gap)
| tutorial | our pipeline until now |
|---|---|
| a new visual conceit per video, each line a gag | one template: 10 scenes x 12 s, pop-ins, text on the right half |
| text = the spoken words (captions/bubbles) | text = an explanation panel |
| reference video per video + pacing research | one house style, rules-based checks |
| voice first: lip sync, word-timed captions | voice recorded after the picture |
| draft render, approval, final | one 25-minute render, then fixes |
| timeline.json as the single source of timing | timing spread over SCN, scenes and cards |
| HyperFrames/Remotion + GSAP harness | a home-grown canvas engine |
| depth via stacked planes, extreme close-ups | flat scenes, one framing |
