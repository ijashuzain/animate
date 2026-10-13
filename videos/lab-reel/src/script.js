// =====================================================================
//  STUDIO LAB — every transition in studio/channel/transitions.js, one per 3 s scene, each coming out of an object
//  on screen. Also the piece the genre sampler plays (studio/tools/sampler.mjs): warm, then groove, then full.
// =====================================================================
const LAB = [
  // [kind, tr options, shape on screen, wall colour, use-for line]
  ['morph', null, 'circle', '#26315f', 'the classic: quiet, anything'],
  ['shape', { shape: 'hex' }, 'hex', '#f6cf55', 'bees, crystals, cells'],
  ['shape', { shape: 'drop' }, 'drop', '#7fb3e6', 'water, rain, the sea'],
  ['zoom', {}, 'cell', '#f3a3bf', 'going inside something'],
  ['tiles', { tile: 'hex', order: 'radial' }, 'hex', '#fbe6a2', 'honeycombs, patterns'],
  ['wipe', { dir: 0, edge: 'torn' }, 'square', '#a9d9c6', 'paper, moving on'],
  ['push', { dir: 180 }, 'leaf', '#5aa05a', 'a journey, onward'],
  ['whip', { dir: 0, d: 0.35 }, 'star', '#ec7a4f', 'energy, countdowns'],
  ['slideOver', { dir: 180 }, 'square', '#cfe2ee', 'a new page or layer'],
  ['pageTurn', {}, 'square', '#f3ead6', 'books, history, diaries'],
  ['clock', {}, 'circle', '#d9c8ec', 'time, cycles, a day'],
  ['doors', {}, 'shield', '#b98576', 'reveals, openings'],
  ['blinds', { n: 9 }, 'square', '#fbf6ea', 'windows, light, data'],
  ['pixel', { block: 72 }, 'square', '#3f9f9a', 'computers, games, screens'],
  ['ink', { d: 0.8 }, 'drop', '#4c6fb5', 'water, paint, smoke, dreams'],
  ['shutter', {}, 'circle', '#141c40', 'eyes, cameras, look closer'],
  ['scatter', { d: 0.7 }, 'diamond', '#e9b9a4', 'breaking, a myth busted'],
  ['spin', {}, 'gear', '#8c7ad8', 'planets, machines, cycles'],
  ['fade', {}, 'cloud', '#cfe2ee', 'a soft change of time'],
  ['dip', { color: '#141c40' }, 'heart', '#f8c3d4', 'night, a pause'],
  ['flash', { d: 0.3 }, 'star', '#f6cf55', 'a camera, a shock'],
];
const MOODS = ['warm', 'warm', 'warm', 'groove', 'groove', 'groove', 'groove', 'full', 'full', 'full'];
const SCN = [
  { key: 'title', d: 4, tag: 'studio lab', mood: 'warm', focus: [495, 540], bg: '#26315f', dark: true, scene: () => sTitle(), card: (at) => cTitle(at) },
  ...LAB.map(([kind, tr, shape, bg, use], i) => ({ key: 'l' + i, d: 3, tag: kind, mood: MOODS[i % MOODS.length], focus: [495, 540], bg, dark: ['#26315f', '#141c40', '#4c6fb5', '#3f9f9a', '#5aa05a', '#8c7ad8'].includes(bg),
    tr: kind === 'morph' ? undefined : { kind, p: [495, 540], ...tr }, scene: () => sLab(i), card: (at) => cLab(at, i) })),
  { key: 'hush', d: 1.5, mood: 'silence', focus: [495, 540], bg: '#141c40', scene: () => sHush(), card: null },
  { key: 'cut', d: 3, tag: 'cut', mood: 'full', cut: true, focus: [495, 540], bg: '#f3a3bf', scene: () => sCut(), card: (at) => cCut(at) },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [];
const SCORE = { genre: 'lofi' };
const META = { title: 'Studio Lab: Transitions', alt: [], hook: 'Every scene change the studio can make.', about: 'A reel of the transitions.', sources: [], hashtags: [], tags: [] };
const THUMB = { t: 10.5, panel: '#fbf6ea', lines: [['STUDIO LAB', 120, '#2a1d18'], ['transitions', 70, '#c4542e']] };
