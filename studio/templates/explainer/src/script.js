
// =====================================================================
//  __TITLE__ — the scene list (see CLAUDE.md -> "Writing a video"). Each scene: duration d (s), the left scene, the
//  explanation lettered on the right (no card), the voice line (fill the window: ~2.7 words per second of d - 0.9), the music mood and sound cues.
//  The scene before the payoff is a 2.5 s 'silence'; the payoff scene has cut: true and mood 'full'.
// =====================================================================
const SCN = [
  { key: 'hook', d: 12, tag: 'a question', mood: 'warm', focus: [500, 540], bg: '#26315f', scene: () => sHook(), card: (at) => cHook(at),
    say: 'Replace me: the hook. One surprising question or image that the whole video answers, said in about twenty-eight words so the voice fills this scene.',
    sfx: [[2.0, 'chime']] },
  { key: 'step1', d: 13, tag: 'step 1', mood: 'groove', focus: [500, 540], bg: '#cfe2ee', scene: () => sStep1(), card: (at) => cStep1(at),
    say: 'Replace me: the first true step of the process, acted out on the left and lettered on the right, with one number or one diagram that sticks.',
    sfx: [[3.0, 'pop']] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [500, 540], bg: '#0c1124', scene: () => sHush(), card: null },
  { key: 'payoff', d: 12, tag: 'the twist', mood: 'full', cut: true, focus: [500, 540], bg: '#f3a3bf', scene: () => sPayoff(), card: (at) => cPayoff(at),
    say: 'Replace me: the payoff, the twist or the big number, landing right after the silence, with the loudest hit of the whole video under it.' },
  { key: 'end', d: 10, tag: 'so...', mood: 'warm', focus: [500, 540], bg: '#26315f', scene: () => sHook(), card: (at) => cEnd(at),
    say: 'Replace me: the ending, a callback to the opening image, changed by everything we learned.' },
];
const HIT = SCN.slice(0, SCN.findIndex((s) => s.cut)).reduce((a, s) => a + s.d, 0);
const ACTS = [];
const SCORE = { motif: ['D4', 'A4', 'Fs4'] };            // the hero's little tune (score-channel plays it on tag scenes)
const META = {                                           // YouTube metadata (studio/tools/metadata.mjs adds the chapters)
  title: '__TITLE__', alt: [], hook: 'One or two sentences that make people click.', about: 'What the video covers, in plain words.',
  sources: [], hashtags: ['#explained', '#animation'], tags: ['__TITLE__'],
};
const THUMB = { t: 4.0, panel: '#26315f', lines: [['__TITLE__', 90, '#fbf6ea']] };   // the frame time and the hook lines
