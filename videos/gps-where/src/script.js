// =====================================================================
//  HOW DOES GPS KNOW WHERE YOU ARE? — the scene list. A little cube-bot stands by a phone with a dot on its map.
//  The phone only listens: clocks in orbit shout the time, the delay is a distance, three distances meet in one
//  point, a fourth fixes the phone's cheap clock. The turn: relativity; the payoff (after a hush): +38 µs a day,
//  about 10 km of drift, so the clocks are tuned slow before launch.
// =====================================================================
const SCN = [
  { key: 'hook', d: 12, tag: 'a question', mood: 'warm', focus: [495, 560], bg: '#ffffff', scene: () => sHook(), card: (at) => cHook(at),
    say: "Open a map on your phone, and a little dot appears exactly where you're standing. But your phone can't see the street, and nobody told it your address. So how does it know?",
    sfx: [[1.6, 'beep', 1320], [10.0, 'ding']], pops: [2.4, 6.0, 8.0] },
  { key: 'sats', d: 13, tag: 'step 1', mood: 'groove', focus: [495, 520], bg: '#ffffff', scene: () => sSats(), card: (at) => cSats(at),
    say: 'Twenty thousand kilometres above you, about thirty GPS satellites circle the Earth, each one going all the way around twice a day. Wherever you are, several of them are always above your horizon.',
    sfx: [[0.8, 'whoosh', 1.4], [9.6, 'pop', 1500]], pops: [1.6, 3.0, 7.4, 10.0] },
  { key: 'clocks', d: 13, tag: 'step 2', mood: 'groove', focus: [495, 480], bg: '#ffffff', scene: () => sClocks(), card: (at) => cClocks(at),
    say: 'Each satellite carries atomic clocks, astonishingly precise ones. And it keeps broadcasting the same simple message, again and again: this is exactly what time it is, and this is exactly where I am.',
    sfx: [[5.0, 'beep', 1500], [6.0, 'beep', 1500], [7.0, 'beep', 1500], [8.0, 'beep', 1500]], pops: [1.6, 6.0, 7.6, 10.0] },
  { key: 'delay', d: 13, tag: 'step 3', mood: 'groove', focus: [495, 540], bg: '#ffffff', scene: () => sDelay(), card: (at) => cDelay(at),
    say: "Your phone doesn't send anything back. It just listens. The message races at the speed of light, yet still arrives about seven hundredths of a second late. That tiny delay tells your phone the distance.",
    sfx: [[4.6, 'beep', 1700], [8.0, 'beep', 2000]], pops: [2.0, 5.0, 8.2, 10.6] },
  { key: 'meet', d: 14, tag: 'step 4', mood: 'groove', focus: [495, 600], bg: '#ffffff', scene: () => sMeet(), card: (at) => cMeet(at),
    say: "One distance means you're somewhere on a sphere around that satellite. Add a second, and the spheres cross in a circle. A third cuts that circle to just two points, and only one of them is on Earth.",
    sfx: [[1.4, 'whoosh', 1.0], [4.6, 'whoosh', 1.0], [7.8, 'whoosh', 1.0], [11.2, 'ding']], pops: [2.6, 5.8, 9.0, 11.4] },
  { key: 'fourth', d: 13, tag: 'the catch', mood: 'groove', focus: [495, 560], bg: '#ffffff', scene: () => sFourth(), card: (at) => cFourth(at),
    say: "There's a catch. Your phone's clock is cheap, and timing is everything: one millionth of a second wrong puts you three hundred metres off. So it listens to a fourth satellite to correct its own clock.",
    sfx: [[8.6, 'whoosh', 1.0], [9.8, 'beep', 1900], [11.0, 'ding']], pops: [2.0, 5.0, 7.8] },
  { key: 'einstein', d: 14, tag: 'but wait', mood: 'groove', focus: [495, 520], bg: '#ffffff', scene: () => sEinstein(), card: (at) => cEinstein(at),
    say: "And there's a stranger problem, up in space. The satellites move fast, and moving clocks tick slower. But they also sit in weaker gravity, and that makes them tick faster, by even more. Einstein predicted both.",
    sfx: [[3.6, 'whoosh', 1.0], [7.0, 'rise', 1.6]], pops: [4.0, 5.4, 9.6, 11.6] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [495, 540], bg: '#ffffff', scene: () => sHush(), card: null },
  { key: 'drift', d: 14, tag: '+38 µs a day', mood: 'full', cut: true, focus: [495, 600], bg: '#ffffff', scene: () => sDrift(), card: (at) => cDrift(at),
    say: 'Add it up, and the satellite clocks gain thirty-eight millionths of a second every single day. Left uncorrected, your little dot would drift about ten kilometres a day. So engineers make those clocks tick slightly slow before launch.',
    sfx: [[6.0, 'whoosh', 2.4], [10.4, 'click'], [10.8, 'ding']], pops: [7.6, 12.0] },
  { key: 'end', d: 12, tag: 'so...', mood: 'warm', focus: [495, 560], bg: '#ffffff', scene: () => sEnd(), card: (at) => cEnd(at),
    say: 'So that little dot is a conversation with clocks in space, corrected by Einstein. Under open sky, it finds you to within about five metres. Not bad for a phone that just listens.',
    sfx: [[2.0, 'beep', 1320], [10.0, 'chime', ['D5', 'A5', 'D6']]], pops: [1.6, 4.4, 6.6, 9.6] },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [
  { name: '1 Question', role: 'build',   t0: 0,  t1: 38 },
  { name: '2 Timing',   role: 'journey', t0: 38, t1: 78 },
  { name: '3 Einstein', role: 'peak',    t0: 78, t1: HIT - 2.5 },
  { name: '4 Hush',     role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 Drift',    role: 'gift',    t0: HIT, t1: HIT + 14 },
  { name: '6 End',      role: 'goodbye', t0: HIT + 14, t1: HIT + 26 },
];
const SCORE = { motif: ['E5', 'B4', 'E5', 'Fs5'] };   // a little "ping" pattern, like a signal
const META = {
  title: "GPS Is 10 km Wrong Without Einstein. Here's Why",
  alt: ["How GPS Works, Explained Simply", "How Your Phone Finds You (With Einstein's Help)"],
  hooks: ["Without Einstein, your phone's map would be ten kilometres wrong by tomorrow. Here's why it never is.", "Your phone can't see the street, yet it never loses you by more than five metres. How?", "Every day, clocks in space gain thirty-eight millionths of a second. Your map would drift ten kilometres.", "Your phone finds you by listening to clocks in space, and it only works because Einstein was right.", "Open a map and a dot appears exactly where you stand. Your phone never asked where you are."],
  queries: ["how does gps work", "gps relativity einstein", "how phones find your location"],
  hook: "How GPS works: your phone can't see the street, yet it finds your location within about 5 metres, and only because of Einstein's relativity.",
  about: 'Satellites 20,200 km up carry atomic clocks and keep broadcasting the time and their position. Your phone only listens: the delay of each signal is a distance, three distances meet in one point, and a fourth satellite fixes the phone\'s own clock. Then the strange part: speed and weaker gravity change the satellite clocks, exactly as Einstein predicted, by 38 millionths of a second a day.',
  chapters: [[0, 'The question'], [12, 'Satellites overhead'], [25, 'Clocks that broadcast'], [38, 'A delay is a distance'], [51, 'Three distances, one point'], [65, 'The fourth satellite'], [78, "Einstein's problem"], [92, '38 microseconds a day'], [106, 'Summary']],
  sources: [
    'GPS.gov, Space Segment: orbits at about 20,200 km, each satellite circles the Earth twice a day; 31 operational satellites (2023)',
    'GPS.gov, GPS Accuracy: smartphones are typically accurate to within 4.9 m under open sky',
    'Relativity in GPS (N. Ashby, Living Reviews in Relativity, 2003): about -7 µs/day from speed, +45 µs/day from weaker gravity, net +38 µs/day; clocks tuned to 10.22999999543 MHz instead of 10.23 MHz',
    'Four satellites are needed: three for position, one for the receiver clock error (1 µs of clock error ≈ 300 m)',
  ],
  hashtags: ['#GPS', '#physics', '#Einstein', '#explained', '#animation'],
  tags: ['how does GPS work', 'GPS explained', 'GPS relativity', 'Einstein GPS', 'trilateration', 'GPS satellites', 'atomic clocks', 'how GPS knows where you are', 'science explained', 'animated explainer'],
};
const THUMB = { t: 21.0, panel: '#fbf6ea', lines: [['CLOCKS', 180, '#2a1d18'], ['IN SPACE', 150, '#c4542e']] };
