// =====================================================================
//  WHO KILLED THE DINOSAURS? — a mystery (studio/formats.md): the case, four clues, a second suspect, a hush, and the
//  twist: not every dinosaur died (birds are dinosaurs). Crosshatch ink on paper, mystery score; transitions: dip,
//  zoom (into the clay, into the crater), shutter (look closer), scatter (the eruption).
// =====================================================================
const SCN = [
  { key: 'hook', d: 12, tag: 'the case', mood: 'warm', focus: [480, 560], bg: '#f4ecd9', scene: () => sHook(), card: (at) => cHook(at),
    say: "Nobody saw the dinosaurs die. But sixty-six million years later, you can still touch the clues the killer left. They're hidden in a thin layer of clay.",
    sfx: [[0.8, 'drone', 3.0], [7.2, 'paper']], pops: [1.2, 2.6, 7.2] },
  { key: 'victims', d: 13, tag: 'the victims', mood: 'tense', focus: [480, 560], bg: '#e9dcc0', tr: { kind: 'dip', color: '#1b1410' }, scene: () => sVictims(), card: (at) => cVictims(at),
    say: "The victims: about three quarters of all plant and animal species, including T. rex and Triceratops. The suspects: disease, a changing climate, giant volcanoes, or something from space. Let's look at the evidence.",
    sfx: [[5.0, 'paper'], [5.8, 'paper'], [6.6, 'paper'], [7.4, 'paper']], pops: [1.4, 5.0, 10.6] },
  { key: 'clay', d: 13, tag: 'clue 1', mood: 'groove', focus: [480, 560], bg: '#e9dcc0', tr: { kind: 'zoom', p: [480, 620], pb: [480, 560], z: 7 }, scene: () => sClay(), card: (at) => cClay(at),
    say: 'Clue one: the clay. All over the world, rocks from that moment share one thin layer. Below it, dinosaur fossils. Above it, none, ever again. Whatever happened, it happened fast, in geological terms.',
    sfx: [[5.4, 'thud'], [8.0, 'click']], pops: [1.4, 5.4, 8.0, 10.4] },
  { key: 'iridium', d: 13, tag: 'clue 2', mood: 'groove', focus: [480, 560], bg: '#e9dcc0', tr: { kind: 'shutter', p: [480, 560] }, scene: () => sIridium(), card: (at) => cIridium(at),
    say: "Clue two: in nineteen eighty, Luis and Walter Alvarez found that this clay is loaded with iridium, hundreds of times more than normal. Iridium is rare on Earth's surface, but common in asteroids.",
    sfx: [[3.0, 'typing', 10], [8.4, 'ding']], pops: [1.4, 4.4, 8.4, 10.4] },
  { key: 'quartz', d: 13, tag: 'clue 3', mood: 'groove', focus: [480, 560], bg: '#e9dcc0', tr: { kind: 'shutter', p: [480, 560] }, scene: () => sQuartz(), card: (at) => cQuartz(at),
    say: "Clue three: inside the layer, there's shocked quartz, crystals cracked by a sudden, enormous pressure, and tiny glass beads, melted rock that rained back down from the sky. Both are the fingerprints of an impact.",
    sfx: [[2.4, 'click'], [2.6, 'click'], [6.4, 'drip'], [6.8, 'drip'], [7.2, 'drip']], pops: [1.4, 3.6, 6.4, 10.0] },
  { key: 'crater', d: 14, tag: 'clue 4', mood: 'groove', focus: [480, 560], bg: '#e9dcc0', tr: { kind: 'dip', color: '#1b1410' }, scene: () => sCrater(), card: (at) => cCrater(at),
    say: "Clue four: the weapon. Buried under Mexico's Yucatán coast is a crater about one hundred and eighty kilometres wide, called Chicxulub. It's the same age as the clay. A rock around ten kilometres across hit right here.",
    sfx: [[3.0, 'rise', 1.0], [10.6, 'thud']], pops: [1.4, 4.4, 8.4, 11.0] },
  { key: 'volcano', d: 13, tag: 'suspect 2', mood: 'tense', focus: [480, 560], bg: '#e9dcc0', tr: { kind: 'scatter', d: 0.7 }, scene: () => sVolcano(), card: (at) => cVolcano(at),
    say: "But there's a second suspect. Around the same time, enormous volcanic eruptions in India, the Deccan Traps, poured out lava and gases over a very long time. Scientists still debate how much they helped.",
    sfx: [[3.0, 'thud'], [5.0, 'thud'], [7.0, 'drone', 3.0]], pops: [1.4, 4.0, 9.6] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [480, 560], bg: '#1b1410', scene: () => sHush(), card: null },
  { key: 'birds', d: 14, tag: 'the twist', mood: 'full', cut: true, focus: [480, 560], bg: '#f4ecd9', scene: () => sBirds(), card: (at) => cBirds(at),
    say: 'And here\'s the twist: not every dinosaur died. Birds are dinosaurs, and scientists think a few small, ground-dwelling birds made it through the darkness that followed. Every pigeon, chicken and sparrow today descends from those survivors.',
    sfx: [[3.6, 'chime', ['D5', 'F5', 'A5']], [9.0, 'pop', 1400], [9.4, 'pop', 1600], [9.8, 'pop', 1800]], pops: [0.4, 3.6, 9.0] },
  { key: 'end', d: 12, tag: 'case closed', mood: 'warm', focus: [480, 560], bg: '#f4ecd9', tr: { kind: 'dip', color: '#1b1410' }, scene: () => sEnd(), card: (at) => cEnd(at),
    say: 'So, case closed: an asteroid, maybe with help from volcanoes. The proof was in the clay. And the next time a bird lands outside your window, say hello to a dinosaur.',
    sfx: [[1.4, 'thud'], [9.0, 'chime', ['D5', 'A5', 'D6']]], pops: [1.4, 4.4, 8.4] },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [
  { name: '1 The case',  role: 'build',   t0: 0,  t1: 38 },
  { name: '2 Clues',     role: 'journey', t0: 38, t1: 78 },
  { name: '3 Suspect 2', role: 'peak',    t0: 78, t1: HIT - 2.5 },
  { name: '4 Hush',      role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 Twist',     role: 'gift',    t0: HIT, t1: HIT + 14 },
  { name: '6 End',       role: 'goodbye', t0: HIT + 14, t1: HIT + 26 },
];
const SCORE = { genre: 'mystery' };
const META = {
  title: 'Who Killed the Dinosaurs? 4 Clues From 66 Million Years Ago',
  alt: ['What Killed the Dinosaurs? The Evidence, Explained', 'The Dinosaur Mystery Solved in a Layer of Clay'],
  hooks: [
    'Nobody saw the dinosaurs die. But sixty-six million years later, you can still touch the clues the killer left.',
    'Three quarters of all species died at once, sixty-six million years ago. Who did it?',
    'The weapon that killed the dinosaurs is still buried under Mexico, one hundred and eighty kilometres wide.',
    'Not every dinosaur died. You probably saw one this morning.',
    'There were no witnesses when the dinosaurs died, but the evidence never left. Here are the four clues.',
  ],
  queries: ['who killed the dinosaurs', 'what killed the dinosaurs', 'dinosaur extinction asteroid'],
  hook: 'What killed the dinosaurs? Four clues in a thin layer of clay point to an asteroid, with a second suspect: giant volcanoes.',
  about: 'A dinosaur extinction mystery in four clues: the K-Pg boundary clay, the Alvarez iridium discovery (1980), shocked quartz and glass beads, and the Chicxulub crater, plus the Deccan Traps volcanoes as a second suspect. And the twist: birds are dinosaurs, and some survived.',
  chapters: [[0, 'The case'], [12, 'The victims and suspects'], [25, 'Clue 1: the clay'], [38, 'Clue 2: iridium'], [51, 'Clue 3: shocked quartz'], [64, 'Clue 4: the crater'], [78, 'The second suspect'], [93.5, 'The twist: birds'], [107.5, 'Case closed']],
  sources: [
    'Alvarez, Alvarez, Asaro and Michel, Science (1980): iridium at the Cretaceous-Paleogene boundary hundreds of times normal levels; impact hypothesis',
    'K-Pg extinction ~66 million years ago (66.043 +/- 0.011 Ma); about 75% of plant and animal species lost, all non-avian dinosaurs (Wikipedia: Cretaceous-Paleogene boundary / Alvarez hypothesis)',
    'Chicxulub, Yucatan: a 10-15 km impactor (2010 review panel); crater about 180 km across (commonly cited; stated from knowledge)',
    'Birds are dinosaurs (National Geographic, L. Chiappe); small ground-dwelling birds likely survived (Field et al., Current Biology 2018)',
    'Shocked quartz and impact spherules in the boundary layer; Deccan Traps volcanism as a debated contributor (stated from knowledge)',
  ],
  hashtags: ['#dinosaurs', '#history', '#science', '#mystery', '#animation'],
  tags: ['who killed the dinosaurs', 'what killed the dinosaurs', 'dinosaur extinction', 'chicxulub', 'asteroid impact', 'iridium layer', 'birds are dinosaurs', 'animated explainer'],
};
const THUMB = { t: 72.0, panel: '#f4ecd9', lines: [['CASE', 200, '#3a2417'], ['CLOSED?', 170, '#d4382c']] };
