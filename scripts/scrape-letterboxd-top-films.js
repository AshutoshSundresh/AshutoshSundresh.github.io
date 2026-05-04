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
const FILMS_DIR = path.join(__dirname, '../public/images/films');
const TOP_N = 8;
const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w342';
const POSTER_WIDTH = 240;
const POSTER_HEIGHT = 360;
const SCRAPE_RETRY_OPTIONS = { retries: 3, initialDelayMs: 2500 };
const TMDB_RETRY_OPTIONS = { retries: 5, initialDelayMs: 2000 };
const POSTER_DOWNLOAD_RETRY_OPTIONS = { retries: 4, initialDelayMs: 1500 };
const FETCH_TIMEOUT_MS = 60000;
const TMDB_REQUEST_GAP_MS = 450;
/** Upper bound so a bad/missing clock on HTTP-date cannot stall CI forever */
const MAX_RETRY_AFTER_MS = 5 * 60 * 1000;
const RETRY_AFTER_FALLBACK_MS = 10_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class RateLimitError extends Error {
  /** @param {number} retryAfterMs */
  constructor(message, retryAfterMs) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}

/**
 * RFC 7231 Retry-After: delay-seconds or HTTP-date.
 * @param {Response} response
 */
function getRetryAfterMs(response, fallbackMs = RETRY_AFTER_FALLBACK_MS) {
  const raw = response.headers.get('retry-after');
  if (raw == null || raw === '') {
    return Math.min(fallbackMs, MAX_RETRY_AFTER_MS);
  }
  const trimmed = raw.trim();
  if (/^\d+$/.test(trimmed)) {
    const sec = parseInt(trimmed, 10);
    let ms = sec * 1000;
    if (ms <= 0) ms = Math.min(fallbackMs, MAX_RETRY_AFTER_MS);
    return Math.min(ms, MAX_RETRY_AFTER_MS);
  }
  const when = Date.parse(trimmed);
  if (!Number.isNaN(when)) {
    const ms = when - Date.now();
    if (ms > 0) return Math.min(ms, MAX_RETRY_AFTER_MS);
  }
  return Math.min(fallbackMs, MAX_RETRY_AFTER_MS);
}

async function fetchWithTimeout(url, init = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry(task, { label, retries, initialDelayMs, factor = 2 }) {
  let delayMs = initialDelayMs;
  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      return await task(attempt);
    } catch (error) {
      if (attempt > retries) throw error;
      const detail = error instanceof Error ? error.message : String(error);
      const rateLimited = error instanceof RateLimitError;
      const waitMs = rateLimited ? error.retryAfterMs : delayMs;
      if (rateLimited) {
        console.warn(`${label} rate limited (${detail}). Waiting ${waitMs}ms per Retry-After.`);
      } else {
        console.warn(`${label} failed on attempt ${attempt}/${retries + 1}: ${detail}. Retrying in ${waitMs}ms.`);
      }
      await sleep(waitMs);
      if (!rateLimited) delayMs *= factor;
    }
  }
}

function parseTitleYear(str) {
  const m = str.match(/^(.+?)\s*\((\d{4})\)\s*$/);
  if (m) return { title: m[1].trim(), year: m[2] };
  return { title: str.trim(), year: null };
}

function slugFromFilmUrl(filmUrl) {
  const m = filmUrl.match(/\/film\/([^/?#]+)/);
  return m ? m[1].replace(/\/$/, '') : null;
}

async function downloadAndOptimizePoster(tmdbUrl, slug) {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    return null;
  }

  return withRetry(
    async () => {
      const res = await fetchWithTimeout(tmdbUrl);
      if (res.status === 429) {
        throw new RateLimitError('Poster CDN returned 429', getRetryAfterMs(res));
      }
      if (res.status >= 500) {
        throw new Error(`Poster CDN returned ${res.status}`);
      }
      if (!res.ok) {
        throw new Error(`Poster HTTP ${res.status}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());

      if (!fs.existsSync(FILMS_DIR)) fs.mkdirSync(FILMS_DIR, { recursive: true });

      const outPath = path.join(FILMS_DIR, slug + '.webp');
      await sharp(buffer)
        .resize(POSTER_WIDTH, POSTER_HEIGHT, { fit: 'cover', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);

      return '/images/films/' + slug + '.webp';
    },
    { label: `Poster download (${slug})`, ...POSTER_DOWNLOAD_RETRY_OPTIONS }
  );
}

async function fetchTMDBPoster(apiKey, title) {
  const { title: q, year } = parseTitleYear(title);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(q)}${year ? '&year=' + year : ''}`;
  let res;
  try {
    res = await withRetry(async () => {
      const response = await fetchWithTimeout(url);
      if (response.status === 429) {
        throw new RateLimitError(`TMDB returned 429`, getRetryAfterMs(response));
      }
      if (response.status >= 500) {
        throw new Error(`TMDB returned ${response.status}`);
      }
      return response;
    }, { label: `TMDB lookup for "${q}"`, ...TMDB_RETRY_OPTIONS });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.warn(`Skipping poster for "${title}" after retries: ${detail}`);
    return null;
  }
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
    topFilms = await withRetry(async () => {
      const page = await browser.newPage();
      try {
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto(LETTERBOXD_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForSelector('li.poster-container, .poster-list li, [data-film-slug]', { timeout: 10000 }).catch(() => null);
        await page.evaluate(() => {
          const grid = document.querySelector('.poster-list, [class*="poster-list"], .content .film-list');
          if (grid) grid.scrollIntoView({ behavior: 'instant' });
        });
        await sleep(2000);

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
          throw new Error('No films found.');
        }
        return films.slice(0, TOP_N);
      } finally {
        await page.close();
      }
    }, { label: 'Letterboxd scrape', ...SCRAPE_RETRY_OPTIONS });
  } finally {
    await browser.close();
  }

  const fallback = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="150" height="225" viewBox="0 0 150 225"><rect fill="#2a2a2a" width="150" height="225"/><text x="75" y="115" fill="#666" font-size="12" text-anchor="middle" font-family="sans-serif">?</text></svg>');
  const result = [];
  const keptSlugs = new Set();

  for (let i = 0; i < topFilms.length; i += 1) {
    const f = topFilms[i];
    if (i > 0) await sleep(TMDB_REQUEST_GAP_MS);
    const tmdbUrl = await fetchTMDBPoster(apiKey, f.title);
    const slug = slugFromFilmUrl(f.filmUrl);
    let posterUrl = fallback;

    if (tmdbUrl && slug) {
      const localPath = await downloadAndOptimizePoster(tmdbUrl, slug).catch(() => null);
      posterUrl = localPath || tmdbUrl;
      if (localPath) keptSlugs.add(slug + '.webp');
    } else if (tmdbUrl) {
      posterUrl = tmdbUrl;
    }

    result.push({ title: f.title, filmUrl: f.filmUrl, posterUrl });
  }

  // Remove stale posters from previous runs
  if (fs.existsSync(FILMS_DIR)) {
    for (const file of fs.readdirSync(FILMS_DIR)) {
      if (!keptSlugs.has(file)) {
        fs.unlinkSync(path.join(FILMS_DIR, file));
        console.log('Removed stale poster:', file);
      }
    }
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2), 'utf8');
  console.log('Wrote', OUT_PATH, '—', result.length, 'films');

  const { spawnSync } = require('child_process');
  const blurResult = spawnSync('node', ['scripts/generate-blur-placeholders.js'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
  if (blurResult.status !== 0) {
    console.warn('Blur placeholder generation exited with', blurResult.status);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
