
// =====================================================================
//  A SHORT HISTORY OF THE INTERNET — the scene list. Pip (an orange envelope: the message) travels from 1969's "LO"
//  to 5.5 billion people. Each scene: duration d, the left scene, the right card, the voice line, sound.
// =====================================================================
const SCN = [
  { key: 'lo', d: 14, tag: '1969', mood: 'warm', focus: [500, 560], bg: '#26315f', scene: () => sLo(), card: (at) => cLo(at),
    say: 'Nineteen sixty-nine. Two computers, hundreds of miles apart, try to talk for the first time. The message was meant to be "login". The system crashed after two letters: L, O.',
    sfx: [[1.2, 'typing', 10], [4.5, 'beep', 880], [6.2, 'beep', 990], [9.2, 'thud'], [9.3, 'click']] },
  { key: 'email', d: 11, tag: '1971', mood: 'warm', focus: [520, 520], bg: '#e7c79a', scene: () => sEmail(), card: (at) => cEmail(at),
    say: "Nineteen seventy-one. Ray Tomlinson sends the first network email, and picks the at sign to join a person's name to their computer.",
    sfx: [[1.0, 'typing', 14], [5.5, 'ding']] },
  { key: 'tcpip', d: 14, tag: '1983', mood: 'groove', focus: [500, 540], bg: '#cfdccf', scene: () => sTcp(), card: (at) => cTcp(at),
    say: "Nineteen eighty-three. The network switches to TCP/IP: messages are cut into small packets, each finds its own way, and they're put back together at the other end.",
    sfx: [[3.0, 'pop', 900], [3.2, 'pop', 1100], [3.4, 'pop', 1300], [3.6, 'pop', 1500], [10.5, 'chime']] },
  { key: 'web', d: 13, tag: '1991', mood: 'groove', focus: [470, 500], bg: '#c9b9da', scene: () => sWeb(), card: (at) => cWeb(at),
    say: 'Nineteen ninety-one. At CERN, Tim Berners-Lee puts the first website online. Pages that link to other pages: the World Wide Web.',
    sfx: [[6.0, 'click'], [6.2, 'whoosh', 0.6]] },
  { key: 'search', d: 12, tag: '1998', mood: 'groove', focus: [500, 520], bg: '#f0cf78', scene: () => sSearch(), card: (at) => cSearch(at),
    say: 'Nineteen ninety-eight. Google ranks pages by how many other pages link to them, and finding anything becomes easy.',
    sfx: [[1.5, 'typing', 8], [4.0, 'ding']] },
  { key: 'social', d: 12, tag: '2004', mood: 'groove', focus: [500, 540], bg: '#a9d9c6', scene: () => sSocial(), card: (at) => cSocial(at),
    say: 'Two thousand four. Social networks connect friends, then strangers by the billion. Everyone becomes a publisher.',
    sfx: [[2.0, 'pop', 800], [2.4, 'pop', 1000], [2.8, 'pop', 1200], [3.2, 'pop', 1400]] },
  { key: 'phone', d: 12, tag: '2007', mood: 'groove', focus: [500, 560], bg: '#f3a3bf', scene: () => sPhone(), card: (at) => cPhone(at),
    say: 'Two thousand seven. The iPhone puts the internet in your pocket. Now it goes everywhere you go.',
    sfx: [[1.5, 'click'], [2.0, 'chime', ['E5', 'B5']]] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [500, 540], bg: '#0c1124', scene: () => sHush(), card: null },
  { key: 'today', d: 15, tag: 'today', mood: 'full', cut: true, focus: [500, 540], bg: '#141a33', scene: () => sToday(), card: (at) => cToday(at),
    say: 'Today, about five and a half billion people are online. Two out of every three humans on Earth.',
    sfx: [] },
  { key: 'end', d: 14, tag: '1969 -> today', mood: 'warm', focus: [500, 560], bg: '#26315f', scene: () => sEnd(), card: (at) => cEnd(at),
    say: 'And it all started with two letters. L, O. As in: lo, and behold.', sayAt: 1.5,
    sfx: [[3.0, 'typing', 2], [9.5, 'chime', ['D5', 'A5', 'D6']]] },
];
const HIT = SCN.slice(0, 8).reduce((a, s) => a + s.d, 0);   // the start of 'today'
const ACTS = [
  { name: '1 Early',   role: 'build',   t0: 0,    t1: 39 },
  { name: '2 The web', role: 'journey', t0: 39,   t1: 76 },
  { name: '3 Pocket',  role: 'peak',    t0: 76,   t1: HIT - 2.5 },
  { name: '4 Hush',    role: 'silence', t0: HIT - 2.5, t1: HIT },
  { name: '5 Today',   role: 'gift',    t0: HIT,  t1: HIT + 15 },
  { name: '6 LO',      role: 'goodbye', t0: HIT + 15, t1: HIT + 29 },
];
