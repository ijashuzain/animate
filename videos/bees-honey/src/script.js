// =====================================================================
//  HOW DO BEES MAKE HONEY? — the scene list, drawn in a sketchbook. Bea, a forager bee, sips nectar, passes it on,
//  the house bees add enzymes, spread it into wax cells, fan the water out and cap it with wax. The turn: why
//  (food for winter); the payoff (after a hush): one bee's whole life makes about 1/12 of a teaspoon.
// =====================================================================
const SCN = [
  { key: 'hook', d: 12, tag: 'a question', mood: 'warm', focus: [480, 560], bg: '#f2ead8', scene: () => sHook(), card: (at) => cHook(at),
    say: "This jar of honey took a lot of work: hundreds of bees, millions of flowers, and tens of thousands of kilometres of flying. But flowers don't make honey. Bees do. So how?",
    sfx: [[0.6, 'scribble', 1.2], [10.2, 'ding']], pops: [3.8, 4.9, 6.2, 8.8] },
  { key: 'nectar', d: 13, tag: 'step 1', mood: 'groove', focus: [500, 560], bg: '#f2ead8', scene: () => sNectar(), card: (at) => cNectar(at),
    say: "Meet a forager bee. She visits flower after flower, sipping sugary nectar through her long tongue and storing it in a special second stomach, called a honey stomach, until it's nearly full.",
    sfx: [[1.0, 'whoosh', 0.8], [4.0, 'pop', 900], [4.6, 'pop', 1000], [5.2, 'pop', 1100]], pops: [1.6, 3.8, 6.4, 8.8] },
  { key: 'enzymes', d: 13, tag: 'step 2', mood: 'groove', focus: [500, 540], bg: '#f2ead8', scene: () => sEnzymes(), card: (at) => cEnzymes(at),
    say: "Back at the hive, she passes the nectar mouth to mouth to younger house bees. Each one adds enzymes that break the nectar's sugar into simpler sugars, the first step to honey.",
    sfx: [[2.6, 'pop', 1200], [4.0, 'pop', 1300], [5.4, 'pop', 1400], [8.0, 'chime', ['A5', 'E6']]], pops: [2.6, 6.0, 8.0, 10.6] },
  { key: 'cells', d: 13, tag: 'step 3', mood: 'groove', focus: [500, 540], bg: '#f2ead8', scene: () => sCells(), card: (at) => cCells(at),
    say: 'The house bees spread the drops into wax cells. But nectar is mostly water, around seventy to eighty percent. Honey is under twenty. Somehow, the bees have to get rid of all that water.',
    sfx: [[1.0, 'scribble', 1.0], [9.4, 'click']], pops: [4.8, 7.6, 9.4] },
  { key: 'fan', d: 13, tag: 'step 4', mood: 'groove', focus: [500, 540], bg: '#f2ead8', scene: () => sFan(), card: (at) => cFan(at),
    say: 'So they fan it. Thousands of bees beat their wings over the open cells, pushing warm air through the hive, until the nectar thickens into honey, about seventeen or eighteen percent water.',
    sfx: [[0.8, 'whoosh', 2.0], [4.0, 'whoosh', 2.0], [9.6, 'ding']], pops: [1.8, 5.6, 9.6] },
  { key: 'cap', d: 13, tag: 'step 5', mood: 'groove', focus: [500, 540], bg: '#f2ead8', scene: () => sCap(), card: (at) => cCap(at),
    say: "When it's ready, they seal each cell with a tiny lid of fresh beeswax, made in glands on their own bodies. Sealed and dry, honey keeps for an astonishingly long time, even years.",
    sfx: [[3.0, 'click'], [3.8, 'click'], [4.6, 'click'], [5.4, 'click'], [9.6, 'chime', ['D5', 'A5']]], pops: [3.4, 5.8, 9.6] },
  { key: 'winter', d: 14, tag: 'but why?', mood: 'groove', focus: [500, 540], bg: '#f2ead8', scene: () => sWinter(), card: (at) => cWinter(at),
    say: "But why go to all this trouble? Honey is the colony's food for winter, when there are no flowers. A strong hive can make far more than it needs, which is the extra that beekeepers collect.",
    sfx: [[3.0, 'whoosh', 1.4], [11.0, 'pop', 1500]], pops: [3.4, 5.4, 8.2, 11.2] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [495, 540], bg: '#f2ead8', scene: () => sHush(), card: null },
  { key: 'teaspoon', d: 14, tag: 'one life', mood: 'full', cut: true, focus: [495, 560], bg: '#f2ead8', scene: () => sSpoon(), card: (at) => cSpoon(at),
    say: "And here's the twist. In her whole life, about five or six busy weeks, one worker bee makes only about a twelfth of a teaspoon of honey. That's it. One tiny drop, from an entire life.",
    sfx: [[3.4, 'scribble', 1.6], [7.8, 'thud'], [11.4, 'chime', ['D5', 'Fs5', 'A5']]], pops: [3.4, 7.8, 11.4] },
  { key: 'end', d: 12, tag: 'so...', mood: 'warm', focus: [480, 560], bg: '#f2ead8', scene: () => sEnd(), card: (at) => cEnd(at),
    say: "So every jar of honey is hundreds of bees' whole lives, stirred together. Next time you spread some on toast, maybe say a little thank you to the bees.",
    sfx: [[9.0, 'chime', ['D5', 'A5', 'D6']]], pops: [1.6, 4.0, 5.6, 8.4] },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [
  { name: '1 Question', role: 'build',   t0: 0,  t1: 38 },
  { name: '2 The hive', role: 'journey', t0: 38, t1: 77 },
  { name: '3 Why',      role: 'peak',    t0: 77, t1: HIT - 2.5 },
  { name: '4 Hush',     role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 One life', role: 'gift',    t0: HIT, t1: HIT + 14 },
  { name: '6 End',      role: 'goodbye', t0: HIT + 14, t1: HIT + 26 },
];
const SCORE = { motif: ['G4', 'B4', 'D5', 'B4'] };
const META = {
  title: 'How Do Bees Make Honey? (One Bee Makes 1/12 of a Teaspoon) | Explained in 2 Minutes',
  alt: ['How Bees Make Honey, Step by Step', 'One Bee, One Life, One Tiny Drop of Honey'],
  hook: "Flowers don't make honey. Bees do. Here's how, and how little one bee makes in her whole life.",
  about: "Follow Bea, a forager bee, from flower to hive. Nectar goes into her honey stomach, house bees pass it mouth to mouth and add enzymes, spread it into wax cells, fan the water out until it is about 17-18% water, and seal each cell with beeswax. Honey is the colony's winter food, and a strong hive makes extra. The twist: in her five or six weeks of life, one worker makes only about a twelfth of a teaspoon.",
  chapters: [[0, 'The question'], [12, 'Sipping nectar'], [25, 'Enzymes'], [38, 'Too much water'], [51, 'Fanning it dry'], [64, 'Sealing with wax'], [77, 'Why bees make honey'], [93.5, 'One bee, one life'], [107.5, 'Summary']],
  sources: [
    'NC State University News, "How do bees make honey?" (2013): enzymes (invertase), passing nectar between bees, fanning, capping with beeswax',
    'Nectar is about 70-80% water; finished honey is about 17-18% water (bee extension and education sources)',
    'Worker bees live about five to six weeks in the active season (University of Tennessee Extension; Agroscope: 3-6 weeks)',
    'One worker makes about 1/12 teaspoon of honey in her lifetime; about 2 million flowers and ~55,000 miles of flying per pound (University of Illinois Extension; National Honey Board figures)',
  ],
  hashtags: ['#bees', '#honey', '#nature', '#explained', '#animation'],
  tags: ['how do bees make honey', 'how honey is made', 'honey bees', 'bees explained', 'beehive', 'beeswax', 'nature explained', 'science for kids', 'animated explainer'],
};
const THUMB = { t: 103.0, panel: '#fbf6ea', lines: [['One bee\'s', 80, '#2a1d18'], ['WHOLE LIFE', 120, '#2a1d18'], ['= 1/12', 170, '#c4542e'], ['teaspoon of honey', 58, '#2a1d18']] };
