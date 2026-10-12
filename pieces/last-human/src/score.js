  // =====================================================================
  //  SCORE — quiet under a voice: a slow pad whose mood follows the scene, sparse plucks, and sound on the story's
  //  events. Hard silence after "Then nothing." The end returns to the morning's warm chord.
  // =====================================================================
  const R = RNG('score');
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const MOODS = {
    warm: { ch: [['D3', 'A3', 'Fs4'], ['B2', 'Fs3', 'D4'], ['G2', 'D3', 'B3'], ['A2', 'E3', 'Cs4']], sc: ['D5', 'E5', 'Fs5', 'A5', 'B5'], pl: 0.5, pk: 0.024 },
    cold: { ch: [['D3', 'A3', 'F4'], ['Bb2', 'F3', 'D4'], ['G2', 'D3', 'Bb3'], ['A2', 'E3', 'C4']], sc: ['D5', 'F5', 'A5', 'C6'], pl: 0.25, pk: 0.022 },
    awe: { ch: [['F2', 'C3', 'A3', 'E4'], ['Bb2', 'F3', 'D4', 'A4'], ['D3', 'A3', 'F4', 'C5'], ['C3', 'G3', 'E4', 'G4']], sc: ['F5', 'G5', 'A5', 'C6', 'E6'], pl: 0.35, pk: 0.022 },
    tense: { ch: [['D2', 'A2', 'Eb3'], ['D2', 'G2', 'Eb3']], sc: ['D5', 'Eb5', 'A5'], pl: 0.12, pk: 0.02 },
    hope: { ch: [['D3', 'A3', 'E4', 'Fs4'], ['G2', 'D3', 'A3', 'B3'], ['B2', 'Fs3', 'A3', 'D4'], ['A2', 'E3', 'G3', 'Cs4']], sc: ['A4', 'D5', 'E5', 'Fs5', 'A5'], pl: 0.55, pk: 0.024 },
  };
  const MOOD_OF = {
    title: 'warm', galley: 'warm', alarm: 'tense', console1: 'tense', floor: 'cold', memories: 'awe', tiny: 'cold', breathe: 'cold', halcyon: 'cold',
    feedopen: 'tense', light: 'awe', calm: 'warm', gauge: 'cold', cutaway: 'awe', giant: 'awe', swallow: 'tense', speck: 'cold', oceans: 'cold',
    migration: 'hope', grandma: 'warm', zone: 'hope', campfire: 'warm', seedships: 'awe', alone: 'cold', message: 'cold', departure: 'cold',
    archive: 'awe', hospital: 'cold', stayed: 'cold', drag: 'tense', voice1: 'cold', sinking: 'cold', decision: 'hope', bay: 'hope', launch: 'hope',
    core: 'cold', corridor: 'cold', pod: 'cold', probeview: 'awe', molten: 'tense', inside: 'awe', witness: 'awe', white: 'tense', nothing: null,
    wall: 'cold', cycles: 'cold', wind: 'awe', drift: 'awe', flash: 'awe', outside: 'cold', think: 'cold', life: 'cold', medical: 'cold', hours: 'warm',
    titanwake: 'hope', podoff: 'warm', jump: 'hope', lie: 'warm', ships: 'awe', record: 'warm', photon: 'awe', nebula: 'awe', dwarf: 'awe',
    recordend: 'cold', distant: 'hope', changed: 'warm', power: 'cold', chairs: 'cold', shutdown: 'cold', nightly: 'awe', newstars: 'hope', cup: 'warm',
    galley2: 'warm', end: 'warm',
  };

  // ================= MUSIC =================
  to = 'm';
  SCN.forEach((s, i) => {
    const mood = MOODS[MOOD_OF[s[0]]]; if (!mood) return;
    const t0 = ERA_LIST[i][0], t1 = Math.min(ERA_LIST[i][1], DURATION - 0.05), step = 6.0;
    each(t0, t1, step, (t, k) => {
      const c = mood.ch[(k + i) % mood.ch.length], te = Math.min(t + step + 0.8, t1 + 0.8);
      pad(t, te, c, mood.pk, { type: 'triangle', cut: 900, att: 1.6, rel: 1.4, send: 0.45 });
      drone(t, te, nz(c[0]) / 2, mood.pk * 0.9, { att: 1.5, rel: 1.4 });
    });
    each(t0 + 1.0, t1 - 1.0, BEAT * 2, (t) => { if (R.f() < mood.pl) pluck(t, nz(mood.sc[Math.floor(R.f() * mood.sc.length)]), 0.03, R.n(0.5), 1.2, 1800, 0.55); });
  });
  // the silence after "Then nothing": every voice ended dry before it; a faint room tone returns with the wall scene

  // ================= SFX =================
  to = 's';
  const typing = (t, str, cps = 22) => { const n = Math.min(60, str.length); for (let k = 0; k < n; k++) if (str[k] !== ' ') noiseHit(t + k / cps, 0.02, 'bandpass', 3800 + R.n(600), 2, 0.012, R.n(0.3)); };
  const swish = (tc) => sweep(tc - 0.5, tc + 0.05, 0.006, 400, 2200, 0);
  TIMELINE.morphs.forEach(swish);
  const beep = (t, f = 1000, v = 0.015) => blip(t, f, f, 0.07, v, 0.3);
  // the morning: the kettle, its click
  noiseHit(P(1), 6, 'bandpass', 900, 0.8, 0.006, -0.3);
  noiseHit(PW(3, 'clicks off'), 0.03, 'highpass', 3000, 1, 0.08, -0.3);
  noiseHit(PW(3, 'You reach') + 0.6, 0.05, 'bandpass', 2600, 6, 0.03, 0.2);
  // the alarm: a deep, pulsing tone
  each(P(4) - 0.2, PE(5) + 1.0, 1.0, (t) => { blip(t, 196, 190, 0.55, 0.06); blip(t, 98, 96, 0.55, 0.05); });
  noiseHit(PW(5, 'You set the cup'), 0.05, 'bandpass', 2400, 6, 0.04, 0.2);
  typing(P(7) - 0.3, 'EARTH HAS ENTERED THE OUTER ENVELOPE OF THE SUN.', 16);
  sub(PW(8, 'sit down') + 0.5, 0.08);
  // breathing: three soft swells
  [0, 1.3, 2.6].forEach((d) => sweep(PW(11, 'In for four') + d, PW(11, 'In for four') + d + 1.2, 0.005, 300, 900, 0));
  typing(P(12) + 0.3, 'ACQUIRING SIGNAL...');
  // the light crossing: a long thin tone
  drone(P(13), PE(13), 1320, 0.004, { att: 1, rel: 1 });
  noiseHit(P(14), 2.0, 'bandpass', 2000, 0.6, 0.02, 0, 0, 600);
  chime(PW(16, 'ran out') + 0.5, [nz('D4'), nz('A3')], 0.03);
  sub(PW(17, 'ignited a shell'), 0.07);
  [PW(19, 'Mercury is gone') + 1.4, PW(19, 'Venus is gone') + 1.4].forEach((t) => { sub(t, 0.09); noiseHit(t, 0.6, 'lowpass', 600, 1, 0.05); });
  chime(P(21), [nz('A5'), nz('E5')], 0.025);
  // the migration hops
  [PW(23, 'First to Mars'), PW(23, 'Then to the moons'), PW(23, 'Then here')].forEach((t) => sweep(t, t + 1.4, 0.01, 300, 2000, 0.2));
  // the campfire: crackles that fade
  each(P(25), PE(26), 0.37, (t) => { const f = 1 - lin(t, PW(26, 'going out'), PE(26)); if (R.f() < 0.6) noiseHit(t, 0.03, 'highpass', 2500, 1, 0.025 * f, R.n(0.4)); });
  // the seed ships, the Meridian's engines
  each(P(27), PE(28), 4, (t) => noiseHit(t, 3.8, 'lowpass', 180, 1, 0.03, 0));
  each(P(30), P(31), 0.8, (t) => beep(t, 880, 0.012));
  typing(P(32) - 0.2, '"Window closes in six hours. There\'s still a berth. Please."', 14);
  noiseHit(PW(33, 'Then the window closed'), 6, 'lowpass', 140, 1, 0.05, 0, 0, 60);
  // the archive's beacon: a ping each ring
  const pings = (t0, t1, every = 2.0) => each(t0, t1, every, (t) => blip(t, 2093, 2093, 0.25, 0.008, 0.4));
  pings(P(34), PE(36)); pings(P(89), PE(91)); pings(P(99), PE(100));
  // the hospital's heart monitor
  each(P(37), PE(37), 1.1, (t) => beep(t, 1000, 0.012));
  noiseHit(P(39), PE(39) - P(39), 'lowpass', 220, 0.7, 0.025);
  typing(P(41), 'ORBITAL DECAY: UNCERTAIN'); typing(P(107), 'POWER RESERVES');
  // the bay: welding crackle, the launch
  each(P(45) + 0.5, PW(45, 'You barely sleep'), 0.083, (t, k) => { if (k % 12 < 6) noiseHit(t, 0.03, 'highpass', 4000, 1, 0.02, -0.2); });
  noiseHit(P(46) + 0.8, 4, 'lowpass', 300, 1, 0.08, 0, 0, 120); sub(P(46) + 0.8, 0.1);
  // the core hums
  drone(P(47), PE(48), 110, 0.012, { att: 1, rel: 1 });
  // cold sleep: the pod's hiss; 83 years ticking; the lid
  noiseHit(P(50), 2.5, 'highpass', 3000, 0.7, 0.02);
  each(P(51), PE(51) + 1.5, 0.12, (t) => beep(t, 1500, 0.006));
  noiseHit(P(52) + 0.5, 2, 'highpass', 2500, 0.7, 0.03);
  chime(P(55), [nz('D5'), nz('A5'), nz('E6')], 0.03);
  // the last transmission: rising static, then the white, then nothing
  noiseHit(P(60), PW(60, 'Its final transmission') - P(60), 'bandpass', 1500, 0.5, 0.02, 0, 0, 4000);
  noiseHit(PW(60, 'Its final transmission'), P(62) - 0.3 - PW(60, 'Its final transmission'), 'highpass', 1500, 0.5, 0.03);
  // waking and sleeping
  each(P(65), PE(65), 4.4, (t) => noiseHit(t, 1.5, 'highpass', 3000, 0.7, 0.012));
  // the helium flash: the most violent event, heard as almost nothing
  sub(PW(72, 'all at once'), 0.05); noiseHit(PW(72, 'all at once'), 0.8, 'lowpass', 400, 1, 0.02);
  // the jump: a long rise and fall; the laugh as a bright chime
  sweep(PW(84, 'But you jump'), PW(84, 'But you jump') + 3.5, 0.012, 300, 1600, 0);
  chime(PW(84, 'you laugh'), [nz('D5'), nz('Fs5'), nz('A5'), nz('D6')], 0.04);
  typing(P(91), 'REC');
  // the photon's walk: tiny ticks; its dash
  each(PW(92, 'a single photon'), PW(92, 'before racing'), 0.18, (t) => blip(t, 2400 + R.n(400), 2400, 0.03, 0.006, R.n(0.5)));
  sweep(PW(92, 'before racing'), PW(92, 'before racing') + 1.2, 0.012, 800, 6000, 0.4);
  chime(PW(94, 'planetary nebula'), [nz('F5'), nz('A5'), nz('C6'), nz('E6')], 0.03);
  chime(P(96), [nz('E6'), nz('B5')], 0.03);
  // shutting down: a clunk per wing
  [PW(110, 'The lights'), PW(110, 'The lights') + 1.2, PW(110, 'hydroponic'), PW(110, 'Then the heating'), PW(110, 'One by one'), PW(110, 'One by one') + 1.2].forEach((t) => { noiseHit(t, 0.12, 'lowpass', 500, 1, 0.06); drone(t, t + 0.6, 60, 0.02, { att: 0.01, rel: 0.5 }); });
  [PW(112, 'Iron from'), PW(112, 'carbon from'), PW(112, 'oxygen from')].forEach((t, i) => chime(t, [nz(['D5', 'Fs5', 'A5'][i])], 0.025));
  // the end: the kettle again, the beacon, listening
  noiseHit(P(117) - 0.4, 0.03, 'highpass', 3000, 1, 0.06, -0.3);
  pings(P(118), DURATION - 3, 2.4);
