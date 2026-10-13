// =====================================================================
//  WHAT IF EARTH STOPPED SPINNING? — a "what if", told by the clock (studio/formats.md): right now, one second later,
//  one minute later, then the gentle version (day 1, year 1, the new map), the quiet danger (the magnetic field),
//  a hush, and the payoff: Earth IS slowing, by about 2 ms a century. Riso print, ambient score; spin/dip/ink/flash.
// =====================================================================
const SCN = [
  { key: 'hook', d: 12, tag: 'right now', mood: 'warm', focus: [480, 540], bg: '#141a2e', dark: true, scene: () => sHook(), card: (at) => cHook(at),
    say: "Right now, the ground under the equator is racing east at about one thousand six hundred and seventy kilometres an hour. You don't feel a thing. So what if Earth simply stopped?",
    sfx: [[1.0, 'whoosh', 1.6], [9.6, 'drone', 2.0]], pops: [3.0, 7.2, 9.8] },
  { key: 'second', d: 13, tag: '1 second later', mood: 'tense', focus: [480, 600], bg: '#e9b06a', tr: { kind: 'flash', d: 0.3 }, scene: () => sSecond(), card: (at) => cSecond(at),
    say: 'One second later, everything not bolted to the bedrock keeps moving east at full speed. Air, oceans, rocks, cities, and you, all flung sideways faster than a jet airliner. Only the poles stay calm.',
    sfx: [[0.2, 'thud'], [1.0, 'whoosh', 2.5], [5.0, 'whoosh', 2.0]], pops: [2.0, 5.6, 9.0, 11.4] },
  { key: 'minute', d: 13, tag: '1 minute later', mood: 'tense', focus: [480, 600], bg: '#3689ab', tr: { kind: 'ink', d: 0.7, key: 'wave' }, scene: () => sMinute(), card: (at) => cMinute(at),
    say: "A minute later, winds far stronger than any hurricane scour the land, and the oceans keep surging east as giant tsunamis, crashing over the continents. That's the sudden version. Now let's be kinder.",
    sfx: [[0.6, 'whoosh', 3.0], [4.0, 'thud'], [7.0, 'thud']], pops: [1.8, 5.0, 9.6, 11.4] },
  { key: 'day', d: 14, tag: 'day 1', mood: 'awe', focus: [480, 560], bg: '#f2c9a0', tr: { kind: 'dip', color: '#141a2e', d: 0.7 }, scene: () => sDay(), card: (at) => cDay(at),
    say: 'Imagine the spin fades slowly instead, over many years. Now one day lasts a whole year: about six months of daylight, then six months of night, as the Sun slowly crawls across the sky.',
    sfx: [[5.0, 'chime', ['B4', 'E5', 'Fs5']]], pops: [2.0, 5.2, 7.6, 9.6] },
  { key: 'bulge', d: 13, tag: 'year 1', mood: 'groove', focus: [480, 560], bg: '#141a2e', dark: true, tr: { kind: 'spin', turns: 0.5, color: '#141a2e' }, scene: () => sBulge(), card: (at) => cBulge(at),
    say: 'Spinning makes Earth bulge at its middle: the equator sits about twenty-one kilometres further out than the poles, and the oceans pile up there. Without the spin, that water slowly flows toward the poles.',
    sfx: [[8.6, 'drip'], [9.4, 'drip'], [10.2, 'drip']], pops: [2.0, 5.0, 9.0] },
  { key: 'map', d: 13, tag: 'the new map', mood: 'groove', focus: [480, 560], bg: '#141a2e', dark: true, tr: { kind: 'ink', d: 0.7, key: 'map' }, scene: () => sMap(), card: (at) => cMap(at),
    say: 'One computer model shows where it ends up: two huge polar oceans, and one giant continent wrapped around the middle of the planet. Greenland and Canada would be under water.',
    sfx: [[2.4, 'pop', 900], [5.0, 'pop', 1100], [9.0, 'thud']], pops: [2.4, 5.0, 9.0] },
  { key: 'field', d: 14, tag: 'but wait', mood: 'tense', focus: [480, 560], bg: '#141a2e', dark: true, tr: { kind: 'dip', color: '#0a0d18' }, scene: () => sField(), card: (at) => cField(at),
    say: "And there's a quieter danger. Earth's magnetic field is made by molten iron swirling inside, and that swirling depends partly on the spin. Some scientists think the field could fade, leaving us exposed to the Sun's radiation.",
    sfx: [[2.0, 'drone', 4.0, 'E2'], [10.0, 'rise', 1.4]], pops: [2.0, 6.0, 10.0] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [480, 540], bg: '#0a0d18', scene: () => sHush(), card: null },
  { key: 'payoff', d: 14, tag: 'the good news', mood: 'full', cut: true, focus: [480, 560], bg: '#f2c9a0', scene: () => sPayoff(), card: (at) => cPayoff(at),
    say: 'The good news? Earth is slowing down, but only by about two thousandths of a second every century. Four hundred million years ago, a day lasted about twenty-two hours. At that pace, you have nothing to worry about.',
    sfx: [[3.0, 'tick'], [3.5, 'tick'], [4.0, 'tick'], [7.8, 'chime', ['E5', 'Gs5', 'B5']]], pops: [0.4, 5.0, 6.8, 11.0] },
  { key: 'end', d: 12, tag: 'so...', mood: 'warm', focus: [480, 540], bg: '#141a2e', dark: true, tr: { kind: 'spin', turns: 0.5, color: '#141a2e' }, scene: () => sEnd(), card: (at) => cEnd(at),
    say: "So tonight, as the Sun sets right on time, remember: you're riding a planet whose middle spins at more than sixteen hundred kilometres an hour. And that's exactly how we like it.",
    sfx: [[9.0, 'chime', ['E5', 'B5', 'E6']]], pops: [1.6, 4.4, 8.4] },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [
  { name: '1 Right now', role: 'build',   t0: 0,  t1: 38 },
  { name: '2 Slow stop', role: 'journey', t0: 38, t1: 78 },
  { name: '3 Danger',    role: 'peak',    t0: 78, t1: HIT - 2.5 },
  { name: '4 Hush',      role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 Good news', role: 'gift',    t0: HIT, t1: HIT + 14 },
  { name: '6 End',       role: 'goodbye', t0: HIT + 14, t1: HIT + 26 },
];
const SCORE = { genre: 'ambient' };
const META = {
  title: 'What If Earth Stopped Spinning? 1,670 km/h to Zero',
  alt: ['What If Earth Stopped Spinning, Minute by Minute', 'A Day That Lasts a Year: If Earth Stopped Spinning'],
  hooks: [
    "Right now, the ground under the equator is racing east at about one thousand six hundred and seventy kilometres an hour.",
    "If Earth stopped spinning for one second, you would fly east faster than a jet airliner.",
    "Stop Earth's spin and a single day would last a whole year: six months of light, six of night.",
    "Earth is slowing down right now, by about two thousandths of a second every century. What if it stopped?",
    "You are spinning at hundreds of kilometres an hour, and you never feel it. So what happens if it stops?",
  ],
  queries: ['what if earth stopped spinning', 'what happens if earth stops rotating', 'earth rotation slowing down'],
  hook: 'What happens if Earth stops rotating? Second by second: the winds, the oceans, a day that lasts a year, and why Earth slowing down is nothing to worry about.',
  about: "Earth's equator spins east at about 1,670 km/h. If it stopped suddenly, everything would keep moving: winds and tsunamis would scour the planet. If it slowed gently, a day would last a year, the oceans would drain toward the poles and leave one giant continent around the middle, and the magnetic field might fade. And the good news: Earth really is slowing, but only by about 2 milliseconds per century.",
  chapters: [[0, 'Right now'], [12, 'One second later'], [25, 'One minute later'], [38, 'A day that lasts a year'], [52, 'The oceans move'], [65, 'The new map'], [78, 'The magnetic field'], [94.5, 'The good news'], [108.5, 'Summary']],
  sources: [
    'Space.com, "What would happen if Earth stopped spinning?" (physicist Andrew Layden): everything keeps moving; poles least affected; a gradual stop gives ~6 months of day and ~6 of night',
    'ScienceAlert: the equator moves east at about 1,674 km/h',
    'Popular Science / Esri (W. Fraczek, 2010): a non-spinning Earth model, oceans migrate to the poles, one equatorial megacontinent (IFLScience: Greenland and Canada submerged; magnetic field could be lost)',
    'Earth\'s day lengthens about 2 ms per century (tidal drag); ~400 million years ago a day was about 22 hours (coral growth rings, ~400 days a year)',
  ],
  hashtags: ['#space', '#earth', '#whatif', '#science', '#animation'],
  tags: ['what if earth stopped spinning', 'earth stops rotating', 'earth rotation', 'what if', 'earth day length', 'equatorial bulge', 'science explained', 'animated explainer'],
};
const THUMB = { t: 66.0, panel: '#f2ece3', lines: [['6 MONTHS', 150, '#2b2f3a'], ['OF NIGHT', 150, '#dc44a0']] };
