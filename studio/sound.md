# Sound: genres, moods, sfx kits

`SCORE = { genre, motif? }` in src/script.js picks the music for the whole video; each scene's `mood` picks the energy
inside it (warm 1, groove 2, full 3; cold/tense = the genre's minor colour, awe = its open colour, silence = nothing).
Hear them all: `node studio/tools/sampler.mjs` writes one short sample per genre.

| genre | sounds like | fits |
|---|---|---|
| `paper` | warm plucks and pads in D, soft kick (the channel's first sound) | stories, general explainers |
| `lofi` | electric piano chords in F with 7ths, swung hats, a lazy kick and snare, vinyl crackle | everyday science, myths vs facts, question chains, chill topics |
| `synth` | saw arpeggios in A minor, clap on 2 and 4, octave bass | tech, internet, space hardware, countdowns, the future |
| `pizzicato` | plucked strings and marimba in G, woodblock and shaker, a little swing | animals, nature, insects, kids' science, journeys |
| `ambient` | slow sine pads and bells in E, air, almost no drums | space, scale, wonder, oceans, "what if" |
| `chiptune` | square-wave arpeggios in C, 8-bit kick and snare | computers, games, pixels, retro tech |
| `folk` | strummed and fingerpicked guitar in D, shaker | history, people, inventions, maps, food |
| `mystery` | dark low pads in D minor, pizzicato ostinato, timpani, a drone | mysteries, the deep sea, extinctions, unsolved things |

Rules (from research on explainer music): the music sits under the voice, so no busy lead melody; the narration ducks
it; the payoff is the loudest moment and the ending decays (built in). Three videos in one batch use three different genres.

**SFX kits** follow the drawing style automatically (`KITS` in score-channel.js): cut-paper = paper taps and swishes,
sketchbook = pencil taps and page flips, isometric = soft digital clicks and air, pixel = 8-bit blips, math = chalk taps.
Extra sounds for scene cues (`sfx: [[sec, kind, arg]]`): pop, chime, whoosh, thud, click, typing, scribble, ding, beep,
rise, drone, paper, flip, pencil, tick, coin, drip, buzz (a bee, a fly), shutter. `SCORE.sfx` can override any of them.
