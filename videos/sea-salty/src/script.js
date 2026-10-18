// =====================================================================
//  WHY IS THE SEA SALTY BUT RIVERS AREN'T? — a mystery (studio/formats.md): the case, the evidence, four clues, the turn
//  (why it isn't getting saltier), a hush, and the answer: the rivers were salty all along. Riso print on calm flat
//  fields (no dot screens behind words); mystery score; transitions: drop (water), wave wipe, ink.
// =====================================================================
const SCN = [
  { key: 'hook', d: 12, tag: 'the case', mood: 'warm', focus: [480, 560], bg: '#e9f1ee', scene: () => sHook(), card: (at) => cHook(at),
    say: "You could never drink the sea: there's 35 grams of salt in every litre. But the rivers that fill it are fresh. So where does the salt come from?",
    sfx: [[1.0, 'drip'], [1.4, 'drip'], [7.6, 'pop', 900]], pops: [1.2, 4.6, 8.4] },
  { key: 'evidence', d: 13, tag: 'the evidence', mood: 'tense', focus: [480, 560], bg: '#e9f1ee', tr: { kind: 'shape', shape: 'drop', p: [480, 520] }, scene: () => sEvidence(), card: (at) => cEvidence(at),
    say: "First, the evidence. That's about three and a half percent of every glass. Spread all the sea's salt over the land, and it would make a layer about one hundred and sixty-six metres thick.",
    sfx: [[3.0, 'coin'], [3.3, 'coin'], [3.6, 'coin'], [8.6, 'rise', 1.4]], pops: [1.4, 3.0, 8.6, 10.6] },
  { key: 'rain', d: 13, tag: 'clue 1', mood: 'groove', focus: [480, 560], bg: '#e9f1ee', tr: { kind: 'wipe', dir: 90, edge: 'wave' }, scene: () => sRain(), card: (at) => cRain(at),
    say: "Clue one: the rain. Raindrops pick up a little carbon dioxide from the air, which makes them slightly acidic. Over thousands of years, that weak acid slowly dissolves rock.",
    sfx: [[1.2, 'drip'], [1.6, 'drip'], [2.0, 'drip'], [2.4, 'drip'], [8.0, 'paper']], pops: [1.4, 4.4, 8.4] },
  { key: 'rivers', d: 13, tag: 'clue 2', mood: 'groove', focus: [480, 560], bg: '#e9f1ee', tr: { kind: 'ink', d: 0.7, key: 'rv' }, scene: () => sRivers(), card: (at) => cRivers(at),
    say: "Clue two: the rivers. They carry those dissolved minerals, like sodium and chloride, all the way to the sea. River water does contain salt. Just far too little for you to taste.",
    sfx: [[2.0, 'pop', 1200], [2.6, 'pop', 1400], [3.2, 'pop', 1100]], pops: [1.4, 4.0, 8.0, 10.4] },
  { key: 'vents', d: 13, tag: 'clue 3', mood: 'tense', focus: [480, 560], bg: '#e9f1ee', tr: { kind: 'shape', shape: 'drop', p: [480, 760] }, scene: () => sVents(), card: (at) => cVents(at),
    say: "Clue three: the sea floor. Deep down, hot vents pour out water loaded with dissolved minerals from the rock below. The whole ocean may pass through these vents every ten to twenty million years.",
    sfx: [[1.6, 'drone', 3.0], [6.0, 'bubble'], [6.4, 'bubble'], [6.8, 'bubble']], pops: [1.4, 4.8, 9.0] },
  { key: 'sun', d: 14, tag: 'clue 4', mood: 'groove', focus: [480, 560], bg: '#e9f1ee', tr: { kind: 'wipe', dir: -90, edge: 'wave' }, scene: () => sSun(), card: (at) => cSun(at),
    say: "Clue four: the Sun. It lifts water off the sea as vapour, but salt can't evaporate. So the water leaves, falls again as fresh rain, and the salt stays behind, trapped.",
    sfx: [[2.0, 'rise', 1.2], [8.4, 'thud']], pops: [1.4, 4.4, 8.4, 11.0] },
  { key: 'turn', d: 13, tag: 'but wait', mood: 'tense', focus: [480, 560], bg: '#e9f1ee', tr: { kind: 'ink', d: 0.7, key: 'tw' }, scene: () => sTurn(), card: (at) => cTurn(at),
    say: "But then, why isn't the sea getting saltier every year? Because salt leaves too. Some sinks into the mud of the sea floor, and sea life uses some, so the saltiness stays about the same.",
    sfx: [[5.0, 'drip'], [7.0, 'thud']], pops: [1.4, 5.0, 9.4] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [480, 560], bg: '#d4e6e2', scene: () => sHush(), card: null },
  { key: 'answer', d: 14, tag: 'case solved', mood: 'full', cut: true, focus: [480, 560], bg: '#f2e6c8', scene: () => sAnswer(), card: (at) => cAnswer(at),
    say: "So here's the answer. The rivers were never really fresh. They have been carrying a pinch of salt to the sea for hundreds of millions of years, and the sea is where the water leaves and the salt stays.",
    sfx: [[0.4, 'thud'], [3.4, 'chime', ['D5', 'F5', 'A5']], [9.0, 'pop', 1500]], pops: [0.4, 3.4, 9.0] },
  { key: 'end', d: 12, tag: 'so...', mood: 'warm', focus: [480, 560], bg: '#e9f1ee', tr: { kind: 'shape', shape: 'drop', p: [480, 520] }, scene: () => sEnd(), card: (at) => cEnd(at),
    say: "So the next time you swallow a wave at the beach, remember what you're really tasting: old mountains, dissolved by rain, carried by rivers, and left behind by the Sun.",
    sfx: [[1.0, 'drip'], [8.6, 'chime', ['D5', 'A5', 'D6']]], pops: [1.6, 4.4, 8.4] },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [
  { name: '1 The case', role: 'build',   t0: 0,  t1: 25 },
  { name: '2 Clues',    role: 'journey', t0: 25, t1: 78 },
  { name: '3 The turn', role: 'peak',    t0: 78, t1: HIT - 2.5 },
  { name: '4 Hush',     role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 Answer',   role: 'gift',    t0: HIT, t1: HIT + 14 },
  { name: '6 End',      role: 'goodbye', t0: HIT + 14, t1: HIT + 26 },
];
const SCORE = { genre: 'mystery' };
const META = {
  title: 'Where Does the Sea Get Its Salt? 4 Clues',
  alt: ["Why Is the Sea Salty but Rivers Aren't? 4 Clues", 'Why Is the Ocean Salty? The Mystery, Solved'],
  hooks: [
    "You could never drink the sea: there's 35 grams of salt in every litre. But the rivers that fill it are fresh. So where does the salt come from?",
    "If you spread all the salt in the sea over the land, it would be 166 metres thick. So where did it come from?",
    "Why is the sea salty when every river that fills it is fresh? You've tasted the answer, you just didn't know it.",
    "The rivers that fill the sea are salty too. You just can't taste it. Here's the case.",
    "Every litre of seawater holds 35 grams of salt. Not one river is that salty. So where does it come from?",
  ],
  queries: ['why is the sea salty', 'why is the ocean salty', 'where does salt in the ocean come from'],
  hook: 'Why is the sea salty when rivers are fresh? Four clues about where the salt in the ocean comes from: rain, rivers, sea-floor vents and the Sun.',
  about: "Why is the ocean salty but rivers aren't? Rain dissolves rock, rivers carry the minerals to the sea, hot vents on the sea floor add more, and evaporation lifts the water but leaves the salt behind. The twist: the rivers were never really fresh.",
  chapters: [[0, 'The case'], [12, 'The evidence'], [25, 'Clue 1: rain'], [38, 'Clue 2: rivers'], [51, 'Clue 3: sea-floor vents'], [64, 'Clue 4: the Sun'], [78, "Why isn't it getting saltier?"], [93.5, 'Case solved'], [107.5, 'Summary']],
  sources: [
    'USGS Water Science School, "Why is the ocean salty?": rain dissolves rock via carbonic acid; rivers carry ions to the sea; hydrothermal vents and undersea volcanism add salts; the ocean may circulate through vents every 10-20 million years; NOAA: the salt spread over land would be over 166 m deep',
    'WHOI, "What makes the ocean salty?" (sources and sinks of sea salt)',
    'About 35 g of salt per litre of seawater (average salinity ~35 parts per thousand; stated from knowledge)',
    'Salinity roughly steady because salts are removed (sediments, uptake by organisms) as fast as they arrive (USGS; secondary summaries)',
  ],
  hashtags: ['#ocean', '#science', '#mystery', '#explained', '#animation'],
  tags: ['why is the sea salty', 'why is the ocean salty', 'ocean salt', 'where does sea salt come from', 'rivers fresh water', 'hydrothermal vents', 'evaporation', 'animated explainer'],
};
const THUMB = { t: 98.0, panel: '#f2e6c8', lines: [['RIVERS', 150, '#2b2f3a'], ['DID IT', 170, '#e0509f']] };
