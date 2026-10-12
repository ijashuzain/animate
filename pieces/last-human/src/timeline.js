
// =====================================================================
//  TIMELINE — scenes start just before the paragraph they illustrate; cues inside a scene come from the words
//  of the narration: PW(i, 'phrase') = when paragraph i is planned to reach that phrase (by its place in the text).
// =====================================================================
const NFRAMES = Math.round(DURATION * FPS);
const LOOP_T = NFRAMES / FPS;
const P = (i) => NARR[i][1];
const PE = (i) => NARR[i][2];
function PW(i, phrase) {
  const [, t0, t1, text] = NARR[i], k = text.indexOf(phrase);
  if (k < 0) throw new Error(`cue "${phrase}" not in paragraph ${i}`);
  return +(t0 + (t1 - 0.4 - t0) * (k / text.length)).toFixed(3);
}
const at = (i) => onBeat(P(i) - 0.6);   // a scene that opens on paragraph i: its morph ends as the voice starts

// [key, start, draw, focus (the bridge's centre), dominant colour, hard cut?]
const SCN = [
  ['title',     0,                             () => sTitle(),            [960, 520], '#d98a3d'],
  ['galley',    at(1),                         () => sGalley(1),          [1210, 520], '#4a5262'],
  ['alarm',     onBeat(P(4) - 0.25),           () => sAlarm(),            [960, 540], '#5a2a2e', true],
  ['console1',  at(6),                         () => sConsole('alert'),   [960, 470], '#2b3240'],
  ['floor',     at(8),                         () => sFloor(),            [760, 560], '#3e4655'],
  ['memories',  at(9),                         () => sMemories(),         [960, 540], '#141a33'],
  ['tiny',      at(10),                        () => sTiny(),             [1460, 560], '#141a33'],
  ['breathe',   at(11),                        () => sBreathe(),          [760, 560], '#3e4655'],
  ['halcyon',   onBeat(PW(11, 'The station hums') - 0.3), () => sHalcyon(), [960, 600], '#c9772f'],
  ['feedopen',  at(12),                        () => sConsole('feed'),    [960, 470], '#2b3240'],
  ['light',     at(13),                        () => sLight(),            [960, 540], '#141a33'],
  ['calm',      at(14),                        () => sSunCalm(),          [960, 470], '#2a4f7a'],
  ['gauge',     at(16),                        () => sGauge(),            [960, 540], '#2b3240'],
  ['cutaway',   at(17),                        () => sCutaway(),          [960, 540], '#141a33'],
  ['giant',     at(18),                        () => sGiant(),            [1100, 540], '#141a33'],
  ['swallow',   at(19),                        () => sSwallow(),          [700, 540], '#141a33'],
  ['speck',     at(20),                        () => sSpeck(),            [1300, 520], '#7a1f1a'],
  ['oceans',    at(22),                        () => sOceans(),           [960, 540], '#141a33'],
  ['migration', at(23),                        () => sMigration(),        [960, 560], '#141a33'],
  ['grandma',   at(24),                        () => sGrandma(),          [960, 560], '#3a4a6a'],
  ['zone',      onBeat(PW(24, 'For a few hundred') - 0.3), () => sZone(), [960, 540], '#141a33'],
  ['campfire',  at(25),                        () => sCampfire(),         [960, 700], '#101a2a'],
  ['seedships', at(27),                        () => sSeedShips(),        [960, 480], '#141a33'],
  ['alone',     at(29),                        () => sDeckScene('alone'), [760, 540], '#3e4655'],
  ['message',   at(30),                        () => sMessage(),          [960, 470], '#2b3240'],
  ['departure', at(33),                        () => sDeparture(),        [1200, 420], '#3e4655'],
  ['archive',   at(34),                        () => sArchive(1),         [960, 500], '#33302c'],
  ['hospital',  at(37),                        () => sHospital(),         [960, 560], '#2d3a40'],
  ['stayed',    at(38),                        () => sDeckScene('stayed'), [760, 540], '#3e4655'],
  ['drag',      at(39),                        () => sDrag(),             [960, 560], '#7a1f1a'],
  ['voice1',    at(40),                        () => sStationVoice(1),    [960, 470], '#2b3240'],
  ['sinking',   at(42),                        () => sSinking(),          [960, 600], '#7a1f1a'],
  ['decision',  at(43),                        () => sDeckScene('decision'), [760, 540], '#3e4655'],
  ['bay',       at(45),                        () => sBay(),              [1000, 560], '#3a3f4a'],
  ['launch',    at(46),                        () => sLaunch(),           [960, 560], '#c9772f'],
  ['core',      at(47),                        () => sCore(),             [800, 540], '#2b3240'],
  ['corridor',  at(49),                        () => sCorridor(1),        [960, 560], '#3e4655'],
  ['pod',       at(50),                        () => sPod(1),             [960, 560], '#2d3a48'],
  ['probeview', at(53),                        () => sProbeView(),        [1150, 520], '#141a33'],
  ['molten',    at(56),                        () => sMolten(),           [960, 540], '#3a1410'],
  ['inside',    at(57),                        () => sInside(),           [1000, 540], '#7a1f1a'],
  ['witness',   at(58),                        () => sWitness(),          [960, 520], '#2b3240'],
  ['white',     at(60),                        () => sWhite(),            [960, 540], '#e8e2d4'],
  ['nothing',   onBeat(P(62) - 0.25),          () => sNothing(),          [960, 540], '#0c0e14', true],
  ['wall',      at(63),                        () => sWall(),             [960, 520], '#4a5262'],
  ['cycles',    at(65),                        () => sCycles(),           [960, 560], '#2d3a48'],
  ['wind',      at(66),                        () => sWind(),             [800, 540], '#141a33'],
  ['drift',     at(69),                        () => sDrift(),            [960, 540], '#141a33'],
  ['flash',     at(71),                        () => sFlash(),            [960, 540], '#141a33'],
  ['outside',   at(73),                        () => sOutside(),          [960, 540], '#141a33'],
  ['think',     at(75),                        () => sDeckScene('think'), [760, 540], '#3e4655'],
  ['life',      at(76),                        () => sCorridor(2),        [960, 560], '#3e4655'],
  ['medical',   at(78),                        () => sMedical(),          [960, 520], '#2b3240'],
  ['hours',     at(79),                        () => sDeckScene('hours'), [960, 480], '#3e4655'],
  ['titanwake', at(80),                        () => sTitanWake(),        [960, 600], '#c9772f'],
  ['podoff',    at(83),                        () => sPod(2),             [960, 560], '#2d3a48'],
  ['jump',      at(84),                        () => sJump(),             [900, 600], '#c9772f'],
  ['lie',       at(86),                        () => sLie(),              [960, 700], '#c9772f'],
  ['ships',     at(87),                        () => sShipsStars(),       [960, 540], '#141a33'],
  ['record',    at(89),                        () => sArchive(2),         [960, 500], '#33302c'],
  ['photon',    at(92),                        () => sPhoton(),           [700, 540], '#141a33'],
  ['nebula',    at(93),                        () => sNebula(),           [960, 540], '#141a33'],
  ['dwarf',     at(95),                        () => sDwarf(),            [960, 540], '#141a33'],
  ['recordend', at(99),                        () => sArchive(3),         [960, 500], '#33302c'],
  ['distant',   at(101),                       () => sDistant(),          [960, 560], '#2a2350'],
  ['changed',   at(103),                       () => sDeckScene('changed'), [760, 540], '#3e4655'],
  ['power',     at(106),                       () => sStationVoice(2),    [960, 470], '#2b3240'],
  ['chairs',    at(108),                       () => sDeckScene('chairs'), [960, 540], '#3e4655'],
  ['shutdown',  at(110),                       () => sShutdown(),         [960, 540], '#141a33'],
  ['nightly',   at(111),                       () => sNightly(),          [960, 520], '#141a33'],
  ['newstars',  at(113),                       () => sNewStars(),         [960, 540], '#141a33'],
  ['cup',       at(115),                       () => sCup(),              [960, 560], '#4a5262'],
  ['galley2',   at(116),                       () => sGalley(2),          [1210, 520], '#4a5262'],
  ['end',       at(118),                       () => sDeckScene('end'),   [960, 480], '#3e4655'],
];
const ERA_LIST = SCN.map((s, i) => [s[1], i + 1 < SCN.length ? SCN[i + 1][1] : DURATION, s[2]]);
const SCN_I = Object.fromEntries(SCN.map((s, i) => [s[0], i]));
const T0 = (k) => SCN[SCN_I[k]][1];
const TIMELINE = {
  width: W, height: H, fps: FPS, bpm: BPM, gridOffset: GRID0, duration: DURATION, frames: NFRAMES, loop: LOOP_T, safe: SAFE, aspect: FORMAT,
  format: 'morph-chain',
  shots: SCN.map((s, i) => ({ id: i + 1, key: s[0], era: i, t0: ERA_LIST[i][0], t1: ERA_LIST[i][1], title: s[0] })),
  cuts: SCN.filter((s) => s[5]).map((s) => s[1]),
  morphs: SCN.slice(1).filter((s) => !s[5]).map((s) => s[1]),
  cues: {},
  acts: [],
  board: [],
  narration: NARR.map(([i, t0, t1, text]) => ({ id: 'p' + i, t0, t1, text })),
};
window.TIMELINE = TIMELINE;
