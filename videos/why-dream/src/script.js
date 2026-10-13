// =====================================================================
//  WHY DO WE DREAM? — a question chain (studio/formats.md): every answer opens the next "but why?". Sketchbook,
//  lo-fi score; cloud-shape, page-turn, ink and fade transitions. The hero (the terracotta doodle) sleeps and dreams;
//  four ideas get their page; the twist: babies spend about half their sleep in REM.
// =====================================================================
const SCN = [
  { key: 'hook', d: 12, tag: 'why?', mood: 'warm', focus: [480, 560], bg: '#f2ead8', scene: () => sHook(), card: (at) => cHook(at),
    say: "Why does your brain spend about two hours every night making movies you'll never remember? You forget most of them by breakfast, and scientists still argue about the answer.",
    sfx: [[1.0, 'scribble', 0.8], [8.6, 'ding']], pops: [2.4, 5.0, 8.6] },
  { key: 'rem', d: 13, tag: 'when?', mood: 'groove', focus: [480, 560], bg: '#f2ead8', tr: { kind: 'shape', shape: 'cloud', p: [700, 300], spin: 0 }, scene: () => sRem(), card: (at) => cRem(at),
    say: "Most vivid dreams happen in REM sleep. Your eyes dart under closed lids, your brain lights up almost as if you were awake, and your body is kept still, so you don't act your dreams out.",
    sfx: [[3.0, 'tick'], [3.3, 'tick'], [3.6, 'tick'], [3.9, 'tick']], pops: [1.6, 3.4, 6.2, 9.6] },
  { key: 'noise', d: 13, tag: 'idea 1', mood: 'groove', focus: [480, 560], bg: '#f2ead8', tr: { kind: 'pageTurn', paper: '#e6dcc4' }, scene: () => sNoise(), card: (at) => cNoise(at),
    say: 'Idea one: dreams are noise. Signals fire up from the brainstem during REM, and the rest of the brain stitches them into a story, the best it can. Weird plots included.',
    sfx: [[2.0, 'beep', 900], [2.6, 'beep', 1300], [3.2, 'beep', 700], [6.4, 'scribble', 1.0]], pops: [1.4, 4.2, 7.6, 10.6] },
  { key: 'filing', d: 13, tag: 'idea 2', mood: 'groove', focus: [480, 560], bg: '#f2ead8', tr: { kind: 'pageTurn', paper: '#e6dcc4' }, scene: () => sFiling(), card: (at) => cFiling(at),
    say: "Idea two: dreams help you remember. While you sleep, your brain replays bits of the day and files the important ones away. Sleep's link to memory has some of the strongest support in the lab.",
    sfx: [[4.0, 'paper'], [5.0, 'paper'], [6.0, 'paper'], [9.4, 'ding']], pops: [1.4, 4.0, 9.4] },
  { key: 'feelings', d: 13, tag: 'idea 3', mood: 'groove', focus: [480, 560], bg: '#f2ead8', tr: { kind: 'ink', d: 0.7, key: 'feel' }, scene: () => sFeelings(), card: (at) => cFeelings(at),
    say: 'Idea three: dreams soften feelings. REM sleep may replay emotional moments with the stress turned down, a kind of overnight therapy. That might be why a bad day can feel smaller in the morning.',
    sfx: [[7.6, 'chime', ['A4', 'C5', 'E5']]], pops: [1.4, 4.0, 7.6, 10.0] },
  { key: 'rehearsal', d: 13, tag: 'idea 4', mood: 'tense', focus: [480, 560], bg: '#f2ead8', tr: { kind: 'pageTurn', paper: '#e6dcc4' }, scene: () => sRehearsal(), card: (at) => cRehearsal(at),
    say: "Idea four: dreams are practice. Being chased, falling, missing a test: one theory says the brain rehearses threats in a safe place, like an ancient survival drill, so you're ready for the real thing.",
    sfx: [[1.6, 'whoosh', 1.0], [3.4, 'thud'], [8.4, 'rise', 1.0]], pops: [1.4, 4.4, 8.4] },
  { key: 'which', d: 12, tag: 'so which?', mood: 'groove', focus: [480, 560], bg: '#f2ead8', tr: { kind: 'fade' }, scene: () => sWhich(), card: (at) => cWhich(at),
    say: 'So which idea is right? Honestly, nobody knows for certain. Dreams might do several of these jobs at once, and new studies keep adding pieces to the puzzle.',
    sfx: [[1.6, 'pencil'], [3.4, 'pencil'], [6.0, 'pencil'], [8.0, 'pencil']], pops: [1.6, 3.4, 6.4] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [480, 560], bg: '#f2ead8', scene: () => sHush(), card: null },
  { key: 'babies', d: 14, tag: 'the clue', mood: 'full', cut: true, focus: [480, 560], bg: '#f2ead8', scene: () => sBabies(), card: (at) => cBabies(at),
    say: "But here's a clue. Newborn babies spend about half their sleep in REM, far more than adults. One idea is that dreaming sleep helps build and wire the brain itself, while it's still growing.",
    sfx: [[3.0, 'scribble', 1.0], [9.0, 'chime', ['C5', 'E5', 'G5']]], pops: [0.4, 3.4, 9.0] },
  { key: 'end', d: 12, tag: 'so...', mood: 'warm', focus: [480, 560], bg: '#f2ead8', tr: { kind: 'shape', shape: 'cloud', p: [700, 300], spin: 0 }, scene: () => sEnd(), card: (at) => cEnd(at),
    say: "So tonight, when your eyes start to dart, your brain gets busy: sorting, soothing, rehearsing, maybe building a little more of itself. You just won't remember most of it. Sweet dreams.",
    sfx: [[9.6, 'chime', ['C5', 'G5', 'C6']]], pops: [1.6, 4.4, 8.6] },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [
  { name: '1 Question', role: 'build',   t0: 0,  t1: 38 },
  { name: '2 Ideas',    role: 'journey', t0: 38, t1: 77 },
  { name: '3 Which?',   role: 'peak',    t0: 77, t1: HIT - 2.5 },
  { name: '4 Hush',     role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 Clue',     role: 'gift',    t0: HIT, t1: HIT + 14 },
  { name: '6 End',      role: 'goodbye', t0: HIT + 14, t1: HIT + 26 },
];
const SCORE = { genre: 'lofi' };
const META = {
  title: 'Why Do We Dream? 4 Ideas Scientists Still Argue About',
  alt: ['Why Do We Dream? The Science, Simply Explained', 'Your Brain Dreams for 2 Hours a Night. Here Is Why (Maybe)'],
  hooks: [
    "Last night you probably spent about two hours dreaming, and you've already forgotten most of it.",
    "You dream for about two hours every night, and nobody knows for certain why.",
    "Being chased in a dream might be your brain running a survival drill. Or it might be noise.",
    "Newborn babies spend about half their sleep dreaming. That might be the biggest clue to why you dream.",
    "Why does your brain spend two hours a night making movies you never remember?",
  ],
  queries: ['why do we dream', 'what are dreams for', 'rem sleep dreams'],
  hook: 'Why do we dream? You spend about two hours a night in dreams, mostly in REM sleep, and scientists still argue what they are for.',
  about: 'Four ideas, each answering the last "but why?": dreams as the brain stitching random signals into a story, as memory filing, as overnight emotional therapy, and as a survival drill. Nobody knows for certain which is right, but newborn babies, who spend about half their sleep in REM, offer a clue.',
  chapters: [[0, 'Why do we dream?'], [12, 'REM sleep'], [25, 'Idea 1: noise'], [38, 'Idea 2: memory'], [51, 'Idea 3: feelings'], [64, 'Idea 4: practice'], [77, 'So which is it?'], [91.5, "The babies' clue"], [105.5, 'Summary']],
  sources: [
    'Sleep Foundation, "How long do dreams last?": about two hours of dreaming a night; REM periods grow from ~10 minutes to up to an hour across the night',
    'Healthline: scientists don\'t know for certain why we dream; infants spend much of their sleep in REM (developmental idea)',
    'Lumen Learning, Introduction to Psychology (Dreams and Dreaming): activation-synthesis (Hobson and McCarley), threat simulation (Revonsuo), memory consolidation, emotional processing',
    'Newborns spend roughly half their sleep in REM (standard sleep-medicine figure; stated from knowledge)',
  ],
  hashtags: ['#dreams', '#sleep', '#brain', '#science', '#animation'],
  tags: ['why do we dream', 'what are dreams', 'rem sleep', 'dream science', 'why dreams happen', 'sleep science', 'brain explained', 'animated explainer'],
};
const THUMB = { t: 70.0, panel: '#f2ead8', lines: [['NOBODY', 170, '#2a2420'], ['KNOWS', 190, '#b85c3f']] };
