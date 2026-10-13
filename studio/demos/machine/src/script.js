// =====================================================================
//  MACHINE KIT DEMO — proves studio/library/machines.js (the vendored anatomy geometry) inside a channel piece:
//  an isometric water pump with a turning flywheel, a moving piston, a pipe, a pressure gauge. Not a video; a reference.
//  node engine/animate/tools/still.mjs studio/demos/machine 2,5 out.png --scale 0.5
// =====================================================================
const SCN = [
  { key: 'pump', d: 8, tag: 'how it works', mood: 'groove', focus: [520, 560], bg: '#ffffff', scene: () => sPump(), card: (at) => cPump(at), say: 'A demo of the machine kit.' },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [520, 560], bg: '#ffffff', scene: () => sPump(), card: null },
  { key: 'payoff', d: 6, tag: 'the twist', mood: 'full', cut: true, focus: [520, 560], bg: '#ffffff', tr: { kind: 'fade' }, scene: () => sPump(), card: (at) => cPump(at), say: 'Same machine.' },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [];
const SCORE = { genre: 'synth' };
const META = { title: 'Machine kit demo', alt: [], hooks: [], queries: [], hook: '', about: '', sources: [], hashtags: [], tags: [] };
const THUMB = { t: 4.0, panel: '#ffffff', lines: [['PUMP', 90, '#232327']] };
