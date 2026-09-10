/**
 * Captures the hero social row and its custom hover cursors.
 * The HoverCursor only mounts on `(pointer: fine)` and follows real
 * mousemove events, so this drives the actual mouse rather than CSS :hover.
 *
 * Usage: node scripts/hover-shots.js <outDir>
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:3000';
const OUT = process.argv[2] || 'hover-shots';
const THEMES = ['light', 'dark'];
const LINKS = ['GPT', 'LinkedIn'];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });

  for (const theme of THEMES) {
    const page = await browser.newPage();
    // hasTouch:false keeps `(pointer: fine)` true so the cursor mounts
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2, isMobile: false, hasTouch: false });
    await page.evaluateOnNewDocument((t) => {
      try { localStorage.setItem('theme', t); } catch (e) {}
    }, theme);
    // Headless Chrome reports no pointing device, so `(pointer: fine)` is
    // false and HoverCursor bails out. Shim only the pointer/hover queries;
    // everything else (prefers-color-scheme) passes through untouched.
    await page.evaluateOnNewDocument(() => {
      const orig = window.matchMedia.bind(window);
      window.matchMedia = (q) => {
        if (/(any-)?pointer:\s*fine|(any-)?hover:\s*hover/.test(q)) {
          return {
            matches: true, media: q, onchange: null,
            addListener() {}, removeListener() {},
            addEventListener() {}, removeEventListener() {},
            dispatchEvent() { return false; },
          };
        }
        return orig(q);
      };
    });
    await page.evaluateOnNewDocument(() => {
      const css = 'nextjs-portal,#nextjs-devtools,[data-nextjs-toast]{display:none!important}';
      const add = () => { const s = document.createElement('style'); s.textContent = css; document.head && document.head.appendChild(s); };
      if (document.head) add(); else document.addEventListener('DOMContentLoaded', add);
    });

    await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 1500));

    // Resting state — the row with GPT added
    await page.screenshot({ path: path.join(OUT, `row__${theme}.png`) });

    for (const label of LINKS) {
      const box = await page.evaluate((text) => {
        const a = [...document.querySelectorAll('a')].find((el) => el.textContent.trim() === text);
        if (!a) return null;
        const r = a.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }, label);
      if (!box) { console.warn('link not found:', label); continue; }

      // Two moves: the first enters the link, the second settles the cursor
      await page.mouse.move(box.x - 40, box.y);
      await page.mouse.move(box.x, box.y, { steps: 8 });
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({ path: path.join(OUT, `hover-${label.toLowerCase()}__${theme}.png`) });
    }
    await page.close();
  }

  await browser.close();
  console.log('done ->', OUT);
})();
