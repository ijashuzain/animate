// JIST + book: three ways to blend the framed stacked monogram with a book (bold Inter Display Black, white on black).
//   node tools2/brand-jist-book.cjs  ->  studio/brand/jist-book-{open,cover,mark}.png + jist-book-options.png
const { chromium } = require('playwright');
const T = (x, y, s, size = 150) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="${size}" letter-spacing="8" fill="#fff">${s}</text>`;
const LOGOS = {
  // A: an open book: the frame becomes two pages with a spine; J and S on the left page, I and T on the right
  open: `<path d="M500 300 C 430 268 340 262 262 284 L 262 712 C 340 690 430 696 500 728 C 570 696 660 690 738 712 L 738 284 C 660 262 570 268 500 300 Z" fill="none" stroke="#fff" stroke-width="20" stroke-linejoin="round"/>
         <path d="M500 300 L 500 728" stroke="#fff" stroke-width="10"/>
         ${T(392, 490, 'J')}${T(606, 490, 'I')}${T(392, 668, 'S')}${T(606, 668, 'T')}`,
  // B: the cover: the frame is a book cover with a hinge line by the spine and the page block showing at the side and foot
  cover: `<rect x="270" y="250" width="440" height="440" fill="none" stroke="#fff" stroke-width="20"/>
          <path d="M306 250 L 306 690" stroke="#fff" stroke-width="7"/>
          <path d="M722 270 L 732 270 L 732 712 L 292 712 L 292 702" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round"/>
          <path d="M745 290 L 752 290 L 752 732 L 312 732 L 312 724" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>
          ${T(508, 465, 'JI')}${T(508, 640, 'ST')}`,
  // C: the bookmark: the frame stays square and a ribbon bookmark hangs from its top edge
  mark: `<rect x="280" y="280" width="440" height="440" fill="none" stroke="#fff" stroke-width="20"/>
         <path d="M612 270 L 668 270 L 668 382 L 640 356 L 612 382 Z" fill="#fff"/>
         ${T(492, 495, 'JI')}${T(500, 670, 'ST')}`,
};
(async () => {
  const b = await chromium.launch(), out = __dirname + '/../studio/brand/';
  for (const [k, inner] of Object.entries(LOGOS)) for (const [suffix, bg, size] of [['', '#000', 1000], ['-avatar-800', '#000', 800]]) {
    const p = await b.newPage({ viewport: { width: size, height: size } });
    await p.setContent(`<html><body style="margin:0;background:${bg}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="${size}" height="${size}">${inner}</svg></body></html>`);
    await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: `${out}jist-book-${k}${suffix}.png` }); await p.close();
  }
  await b.close();
})();
