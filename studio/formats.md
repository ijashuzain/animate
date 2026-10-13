# Narrative formats

Not every video is "step 1, step 2". Pick the format that fits the topic **before** writing the script, and say which
one in `research.md`. Every format keeps the channel's spine: a hook in the first 12 s, a turn, a 2.5 s silence, the
payoff on a hard cut, an ending that calls back to the opening. What changes is how the middle is told, what the scene
tags say, how the lettering looks, and which music and transitions fit.

| format | middle is told as | tags say | lettering helpers | fits topics like | genre / transitions that suit it |
|---|---|---|---|---|---|
| **Process** (steps) | one true step per scene | `step 1`, `step 2` | `title`, `bigNum`, `check` | how X works, how X is made | any; `push`, `wipe`, `tiles` |
| **Journey / POV** | we ride along with the hero through places | the place: `the stomach`, `the hive` | `title`, `bubble` | food through the body, a letter through the post, a drop of water | `folk`, `pizzicato`; `zoom` into the next place, `push` |
| **Timeline** | dated moments, old to new | the year: `1969`, `1983` | `timeline(years, cur)`, `bigNum` | histories, inventions, how X changed | `folk`, `paper`; `pageTurn`, `clock`, `wipe` |
| **Countdown** | ranked items, #5 to #1 | `#5` … `#1` | `rank(n)`, `bigNum` | the biggest/fastest/strangest X | `synth`, `chiptune`; `flash`, `whip`, `tiles` |
| **Myth vs fact** | a common belief, then what's true | `myth #1`, `fact` | `stamp('MYTH')`, `stamp('FACT', …, green)` | misconceptions (goldfish memory, the 10% brain) | `lofi`, `paper`; `wipe` with a torn edge, `scatter` on a busted myth |
| **What if** | a scenario that unfolds over time | the time: `1 second later`, `day 3`, `year 100` | `bigNum`, `meter` | what if the Moon vanished / Earth stopped spinning | `ambient`, `mystery`; `spin`, `ink`, `dip` |
| **Mystery / detective** | clues that build to the answer | `clue 1`, `clue 2`, `the answer` | `clue(n, str)`, `stamp('SOLVED')` | why is the sea salty, what killed the dinosaurs | `mystery`; `shutter`, `dip`, `ink` |
| **Versus** | two things compared side by side, round by round | `round 1`, `size`, `speed` | `versus(a, b)`, `meter` | cats vs dogs, Mars vs Venus, then vs now | `synth`, `paper`; `doors`, `push` |
| **Scale journey** | zoom from tiny to huge (or back) | the scale: `1 mm`, `1 km`, `1 light-year` | `meter(label, frac)`, `bigNum` | how big is the universe, how small is an atom | `ambient`; `zoom` every time, ending on a `shape` |
| **Question chain** | each answer raises the next "but why?" | `why?`, `but why?`, `and why?` | `bubble`, `title` | why do we sleep, why is the sea blue | `lofi`, `pizzicato`; `shape` (a ? or a drop), `fade` |
| **Day in the life** | hours of one day of a person/animal/thing | the clock: `6:00`, `noon`, `midnight` | `bigNum`, `timeline` | a day as a bee, a red blood cell's day | `pizzicato`, `folk`; `clock` |

## Rules
- One format per video. Don't mix countdown with timeline.
- Tags follow the format (years, ranks, clocks, clues, rounds), never "step" unless the format is Process.
- The format also sets the payoff: a countdown's #1, the mystery's answer, the timeline's "today", the scale's edge.
- Batch rule: three videos in a batch should use **three different formats** (and different genres and transition sets).
