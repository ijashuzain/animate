  // =====================================================================
  //  CHANNEL SCORE — runs inside buildScore(). SCORE.genre picks the sound of the whole video (instruments, key,
  //  chords, drum pattern, swing, texture); each scene's `mood` picks the energy inside that genre
  //  (warm 1, groove 2, full 3; cold/tense use the genre's minor colour, awe its open colour; 'silence' is dead quiet).
  //  The payoff (HIT) gets the genre's stab and a sub; the last scene decays. SFX come from a kit that matches the
  //  drawing style (paper taps, pencil, digital clicks, 8-bit), and every scene change gets a sound for its transition.
  //  Genres: paper (default) | lofi | synth | pizzicato | ambient | chiptune | folk | mystery   (see studio/sound.md)
  //  The narration windows duck the music (score-head), so this sits under a voice: no busy lead melodies.
  // =====================================================================
  const RS = RNG('chscore');
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const SC = typeof SCORE !== 'undefined' ? SCORE : {};

  // ---- instruments (built on score-head's osc / env / out / noiseHit)
  const tone = (type, t, f, vel, a, d, pan = 0, send = 0.25, cut = 0) => { const g = ac.createGain(); env(g, t, a, vel, d); const o = osc(type, f, t, t + a + d + 0.05); if (cut) { const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cut; o.connect(lp); lp.connect(g); } else o.connect(g); out(g, pan, send); return o; };
  const I = {
    pluck: (t, f, v, pan = 0, dur = 0.32) => pluck(t, f, v, pan, dur, 3000, 0.25),
    epiano: (t, f, v, pan = 0, dur = 0.9) => { tone('sine', t, f, v, 0.008, dur, pan, 0.3); tone('sine', t, f * 2.002, v * 0.28, 0.004, dur * 0.4, pan, 0.2); tone('triangle', t, f * 0.999, v * 0.25, 0.01, dur * 0.7, -pan, 0.2, 1800); },
    pizz: (t, f, v, pan = 0) => { tone('triangle', t, f, v, 0.002, 0.18, pan, 0.25, 2600); noiseHit(t, 0.012, 'bandpass', 2200, 2, v * 0.35, pan); },
    marimba: (t, f, v, pan = 0) => { tone('sine', t, f, v, 0.002, 0.42, pan, 0.25); tone('sine', t, f * 3.99, v * 0.14, 0.001, 0.08, pan, 0.1); },
    bell: (t, f, v, pan = 0, dur = 2.2) => { tone('sine', t, f, v, 0.003, dur, pan, 0.6); tone('sine', t, f * 2.76, v * 0.3, 0.002, dur * 0.4, pan, 0.6); tone('sine', t, f * 5.4, v * 0.12, 0.001, dur * 0.2, pan, 0.6); },
    square: (t, f, v, pan = 0, dur = 0.14) => tone('square', t, f, v * 0.55, 0.002, dur, pan, 0.12, 3200),
    saw: (t, f, v, pan = 0, dur = 0.16) => { const o = tone('sawtooth', t, f, v * 0.7, 0.003, dur, pan, 0.25, 2400); o.detune.value = RS.n(6); },
    guitar: (t, f, v, pan = 0, dur = 0.7) => { tone('triangle', t, f, v, 0.002, dur, pan, 0.25, 2600); tone('sawtooth', t, f * 1.001, v * 0.18, 0.001, dur * 0.25, pan, 0.15, 1800); },
  };
  const D = {
    kick: (t, v = 0.11) => { const o = osc('sine', 110, t, t + 0.3); o.frequency.exponentialRampToValueAtTime(42, t + 0.12); const g = ac.createGain(); env(g, t, 0.003, v, 0.22); o.connect(g); out(g); },
    snare: (t, v = 0.05) => { noiseHit(t, 0.16, 'bandpass', 1900, 0.9, v, 0, 0.15); tone('triangle', t, 190, v * 0.6, 0.002, 0.08); },
    clap: (t, v = 0.05) => { for (let i = 0; i < 3; i++) noiseHit(t + i * 0.011, 0.05 + i * 0.03, 'bandpass', 1400, 1.2, v * (i === 2 ? 1 : 0.6), 0, 0.2); },
    hat: (t, v = 0.018, pan = 0.25) => noiseHit(t, 0.03, 'highpass', 8200, 0.7, v, pan),
    shaker: (t, v = 0.014) => noiseHit(t, 0.07, 'bandpass', 6200, 1.5, v, -0.3),
    wood: (t, v = 0.04, f = 900) => tone('sine', t, f, v, 0.001, 0.05, 0.3, 0.1),
    timp: (t, v = 0.14) => { const o = osc('sine', 98, t, t + 1.2); o.frequency.exponentialRampToValueAtTime(70, t + 0.6); const g = ac.createGain(); env(g, t, 0.005, v, 0.9); o.connect(g); out(g, 0, 0.3); noiseHit(t, 0.08, 'lowpass', 400, 0.7, v * 0.4); },
    chipKick: (t, v = 0.06) => { const o = osc('square', 160, t, t + 0.12); o.frequency.exponentialRampToValueAtTime(40, t + 0.1); const g = ac.createGain(); env(g, t, 0.002, v, 0.09); o.connect(g); out(g); },
    chipSnare: (t, v = 0.03) => noiseHit(t, 0.07, 'highpass', 3000, 0.5, v),
  };
  const vinyl = (t0, t1, v = 0.006) => { for (let t = t0; t < t1; t += 0.11 + RS.f() * 0.3) noiseHit(t, 0.006, 'highpass', 5000, 0.5, v * (0.4 + RS.f()), RS.n(0.8)); };
  const air = (t0, t1, v = 0.004) => each(t0, t1, 2.0, (t) => noiseHit(t, 2.4, 'bandpass', 900 + RS.f() * 900, 0.6, v, RS.n(0.5), 0.6));

  // ---- genres: chords (4-bar loop, one chord per 2 s = 1 bar at 120), bass roots, figures per energy, drums per 16th
  //      energy e: 1 warm, 2 groove, 3 full. fig(k, ch, e) -> note name or null; drums(t, k16, e)
  const arp = (ch, k, up = true) => ch[(up ? k : ch.length - 1 - (k % ch.length)) % ch.length];
  const GENRES = {
    paper: { ch: [['D3', 'A3', 'Fs4'], ['B2', 'Fs3', 'D4'], ['G2', 'D3', 'B3'], ['A2', 'E3', 'Cs4']], minor: [['D3', 'A3', 'F4'], ['Bb2', 'F3', 'D4'], ['G2', 'D3', 'Bb3'], ['A2', 'E3', 'C4']], open: [['F2', 'C3', 'A3', 'E4'], ['Bb2', 'F3', 'D4', 'A4'], ['D3', 'A3', 'F4', 'C5'], ['C3', 'G3', 'E4', 'G4']],
      roots: ['D2', 'B1', 'G1', 'A1'], lead: 'pluck', padType: 'sawtooth', padCut: 900, pk: 0.026, lv: 0.04, step: [BEAT, E8, E16], swing: 0,
      fig: (k, ch, e) => ['D4', 'A4', e > 1 ? 'B4' : 'Fs4', 'A4', e > 1 ? 'E5' : 'D5', 'A4', e > 1 ? 'B4' : 'Fs4', 'A4'][k % 8],
      drums: (t, k, e) => { if (e >= 2 && k % 4 === 0) D.kick(t, e === 3 ? 0.16 : 0.11); if (e === 3 && k % 4 === 2) D.hat(t, 0.016); }, hit: ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'], motif: ['D4', 'A4', 'Fs4'] },
    lofi: { ch: [['F3', 'A3', 'C4', 'E4'], ['E3', 'G3', 'B3', 'D4'], ['D3', 'F3', 'A3', 'C4'], ['C3', 'E3', 'G3', 'B3']], minor: [['D3', 'F3', 'A3', 'C4'], ['Bb2', 'D3', 'F3', 'A3'], ['G2', 'Bb2', 'D3', 'F3'], ['A2', 'C3', 'E3', 'G3']],
      roots: ['F2', 'E2', 'D2', 'C2'], lead: 'epiano', padType: 'triangle', padCut: 1100, pk: 0.02, lv: 0.05, step: [BEAT, BEAT, E8], swing: 0.16, texture: (t0, t1) => vinyl(t0, t1),
      fig: (k, ch, e) => (e === 1 ? (k % 2 ? null : arp(ch, k / 2 + 2)) : (k % 4 === 3 ? null : arp(ch, k + 1))),
      chordHits: true,
      drums: (t, k, e) => { if (e < 2) return; if (k % 16 === 0 || k % 16 === 10) D.kick(t, 0.12); if (k % 8 === 4) D.snare(t, 0.045); if (k % 2 === 0) D.hat(t, k % 4 === 2 ? 0.012 : 0.017); }, hit: ['F3', 'C4', 'E4', 'A4', 'C5'], motif: ['A4', 'C5', 'E5', 'D5'] },
    synth: { ch: [['A2', 'E3', 'A3', 'C4'], ['F2', 'C3', 'F3', 'A3'], ['C3', 'G3', 'C4', 'E4'], ['G2', 'D3', 'G3', 'B3']], open: [['F2', 'C3', 'G3', 'A3'], ['C3', 'G3', 'D4', 'E4'], ['G2', 'D3', 'A3', 'B3'], ['A2', 'E3', 'B3', 'C4']],
      roots: ['A1', 'F1', 'C2', 'G1'], lead: 'saw', padType: 'sawtooth', padCut: 1400, pk: 0.022, lv: 0.036, step: [E8, E16, E16], swing: 0,
      fig: (k, ch, e) => (e === 1 && k % 2 ? null : arp(ch, k) .replace(/(\d)$/, (m) => String(+m + 1))),
      bassStep: E8, drums: (t, k, e) => { if (e >= 2 && k % 4 === 0) D.kick(t, 0.14); if (e >= 2 && k % 8 === 4) D.clap(t, 0.05); if (e >= 2 && k % 2 === 1) D.hat(t, 0.012); if (e === 3) D.hat(t, 0.008, -0.3); }, hit: ['A2', 'E3', 'A3', 'C4', 'E4', 'A4'], motif: ['A4', 'C5', 'E5', 'G5'] },
    pizzicato: { ch: [['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'], ['D4', 'Fs4', 'A4'], ['E3', 'G3', 'B3']], minor: [['E3', 'G3', 'B3'], ['A3', 'C4', 'E4'], ['B3', 'D4', 'Fs4'], ['E3', 'G3', 'B3']],
      roots: ['G2', 'C3', 'D3', 'E2'], lead: 'pizz', double: 'marimba', padType: 'triangle', padCut: 800, pk: 0.012, lv: 0.06, step: [E8, E8, E16], swing: 0.08, bassInst: 'pizz',
      fig: (k, ch, e) => (k % 4 === 3 && e < 3 ? null : arp(ch, [0, 1, 2, 1, 2, 0, 1, 2][k % 8]).replace(/(\d)$/, (m) => String(+m + (k % 8 > 3 ? 1 : 0)))),
      drums: (t, k, e) => { if (k % 4 === 2) D.wood(t, 0.03, 1100); if (e >= 2 && k % 2 === 0) D.shaker(t, 0.012); if (e === 3 && k % 8 === 0) D.kick(t, 0.09); }, hit: ['G3', 'B3', 'D4', 'G4', 'B4', 'D5'], motif: ['G4', 'B4', 'D5', 'B4'] },
    ambient: { ch: [['E3', 'B3', 'Fs4', 'Gs4'], ['Cs3', 'Gs3', 'B3', 'E4'], ['A2', 'E3', 'Gs3', 'Cs4'], ['B2', 'Fs3', 'Cs4', 'Ds4']], minor: [['E3', 'B3', 'D4', 'G4'], ['C3', 'G3', 'B3', 'E4'], ['A2', 'E3', 'G3', 'C4'], ['B2', 'Fs3', 'A3', 'D4']],
      roots: ['E2', 'Cs2', 'A1', 'B1'], lead: 'bell', padType: 'sine', padCut: 2400, pk: 0.05, lv: 0.035, step: [BEAT * 2, BEAT, BEAT], swing: 0, padAtt: 1.2, texture: (t0, t1) => air(t0, t1),
      fig: (k, ch, e) => (RS.f() < (e === 1 ? 0.5 : 0.75) ? arp(ch, Math.floor(RS.f() * 4)).replace(/(\d)$/, (m) => String(+m + 1)) : null),
      drums: (t, k, e) => { if (e === 3 && k % 4 === 0) D.kick(t, 0.09); }, hit: ['E3', 'B3', 'E4', 'Gs4', 'B4', 'Fs5'], motif: ['B4', 'E5', 'Fs5', 'Gs5'] },
    chiptune: { ch: [['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4']], minor: [['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['D3', 'F3', 'A3'], ['E3', 'G3', 'B3']],
      roots: ['C2', 'A1', 'F1', 'G1'], lead: 'square', padType: null, pk: 0, lv: 0.05, step: [E8, E16, E16], swing: 0, bassInst: 'chipBass', bassStep: E8,
      fig: (k, ch, e) => (e === 1 && k % 2 ? null : arp(ch, k).replace(/(\d)$/, (m) => String(+m + 1))),
      drums: (t, k, e) => { if (e >= 2 && k % 8 === 0) D.chipKick(t); if (e >= 2 && k % 8 === 4) D.chipSnare(t); if (e === 3 && k % 2 === 1) D.chipSnare(t, 0.01); }, hit: ['C4', 'E4', 'G4', 'C5', 'E5', 'G5'], motif: ['C5', 'E5', 'G5', 'C6'] },
    folk: { ch: [['D3', 'A3', 'D4', 'Fs4'], ['G2', 'D3', 'G3', 'B3'], ['B2', 'Fs3', 'B3', 'D4'], ['A2', 'E3', 'A3', 'Cs4']], minor: [['B2', 'Fs3', 'B3', 'D4'], ['G2', 'D3', 'G3', 'B3'], ['D3', 'A3', 'D4', 'Fs4'], ['A2', 'E3', 'A3', 'Cs4']],
      roots: ['D2', 'G1', 'B1', 'A1'], lead: 'guitar', padType: 'triangle', padCut: 700, pk: 0.012, lv: 0.045, step: [E8, E8, E16], swing: 0.1, strum: true,
      fig: (k, ch, e) => arp(ch, [0, 2, 1, 3, 2, 1, 3, 2][k % 8]),
      drums: (t, k, e) => { if (k % 2 === 0) D.shaker(t, e === 1 ? 0.008 : 0.013); if (e >= 2 && k % 8 === 0) D.kick(t, 0.09); if (e === 3 && k % 8 === 4) D.clap(t, 0.035); }, hit: ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'], motif: ['Fs4', 'A4', 'B4', 'A4'] },
    mystery: { ch: [['D3', 'F3', 'A3'], ['Bb2', 'F3', 'D4'], ['G2', 'D3', 'Bb3'], ['A2', 'E3', 'Cs4']], open: [['D3', 'A3', 'E4'], ['Bb2', 'F3', 'C4'], ['G2', 'D3', 'A3'], ['A2', 'E3', 'B3']],
      roots: ['D2', 'Bb1', 'G1', 'A1'], lead: 'pizz', padType: 'sawtooth', padCut: 650, pk: 0.024, lv: 0.05, step: [BEAT, E8, E8], swing: 0, texture: (t0, t1) => drone(t0, t1, nz('D2'), 0.025, { att: 0.8, rel: 0.4 }),
      fig: (k, ch, e) => [ch[0], ch[1], ch[2], ch[1]][k % 4],
      drums: (t, k, e) => { if (e >= 2 && k % 16 === 0) D.timp(t, 0.12); if (e === 3 && k % 4 === 0) D.kick(t, 0.1); if (e >= 2 && k % 8 === 6) D.wood(t, 0.02, 600); }, hit: ['D2', 'A2', 'D3', 'F3', 'A3', 'D4'], motif: ['D4', 'F4', 'E4', 'A3'] },
  };
  const GN = (typeof window !== 'undefined' && window.GENRE) || SC.genre || 'paper', G = GENRES[GN];   // window.GENRE: the sampler tool
  if (!G) throw new Error(`unknown SCORE.genre "${GN}" (one of ${Object.keys(GENRES).join(', ')})`);
  const energy = { warm: 1, groove: 2, full: 3, cold: 1, awe: 1, tense: 2 };
  const leadOf = (name) => I[name] ?? I.pluck;
  const bassNote = (t, f, v) => { if (G.bassInst === 'pizz') I.pizz(t, f, v * 0.8, 0); else if (G.bassInst === 'chipBass') tone('triangle', t, f, v * 0.9, 0.002, 0.12); else bass(t, f, v); };
  const swingT = (t, k) => t + (k % 2 ? (G.swing ?? 0) * E8 : 0);

  // ---- music, scene by scene
  to = 'm';
  SCN.forEach((s, i) => {
    const e = energy[s.mood ?? 'warm']; if (!e) return;
    // the arc: the payoff ('full') sits ~2 dB above everything, the goodbye decays ~7 dB below it (review: gift loudest, goodbye decays)
    const gv = i === SCN.length - 1 && s.mood !== 'full' ? 0.42 : s.mood === 'full' ? 1.3 : 1;
    const chs = (s.mood === 'cold' || s.mood === 'tense') ? (G.minor ?? G.ch) : s.mood === 'awe' ? (G.open ?? G.ch) : G.ch;
    const nextSilent = SCN[i + 1] && SCN[i + 1].mood === 'silence';
    const t0 = s.t0, t1 = nextSilent ? s.t1 - 0.02 : Math.min(s.t1 + 0.05, DURATION), rel = nextSilent ? 0.05 : 0.3;
    const chordAt = (t) => chs[Math.floor(t / 2) % chs.length];
    if (G.padType && G.pk) each(t0, t1, 4.0, (t, k) => pad(t, Math.min(t + 4.1, t1), chordAt(t), G.pk * gv, { type: G.padType, cut: e === 3 ? G.padCut * 1.5 : G.padCut, att: k ? 0.05 : (G.padAtt ?? 0.3), rel, send: nextSilent ? 0.02 : 0.4 }));
    if (G.texture && i === 0) G.texture(0, DURATION - 1);
    const step = G.step[e - 1], L = leadOf(G.lead), Ld = G.double ? leadOf(G.double) : null;
    each(t0 + (e === 1 ? 0.5 : 0), t1 - (nextSilent ? 0.3 : 0), step, (t, k) => {
      const ch = chordAt(t), n = G.fig(k, ch, e); if (!n) return;
      const acc = k % 4 === 0 ? 1.15 : k % 2 === 0 ? 1 : 0.8, tt = swingT(t, k), v = G.lv * acc * gv;
      if (G.strum && k % 4 === 0) ch.forEach((cn, j) => L(tt + j * 0.018, nz(cn), v * 0.55, -0.2 + j * 0.13));
      else L(tt, nz(n), v, Math.sin(k * 0.9) * 0.35);
      if (Ld && e >= 2 && k % 2 === 0) Ld(tt, nz(n), v * 0.5, -Math.sin(k * 0.9) * 0.3);
    });
    if (G.chordHits) each(t0, t1 - 0.3, BEAT * 2, (t, k) => chordAt(t).forEach((cn, j) => I.epiano(swingT(t, 1) + j * 0.012, nz(cn), G.lv * 0.38 * gv, -0.3 + j * 0.2, 1.4)));
    if (e >= 2) each(t0, t1 - (nextSilent ? 0.3 : 0), G.bassStep ?? BEAT, (t, k) => { if (G.bassStep || k % 2 === 0) bassNote(t, nz(G.roots[Math.floor(t / 2) % 4]) * (G.bassStep && k % 2 ? 2 : 1), 0.12 * gv); });
    if (s.mood === 'cold' || s.mood === 'tense') drone(t0, t1, nz(G.roots[0]), 0.025, { att: 0.6, rel });
    each(t0, t1 - (nextSilent ? 0.4 : 0), E16, (t, k) => G.drums(swingT(t, k >> 1), k, e));
  });
  // the hero's motif (SCORE.motif, else the genre's) on every other tagged scene, and quietly at the very end
  const MOTIF = SC.motif ?? G.motif, ML = leadOf(G.lead);
  const motif = (t, vel, step = E8) => MOTIF.forEach((n, k) => ML(t + k * step, nz(n), vel * (k === MOTIF.length - 1 ? 1.15 : 1), 0.15 - k * 0.12));
  SCN.forEach((s, i) => { if (s.tag && s.mood !== 'silence' && i % 2 === 0) motif(s.t0 + 0.75, G.lv * 1.1); });
  motif(Math.max(0, DURATION - 4.2), G.lv * 0.9, BEAT);
  // a downlifter after the payoff; the payoff: the genre's stab and a flat chord
  sweep(HIT + 0.3, HIT + 2.2, 0.006, 3000, 400, 0);
  G.hit.forEach((n, i) => ML(HIT + i * 0.006, nz(n), 0.3, (i - 2.5) * 0.15, 0.7));
  pad(HIT, HIT + 0.4, G.hit, 0.42, { cut: 3600, att: 0.008, rel: 0.35, send: 0.3 });

  // ================= SFX =================
  to = 's';
  sub(HIT, 0.34); noiseHit(HIT, 0.2, 'lowpass', 1200, 0.8, 0.2);
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
    paper: (t) => { noiseHit(t, 0.12, 'bandpass', 3200, 0.8, 0.022, RS.n(0.4), 0.1, 6000); noiseHit(t + 0.05, 0.04, 'highpass', 5000, 0.7, 0.01); },
    flip: (t) => { noiseHit(t, 0.32, 'bandpass', 1800, 0.7, 0.03, -0.3, 0.15, 6500); noiseHit(t + 0.3, 0.03, 'lowpass', 2500, 0.8, 0.025, 0.3); },
    pencil: (t) => noiseHit(t, 0.05, 'bandpass', 4200, 2.5, 0.022, RS.n(0.3)),
    tick: (t) => tone('sine', t, 2400, 0.018, 0.001, 0.03, RS.n(0.3), 0.1),
    coin: (t) => { tone('square', t, nz('B5'), 0.02, 0.001, 0.07, 0, 0.1, 5000); tone('square', t + 0.07, nz('E6'), 0.02, 0.001, 0.25, 0, 0.1, 5000); },
    drip: (t) => blip(t, 1800, 500, 0.12, 0.03, RS.n(0.3)),
    buzz: (t, d = 0.8) => { const o = osc('sawtooth', 220, t, t + d); o.frequency.setValueAtTime(220, t); for (let u = 0; u < d; u += 0.05) o.frequency.setValueAtTime(215 + RS.n(12), t + u); const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.012, t + 0.1); g.gain.setValueAtTime(0.012, t + d - 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(lp); lp.connect(g); out(g, RS.n(0.5), 0.2); },
    shutter: (t) => { noiseHit(t, 0.03, 'highpass', 3000, 0.8, 0.05); noiseHit(t + 0.07, 0.05, 'bandpass', 1500, 1, 0.04); },
  };
  // the style's own kit: what a "pop" or a "whoosh" sounds like in this world
  const KITS = {
    'cut-paper': { pop: (t) => SFX.paper(t), whoosh: (t, d = 0.8) => { sweep(t, t + d, 0.014, 500, 3200, RS.n(0.4)); noiseHit(t + d * 0.6, 0.15, 'bandpass', 2800, 0.8, 0.012, 0, 0.1, 5000); } },
    sketchbook: { pop: (t) => SFX.pencil(t), whoosh: (t, d = 0.8) => SFX.flip(t + d * 0.3) },
    isometric: { pop: (t, f = 1600) => blip(t, f * 1.4, f * 1.4, 0.04, 0.014, RS.n(0.3)), whoosh: (t, d = 0.8) => sweep(t, t + d, 0.012, 800, 6000, RS.n(0.3)) },
    pixel: { pop: (t, f = 900) => tone('square', t, f * 1.2, 0.02, 0.001, 0.06, RS.n(0.3), 0.1, 5000), whoosh: (t, d = 0.8) => { for (let u = 0; u < d; u += 0.06) tone('square', t + u, 300 + u / d * 1600, 0.008, 0.001, 0.05, 0, 0.05, 4000); } },
    math: { pop: (t) => noiseHit(t, 0.04, 'bandpass', 2600, 3, 0.02, RS.n(0.3)) },
  };
  Object.assign(SFX, KITS[STYLE.name] ?? {}, SC.sfx ?? {});
  SCN.forEach((s) => (s.sfx || []).forEach(([d, kind, arg]) => { if (!SFX[kind]) throw new Error(`unknown sfx "${kind}" in scene ${s.key}`); SFX[kind](s.t0 + d, arg); }));
  // the lettering's items arrive with soft pops
  SCN.forEach((s, i) => { if (s.card && s.mood !== 'silence') (s.pops ?? [1.6, 3.0, 4.4]).forEach((d) => SFX.pop(s.t0 + d, 1200 + i * 30)); });
  // every scene change sounds like its transition (studio/channel/transitions.js)
  const TRSFX = {
    morph: (tc) => { sweep(tc - 0.35, tc + 0.02, 0.005, 500, 2600, 0); to = 'm'; sweep(tc - 1.1, tc - 0.05, 0.004, 900, 3200, 0); to = 's'; },
    fade: (tc, d) => sweep(tc - d, tc + d * 0.5, 0.004, 300, 1500, 0), dip: (tc, d) => sweep(tc - d, tc + d * 0.5, 0.004, 300, 1200, 0),
    wipe: (tc, d) => SFX.whoosh(tc - d * 0.8, d * 1.4), push: (tc, d) => SFX.whoosh(tc - d * 0.8, d * 1.4), slideOver: (tc, d) => SFX.whoosh(tc - d * 0.8, d * 1.4),
    whip: (tc) => sweep(tc - 0.25, tc + 0.05, 0.03, 600, 7000, RS.n(0.5)),
    zoom: (tc, d) => { riser(tc - d, tc, 0.01); blip(tc, 900, 1800, 0.08, 0.02); },
    shape: (tc, d) => sweep(tc - d * 0.6, tc + d * 0.6, 0.006, 400, 3000, 0), clock: (tc, d) => { for (let u = -d; u < d; u += d / 6) SFX.tick(tc + u); },
    doors: (tc, d) => sweep(tc - d * 0.3, tc + d, 0.008, 2400, 400, 0), blinds: (tc, d) => { for (let k = 0; k < 6; k++) SFX.click(tc - d * 0.5 + k * d / 6); },
    tiles: (tc, d) => { for (let k = 0; k < 9; k++) SFX.pop(tc - d * 0.6 + k * d * 0.15, 900 + k * 90); },
    pageTurn: (tc, d) => SFX.flip(tc - d * 0.7),
    pixel: (tc, d) => { for (let k = 0; k < 8; k++) tone('square', tc - d + k * d / 4, 300 * 2 ** (k / 4), 0.012, 0.001, 0.06, 0, 0.05, 4000); },
    ink: (tc, d) => { sweep(tc - d, tc + d, 0.006, 200, 1400, 0); SFX.drip(tc - d * 0.3); },
    shutter: (tc) => SFX.shutter(tc - 0.05), scatter: (tc, d) => { noiseHit(tc - d * 0.5, 0.5, 'bandpass', 3500, 0.8, 0.03, 0, 0.3, 900); for (let k = 0; k < 6; k++) SFX.click(tc - d * 0.4 + k * 0.08); },
    flash: (tc) => { noiseHit(tc, 0.25, 'highpass', 2500, 0.6, 0.05, 0, 0.4); sub(tc, 0.08); }, spin: (tc, d) => sweep(tc - d, tc + d * 0.3, 0.012, 300, 5000, 0),
  };
  SCN.forEach((s, i) => { if (!i || s.cut) return; const f = TRSFX[s.trKind ?? 'morph'] ?? TRSFX.morph; f(s.t0, (s.tr && s.tr.d) ?? 0.55); });
