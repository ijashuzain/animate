  // =====================================================================
  //  CHANNEL SCORE — runs inside buildScore(). Each scene's `mood` picks a pad, a pluck figure and a density;
  //  `mood: 'silence'` is dead quiet (everything before it ends dry); HIT gets the payoff recipe (a short stab + a sub,
  //  then a flat chord). Each scene's `sfx: [[seconds, kind, arg], ...]` places sound on its own cues.
  //  The narration windows duck the music (score-head), so this sits under a voice.
  // =====================================================================
  const RS = RNG('chscore');
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const MOOD = {
    warm:   { ch: [['D3', 'A3', 'Fs4'], ['B2', 'Fs3', 'D4'], ['G2', 'D3', 'B3'], ['A2', 'E3', 'Cs4']], fig: ['D4', 'A4', 'Fs4', 'A4', 'D5', 'A4', 'Fs4', 'A4'], step: BEAT, pk: 0.026, pl: 0.04, bass: false },
    groove: { ch: [['D3', 'A3', 'E4'], ['B2', 'Fs3', 'D4'], ['G2', 'D3', 'B3'], ['A2', 'E3', 'Cs4']], fig: ['D4', 'A4', 'B4', 'A4', 'E5', 'A4', 'B4', 'A4'], step: E8, pk: 0.026, pl: 0.042, bass: true },
    full:   { ch: [['D3', 'A3', 'E4', 'A4'], ['B2', 'Fs3', 'D4', 'A4'], ['G2', 'D3', 'B3', 'D4'], ['A2', 'E3', 'Cs4', 'E4']], fig: ['Fs4', 'A4', 'Cs5', 'A4', 'E5', 'A4', 'Cs5', 'A4'], step: E16, pk: 0.028, pl: 0.036, bass: true, hats: true },
    cold:   { ch: [['D3', 'A3', 'F4'], ['Bb2', 'F3', 'D4'], ['G2', 'D3', 'Bb3'], ['A2', 'E3', 'C4']], fig: ['A5', 'F5', 'E5', 'D5'], step: BEAT * 3, pk: 0.02, pl: 0.03, bass: false },
    awe:    { ch: [['F2', 'C3', 'A3', 'E4'], ['Bb2', 'F3', 'D4', 'A4'], ['D3', 'A3', 'F4', 'C5'], ['C3', 'G3', 'E4', 'G4']], fig: ['F5', 'A5', 'C6', 'E6', 'C6', 'A5'], step: BEAT, pk: 0.024, pl: 0.03, bass: false },
    tense:  { ch: [['D2', 'A2', 'Eb3'], ['D2', 'G2', 'Eb3']], fig: ['D5', 'Eb5', 'A5'], step: BEAT * 2, pk: 0.02, pl: 0.028, bass: false },
  };
  SCN.forEach((s, i) => {
    const m = MOOD[s.mood ?? 'warm']; if (!m) return;
    const nextSilent = SCN[i + 1] && SCN[i + 1].mood === 'silence';
    const t0 = s.t0, t1 = nextSilent ? s.t1 - 0.02 : Math.min(s.t1 + 0.05, DURATION), rel = nextSilent ? 0.05 : 0.3;
    each(t0, t1, 4.0, (t, k) => { const c = m.ch[(k + i) % m.ch.length]; pad(t, Math.min(t + 4.1, t1), c, m.pk, { type: s.mood === 'cold' || s.mood === 'warm' ? 'triangle' : 'sawtooth', cut: s.mood === 'full' ? 1300 : 900, att: k ? 0.05 : 0.3, rel, send: nextSilent ? 0.02 : 0.35 }); });
    each(t0 + (s.mood === 'warm' || s.mood === 'cold' ? 0.5 : 0), t1 - (nextSilent ? 0.3 : 0), m.step, (t, k) => {
      const acc = k % 4 === 0 ? 1.2 : k % 2 === 0 ? 1 : 0.75;
      pluck(t, nz(m.fig[k % m.fig.length]), m.pl * acc, Math.sin(k * 0.9) * 0.35, m.step >= BEAT ? 0.8 : 0.3, s.mood === 'full' ? 5000 : 3000, nextSilent && t > t1 - 0.6 ? 0.02 : 0.25);
      if (m.bass && k % (m.step === E16 ? 4 : 2) === 0) bass(t, nz(Math.floor(t / 2) % 2 ? 'A2' : 'D2'), 0.13);
      if (m.hats && k % 2 === 1) noiseHit(t, 0.016, 'highpass', 8500, 0.7, 0.016, k % 4 === 1 ? 0.3 : -0.3);
    });
    if (s.mood === 'cold') drone(t0, t1, nz('D2'), 0.03, { att: 0.6, rel });
  });
  // the hero's motif (SCORE.motif): a little tune on each tagged scene's first beat and at the very end
  const MOTIF = (typeof SCORE !== 'undefined' && SCORE.motif) || ['D4', 'A4', 'Fs4'];
  const motif = (t, vel, step = E8) => MOTIF.forEach((n, k) => pluck(t + k * step, nz(n), vel * (k === MOTIF.length - 1 ? 1.15 : 1), 0.15 - k * 0.12, 0.7, 2800, 0.4));
  SCN.forEach((s, i) => { if (s.tag && s.mood !== 'silence' && i % 2 === 0) motif(s.t0 + 0.75, 0.05); });
  motif(Math.max(0, DURATION - 4.2), 0.08, BEAT);
  // a soft kick under the groove and the full moods (on the beat, under the voice's duck)
  SCN.forEach((s, i) => { if (s.mood !== 'groove' && s.mood !== 'full') return; const nextSilent = SCN[i + 1] && SCN[i + 1].mood === 'silence'; each(s.t0, s.t1 - (nextSilent ? 0.4 : 0), BEAT, (t, k) => { const o = osc('sine', 110, t, t + 0.3); o.frequency.exponentialRampToValueAtTime(42, t + 0.12); const g = ac.createGain(); env(g, t, 0.003, s.mood === 'full' ? 0.16 : 0.11, 0.22); o.connect(g); out(g); }); });
  // a gentle riser into every scene change (not into the silence), a downlifter after the payoff
  TIMELINE.morphs.forEach((tc) => sweep(tc - 1.1, tc - 0.05, 0.004, 900, 3200, 0));
  sweep(HIT + 0.3, HIT + 2.2, 0.006, 3000, 400, 0);
  // the payoff: a stab and a sub on the hit, then a flat warm chord
  ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'].forEach((n, i) => pluck(HIT + i * 0.006, nz(n), 0.34, (i - 2.5) * 0.15, 0.7, 5200, 0.4));
  pad(HIT, HIT + 0.4, ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'], 0.45, { cut: 3600, att: 0.008, rel: 0.35, send: 0.3 });

  // ================= SFX =================
  to = 's';
  sub(HIT, 0.34); noiseHit(HIT, 0.2, 'lowpass', 1200, 0.8, 0.2);
  TIMELINE.morphs.forEach((tc) => sweep(tc - 0.35, tc + 0.02, 0.005, 500, 2600, 0));
  const SFX = {
    pop: (t, f = 1000) => blip(t, f, f * 1.5, 0.07, 0.02, RS.n(0.4)),
    chime: (t, notes = ['A5', 'E6']) => chime(t, notes.map(nz), 0.035),
    whoosh: (t, d = 0.8) => sweep(t, t + d, 0.018, 300, 4000, RS.n(0.4)),
    thud: (t) => { sub(t, 0.1); noiseHit(t, 0.15, 'lowpass', 600, 1, 0.08); },
    click: (t) => noiseHit(t, 0.025, 'highpass', 3500, 1, 0.04, RS.n(0.3)),
    typing: (t, n = 12) => { for (let k = 0; k < n; k++) noiseHit(t + k * 0.07, 0.02, 'bandpass', 3800 + RS.n(600), 2, 0.016, RS.n(0.3)); },
    scribble: (t, d = 0.6) => { for (let u = 0; u < d; u += E16) noiseHit(t + u, 0.09, 'bandpass', 2800 + RS.n(500), 1.4, 0.02 * (0.7 + RS.f() * 0.5), 0.2); },
    ding: (t) => chime(t, [nz('D6'), nz('A6')], 0.04),
    beep: (t, f = 1000) => blip(t, f, f, 0.08, 0.018, 0.3),
    rise: (t, d = 1.0) => riser(t, t + d, 0.012),
    drone: (t, d = 2, f = 'D2') => drone(t, t + d, nz(f), 0.03, { att: 0.3, rel: 0.4 }),
  };
  SCN.forEach((s) => (s.sfx || []).forEach(([d, kind, arg]) => SFX[kind](s.t0 + d, arg)));
  // the card's items arrive with soft pops
  SCN.forEach((s, i) => { if (s.card && s.mood !== 'silence') (s.pops ?? [1.6, 3.0, 4.4]).forEach((d) => SFX.pop(s.t0 + d, 1200 + i * 30)); });
