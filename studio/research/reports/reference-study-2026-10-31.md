# Reference study, batch 2026-10-31 (5 videos, measured)

Text-only report. Every video file, decoded frame and contact sheet stayed on the user's Mac, in a private study folder
(`_reference-study-2026-10-31/`, next to the source folder). Nothing from the picture is in this repository: only numbers
and the reviewer's own descriptions.

```text
Batch ID     | refstudy-2026-10-31-b1
Snapshot ID  | local-folder-2026-10-31 (no API snapshot; IDs are taken from the file names)
Agent        | coordinating cloud session + a Claude Code session on the user's Mac (Remote Control)
Commit       | script studio/research/scripts/film_metrics.py at af88005, sha256 5709f32c...0d58 (checked on the Mac before running)
Planned / processed / validated / blocked / metadata-only | 5 / 5 / 0 / 0 / 0
Shot rhythm valid | 3 of 5 (2 long videos fail cut detection, see 4.1)
```

## 1. Source, access and rights (worksheet A)

| field | value |
|---|---|
| Source | Local folder on the user's Mac: one channel folder `UCsXVk37bltHxD1rDPwtNM8Q` with a `max-480p/` subfolder. Files are named by YouTube video ID. |
| Folder inventory (read-only) | 397 files (212 webm, 185 mp4); 5,631 MB; 44.4 h in total (42 s to 3,810 s). Resolutions: 854x480 x253, 608x1080 x123, 480x854 x19, 640x360 x2. Frame rates: 30 x350, 25 x45, 24 x1, 29.97 x1. 0 probe failures. |
| Provenance files on disk | **None** (no `.info.json`, licence, permission note or download log) |
| Rights state | `licensed_local_analysis`, **asserted by the user on 2026-10-31** in the coordinating session. **`grant_reference`: not yet supplied.** |
| Permitted operations used | local decoding at 4 fps / 320 px, scene-change scoring, numeric measurement, one contact sheet per video for private review |
| Storage / publishing | Media, frames and sheets stay on the Mac (git-ignored, never committed). Only this text report is published. |
| Retention | `retention_until`: unknown. Set it when the grant reference is recorded. |
| Titles / dates | `unknown`. Not reliably obtained: nothing on disk, and youtube.com is blocked from the cloud session. The Data API was not used. |
| Observation method | `licensed_frame_sequence` (automated metrics) + `licensed_stills` (320 px contact sheets reviewed by the Mac agent). **No human viewing; no audio.** |
| Reviewer | Claude Code on the Mac (sheet review); the coordinating session (this report). No human sign-off yet. |

**Gate:** docs/14's preflight needs a real (not synthetic) `grant_reference`. Until the user records one, these records are
`hypothesis` grade and must not be promoted to the design library (worksheet H). Do not scale beyond this batch before
then. config/project.json still says `max_local_source_storage_mb: 0`, which would need updating if that store is
counted.

### Selected videos (T05: rule-based, no cherry-picking)

Selection rule, run on the Mac:
- **LONG (3):** landscape files of 480 to 660 s (pool N = 71), sorted by duration; indices round(p·(N−1)) for p = 0.1 / 0.5 / 0.9.
- **SHORT (2):** vertical files of 90 s or less (pool N = 130), sorted by file name in byte order; indices 0 and N//2.

| video ID | URL | group | duration | source | container | size | sha256 (local file) | status |
|---|---|---|---|---|---|---|---|---|
| oHHSSJDJ4oo | https://www.youtube.com/watch?v=oHHSSJDJ4oo | long p0.1 | 502.8 s | 854x480 @ 30 | mp4 | 17.2 MB | 88c75414…b730a5 | `licensed_stills` (rhythm invalid) |
| dGiQaabX3_o | https://www.youtube.com/watch?v=dGiQaabX3_o | long p0.5 | 578.7 s | 854x480 @ 30 | webm | 15.4 MB | e07ea090…f50e | `licensed_stills` (rhythm invalid) |
| lXfEK8G8CUI | https://www.youtube.com/watch?v=lXfEK8G8CUI | long p0.9 | 647.5 s | 854x480 @ 30 | webm | 29.4 MB | ac08f99e…3bc5 | `licensed_stills` |
| 0pyGPK3fG4U | https://www.youtube.com/shorts/0pyGPK3fG4U | short | 61.1 s | 608x1080 @ 30 | webm | 3.1 MB | 5c62fe06…8a82 | `licensed_stills` |
| UKOxj8oP59w | https://www.youtube.com/shorts/UKOxj8oP59w | short | 54.5 s | 608x1080 @ 30 | webm | 2.2 MB | 53c02416…067a | `licensed_stills` |

