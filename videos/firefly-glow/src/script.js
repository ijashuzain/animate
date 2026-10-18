// =====================================================================
//  HOW DO FIREFLIES GLOW WITHOUT GETTING HOT? — a day (a night) in the life (studio/formats.md): one firefly from dusk
//  to dawn, told by the clock. FLAT style at night, folk score; transitions: clock (time passing), dip (into the dark),
//  shutter (look closer). The twist: "femme fatale" fireflies fake another species' code to eat the males.
// =====================================================================
const SCN = [
  { key: 'hook', d: 12, tag: '8:30 pm', mood: 'warm', focus: [480, 560], bg: '#1b2140', dark: true, scene: () => sHook(), card: (at) => cHook(at),
    say: "You've seen fireflies glow, but you've never felt one get hot. How do they make light without heat? An old light bulb turns about ninety percent of its power into heat.",
    sfx: [[1.4, 'ding'], [4.6, 'pop', 1400], [8.4, 'chime', ['E5', 'G5', 'B5']]], pops: [1.4, 4.6, 8.4] },
  { key: 'wake', d: 13, tag: '8:45 pm', mood: 'groove', focus: [480, 560], bg: '#2c3560', dark: true, tr: { kind: 'clock', p: [480, 540] }, scene: () => sWake(), card: (at) => cWake(at),
    say: "At dusk, our firefly climbs a blade of grass. Surprise: it isn't a fly at all. Fireflies are beetles, and the light comes from a special organ at the tip of the belly.",
    sfx: [[2.0, 'pencil'], [6.4, 'pop', 1100], [9.4, 'ding']], pops: [1.4, 6.4, 9.4] },
  { key: 'chem', d: 13, tag: '9:00 pm', mood: 'groove', focus: [480, 560], bg: '#1b2140', dark: true, tr: { kind: 'shutter', p: [600, 600] }, scene: () => sChem(), card: (at) => cChem(at),
    say: "Inside that lantern, a molecule called luciferin meets an enzyme called luciferase, plus oxygen and a little energy. The reaction releases its energy as light, and very little as heat.",
    sfx: [[2.0, 'pop', 1200], [4.4, 'pop', 1500], [8.0, 'chime', ['G5', 'B5', 'D6']]], pops: [1.4, 2.0, 4.4, 8.0] },
  { key: 'switch', d: 13, tag: '9:10 pm', mood: 'groove', focus: [480, 560], bg: '#1b2140', dark: true, tr: { kind: 'dip', color: '#0f1430' }, scene: () => sSwitch(), card: (at) => cSwitch(at),
    say: "To flash, the firefly controls the air that reaches its lantern through tiny breathing tubes. A rush of oxygen, and it glows. Cut the oxygen, and the light goes out.",
    sfx: [[3.0, 'click'], [5.0, 'click'], [7.0, 'click'], [9.0, 'click']], pops: [1.4, 4.0, 8.0] },
  { key: 'code', d: 13, tag: '9:30 pm', mood: 'groove', focus: [480, 560], bg: '#1b2140', dark: true, tr: { kind: 'clock', p: [480, 540] }, scene: () => sCode(), card: (at) => cCode(at),
    say: "Every species has its own flash code: how many flashes, how long, how far apart. The males fly and flash. A female in the grass answers with her own flash, at just the right moment.",
    sfx: [[2.0, 'beep', 900], [2.6, 'beep', 900], [3.2, 'beep', 900], [7.6, 'beep', 1300]], pops: [1.4, 4.4, 7.6] },
  { key: 'cold', d: 14, tag: '10:00 pm', mood: 'tense', focus: [480, 560], bg: '#1b2140', dark: true, tr: { kind: 'dip', color: '#0f1430' }, scene: () => sCold(), card: (at) => cCold(at),
    say: "Old textbooks said almost every reaction makes a flash. In 2008, scientists measured about four in ten. But even so, a firefly's light is far cooler than a light bulb, which turns most of its power into heat.",
    sfx: [[3.0, 'tick'], [3.4, 'tick'], [3.8, 'tick'], [8.6, 'thud']], pops: [1.4, 4.4, 8.6] },
  { key: 'danger', d: 13, tag: '10:30 pm', mood: 'tense', focus: [480, 560], bg: '#141a33', dark: true, tr: { kind: 'shutter', p: [480, 500] }, scene: () => sDanger(), card: (at) => cDanger(at),
    say: "But glowing in the dark is risky. Bats, frogs and spiders hunt at night. Many fireflies carry bitter chemicals in their blood, so most hunters learn that the light means: don't eat me.",
    sfx: [[2.0, 'whoosh', 1.0], [6.0, 'buzz', 0.6], [9.0, 'thud']], pops: [1.4, 4.4, 9.0] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [480, 560], bg: '#0f1430', dark: true, scene: () => sHush(), card: null },
  { key: 'twist', d: 14, tag: '11:00 pm', mood: 'full', cut: true, focus: [480, 560], bg: '#1b2140', dark: true, scene: () => sTwist(), card: (at) => cTwist(at),
    say: "And here's the twist. Some female fireflies fake another species' answer. A male flies down, expecting a mate, and gets eaten instead. She even steals his bitter chemicals. Scientists call them femme fatale fireflies.",
    sfx: [[0.4, 'thud'], [4.0, 'beep', 1300], [8.4, 'chime', ['A4', 'C5', 'E5']]], pops: [0.4, 4.0, 8.4] },
  { key: 'end', d: 12, tag: '6:00 am', mood: 'warm', focus: [480, 560], bg: '#ffcf9a', tr: { kind: 'clock', p: [480, 540] }, scene: () => sEnd(), card: (at) => cEnd(at),
    say: "By dawn, the lanterns go dark. Somewhere in the grass, a little beetle rests, ready to light up the night again, with a light that hardly gets warm.",
    sfx: [[1.6, 'chime', ['E5', 'B5', 'E6']], [8.6, 'chime', ['E5', 'G5', 'B5']]], pops: [1.6, 4.4, 8.6] },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [
  { name: '1 Dusk',    role: 'build',   t0: 0,  t1: 38 },
  { name: '2 Night',   role: 'journey', t0: 38, t1: 78 },
  { name: '3 Danger',  role: 'peak',    t0: 78, t1: HIT - 2.5 },
  { name: '4 Hush',    role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 Twist',   role: 'gift',    t0: HIT, t1: HIT + 14 },
  { name: '6 Dawn',    role: 'goodbye', t0: HIT + 14, t1: HIT + 26 },
];
const SCORE = { genre: 'folk' };
const META = {
  title: 'How Fireflies Glow Without Getting Hot',
  alt: ['How Do Fireflies Glow? Cold Light and 1 Deadly Trick', 'Why Fireflies Glow: The Chemistry and the Code'],
  hooks: [
    "You've seen fireflies glow, but you've never felt one get hot. How do they make light without heat? An old light bulb turns about ninety percent of its power into heat.",
    "You've seen fireflies glow, but you've never felt one get hot. How do they make light without heat?",
    "Some fireflies use their light to call a mate. Others use it to lure dinner. Here's how the glow works.",
    "Fireflies aren't flies, and their light is cold. So how does a beetle switch on a lamp in its belly?",
    "In 2008, scientists measured a firefly's glow and found the textbooks were wrong. Here's how the light really works.",
  ],
  queries: ['how do fireflies glow', 'why do fireflies light up', 'firefly bioluminescence'],
  hook: 'How do fireflies glow, and why do fireflies light up? Firefly bioluminescence: a chemical reaction in their lantern makes cold light, they flash in codes to find a mate, and some fake the code to hunt.',
  about: "How do fireflies glow without getting hot? Firefly bioluminescence: luciferin, the enzyme luciferase, oxygen and energy make light with little heat. Fireflies are beetles; they control oxygen to flash, every species has its own flash code, and some 'femme fatale' fireflies fake another species' code to eat the males.",
  chapters: [[0, 'Cold light'], [12, 'Fireflies are beetles'], [25, 'Luciferin and luciferase'], [38, 'The light switch'], [51, 'The flash code'], [64, 'How efficient is it?'], [78, 'Danger in the dark'], [92.5, 'Femme fatale fireflies'], [106.5, 'Dawn']],
  sources: [
    'Britannica, "How do fireflies light up?": luciferin, luciferase, oxygen, ATP and magnesium; very little heat ("cold light")',
    'Ando et al., Nature Photonics (2008): quantum yield of firefly bioluminescence ~41% (Chemistry World, "Firefly chemistry in less glowing terms"; the older figure was 88%)',
    'Fireflies control oxygen supply to the light organ to flash; species-specific flash codes; females answer (Farm and Dairy; John Deere "Flash guide")',
    'Photuris females mimic Photinus females\' replies and eat the males, gaining their defensive chemicals (Lloyd; Nature 1981; KQED "So sometimes fireflies eat other fireflies")',
    'Incandescent bulbs turn most of their energy into heat (about 90%; stated from knowledge)',
  ],
  hashtags: ['#fireflies', '#nature', '#science', '#insects', '#animation'],
  tags: ['how do fireflies glow', 'fireflies', 'bioluminescence', 'luciferin', 'luciferase', 'flash code', 'femme fatale firefly', 'animated explainer'],
};
const THUMB = { t: 100.0, panel: '#1b2140', lines: [['A FAKE', 150, '#ffffff'], ['SIGNAL', 170, '#ffe066']] };
