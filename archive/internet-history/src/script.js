
// =====================================================================
//  A SHORT HISTORY OF THE INTERNET — the scene list. Pip (an orange envelope: the message) travels from 1969's "LO"
//  to 5.5 billion people. Each scene: duration d, the left scene, the right card, the voice line, sound.
// =====================================================================
const SCN = [
  { key: 'lo', d: 14, tag: '1969', mood: 'warm', focus: [500, 560], bg: '#26315f', scene: () => sLo(), card: (at) => cLo(at),
    say: "Nineteen sixty-nine. Two computers, hundreds of miles apart, try to talk to each other for the very first time. The message was meant to be \"login\". The system crashed after just two letters: L, O.",
    sfx: [[1.2, 'typing', 10], [4.5, 'beep', 880], [6.2, 'beep', 990], [9.2, 'thud'], [9.3, 'click']] },
  { key: 'email', d: 11, tag: '1971', mood: 'warm', focus: [520, 520], bg: '#e7c79a', scene: () => sEmail(), card: (at) => cEmail(at),
    say: "Nineteen seventy-one. Ray Tomlinson sends the first email between computers on a network, and picks the at sign to join a person's name to the name of their machine.",
    sfx: [[1.0, 'typing', 14], [5.5, 'ding']] },
  { key: 'tcpip', d: 14, tag: '1983', mood: 'groove', focus: [500, 540], bg: '#cfdccf', scene: () => sTcp(), card: (at) => cTcp(at),
    say: "Nineteen eighty-three. The network switches to a shared language called TCP/IP. Every message is cut into small packets, each packet finds its own way across the network, and they're put back together, in order, at the other end.",
    sfx: [[3.0, 'pop', 900], [3.2, 'pop', 1100], [3.4, 'pop', 1300], [3.6, 'pop', 1500], [10.5, 'chime']] },
  { key: 'web', d: 13, tag: '1991', mood: 'groove', focus: [470, 500], bg: '#c9b9da', scene: () => sWeb(), card: (at) => cWeb(at),
    say: "Nineteen ninety-one. At CERN, the physics lab in Switzerland, Tim Berners-Lee puts the very first website online. Pages that link to other pages, anywhere in the world: he calls it the World Wide Web.",
    sfx: [[6.0, 'click'], [6.2, 'whoosh', 0.6]] },
  { key: 'search', d: 12, tag: '1998', mood: 'groove', focus: [500, 520], bg: '#f0cf78', scene: () => sSearch(), card: (at) => cSearch(at),
    say: "Nineteen ninety-eight. Google ranks pages by how many other pages link to them, like votes. The most linked page rises to the top, and finding almost anything becomes easy.",
    sfx: [[1.5, 'typing', 8], [4.0, 'ding']] },
  { key: 'social', d: 12, tag: '2004', mood: 'groove', focus: [500, 540], bg: '#a9d9c6', scene: () => sSocial(), card: (at) => cSocial(at),
    say: "Two thousand four. Social networks arrive. First they connect friends and classmates, then strangers by the billion. Suddenly anyone can share a photo, a thought or a video with the whole world.",
    sfx: [[2.0, 'pop', 800], [2.4, 'pop', 1000], [2.8, 'pop', 1200], [3.2, 'pop', 1400]] },
  { key: 'phone', d: 12, tag: '2007', mood: 'groove', focus: [500, 560], bg: '#f3a3bf', scene: () => sPhone(), card: (at) => cPhone(at),
    say: "Two thousand seven. The iPhone puts the whole internet in your pocket. Maps, music, photos and messages: now the internet goes everywhere you go, every hour of the day.",
    sfx: [[1.5, 'click'], [2.0, 'chime', ['E5', 'B5']]] },
  { key: 'hush', d: 2.5, mood: 'silence', focus: [500, 540], bg: '#0c1124', scene: () => sHush(), card: null },
  { key: 'today', d: 15, tag: 'today', mood: 'full', cut: true, focus: [500, 540], bg: '#141a33', scene: () => sToday(), card: (at) => cToday(at),
    say: "Today, about five and a half billion people are online. That's two out of every three humans on Earth, all connected by the same simple idea: small packets of data, finding their own way from one computer to another.",
    sfx: [] },
  { key: 'end', d: 14, tag: '1969 -> today', mood: 'warm', focus: [500, 560], bg: '#26315f', scene: () => sEnd(), card: (at) => cEnd(at),
    say: "And it all started with two letters, typed on a quiet night in nineteen sixty-nine. L, O. As in: lo, and behold. Not a bad first word for the internet.", sayAt: 1.5,
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
const SCORE = { motif: ['D4', 'A4', 'Fs4'] };
const META = {
  title: 'The Internet\'s First Word Was "LO", Then It Crashed | A Short History of the Internet',
  alt: ['How the Internet Began: From "LO" to 5.5 Billion People', 'The Internet in 2 Minutes'],
  hook: 'In 1969, two computers tried to say "login". They crashed after two letters: L, O.',
  about: 'This 2-minute animated history follows Pip, a tiny envelope, from that first glitch to the 5.5 billion people online today: email and the @ sign, TCP/IP packets, the World Wide Web, search, social networks and the smartphone.',
  chapters: [[0, '1969: the first message, "LO"'], [14, '1971: email gets its @'], [25, '1983: TCP/IP and packets'], [39, '1991: the World Wide Web'], [52, '1998: search'], [64, '2004: social networks'], [76, '2007: the internet in your pocket'], [90.5, 'Today: 5.5 billion people online'], [105.5, 'Lo and behold']],
  sources: ['Leonard Kleinrock, UCLA: the first ARPANET message (29 Oct 1969)', 'ITU, Facts and Figures 2024: about 5.5 billion people online (68% of the world)'],
  hashtags: ['#history', '#internet', '#animation', '#explained', '#technology'],
  tags: ['history of the internet', 'internet history', 'ARPANET', 'first internet message', 'LO and behold', 'how the internet works', 'TCP/IP explained', 'world wide web history', 'Tim Berners-Lee', 'animated explainer'],
};
const THUMB = { t: 10.6, panel: '#26315f', lines: [['the internet\'s', 74, '#fbf6ea'], ['first word:', 74, '#fbf6ea'], ['"LO"', 250, '#ec7a4f'], ['(then it crashed)', 60, '#f6cf55']] };
