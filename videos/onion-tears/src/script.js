// =====================================================================
//  WHY DO ONIONS MAKE YOU CRY? — a question chain (studio/formats.md): every answer opens the next "but why?".
//  Cut-paper (an onion is paper layers), pizzicato score; transitions: zoom into the onion, a cell shape, a knife-cut
//  wipe, a tear drop. Peekaboo moves: a lens into the cells, chemicals with faces, labels that point, a sound per pop.
// =====================================================================
const SCN = [
  { key: 'hook', d: 12, tag: 'why?', mood: 'warm', focus: [480, 560], bg: '#f3e3c3', scene: () => sHook(), card: (at) => cHook(at),
    say: "You've cried over an onion, and you weren't sad. Your eyes were under chemical attack. So why does an onion make you cry, and how do you stop it?",
    sfx: [[1.0, 'click'], [1.4, 'click'], [1.8, 'click'], [6.2, 'drip']], pops: [1.2, 4.6, 8.6] },
  { key: 'cells', d: 13, tag: 'but why?', mood: 'groove', focus: [480, 560], bg: '#e9e2c0', tr: { kind: 'zoom', p: [430, 600], pb: [480, 540], z: 6 }, scene: () => sCells(), card: (at) => cCells(at),
    say: "An onion is made of millions of tiny cells. Each one keeps two things apart: sulfur chemicals, and enzymes that can change them. Your knife breaks the walls, and the two finally meet.",
    sfx: [[2.0, 'pop', 900], [2.4, 'pop', 1100], [8.6, 'paper']], pops: [1.4, 4.4, 8.6, 10.8] },
  { key: 'enzymes', d: 13, tag: 'and then?', mood: 'groove', focus: [480, 560], bg: '#e9e2c0', tr: { kind: 'shape', shape: 'cell', p: [480, 540] }, scene: () => sEnzymes(), card: (at) => cEnzymes(at),
    say: "First, an enzyme called alliinase turns the sulfur chemicals into an acid. Then a second enzyme, found in 2002, turns that acid into a gas with a very long name. Try saying it with watery eyes.",
    sfx: [[2.4, 'pop', 1300], [6.4, 'pop', 1600], [9.6, 'ding']], pops: [1.4, 2.4, 6.4, 9.6] },
  { key: 'gas', d: 13, tag: 'but why?', mood: 'groove', focus: [480, 560], bg: '#f3e3c3', tr: { kind: 'wipe', dir: 35, edge: 'straight' }, scene: () => sGas(), card: (at) => cGas(at),
    say: "That gas is light. It drifts up off the cutting board, straight toward the face of the person holding the knife. The closer you lean in, the more of it you meet.",
    sfx: [[1.6, 'whoosh', 1.4], [6.0, 'whoosh', 1.0]], pops: [1.4, 4.6, 8.8] },
  { key: 'eyes', d: 13, tag: 'and why tears?', mood: 'tense', focus: [480, 560], bg: '#d9ecf2', tr: { kind: 'shape', shape: 'drop', p: [520, 420] }, scene: () => sEyes(), card: (at) => cEyes(at),
    say: "When the gas touches your eyes, it irritates the nerves on their surface. Your brain treats it as an attack, and tells your tear glands to wash it away. Tears are your eyes' rinse.",
    sfx: [[3.0, 'buzz', 0.8], [6.6, 'drip'], [7.0, 'drip'], [7.4, 'drip']], pops: [1.4, 3.0, 6.6, 10.0] },
  { key: 'defence', d: 13, tag: 'but why would it?', mood: 'tense', focus: [480, 560], bg: '#c9b48a', tr: { kind: 'doors' }, scene: () => sDefence(), card: (at) => cDefence(at),
    say: "Scientists think it's a defence. Onions grow in the ground, where hungry animals dig and bite. One bite breaks the cells, and the attacker gets a face full of stinging gas.",
    sfx: [[2.0, 'paper'], [6.8, 'thud'], [7.2, 'whoosh', 0.8]], pops: [1.4, 4.6, 7.2] },
  { key: 'tips', d: 13, tag: 'so what helps?', mood: 'groove', focus: [480, 560], bg: '#f3e3c3', tr: { kind: 'wipe', dir: 35, edge: 'straight' }, scene: () => sTips(), card: (at) => cTips(at),
    say: "Chill the onion first, because cold slows the enzymes down. Use a sharp knife, which breaks fewer cells. And let a fan or an open window carry the gas away from your face.",
    sfx: [[1.6, 'ding'], [5.2, 'ding'], [9.2, 'ding']], pops: [1.6, 5.2, 9.2] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [480, 560], bg: '#e9e2c0', scene: () => sHush(), card: null },
  { key: 'twist', d: 14, tag: 'the twist', mood: 'full', cut: true, focus: [480, 560], bg: '#f6d978', scene: () => sTwist(), card: (at) => cTwist(at),
    say: "And here's the twist: a tearless onion already exists. In 2018, the Sunion went on sale in America. It took about thirty years of ordinary breeding, choosing the mildest onions again and again.",
    sfx: [[0.4, 'chime', ['G5', 'B5', 'D6']], [5.0, 'pop', 1500], [9.0, 'pop', 1700]], pops: [0.4, 5.0, 9.0] },
  { key: 'end', d: 12, tag: 'so...', mood: 'warm', focus: [480, 560], bg: '#f3e3c3', tr: { kind: 'doors' }, scene: () => sEnd(), card: (at) => cEnd(at),
    say: "So the next time an onion makes you cry, don't take it personally. It's just a plant protecting itself, one tiny cell at a time. Pass the tissues.",
    sfx: [[8.4, 'chime', ['G5', 'D6', 'G6']]], pops: [1.6, 4.4, 8.4] },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [
  { name: '1 Why?',     role: 'build',   t0: 0,  t1: 38 },
  { name: '2 The chain', role: 'journey', t0: 38, t1: 77 },
  { name: '3 What helps', role: 'peak',   t0: 77, t1: HIT - 2.5 },
  { name: '4 Hush',     role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 Twist',    role: 'gift',    t0: HIT, t1: HIT + 14 },
  { name: '6 End',      role: 'goodbye', t0: HIT + 14, t1: HIT + 26 },
];
const SCORE = { genre: 'pizzicato' };
const META = {
  title: 'Why Do Onions Make You Cry? 30 Years to Fix It',
  alt: ['Why Do Onions Make You Cry? The 2-Enzyme Trap', 'Why Onions Make You Cry (and the Tearless Onion)'],
  hooks: [
    "You've cried over an onion, and you weren't sad. Your eyes were under chemical attack. So why does an onion make you cry, and how do you stop it?",
    "Every time you cut an onion, it fires a chemical weapon at your face. You just never noticed it was aimed at you.",
    "Why do onions make you cry? It took scientists until 2002 to find the enzyme that does it.",
    "A tearless onion exists, and it took 30 years to make. But first: why does a normal one make you cry?",
    "You've cried over an onion. You weren't sad. You were hit by a gas built to stop animals eating it.",
  ],
  queries: ['why do onions make you cry', 'how to cut onions without crying', 'tearless onion'],
  hook: 'Why do onions make you cry? Cutting an onion sets off a 2-enzyme chemical trap. Plus how to cut onions without crying, and the tearless onion.',
  about: "Why do onions make you cry? When you cut one, enzymes turn its sulfur chemicals into an irritating gas (syn-propanethial-S-oxide) that drifts up to your eyes, and your tear glands wash it away. Scientists think it's a defence against animals, and a tearless onion, the Sunion, took 30 years of breeding.",
  chapters: [[0, 'Why do onions make you cry?'], [12, 'Inside the cells'], [25, 'Two enzymes'], [38, 'The gas'], [51, 'Why tears?'], [64, 'A defence'], [77, 'How to cut onions without crying'], [92.5, 'The tearless onion'], [106.5, 'Summary']],
  sources: [
    'Library of Congress, Everyday Mysteries, "Why does chopping an onion make you cry?": syn-propanethial-S-oxide stimulates the lachrymal glands',
    'Imai et al., Nature (2002): lachrymatory-factor synthase, a second enzyme after alliinase (McGill Office for Science and Society summary)',
    'NPR The Salt (2018-02-08), "Stop Crying! Tear-Free Onions Are Here": Sunions, ~30 years of conventional cross-breeding by Bayer',
    'Chilling slows the enzymes; a sharp knife damages fewer cells (Healthline; Tasting Table; Chowhound)',
    'The irritant as a defence against animals that eat the bulb (scientists think; secondary sources)',
  ],
  hashtags: ['#onions', '#science', '#cooking', '#chemistry', '#animation'],
  tags: ['why do onions make you cry', 'onion tears', 'how to cut onions without crying', 'tearless onion', 'sunions', 'syn-propanethial-S-oxide', 'kitchen science', 'animated explainer'],
};
const THUMB = { t: 72.0, panel: '#f3e3c3', lines: [["IT'S A", 150, '#2a1d18'], ['TRAP', 210, '#c4542e']] };
