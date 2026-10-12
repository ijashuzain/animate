
// =====================================================================
//  WHY IS THE SKY BLUE? — the scene list. Ray (a white sunbeam) splits into his colour siblings; blue is the one the
//  air bounces everywhere. The turn: sunset; the payoff (after a hush): on Mars it's the other way round.
// =====================================================================
const SCN = [
  { key: 'hook', d: 12, tag: 'a question', mood: 'warm', focus: [500, 500], bg: '#7fb3e6', scene: () => sHook(), card: (at) => cHook(at),
    say: "Look up on a clear day, and the sky is blue. But at sunset, the very same sky turns orange, pink and red. Same sky, same Sun. So what's really going on up there?",
    sfx: [[6.0, 'whoosh', 1.5]] },
  { key: 'white', d: 13, tag: 'step 1', mood: 'warm', focus: [480, 540], bg: '#26315f', scene: () => sWhite(), card: (at) => cWhite(at),
    say: "Sunlight looks white, but it's really every colour of the rainbow mixed together. Shine it through a glass prism and it fans out into red, orange, yellow, green, blue and violet, just as Isaac Newton showed.",
    sfx: [[4.0, 'chime', ['D5', 'Fs5', 'A5', 'D6']]] },
  { key: 'waves', d: 13, tag: 'step 2', mood: 'groove', focus: [500, 540], bg: '#f3ead6', scene: () => sWaves(), card: (at) => cWaves(at),
    say: "Each colour travels as a wave. Red light has long, lazy waves, about seven hundred billionths of a metre apart. Blue light has short, choppy ones, closer to four hundred and fifty.",
    sfx: [[2.0, 'whoosh', 1.0], [5.0, 'whoosh', 0.5]] },
  { key: 'air', d: 14, tag: 'step 3', mood: 'groove', focus: [500, 540], bg: '#cfe2ee', scene: () => sAir(), card: (at) => cAir(at),
    say: "Our air is made of tiny molecules, mostly nitrogen and oxygen, far smaller than those waves. They scatter short waves much more than long ones. So blue light gets bounced all over the sky, while red mostly passes straight through.",
    sfx: [[6.0, 'pop', 1400], [6.4, 'pop', 1600], [6.8, 'pop', 1300], [7.2, 'pop', 1700]] },
  { key: 'everywhere', d: 12, tag: 'step 4', mood: 'groove', focus: [500, 520], bg: '#7fb3e6', scene: () => sEverywhere(), card: (at) => cEverywhere(at),
    say: "That scattered blue light reaches your eyes from every direction at once, not just from the Sun. So wherever you look, the whole sky seems to glow blue.",
    sfx: [[3.0, 'chime', ['A5', 'E6']]] },
  { key: 'violet', d: 13, tag: 'but wait', mood: 'groove', focus: [500, 540], bg: '#c9b9da', scene: () => sViolet(), card: (at) => cViolet(at),
    say: "But violet waves are even shorter, so they scatter even more. Why isn't the sky violet, then? The Sun sends out less violet light, and our eyes are less sensitive to it. So we see blue.",
    sfx: [[1.0, 'click'], [6.5, 'pop', 900], [8.0, 'pop', 1100], [9.5, 'pop', 1300]] },
  { key: 'sunset', d: 14, tag: 'sunset', mood: 'groove', focus: [500, 600], bg: '#e9894b', scene: () => sSunset(), card: (at) => cSunset(at),
    say: "At sunset, the light has to skim through much more air to reach you. On that long trip, most of the blue is scattered away, out of sight. What's left are the reds and oranges that paint the evening sky.",
    sfx: [[3.0, 'whoosh', 2.0]] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [500, 600], bg: '#3a2a3a', scene: () => sHush(), card: null },
  { key: 'mars', d: 14, tag: 'on Mars', mood: 'full', cut: true, focus: [500, 560], bg: '#d9a26a', scene: () => sMars(), card: (at) => cMars(at),
    say: "And on Mars, it's the other way around. Fine red dust in its thin air turns the daytime sky a butterscotch colour, and lets blue light through near the Sun, so Martian sunsets glow blue.",
    sfx: [] },
  { key: 'end', d: 12, tag: 'so...', mood: 'warm', focus: [500, 500], bg: '#7fb3e6', scene: () => sEnd(), card: (at) => cEnd(at),
    say: "So next time you look up, remember: the blue sky is sunlight, bouncing off the air all around you. And every red sunset is that same light, after a very long trip.",
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
const SCORE = { motif: ['A4', 'D5', 'E5'] };
const META = {
  title: 'Why Is the Sky Blue? (And Why Sunsets Are Red) | Explained in 2 Minutes',
  alt: ['Why the Sky Is Blue, Explained Simply', "The Sky Should Be Violet. Here's Why It Isn't."],
  hook: 'Same sky, same Sun. So why blue at noon and red at sunset?',
  about: "Follow Ray, a little sunbeam, as he splits into his colour siblings. Light is every colour mixed together, each colour is a wave, and the air bounces short blue waves all over the sky. You'll also find out why the sky isn't violet, why sunsets turn red, and why on Mars it's the other way around.",
  chapters: [[0, 'The question'], [12, 'White light is every colour'], [25, 'Colours are waves'], [38, 'The air scatters blue'], [52, 'Blue from every direction'], [64, 'Why not violet?'], [77, 'Why sunsets are red'], [93.5, "On Mars, it's flipped"], [107.5, 'Summary']],
  sources: ['Rayleigh scattering: scattering goes as 1/wavelength^4, so blue (~450 nm) scatters several times more than red (~700 nm)', 'Blue sunsets on Mars: photographed by NASA rovers'],
  hashtags: ['#science', '#physics', '#sky', '#explained', '#animation'],
  tags: ['why is the sky blue', 'why are sunsets red', 'Rayleigh scattering', 'light scattering explained', "why isn't the sky violet", 'Mars blue sunset', 'physics for kids', 'science explained', 'animated explainer'],
};
const THUMB = { t: 57.0, panel: '#fbf6ea', lines: [['WHY', 150, '#2a1d18'], ['BLUE?', 220, '#3b78d6'], ['...and why sunsets', 56, '#2a1d18'], ['turn red', 56, '#c4542e']] };
