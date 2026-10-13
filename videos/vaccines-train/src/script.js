// =====================================================================
//  HOW DO VACCINES TRAIN YOUR BODY? — the scene list. Wes, a white blood cell, gets shown a germ's "wanted poster"
//  before the real germ ever arrives: antigens are the face, the first meeting is slow, a vaccine shows the face
//  without the fight, messenger cells carry the poster, an army is built, memory cells keep the poster up.
//  The turn: the rematch; the payoff (after a hush): smallpox gone, 154 million lives in 50 years.
// =====================================================================
const SCN = [
  { key: 'hook', d: 13, tag: 'a question', mood: 'warm', focus: [495, 560], bg: '#f8c3d4', scene: () => sHook(), card: (at) => cHook(at),
    say: "Your body has never met this germ. Yet after one small shot, it knows what the germ looks like and how to beat it. How do you train for an enemy you've never met?",
    sfx: [[4.4, 'click'], [6.2, 'pop', 1500], [9.0, 'ding']], pops: [4.2, 6.6, 9.0] },
  { key: 'face', d: 13, tag: 'step 1', mood: 'groove', focus: [470, 540], bg: '#a9d9c6', scene: () => sFace(), card: (at) => cFace(at),
    say: 'Germs like viruses and bacteria are covered in unique shapes, called antigens. Think of them as a face. Your immune system learns to recognise that face, and then hunts down anything wearing it.',
    sfx: [[3.6, 'pop', 1300], [3.8, 'pop', 1500], [4.0, 'pop', 1700], [4.2, 'pop', 1900]], pops: [2.4, 4.4, 7.2, 10.0] },
  { key: 'first', d: 13, tag: 'step 2', mood: 'groove', focus: [495, 540], bg: '#e9b9a4', scene: () => sFirst(), card: (at) => cFirst(at),
    say: 'Normally, the first time a germ invades, your body is caught off guard. It can take a week or two to build the right defences. Meanwhile, the germ multiplies, and you get sick.',
    sfx: [[9.0, 'pop', 700], [9.4, 'pop', 800], [9.8, 'pop', 900], [10.2, 'pop', 1000]], pops: [2.0, 5.0, 9.0, 11.2] },
  { key: 'vaccine', d: 14, tag: 'step 3', mood: 'groove', focus: [495, 520], bg: '#cfe2ee', scene: () => sVaccine(), card: (at) => cVaccine(at),
    say: "A vaccine skips the danger. It shows your body the germ's face without the real fight: a weakened or killed germ, just a harmless piece of it, or instructions for your own cells to make that piece.",
    sfx: [[1.0, 'whoosh', 0.8], [6.2, 'thud'], [8.0, 'click'], [10.0, 'scribble', 0.5]], pops: [2.4, 6.2, 8.0, 10.0] },
  { key: 'poster', d: 13, tag: 'step 4', mood: 'groove', focus: [495, 540], bg: '#d9c8ec', scene: () => sPoster(), card: (at) => cPoster(at),
    say: 'Sentinel cells grab that piece and carry it to your lymph nodes, like a wanted poster. There they show it around until they find the immune cells with exactly the right match.',
    sfx: [[5.6, 'scribble', 0.5], [10.6, 'ding']], pops: [1.6, 4.4, 7.0, 10.6] },
  { key: 'army', d: 13, tag: 'step 5', mood: 'groove', focus: [495, 540], bg: '#fbe6a2', scene: () => sArmy(), card: (at) => cArmy(at),
    say: "Then the match multiplies. B cells pump out antibodies, tiny Y-shaped tags that latch onto the germ's face, and killer T cells destroy infected cells. Your body has built an army for this one enemy.",
    sfx: [[0.8, 'pop', 1000], [1.2, 'pop', 1200], [1.6, 'pop', 1400], [4.0, 'whoosh', 0.6], [8.4, 'click']], pops: [3.0, 5.2, 8.4, 10.6] },
  { key: 'memory', d: 13, tag: 'step 6', mood: 'awe', dark: true, focus: [495, 560], bg: '#26315f', scene: () => sMemory(), card: (at) => cMemory(at),
    say: 'When the job is done, most of that army retires. But some stay behind as memory cells, and they can last for years, even decades. They remember that face, and keep the wanted poster up.',
    sfx: [[5.4, 'chime', ['A5', 'E6']]], pops: [2.0, 5.4, 8.4, 10.8] },
  { key: 'rematch', d: 14, tag: 'the rematch', mood: 'groove', focus: [495, 560], bg: '#f8c3d4', scene: () => sRematch(), card: (at) => cRematch(at),
    say: 'Now, if the real germ ever shows up, the memory cells spot it instantly. Your body attacks within days, faster and stronger than before. Often the germ is wiped out before you even feel sick.',
    sfx: [[3.6, 'ding'], [6.0, 'whoosh', 0.6], [10.8, 'pop', 1800], [11.0, 'pop', 2000]], pops: [5.0, 6.6, 10.8] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [495, 540], bg: '#141c40', scene: () => sHush(), card: null },
  { key: 'world', d: 14.5, tag: 'planet-wide', mood: 'full', cut: true, focus: [495, 540], bg: '#f6cf55', scene: () => sWorld(), card: (at) => cWorld(at),
    say: 'And it works on a planet-wide scale. Vaccines wiped smallpox off the face of the Earth, the first human disease ever eradicated. And over the last fifty years, immunisation has saved at least one hundred and fifty-four million lives.',
    sfx: [[3.4, 'thud'], [10.4, 'chime', ['D5', 'Fs5', 'A5', 'D6']]], pops: [3.4, 10.4, 12.4] },
  { key: 'end', d: 12, tag: 'so...', mood: 'warm', focus: [495, 560], bg: '#f8c3d4', scene: () => sEnd(), card: (at) => cEnd(at),
    say: 'So a vaccine is a wanted poster, shown to your body before the real criminal arrives. One small shot, and your immune system is ready, for an enemy it has never met.',
    sfx: [[8.4, 'chime', ['D5', 'A5', 'D6']]], pops: [1.6, 4.0, 6.8] },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [
  { name: '1 Question', role: 'build',   t0: 0,  t1: 39 },
  { name: '2 Training', role: 'journey', t0: 39, t1: 92 },
  { name: '3 Rematch',  role: 'peak',    t0: 92, t1: HIT - 2.5 },
  { name: '4 Hush',     role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 World',    role: 'gift',    t0: HIT, t1: HIT + 14.5 },
  { name: '6 End',      role: 'goodbye', t0: HIT + 14.5, t1: HIT + 26.5 },
];
const SCORE = { motif: ['D5', 'Fs5', 'A5', 'Fs5'] };
const META = {
  title: "How 1 Shot Trains Your Body for Years",
  alt: ["How Vaccines Work, Explained Simply", "Smallpox Is Gone. Here's the Trick Your Body Learned"],
  hooks: ["Your body has never met this germ, but after one shot it can stop it before you ever get sick.", "Smallpox killed people for three thousand years, then it was gone. One small shot taught your body how.", "A vaccine is a wanted poster for a germ your body has never met.", "Without vaccines, about 154 million more people would have died in the last fifty years.", "How do you train for a fight with an enemy you've never seen?"],
  queries: ["how do vaccines work", "how vaccines train the immune system", "vaccine memory cells"],
  hook: "How do vaccines work? One shot shows your immune system a germ's face, and its memory cells can stop that germ for years.",
  about: "Follow Wes, a white blood cell, as a vaccine shows him a germ's \"wanted poster\" before the real germ ever arrives. Germs carry unique shapes called antigens; messenger cells carry them to the lymph nodes; the matching cells build an army of antibodies and killer T cells; and memory cells keep the poster up for years. Then the rematch, and the numbers: smallpox eradicated, and at least 154 million lives saved in 50 years.",
  chapters: [[0, 'The question'], [13, 'Every germ has a face'], [26, 'The first meeting is slow'], [39, 'What a vaccine is'], [53, 'The wanted poster'], [66, 'Building an army'], [79, 'Memory cells'], [92, 'The rematch'], [108.5, 'Smallpox and 154 million lives'], [123, 'Summary']],
  sources: [
    'WHO, Smallpox: Jenner\'s 1796 vaccine was the first successful vaccine; WHO declared smallpox eradicated in 1980, the only human infectious disease eradicated',
    'WHO / The Lancet (April 2024): global immunisation saved at least 154 million lives over the past 50 years',
    'Primary immune response: antibody levels rise over about 1-2 weeks; memory B and T cells persist (British Society for Immunology; Nature 2021 mRNA vaccine memory study)',
  ],
  hashtags: ['#vaccines', '#immunology', '#science', '#explained', '#animation'],
  tags: ['how do vaccines work', 'vaccines explained', 'immune system explained', 'antibodies', 'memory cells', 'antigens', 'smallpox eradication', 'white blood cells', 'science explained', 'animated explainer'],
};
const THUMB = { t: 6.0, panel: '#fbf6ea', lines: [['WANTED', 190, '#c4542e'], ['POSTER', 190, '#2a1d18']] };
