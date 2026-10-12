
// =====================================================================
//  WHAT IF THE MOON DISAPPEARED? — the scene list. Luna (the Moon) vanishes in the first scene; Earth (with a face)
//  lives through the consequences; after a hush, Luna pops back on the payoff hit.
// =====================================================================
const SCN = [
  { key: 'vanish', d: 13, tag: 'tonight', mood: 'warm', focus: [700, 260], bg: '#1d2448', scene: () => sVanish(), card: (at) => cVanish(at),
    say: "Imagine you step outside tonight, and the Moon is simply gone. No explosion. It just isn't there. What would change?",
    sfx: [[6.0, 'pop', 600], [6.05, 'whoosh', 0.4]] },
  { key: 'dark', d: 12, tag: 'change 1', mood: 'cold', focus: [500, 540], bg: '#0c1124', scene: () => sDark(), card: (at) => cDark(at),
    say: 'First, nights would get much darker. The full Moon is by far the brightest thing in the night sky, and many animals time their lives by it.',
    sfx: [[2.0, 'drone', 3]] },
  { key: 'tides', d: 14, tag: 'change 2', mood: 'groove', focus: [500, 560], bg: '#3a6ea5', scene: () => sTides(), card: (at) => cTides(at),
    say: "The Moon's gravity pulls on the oceans, raising the tides. Without it, only the Sun would make tides, and they'd be less than half as high.",
    sfx: [[2.0, 'whoosh', 2.0], [8.0, 'whoosh', 2.0]] },
  { key: 'shore', d: 12, tag: 'change 3', mood: 'groove', focus: [500, 640], bg: '#e9cf98', scene: () => sShore(), card: (at) => cShore(at),
    say: 'Tide pools, mudflats, and the creatures that live by the rhythm of the tides would all have to adapt, or vanish.',
    sfx: [[2.0, 'pop', 900], [2.6, 'pop', 1100], [3.2, 'pop', 1300]] },
  { key: 'tilt', d: 14, tag: 'change 4', mood: 'tense', focus: [500, 540], bg: '#141a33', scene: () => sTilt(), card: (at) => cTilt(at),
    say: "The Moon also helps steady Earth's tilt. Without it, over millions of years, our planet could wobble far more, and the seasons could swing to extremes.",
    sfx: [[7.0, 'drone', 4, 'A1']] },
  { key: 'day', d: 13, tag: 'change 5', mood: 'groove', focus: [500, 540], bg: '#a9d9c6', scene: () => sDay(), card: (at) => cDay(at),
    say: "The Moon has been slowly braking Earth's spin. When the last dinosaurs lived, a day lasted about twenty-three and a half hours. Without the Moon, that slowdown would mostly stop.",
    sfx: [[3.0, 'click'], [3.5, 'click'], [4.0, 'click'], [6.5, 'thud']] },
  { key: 'eclipse', d: 12, tag: 'change 6', mood: 'awe', focus: [500, 480], bg: '#26315f', scene: () => sEclipse(), card: (at) => cEclipse(at),
    say: "And there would be no more solar eclipses. Even the word 'month' comes from the Moon.",
    sfx: [[2.5, 'chime', ['F5', 'C6']], [7.0, 'scribble', 0.6]] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [700, 260], bg: '#0c1124', scene: () => sHush(), card: null },
  { key: 'back', d: 14, tag: 'phew', mood: 'full', cut: true, focus: [700, 260], bg: '#1d2448', scene: () => sBack(), card: (at) => cBack(at),
    say: 'Luckily, the Moon is still here. But it is slowly drifting away from us: about three point eight centimetres every year.',
    sfx: [] },
  { key: 'end', d: 12, tag: 'thanks, Moon', mood: 'warm', focus: [500, 540], bg: '#141a33', scene: () => sEnd(), card: (at) => cEnd(at),
    say: "So next time you see the Moon, say thanks. It's doing a lot more than lighting up the night.",
    sfx: [[8.5, 'chime', ['D5', 'A5', 'D6']]] },
];
const HIT = SCN.slice(0, 8).reduce((a, s) => a + s.d, 0);
const ACTS = [
  { name: '1 Gone',     role: 'build',   t0: 0,  t1: 39 },
  { name: '2 Changes',  role: 'journey', t0: 39, t1: 78 },
  { name: '3 Eclipse',  role: 'peak',    t0: 78, t1: HIT - 2.5 },
  { name: '4 Hush',     role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 Back',     role: 'gift',    t0: HIT, t1: HIT + 14 },
  { name: '6 Thanks',   role: 'goodbye', t0: HIT + 14, t1: HIT + 26 },
];
