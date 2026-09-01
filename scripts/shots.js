/**
 * Screenshot harness for UI review. Not part of the build.
 * Usage: node scripts/shots.js <outDir> [--full]
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:3000';
const OUT = process.argv[2] || 'shots';
const FULL = process.argv.includes('--full');

const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844, dsf: 2, mobile: true },
  { name: 'mobile-360', width: 360, height: 740, dsf: 2, mobile: true },
  { name: 'tablet-768', width: 768, height: 1024, dsf: 2, mobile: false },
  { name: 'laptop-1280', width: 1280, height: 800, dsf: 1, mobile: false },
  { name: 'desktop-1680', width: 1680, height: 1050, dsf: 1, mobile: false },
];

// Subset used for tab sweeps to keep run time sane
const CORE = new Set(['mobile-390', 'laptop-1280', 'desktop-1680']);

const PAGES = [
  { name: 'home', url: '/experience' },
  { name: 'experience', url: '/experience?tab=experience' },
  { name: 'awards', url: '/experience?tab=awards', core: true },
  { name: 'education', url: '/experience?tab=education', core: true },
  { name: 'projects', url: '/experience?tab=projects', core: true },
  { name: 'publications', url: '/experience?tab=publications', core: true },
  { name: 'activities', url: '/experience?tab=activities', core: true },
  { name: 'coursework', url: '/experience/coursework', core: true },
  // Open the first project so the inspector sidebar is in frame
  {
    name: 'project-detail',
    url: '/experience?tab=projects',
    core: true,
    action: async (page) => {
      await page.click('[data-project-tile]');
      await new Promise((r) => setTimeout(r, 700));
    },
  },
];

const THEMES = ['light', 'dark'];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });

  let count = 0;
  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.dsf,
        isMobile: vp.mobile,
        hasTouch: vp.mobile,
      });
      await page.evaluateOnNewDocument((t) => {
        try { localStorage.setItem('theme', t); } catch (e) {}
      }, theme);
      // Hide the Next.js dev-tools indicator so it never lands in a shot
      await page.evaluateOnNewDocument(() => {
        const css = 'nextjs-portal,#nextjs-devtools,[data-nextjs-toast]{display:none!important}';
        const add = () => {
          const s = document.createElement('style');
          s.textContent = css;
          document.head && document.head.appendChild(s);
        };
        if (document.head) add();
        else document.addEventListener('DOMContentLoaded', add);
      });

      for (const p of PAGES) {
        if (p.core && !CORE.has(vp.name)) continue;
        const file = path.join(OUT, `${p.name}__${vp.name}__${theme}.png`);
        try {
          await page.goto(BASE + p.url, { waitUntil: 'networkidle2', timeout: 45000 });
          // let fonts/animations settle
          await new Promise((r) => setTimeout(r, 1200));
          if (p.action) await p.action(page);
          await page.screenshot({ path: file, fullPage: FULL });
          count++;
        } catch (err) {
          console.warn('FAIL', p.name, vp.name, theme, err.message);
        }
      }
      await page.close();
    }
  }

  await browser.close();
  console.log(`wrote ${count} screenshots to ${OUT}`);
})();