Full hashes are in Appendix B. The `licensed_stills` status is provisional while the grant reference is pending. None of
the five is `motion_reviewed` or `deep_analyzed`. These are 480p re-encodes, so every colour and detail number describes
the local copy, not the master.

## 2. Measurements (film_metrics.py, picture only)

All values come from 4 fps samples at 320 px wide, plus ffmpeg's scene score (threshold 0.32) and dips to dark or flashes
to white. Cuts closer together than 0.75 s are merged. Run: one call, exit 0, 61 s on the Mac.

| metric | oHHSSJDJ4oo | dGiQaabX3_o | lXfEK8G8CUI | 0pyGPK3fG4U | UKOxj8oP59w |
|---|---|---|---|---|---|
| duration s | 502.767 | 578.716 | 647.517 | 61.083 | 54.5 |
| samples (4 fps) | 2011 | 2315 | 2590 | 244 | 218 |
| shots (detected) | 6 ⚠ | 2 ⚠ | 60 | 8 | 7 |
| cuts / min | 0.597 ⚠ | 0.104 ⚠ | 5.467 | 6.876 | 6.606 |
| median shot s | 16.625 ⚠ | 289.358 ⚠ | 5.967 | 8.966 | 5.5 |
| p10 / p90 shot s | 1.008 / 233.75 ⚠ | 75.271 / 503.445 ⚠ | 1.333 / 30.51 | 2.81 / 11.488 | 1.72 / 16.737 |
| longest shot s | 361.75 ⚠ | 556.967 ⚠ | 55.467 | 13.95 | 26.467 |
| motion mean (0–255) | 8.213 | 8.108 | 9.248 | 12.221 | 9.42 |
| motion in shot | 8.199 | 8.09 | 7.774 | 10.993 | 7.699 |
| still share (in-shot diff < 1.5) | 0.166 | 0.406 | 0.157 | 0.149 | 0.291 |
| saturation | 0.82 | 0.658 | 0.692 | 0.674 | 0.779 |
| value | 0.643 | 0.758 | 0.547 | 0.752 | 0.746 |
| dark share (V < 0.15) | 0.0 | 0.004 | 0.069 | 0.016 | 0.029 |
| bright share (V > 0.9) | 0.306 | 0.489 | 0.232 | 0.426 | 0.567 |
| colourfulness (H-S) | 113.324 | 112.105 | 88.775 | 122.422 | 119.195 |
| hues used / 12 | 8 | 9 | 10 | 9 | 5 |
| edge density (mean / p90) | 0.077 / 0.136 | 0.057 / 0.098 | 0.062 / 0.11 | 0.036 / 0.063 | 0.026 / 0.041 |
| band luma spread | 0.073 | 0.087 | 0.085 | 0.077 | 0.094 |
| centre / edge sharpness | 3.979 | 145.562 ⚠ | 4.451 | 1.515 | 5.562 |

⚠ = known measurement failure (section 4). The cut times for every video are in Appendix A.

### Ranges over the valid subset (n is stated each time; this is not channel prevalence)

| measure | n | range | note |
|---|---|---|---|
| cuts / min | 3 (1 long, 2 Shorts) | 5.5 – 6.9 | the detector also over-counts by ~15–20%, so the true rate is probably lower (4.1) |
| median shot | 3 | 5.5 – 9.0 s | |
| in-shot motion | 5 | 7.7 – 11.0 | the Short 0pyGPK3fG4U is the busiest |
| still share | 5 | 0.15 – 0.41 | 0.15–0.17 in 3 videos; 0.29 and 0.41 in the other two |
| saturation | 5 | 0.66 – 0.82 | |
| value | 5 | 0.55 – 0.76 | lowest in the video with large dark interior fields |
| hues / 12 | 5 | 5 – 10 | the Short UKOxj8oP59w uses a deliberately narrow scheme (5) |

## 3. Visual grammar and shot notes (worksheet B, C, D: stills-level)

Source: the Mac agent's own descriptions from 320 px contact sheets (one mid-shot frame per detected shot, at most 60
tiles). Rules for these notes:
- They describe stills only. **Worksheet E (motion events) is `not_measured`** for all five: no key poses, curves or camera
  transforms were tracked.
- When a detected "shot" contains several real shots, its tile shows only one of them.
- The descriptions are deliberately generic. Do not use them to recreate a specific character or composition.

