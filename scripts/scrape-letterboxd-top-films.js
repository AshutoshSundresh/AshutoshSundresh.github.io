#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

const LETTERBOXD_URL = 'https://letterboxd.com/ashsundresh/films/by/entry-rating/';
const OUT_PATH = path.join(__dirname, '../app/data/topFilms.json');
const TOP_N = 8;
const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w342';

function parseTitleYear(str) {
  const m = str.match(/^(.+?)\s*\((\d{4})\)\s*$/);
  if (m) return { title: m[1].trim(), year: m[2] };
  return { title: str.trim(), year: null };
}

async function fetchTMDBPoster(apiKey, title) {
  const { title: q, year } = parseTitleYear(title);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(q)}${year ? '&year=' + year : ''}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const first = data.results && data.results[0];
  if (!first || !first.poster_path) return null;
  return TMDB_POSTER_BASE + first.poster_path;
}

async function main() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error('Set NEXT_PUBLIC_TMDB_API_KEY or TMDB_API_KEY (free at themoviedb.org/settings/api)');
    process.exit(1);
  }

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer not found. Run: npm install -D puppeteer');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let topFilms = [];
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(LETTERBOXD_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('li.poster-container, .poster-list li, [data-film-slug]', { timeout: 10000 }).catch(() => null);
    await page.evaluate(() => {
      const grid = document.querySelector('.poster-list, [class*="poster-list"], .content .film-list');
      if (grid) grid.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 2000));

    const films = await page.evaluate((topN) => {
      function slugFromHref(href) {
        if (!href) return '';
        const m = href.match(/\/film\/([^/?#]+)/);
        return m ? m[1].replace(/\/$/, '').trim() : '';
      }
      const seen = new Set();
      const items = [];
      const selectors = ['li.poster-container', '.poster-list li', 'ul.poster-list > li', 'li[class*="poster"]'];
      let nodes = [];
      for (const sel of selectors) {
        nodes = document.querySelectorAll(sel);
        if (nodes.length >= topN) break;
      }
      for (const li of nodes) {
        if (items.length >= topN) break;
        const link = li.querySelector('a[href*="/film/"]');
        const href = link ? link.getAttribute('href') || '' : '';
        let slug = (li.getAttribute('data-film-slug') || slugFromHref(href) || '').trim();
        if (!slug || slug.includes('/') || seen.has(slug)) continue;
        seen.add(slug);
        const img = li.querySelector('img');
        const title = (img && img.getAttribute('alt')) || li.querySelector('.frame-title')?.textContent?.trim() || slug.replace(/-/g, ' ');
        items.push({ title: title || slug, filmUrl: 'https://letterboxd.com/film/' + slug + '/' });
      }
      if (items.length < topN) {
        const links = document.querySelectorAll('a[href*="/film/"]');
        for (const a of links) {
          if (items.length >= topN) break;
          const slug = slugFromHref(a.getAttribute('href') || '');
          if (!slug || slug.includes('/') || seen.has(slug)) continue;
          seen.add(slug);
          const img = a.querySelector('img');
          const title = (img && img.getAttribute('alt')) || a.textContent.trim() || slug.replace(/-/g, ' ');
          items.push({ title: title || slug, filmUrl: 'https://letterboxd.com/film/' + slug + '/' });
        }
      }
      return items;
    }, TOP_N);

    if (films.length === 0) {
      console.error('No films found.');
      process.exit(1);
    }
    topFilms = films.slice(0, TOP_N);
  } finally {
    await browser.close();
  }

  const fallback = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="150" height="225" viewBox="0 0 150 225"><rect fill="#2a2a2a" width="150" height="225"/><text x="75" y="115" fill="#666" font-size="12" text-anchor="middle" font-family="sans-serif">?</text></svg>');
  const result = [];
  for (const f of topFilms) {
    const posterUrl = (await fetchTMDBPoster(apiKey, f.title)) || fallback;
    result.push({ title: f.title, filmUrl: f.filmUrl, posterUrl });
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2), 'utf8');
  console.log('Wrote', OUT_PATH, '—', result.length, 'films');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
