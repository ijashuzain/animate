# Spider film: prompts for AI-generated reference images

These references show me **how the animals are built** (silhouette, proportions, leg joints, markings, colours), and
they set the film's watercolour look. I redraw everything in code from them; nothing generated goes into the film directly.

## How to use these prompts
- Paste the **style block** at the end of every prompt (or the start, depending on the tool), so all images match.
- Generate **one image per prompt**, square (1:1) unless noted. Plain paper background, no text: AI tools garble letters,
  and I add the handwritten notes myself.
- Keep the **same spider**: once you like image S1, use it as the image reference for S2-S6 ("character reference" in
  Midjourney `--cref`, "use this image as a reference" in ChatGPT/Gemini, image prompt in Ideogram/Leonardo).
- Midjourney: add `--ar 1:1 --style raw --no text, letters, labels, watermark, border, frame, black outline`.
  ChatGPT / Gemini / Ideogram / Leonardo: add the "Avoid" line in plain words.
- If a tool makes it too cute (big eyes, a smile), say "realistic anatomy, not cartoon".

## Style block (paste with every prompt)
> Loose naturalist field-journal watercolour on warm cream cotton paper (#f3ead8) with visible paper fibres. Translucent
> layered washes with soft pooled edges, dry-brush strokes with broken "flying white" streaks, no black outlines (only a
> few very fine sepia ink lines for the smallest details like leg spines). Paper left unpainted for highlights. Muted
> natural palette: ochre #c08a3e, warm brown #5a3a22, umber #7a5a3c, sage green #8ea860, deep leaf green #4e6e3c, a
> single vermilion accent #c8442a used sparingly. Calm, precise, scientific yet hand-made, like a page from a botanist's
> sketchbook. Generous empty paper margins, single subject centred, soft daylight from the upper left.
>
> Avoid: text, letters, labels, numbers, watermark, frame, border, thick outlines, cartoon face, cute eyes, smiling,
> 3D render, photo, glossy, neon, dark background, heavy black ink.

## The spider (European garden spider, Araneus diadematus)
**S1 · Top view (the most important one)**
> Scientific watercolour plate of a European garden spider, Araneus diadematus, seen exactly from above, legs spread
> symmetrically, four legs on each side. Two body parts: a small flattened head-chest (cephalothorax) in front and a
> large round-oval abdomen behind, about twice as long as the head-chest. The abdomen is warm ochre-orange to brown
> with the species' white cross pattern on its back (a vertical row of white spots crossed by a short horizontal row,
> like a dotted cross), a darker leaf-shaped band around the cross, and a lighter edge. Legs long and slender with
> visible joints, banded pale ochre and dark brown, covered in fine short spines. The front two leg pairs point forward,
> the back two pairs point backward. Two short leg-like palps at the front. [style block]

**S2 · Side view (profile)**
> Watercolour plate of the same European garden spider in exact side view, standing on a thin horizontal twig: the
> rounded high-backed abdomen, the lower head-chest in front with a cluster of tiny dark eyes at the very front top,
> legs bent at the knees like tent poles, the body slung between them. The spinnerets visible as a small bump at the
> rear underside of the abdomen. Show the leg segments clearly (thick upper leg, knee bend, thin lower leg, tiny claws
> at the tips). [style block]

**S3 · Pose: releasing the first thread**
> Watercolour of the same garden spider standing at the very tip of a thin twig, abdomen raised high and tilted
> upward, legs gripping the twig, a single extremely fine silk thread streaming out from the rear of the abdomen and
> floating away on the breeze in a long gentle curve across empty paper. Side view, dusk light. [style block]

**S4 · Pose: walking along a single thread**
> Watercolour of the same garden spider walking upside down along a single taut silk thread stretched across the page,
> hanging below the thread, hooked to it by the claws of all eight legs, side view, the thread drawn as a fine sepia
> line. [style block]

**S5 · Pose: waiting at the hub, head down**
> Watercolour of the same garden spider resting at the centre of an orb web, head pointing down, legs spread and
> touching the radial threads, seen from the front of the web. Only the middle of the web is painted (a few spokes
> and spiral loops as very fine lines). [style block]

**S6 · Close-ups (optional but very useful), 16:9, three studies on one page**
> A naturalist sketchbook page with three close-up studies of a garden spider, side by side: (1) the underside rear of
> the abdomen with the small finger-like spinnerets, (2) one leg tip enlarged, showing branching hairs and three tiny
> curved claws, (3) a single silk thread enlarged with tiny glue droplets beaded along it like a string of pearls.
> Each study inside a soft circular watercolour wash. [style block] (Midjourney: --ar 16:9)

## The moth (large yellow underwing, Noctua pronuba: brown wings that flash yellow when they open)
**M1 · Top view, wings open**
> Scientific watercolour plate of a large yellow underwing moth, Noctua pronuba, seen from above with wings fully
> spread: brown mottled forewings with darker kidney-shaped spots, and bright warm yellow hindwings with a narrow
> black band near the edge. Furry thick brown body, two thin antennae. [style block]

**M2 · Side view, at rest**
> Watercolour plate of the same moth at rest in side view, forewings folded flat over its back like a roof, only a
> sliver of yellow showing, fluffy body, legs tucked, antennae swept back. [style block]

**M3 · Caught in the web**
> Watercolour of the same moth caught in the sticky spiral of an orb web, wings half open and slightly tilted, a few
> silk threads stretched and bent where it hit, tiny glue droplets on the threads, motion feel from loose dry-brush
> strokes. [style block]

## The look of the page (optional, for the overall feel)
**L1 · The journal page at dusk, 16:9**
> A full page of a naturalist's watercolour journal: two bare twigs with a few sage-green leaves reaching in from the
> left and right edges, a finished orb web between them painted as delicate fine lines with tiny dew-like glue drops,
> a pale moon wash in the upper right, a soft violet-grey dusk wash at the top fading into cream paper, lots of empty
> paper. [style block] (Midjourney: --ar 16:9)

**L2 · The same page at dawn, 16:9**
> The same journal page at dawn: warm pale-gold wash in the sky, every thread of the orb web beaded with glittering dew
> drops, the spider small at the hub. [style block] (Midjourney: --ar 16:9)

## Priority
If you only make a few: **S1 (top view), S2 (side view), M1 (moth wings open)**. Then S3-S5 for the poses. S6, M2, M3
and L1-L2 help but are optional.
