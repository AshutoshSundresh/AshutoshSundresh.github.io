/**
 * Generates per-image blur placeholders (LQIP) for optimization.
 * Reads images from public/, resizes and blurs, outputs base64 data URLs to app/data/blurPlaceholders.json.
 * Run: node scripts/generate-blur-placeholders.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, 'app', 'data');
const SKELETON_JSON = path.join(DATA_DIR, 'skeumorphicExperienceData.json');
const TOP_FILMS_JSON = path.join(DATA_DIR, 'topFilms.json');
const OUT_JSON = path.join(DATA_DIR, 'blurPlaceholders.json');

const PLACEHOLDER_WIDTH = 20;
const BLUR_SIGMA = 8;

function collectImagePaths(obj, out = new Set()) {
  if (!obj || typeof obj !== 'object') return out;
  if (Array.isArray(obj)) {
    obj.forEach((item) => collectImagePaths(item, out));
    return out;
  }
  if (obj.folderIconUrl && typeof obj.folderIconUrl === 'string') out.add(obj.folderIconUrl);
  if (obj.image && typeof obj.image === 'string') out.add(obj.image);
  if (obj.icon && typeof obj.icon === 'string') out.add(obj.icon);
  for (const value of Object.values(obj)) collectImagePaths(value, out);
  return out;
}

function getFilmPosterPaths() {
  if (!fs.existsSync(TOP_FILMS_JSON)) return [];
  const topFilms = JSON.parse(fs.readFileSync(TOP_FILMS_JSON, 'utf8'));
  return (topFilms || [])
    .map((f) => f.posterUrl)
    .filter((url) => typeof url === 'string' && url.startsWith('/'));
}

async function main() {
  const sharp = require('sharp');
  const data = JSON.parse(fs.readFileSync(SKELETON_JSON, 'utf8'));
  const paths = collectImagePaths(data);

  // Static images
  paths.add('/images/1755148353808.png');
  paths.add('/images/UCLA-square-logo.jpg');
  paths.add('/images/1755148353808.png');
  paths.add('/images/macos-mojave-day.jpg');
  paths.add('/images/macos-mojave-night.jpg');
  paths.add('/images/diorama.webp');
  paths.add('/images/pagani.webp');
  paths.add('/images/f1_diorama.webp');
  paths.add('/images/gtr-diorama.webp');
  paths.add('/images/offroad.webp');
  paths.add('/images/porsche-diorama.webp');
  paths.add('/images/fashion-1.webp');
  paths.add('/images/fashion-2.webp');
  paths.add('/images/fashion-3.webp');

  // Film posters (local WebP files written by scrape-letterboxd-top-films.js)
  for (const p of getFilmPosterPaths()) paths.add(p);

  const map = {};
  for (const src of paths) {
    if (!src.startsWith('/')) continue;
    const filePath = path.join(PUBLIC, src.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) {
      console.warn('Skip (missing):', src);
      continue;
    }
    try {
      const buf = await sharp(filePath)
        .resize(PLACEHOLDER_WIDTH)
        .blur(BLUR_SIGMA)
        .jpeg({ quality: 60, mozjpeg: true })
        .toBuffer();
      map[src] = `data:image/jpeg;base64,${buf.toString('base64')}`;
      console.log('OK:', src);
    } catch (err) {
      console.warn('Error:', src, err.message);
    }
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(map, null, 0), 'utf8');
  console.log('Wrote', OUT_JSON, Object.keys(map).length, 'placeholders');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
