# Reference: Peekaboo Kidz (The Dr. Binocs Show) — the animation, not the host

The user asked us to study this channel's **animation techniques** (not its character-led narration).
Peekaboo Kidz is Rajshri Entertainment's kids' science channel (ages ~5-10); press and reviews describe it as "bright,
colourful animation" with "clear explanations" (PRNewswire / AnimationXpress on the 1M-subscriber milestone, Screenwise).
The page fetches were blocked from this sandbox, so the technique list below is from knowledge of the show, not a
frame-by-frame study; check a few episodes by eye before copying a specific move.

## What makes their animation easy to watch
1. **One idea per shot, short shots.** A new picture every ~2-4 s while the voice explains; the frame is never still.
2. **The zoom-in.** The signature move: a circular lens/binocular zoom from the outside of a thing into its inside
   (into the body, into a cell, into a machine). The circle frames the detail, then fills the screen.
3. **Cutaways and X-ray views.** Objects open up (a slice through the Earth, a body with organs visible) so the
   mechanism is shown, not described.
4. **Flat, bright, simple shapes.** Saturated flat colours, clean dark outlines, rounded forms, almost no texture;
   plain or softly graded backgrounds so the subject pops. (Matches our "calm behind words" rule.)
5. **Things have faces.** Germs, organs, raindrops and planets get two dots and a mouth; it makes a process a story.
6. **Labels that point.** A short word with a leader line pops in next to the part it names, then leaves.
7. **Everything moves with a bounce.** Pop-ins with overshoot, squash and stretch, little idle wobbles.
8. **A sound for every action.** Pops, boings, whooshes and slides on each appearance; the music stays low under it.
9. **Before / after and big numbers.** Split screens, a counter or a gauge filling up for the key fact.
10. **Recap at the end.** The steps reappear quickly in order as a summary.

## How we use it (our engine)
| technique | in the studio |
|---|---|
| lens zoom into the inside | transitions.js `zoom` / `shape` (circle) with the next scene being the inside view; add a lens rim |
| cutaway / X-ray | machines.js (anatomy kit) for objects; `clipTo` + an inside layer for bodies and planets |
| flat bright shapes | cut-paper and isometric already; a new flat "pop" style would fit best (see below) |
| faces on things | library `chFace` on any blob |
| pointing labels | channel `arrow` + `write`, or a `label(x, y, text, at)` helper with a leader line |
| bounce | `popS`, `squash`, `spring` |
| a sound per action | `pops` and `sfx` per scene; the music is now 70% quieter so the sfx read |
| one idea per shot | 2-3 visual beats per 13 s scene; the review's dead-beat check (3 s) enforces it |
| recap | the ending scene replays the step icons in order |

## Proposed next step
A new style `flat` (via engine/animate/new-style.md): flat saturated fills, 4-5 px dark outlines, soft radial
backgrounds, faces on objects, a lens-zoom transition with a rim, pointing labels. Good for the human-body and nature
topics (heart, food journey, cats, fastest animals).

Sources: https://www.prnewswire.com/in/news-releases/dr-binocs-the-beloved-kid-s-edutainment-series-gains-over-1-million-subscribers-on-youtube-817968314.html ,
https://animationxpress.com/animation/rajshri-entertainments-animated-ip-dr-binocs-show-crosses-one-million-subscribers-on-youtube/ ,
https://screenwiseapp.com/media/peekaboo-kidz-youtube , https://www.pluggedin.com/youtube-reviews/peekaboo-kidz/