### lXfEK8G8CUI (long, 60 shots; the sheet covers all of them)
- **Shape:** organic blob-like cell forms next to flat geometric props and buildings. No outlines; corners heavily rounded.
- **Palette roles:**
  - field: deep violet/indigo for interior ("inside the body") scenes;
  - hero: warm orange or magenta;
  - accents: small acid-green and cyan.
- **Light:** flat fills plus radial glows and rim light.
- **Depth:** 3–4 visible layers; blurred foreground particles; dark vignettes.
- **Text:** sparse; label chips of 1–2 words and circular magnifier insets.
- **Shots (tile → mid time):**
  - 1 → 3.4 s: node diagram, wide, centred.
  - 3 → 11.3 s: figure in a park, wide, rule of thirds; foliage foreground, skyline background.
  - 8 → 81.0 s: radiant sky, cosmic scale, diagonal; foreground silhouettes.
  - 15 → 170.5 s: curved tissue wall with a circular inset, medium.
  - 17 → 207.7 s: single glowing cell, close, centred.
  - 24 → 298.2 s: branching tube network, wide (inside the 55 s longest shot).
  - 29 → 352.3 s: historical figure in a town, medium, centred.
  - 33 → 363.9 s: tiled repeating pattern, symmetric.
  - 44 → 480.6 s: hand holding an everyday object, close, rule of thirds.
- **Segments:**
  - 480–488 s (tiles 44–48) is a real rapid montage, about 1.3 s per shot.
  - Tiles 55–60 are a sponsor segment, which shifts the palette toward pastel. It should be excluded from craft statistics (4.2).
- **Qualifies the numbers:** the low value (0.547) and colourfulness (88.8) come from the large indigo interior fields; the outdoor scenes are bright.

### oHHSSJDJ4oo (long; rhythm invalid)
- **Shape and framing:** rounded UI-panel framing.
- **Palette roles:** indigo field, orange-yellow hero, pink accents.
- **Light:** glow blooms.
- **Depth:** 2–3 layers.
- **Text:** heavy use of label chips and icon diagrams.
- **Shots:**
  - 1 → 15.4 s: solar close-up with a label.
  - 2 → 211.6 s: centred title card.
  - 5 → 449.1 s: symmetric radial diagram with four icon boxes.
- **Qualifies the numbers:**
  - White title cards inflate the bright share.
  - A dark share of 0 means mid-value indigo fields, not black space.
  - Its saturation (0.82) is the highest of the five.

### dGiQaabX3_o (long; rhythm invalid)
- **Shape:** organic rounded silhouettes, no outlines.
- **Palette:** warm pastel coral, peach and cream.
- **Light:** flat fills, no glow.
- **Depth:** 3–4 planar layers that lighten toward the background, like atmospheric perspective.
- **Shots:**
  - 1 → 278.5 s: figure at a water's edge, wide, rule of thirds.
  - 2 → 567.8 s: end-screen grid.
- **Qualifies the numbers:** the sharpness ratio of 145.6 is an artifact (4.3). Its high still share (0.41) may be partly real, since flat fills with few edges score low frame differences. It needs a human check.

### 0pyGPK3fG4U (Short, vertical)
- **Shape:** chunky rounded characters.
- **Palette:** cyan backgrounds with warm heroes; 2–3 hues per tile.
- **Light:** flat fills.
- **Depth:** mostly one plane with large negative space.
- **Text:** word-by-word captions burned into every tile, plus speech bubbles.
- **Shots:**
  - 1 → 1.5 s: title over a character group, centred.
  - 3 → 16.5 s: aerial network of paths, diagonal.
  - 4 → 22.8 s: fish with a thought bubble, centred.
  - 6 → 32.5 s: neuron-like form, vertical symmetry, dark background.
  - 7 → 42.4 s: brain in side view, centred.
  - 8 → 54.1 s: tilted photo collage, diagonal.
- **Qualifies the numbers:** the captions add edges in the centre band, nudging centre sharpness up.

### UKOxj8oP59w (Short, vertical)
- **Shape:** simple mascot shapes; a faceted planet.
- **Palette:** a narrow scheme of cyan, navy, orange and magenta (5 of 12 hues).
- **Light:** glow halos.
- **Depth:** 1–2 layers.
- **Text:** captions on every tile.
- **Shots:**
  - 1 → 1.0 s: magnifier-lens opener, macro, centred.
  - 2 → 15.3 s: small planet, cosmic scale, centred.
  - 3 → 31.9 s: mascot on a box, medium.
  - 5 → 42.6 s: tiny sphere on a dark field, rule of thirds.
  - 6 → 48.4 s: ringed dark point, centred.
  - 7 → 51.8 s: person holding a plush, medium.
