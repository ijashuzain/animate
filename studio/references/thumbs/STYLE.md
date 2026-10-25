# Thumbnail style (the user's reference: studio/references/thumbs/reference-grid.webp, 2026-10-25; "exactly like this")

What every thumbnail in the reference grid does:
1. **One headline across the top**: 1-3 words, ALL CAPS, very heavy rounded sans, white, almost the full width of the
   frame, a soft dark shadow (no thick outline). Sometimes one word or a symbol is in an accent colour (red, yellow), or
   ends in an asterisk/question/exclamation ("IT'S IMPOSSIBLE*", "WTF IS THIS?"). It is a hook, never the video title.
2. **One hero, big, in the middle/lower two thirds**: a single subject in dramatic close-up (a face with a strong
   emotion, a planet, an organ in cutaway, a creature), often cut off by the frame edge, rim-lit and glowing.
3. **Rich, saturated, high-contrast colour** on a dark background (deep blue/violet/black, stars, a vignette), neon
   accents, glows; colours pushed further than in the film.
4. **A red arrow** (thick, curved, rounded) pointing at the one detail that matters. At most one or two.
5. **Tiny labels** only where they explain a part ("EARTH", "INK", "ALIVE PART"), or two big coloured numbers to compare.
6. Nothing else: no logos, no borders, no clutter; readable at phone size.

How we make one (tools2/film.mjs <slug> thumb, film.json "thumb"):
- `style: "banner"` (default for new films), `title` (the hook words), optional `accent` (a word drawn in `accentColor`),
- the picture: `t` (a frame of the film) with `zoom`/`shift`, or a dedicated composition `FILM.thumb(ctx)` in the film's
  src when no single frame is dramatic enough (the hero big, centred, lit; drawn with the same kit),
- `arrows`: [[x0, y0, x1, y1, bend]] in 1920x1080 px (curved red arrow ending at x1, y1), `labels`: [[text, x, y, size]],
- `grade`: { sat, contrast, bright } colour push (defaults 1.35 / 1.15 / 1.0), a vignette and a dark top band are added.
- Pills and on-screen labels from the film are hidden (window.THUMB).
