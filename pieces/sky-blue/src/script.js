
// =====================================================================
//  WHY IS THE SKY BLUE? — the scene list. Ray (a white sunbeam) splits into his colour siblings; blue is the one the
//  air bounces everywhere. The turn: sunset; the payoff (after a hush): on Mars it's the other way round.
// =====================================================================
const SCN = [
  { key: 'hook', d: 12, tag: 'a question', mood: 'warm', focus: [500, 500], bg: '#7fb3e6', scene: () => sHook(), card: (at) => cHook(at),
    say: "Look up on a clear day, and the sky is blue. At sunset, it turns orange and red. Same sky, same Sun. So what's going on?",
    sfx: [[6.0, 'whoosh', 1.5]] },
  { key: 'white', d: 13, tag: 'step 1', mood: 'warm', focus: [480, 540], bg: '#26315f', scene: () => sWhite(), card: (at) => cWhite(at),
    say: "Sunlight looks white, but it's really every colour mixed together. Shine it through a prism and it fans out into a rainbow, as Isaac Newton showed.",
    sfx: [[4.0, 'chime', ['D5', 'Fs5', 'A5', 'D6']]] },
  { key: 'waves', d: 13, tag: 'step 2', mood: 'groove', focus: [500, 540], bg: '#f3ead6', scene: () => sWaves(), card: (at) => cWaves(at),
    say: 'Each colour travels as a wave. Red light has long, lazy waves. Blue light has short, choppy ones.',
    sfx: [[2.0, 'whoosh', 1.0], [5.0, 'whoosh', 0.5]] },
  { key: 'air', d: 14, tag: 'step 3', mood: 'groove', focus: [500, 540], bg: '#cfe2ee', scene: () => sAir(), card: (at) => cAir(at),
    say: 'Air is made of tiny molecules, mostly nitrogen and oxygen. They scatter short waves far more than long ones. So blue light gets bounced all over, while red mostly passes straight through.',
    sfx: [[6.0, 'pop', 1400], [6.4, 'pop', 1600], [6.8, 'pop', 1300], [7.2, 'pop', 1700]] },
  { key: 'everywhere', d: 12, tag: 'step 4', mood: 'groove', focus: [500, 520], bg: '#7fb3e6', scene: () => sEverywhere(), card: (at) => cEverywhere(at),
    say: 'That scattered blue light reaches your eyes from every direction. So the whole sky glows blue.',
    sfx: [[3.0, 'chime', ['A5', 'E6']]] },
  { key: 'violet', d: 13, tag: 'but wait', mood: 'groove', focus: [500, 540], bg: '#c9b9da', scene: () => sViolet(), card: (at) => cViolet(at),
    say: "But violet waves are even shorter. So why isn't the sky violet? The Sun sends out less violet light, and our eyes are less sensitive to it. So we see blue.",
    sfx: [[1.0, 'click'], [6.5, 'pop', 900], [8.0, 'pop', 1100], [9.5, 'pop', 1300]] },
  { key: 'sunset', d: 14, tag: 'sunset', mood: 'groove', focus: [500, 600], bg: '#e9894b', scene: () => sSunset(), card: (at) => cSunset(at),
    say: 'At sunset, the light skims through much more air to reach you. Most of the blue is scattered away on the long trip, leaving the reds and oranges.',
    sfx: [[3.0, 'whoosh', 2.0]] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [500, 600], bg: '#3a2a3a', scene: () => sHush(), card: null },
  { key: 'mars', d: 14, tag: 'on Mars', mood: 'full', cut: true, focus: [500, 560], bg: '#d9a26a', scene: () => sMars(), card: (at) => cMars(at),
    say: "And on Mars, it's the other way around. Fine dust makes the daytime sky butterscotch, and the sunsets blue.",
    sfx: [] },
  { key: 'end', d: 12, tag: 'so...', mood: 'warm', focus: [500, 500], bg: '#7fb3e6', scene: () => sEnd(), card: (at) => cEnd(at),
    say: 'So next time you look up, remember: the blue sky is sunlight, bouncing off the air.',
    sfx: [[8.5, 'chime', ['D5', 'A5', 'D6']]] },
];
const HIT = SCN.slice(0, 8).reduce((a, s) => a + s.d, 0);
const ACTS = [
  { name: '1 Question', role: 'build',   t0: 0,  t1: 38 },
  { name: '2 Scatter',  role: 'journey', t0: 38, t1: 77 },
  { name: '3 Sunset',   role: 'peak',    t0: 77, t1: HIT - 2.5 },
  { name: '4 Hush',     role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 Mars',     role: 'gift',    t0: HIT, t1: HIT + 14 },
  { name: '6 End',      role: 'goodbye', t0: HIT + 14, t1: HIT + 26 },
];