- **Qualifies the numbers:** large pale-cyan fields drive the bright share (0.567).

### Cross-video differences (B, last bullet)
- The long videos split into two looks:
  - glow/rim-lit on deep indigo fields (oHHSSJDJ4oo, lXfEK8G8CUI);
  - flat pastel with no glow and atmospheric layering (dGiQaabX3_o).
- That is direct evidence that the look is not constant across the catalogue. With no dates, it cannot be tied to era.
- The Shorts differ from the long videos in three ways: burned-in captions on every tile, fewer depth layers, and lower edge density (0.026–0.036 against 0.057–0.077).

## 4. Measurement failures and the fixes they call for (QA)

1. **Cut detection misses soft transitions.** oHHSSJDJ4oo found 6 shots in 503 s and dGiQaabX3_o found 2 in 579 s; their
   sheets show title cards and scene changes inside one "shot". Dissolves, wipes and camera-carried transitions stay
   under the 0.32 scene score. In the other direction, the lXfEK8G8CUI audit puts false positives at about 15–20%:
   - tiles 2→3 are the same shot reframed;
   - tiles 5, 13, 21, 22, 28, 34, 41, 52 and 56 land mid-wipe or on a split frame.

   The Shorts show about 15% false positives. **Fix:** add a windowed histogram distance across the 4 fps samples, so
   gradual transitions register as cuts (log the threshold). Then audit against hand-marked cuts on one video.
2. **Sponsor segments and end screens pollute the statistics.** They need excluding: a `--exclude a-b` time range, or
   end-screen detection.
3. **The centre/edge sharpness ratio blows up** when the top and bottom bands are almost flat (145.6). **Fix:** use a higher
   floor for the denominator, or report a median over frames instead of a mean.
4. **Bright share and value are skewed** by white title cards and captions, and **edge density** is inflated by burned-in
   captions in the Shorts. A text mask, or excluding title-card frames, would make the colour and detail numbers fairer.
5. The 480p re-encodes limit edge density and colour accuracy. Measure our own films after the same downscale (320 px)
   so the numbers are comparable.

## 5. Inference separation (worksheet F)

| # | Seen | Suggests | Other explanations | What would settle it | Usable with original geometry? |
|---|---|---|---|---|---|
| F1 | In the 3 videos with valid rhythm, median shots run 5.5–9 s, with a montage of ~1.3 s shots in one place | New information arrives mostly *inside* shots (camera moves, builds), not through cuts every 1–2 s | Missed soft cuts make shots look longer; but a ~15–20% false-positive rate pushes the other way | A fixed detector, plus hand-marked cuts on 1 video | Yes: pacing is a timing parameter |
| F2 | 15–41% of in-shot 0.25 s steps are nearly still (3 videos at 0.15–0.17) | The reference does **hold** for brief beats; "the camera never stops" is not literally what it does | Tiny drifts below 1.5 (0–255) may read as motion to a viewer; the 480p compression floor | Per-shot still runs and their lengths; a lower still threshold | Yes: allow short holds; measure ours |
| F3 | Saturation 0.66–0.82, value 0.55–0.76, 5–10 of 12 hues | Highly saturated, mid-to-light palettes with a broad but role-limited hue set | Re-encode colour shifts; title cards, captions and sponsor segments | Exclude non-story segments; a larger n | Yes: palette targets, not copied colours |
| F4 | Glow/rim on dark fields in 2 long videos, flat pastel in 1 (single_example), captions on every tile in both Shorts (2 instances) | At least two look families; Shorts have their own grammar | Topic-driven palettes rather than era; this n can't tell | Dates/metadata plus a larger, era-stratified sample | Yes, as separate presets |
| F5 | Long videos have higher edge density than Shorts (0.057–0.077 against 0.026–0.036) | Long-form frames carry more drawn structure; Shorts are bolder and simpler | Vertical 608x1080 scaled to 320 px loses detail differently; captions | Measure Shorts at matched pixel area | Yes: a detail-density budget per format |

Pattern status: every row is `hypothesis`. F4's flat-pastel look is `single_example`. Nothing here is `validated`
(that needs an original-code A/B, per docs/03).

## 6. Transfer to generative code (worksheet G: proposals, not built)

