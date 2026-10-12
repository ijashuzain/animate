
// =====================================================================
//  WHAT IF THE MOON DISAPPEARED? — the scene list. Luna (the Moon) vanishes in the first scene; Earth (with a face)
//  lives through the consequences; after a hush, Luna pops back on the payoff hit.
// =====================================================================
const SCN = [
  { key: 'vanish', d: 13, tag: 'tonight', mood: 'warm', focus: [700, 260], bg: '#1d2448', scene: () => sVanish(), card: (at) => cVanish(at),
    say: "Imagine you step outside tonight, look up, and the Moon is simply gone. No explosion, no warning. It just isn't there anymore. What would actually change down here on Earth?",
    sfx: [[6.0, 'pop', 600], [6.05, 'whoosh', 0.4]] },
  { key: 'dark', d: 12, tag: 'change 1', mood: 'cold', focus: [500, 540], bg: '#0c1124', scene: () => sDark(), card: (at) => cDark(at),
    say: "First, nights would get much darker. The full Moon is by far the brightest thing in the night sky, and many animals, from night birds to reef corals, time their lives by it.",
    sfx: [[2.0, 'drone', 3]] },
  { key: 'tides', d: 14, tag: 'change 2', mood: 'groove', focus: [500, 560], bg: '#3a6ea5', scene: () => sTides(), card: (at) => cTides(at),
    say: "The Moon's gravity pulls on the oceans, raising the tides twice a day. Without it, only the Sun would make tides, and they would be less than half as high as the tides we know today.",
    sfx: [[2.0, 'whoosh', 2.0], [8.0, 'whoosh', 2.0]] },
  { key: 'shore', d: 12, tag: 'change 3', mood: 'groove', focus: [500, 640], bg: '#e9cf98', scene: () => sShore(), card: (at) => cShore(at),
    say: "Tide pools, mudflats, and the crabs, starfish and shorebirds that live by the rhythm of the tides would all have to adapt to the change, or slowly vanish.",
    sfx: [[2.0, 'pop', 900], [2.6, 'pop', 1100], [3.2, 'pop', 1300]] },
  { key: 'tilt', d: 14, tag: 'change 4', mood: 'tense', focus: [500, 540], bg: '#141a33', scene: () => sTilt(), card: (at) => cTilt(at),
    say: "The Moon also helps to steady Earth's tilt, the reason we have seasons. Without it, over millions of years, our planet could wobble far more, and the seasons could swing to extremes.",
    sfx: [[7.0, 'drone', 4, 'A1']] },
  { key: 'day', d: 13, tag: 'change 5', mood: 'groove', focus: [500, 540], bg: '#a9d9c6', scene: () => sDay(), card: (at) => cDay(at),
    say: "The Moon has been slowly braking Earth's spin. When the last dinosaurs lived, a day lasted about twenty-three and a half hours. Without the Moon, that slowdown would mostly stop.",
    sfx: [[3.0, 'click'], [3.5, 'click'], [4.0, 'click'], [6.5, 'click']] },
  { key: 'eclipse', d: 12, tag: 'change 6', mood: 'awe', focus: [500, 480], bg: '#26315f', scene: () => sEclipse(), card: (at) => cEclipse(at),
    say: "And there would be no more solar eclipses, when the Moon slides in front of the Sun. Even the word month comes from the Moon, and so does the shape of our calendar.",
    sfx: [[2.5, 'chime', ['F5', 'C6']], [7.0, 'scribble', 0.6]] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [700, 260], bg: '#0c1124', scene: () => sHush(), card: null },
  { key: 'back', d: 14, tag: 'phew', mood: 'full', cut: true, focus: [700, 260], bg: '#1d2448', scene: () => sBack(), card: (at) => cBack(at),
    say: "Luckily, the Moon is still right where it should be. But it is slowly drifting away from us, about three point eight centimetres every year, measured by bouncing lasers off mirrors left by the Apollo astronauts.",
    sfx: [] },
  { key: 'end', d: 12, tag: 'thanks, Moon', mood: 'warm', focus: [500, 540], bg: '#141a33', scene: () => sEnd(), card: (at) => cEnd(at),
    say: "So next time you see the Moon, say thanks. It lights our nights, lifts our tides and steadies our seasons. It's doing a lot more than just hanging there.",
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
const SCORE = { motif: ['Fs4', 'A4', 'D5'] };
const META = {
  title: 'What If the Moon Disappeared Tonight?',
  alt: ['What Would Happen If the Moon Vanished?', 'Life Without the Moon: 6 Things That Would Change'],
  hook: 'You step outside tonight, and the Moon is simply gone. No explosion, just gone. What would change?',
  about: 'Darker nights, much smaller tides, struggling shorelines, a wobbling planet, a day that stops getting longer, and no more eclipses. Then the good news, and the twist: the Moon is slowly drifting away from us.',
  chapters: [[0, 'The Moon vanishes'], [13, '1. Darker nights'], [25, '2. Smaller tides'], [39, '3. Life on the shore'], [51, '4. A wobbling tilt'], [65, '5. A slowing spin'], [78, '6. No eclipses, no months'], [92.5, "Phew, it's back"], [106.5, 'Thanks, Moon']],
  sources: ["NASA, Measuring the Moon's Distance: lunar laser ranging off the Apollo retroreflectors, about 3.8 cm a year", "The Sun's tidal pull on Earth is about 46% of the Moon's", 'Day length about 70 million years ago (~23.5 h): growth bands in fossil shells (de Winter et al., 2020)'],
  hashtags: ['#space', '#moon', '#whatif', '#science', '#animation'],
  tags: ['what if the moon disappeared', 'what if the moon vanished', 'life without the moon', 'moon tides', 'earth axial tilt', 'moon moving away', 'solar eclipse', 'space facts', 'what if', 'animated explainer'],
};
const THUMB = { t: 5.6, panel: '#1d2448', lines: [['what if the', 80, '#fbf6ea'], ['MOON', 210, '#efe6c8'], ['vanished?', 110, '#f6cf55']] };
