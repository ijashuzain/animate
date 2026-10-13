# Transitions

A scene sets `tr: { kind, ... }` for the change **into** it (studio/channel/transitions.js). No `tr` = the classic
circle morph through paper. `CHANNEL.tr` in scenes.js sets a default (object, or `(i) => object`).
Every kind has its own sound (score-channel.js `TRSFX`), so the cut sounds like what it looks like.

**Rule: a transition should come out of something on screen or in the story.** A honeycomb video changes scenes through
hex tiles; a zoom goes *into* the object the next scene is about (the cell, the hive door, the screen); a history video
turns pages; a clock topic sweeps like a hand. Use 2–4 kinds per video, chosen on purpose, not one of each.
`o.p` = a screen point (x 0..1920, y 0..1080) on the object the transition starts from.

| kind | looks like | options | use it for |
|---|---|---|---|
| `morph` | circle iris closing to paper, opening on the next scene (the old default) | — | anything; quiet |
| `shape` | the next scene opens inside a growing shape placed on an object | `shape`: circle, hex, drop, star, heart, diamond, leaf, cloud, square, gear, cell, shield; `p`; `spin` | the shape of the thing: a drop for water, a hex for bees, a cell for biology, a gear for machines, a heart for the body |
| `zoom` | push into a point of the old scene until it fills the frame, land in the new one | `p` (into), `pb` (out of), `z` | going inside: into a cell, through a window, into a screen, down a microscope |
| `tiles` | tiles pop open in order to reveal the next scene | `tile`: hex, square, triangle, circle; `order`: diag, radial (from `p`), random, row; `size` | honeycombs (hex), pixels/screens (square), crystals (triangle), bubbles/cells (circle) |
| `wipe` | an edge sweeps across | `dir` (deg, 0 = left→right), `edge`: torn, straight, wave, zigzag | moving on in space; torn edge for paper, wave for water |
| `push` | the old scene slides out as the new slides in | `dir` | travelling in one direction (a journey, a timeline moving forward) |
| `whip` | a fast pan with motion blur | `dir` | energy, surprise, countdowns |
| `slideOver` | the new scene slides over the old like a sheet | `dir` | adding a layer, a new page, a card on a table |
| `pageTurn` | the page folds back from the right | `paper` (flap colour) | books, diaries, history, sketchbook videos |
| `clock` | a clock-hand sweep around a point | `p` | time, history, cycles, days in a life |
| `doors` | the old scene splits and opens from the middle | `vertical` | reveals, openings, "inside the…" |
| `blinds` | stripes open one after another | `n`, `vertical` | windows, light, rooms, data |
| `pixel` | pixelate out, pixelate in | `block` | computers, games, screens, the internet |
| `ink` | the new scene seeps in through soft blotches | `key` (noise seed) | water, paint, ink, smoke, chemistry, dreams |
| `shutter` | a camera iris closes and opens | `p`, `color` | eyes, photos, light, telescopes, "look closer" |
| `scatter` | the old scene breaks into pieces that fall away | `n` | breaking, a myth busted, an ending, explosions |
| `spin` | spin out, spin in | `turns`, `color` | planets, cycles, "a turn of events" |
| `fade`, `dip`, `flash` | dissolve; dip through a colour; a white flash cut | `color` | a soft change of time; night; a camera or a shock |

Durations: `d` is half the transition (default 0.55 s, so 1.1 s). Shorter (0.3) for whip/flash, longer (0.8) for ink/zoom.
The payoff stays a hard cut (`cut: true`) after the silence; don't put a transition there.