The proposals below are original; nothing is traced or copied. Each one must pass the docs/01 similarity guard before
being built.
1. **Pacing check in tools2/film.mjs:** run the same `film_metrics.py` on our drafts.
   - Report cuts/min, median shot and still share next to the reference ranges in section 2.
   - Flag still runs longer than about 1 s, but allow deliberate holds (F2).
   - *Test:* the seed-to-giant pilot and the blood-groups final. *Metric:* still share and in-shot motion against the reference ranges.
2. **Palette-role presets in kit/paint.js:** a `field / hero / accent` role set with target saturation 0.65–0.8 and value
   0.55–0.75, and a cap on accent hues.
   - Presets: "dark field + glow/rim" and "flat pastel + atmospheric layers" (F3, F4).
   - Colours are our own; only the role structure and ranges transfer.
   - *Failure case:* muddy darks. LEARNINGS says flashbacks must stay bright.
3. **Detail budget per format:** long-form scenes aim for more drawn structure than vertical Shorts (F5). Edge density
   becomes a review number in the storyboard check.
4. **Label chips:** stay calm and sparse, 1–2 words. This matches the existing `P.pill` rule; no change needed.

## 7. Uncertainties and false leads
- n = 5, and 3 of them have valid rhythm. Nothing here describes the channel as a whole: the 397-file folder is the
  denominator, and 5 of 397 (1.3%) were measured.
- The grant reference is missing, which blocks promotion (section 1).
- There are no titles or dates, so no era analysis is possible.
- The sheet review was done by an agent, not a human. Worksheet H sign-off is still open.
- The bulk probe misread one file whose name starts with `-` (`-O5kNPlUV7w`). Probed on its own it is 456.9 s landscape,
  so it falls outside both pools and the selection is unaffected.

## 8. Costs
- Mac run: 61 s of CPU wall time for the 5 videos.
- Mac agent: about $0.33 for the inventory turn (reported); later turns were not totalled.
- No paid APIs, no YouTube API requests, no cloud compute beyond the two Claude sessions.

## 9. Next 3 tasks and their gates
1. **Record the grant** (`grant_reference`, permitted operations, `retention_until`) in a private rights record on the Mac,
   and note its ID here. Gate: the user.
2. **Fix film_metrics.py** (section 4, items 1–3), audit it against hand-marked cuts on lXfEK8G8CUI, then re-run this same
   batch to get valid rhythm for oHHSSJDJ4oo and dGiQaabX3_o. Gate: task 1.
3. **Measure our own films** (seed-to-giant, blood-groups, cat) with the same script for a baseline, and A/B one change
   from section 6 (the pacing check first). Gate: none (our own renders).

## Appendix A: detected cut times (s)
- oHHSSJDJ4oo ⚠: 30.75, 392.5, 395.0, 396.25, 502.0
- dGiQaabX3_o ⚠: 556.967
- lXfEK8G8CUI: 6.867, 10.2, 12.367, 42.967, 54.333, 68.25, 73.133, 88.967, 90.633, 95.466, 104.1, 116.5, 157.733, 167.833,
  173.233, 188.933, 226.433, 230.9, 239.3, 253.667, 265.133, 268.7, 270.5, 325.967, 329.767, 335.3, 339.733, 351.667,
  352.9, 354.0, 357.933, 361.8, 366.033, 370.0, 400.5, 403.7, 441.633, 450.167, 452.567, 456.267, 463.567, 474.933,
  479.967, 481.267, 482.6, 483.933, 485.266, 486.6, 487.666, 506.233, 524.533, 534.867, 541.267, 562.9, 579.167, 589.4,
  592.767, 628.733, 632.966
- 0pyGPK3fG4U: 3.0, 11.5, 21.6, 23.967, 27.267, 37.7, 47.133
- UKOxj8oP59w: 2.033, 28.5, 35.25, 37.5, 47.75, 49.0

## Appendix B: local file hashes (sha256)
- oHHSSJDJ4oo: 88c754148ebe75920a7fd7c9f6dafd705b4c4c5ec5fedb02bccfb21a9fb730a5
- dGiQaabX3_o: e07ea0903cfbcbb36cc04d31603041c8cf981229ef94936070c443aa690cf50e
- lXfEK8G8CUI: ac08f99edd1595b7eeef87ddcd8e6fdbd626e99749c36503adf56960d84f3bc5
- 0pyGPK3fG4U: 5c62fe066da138e2544faf43a5e90024fd30b6edf536023506f69ab2d8868a82
- UKOxj8oP59w: 53c02416902798b5a16ed1ca54d4c607d4c5b742609323c8da4906e811c9067a
