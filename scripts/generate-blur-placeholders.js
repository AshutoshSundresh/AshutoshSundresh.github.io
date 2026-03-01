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
const SKELETON_JSON = path.join(DATA_DIR, 'skeumorphicData.json');
const OUT_JSON = path.join(DATA_DIR, 'blurPlaceholders.json');

const PLACEHOLDER_WIDTH = 20;
const BLUR_SIGMA = 8;

// Remote wallpaper URLs to generate blur pre-images for (low-res only, high-res not needed)
const REMOTE_URLS = [
  'https://images.hdqwalls.com/download/macos-mojave-day-mode-stock-pb-1280x720.jpg',
  'https://images.hdqwalls.com/download/macos-mojave-night-mode-stock-0y-1280x720.jpg',
];

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

async function main() {
  const sharp = require('sharp');
  const data = JSON.parse(fs.readFileSync(SKELETON_JSON, 'utf8'));
  const paths = collectImagePaths(data);

  // Add hero/lockscreen images not in JSON
  paths.add('/images/1755148353808.png');
  paths.add('/images/UCLA-square-logo.jpg');
  paths.add('/images/ashutosh.jpeg');

  const map = {};
  for (const src of paths) {
    if (!src.startsWith('/')) continue; // skip remote URLs
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

  for (const url of REMOTE_URLS) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const arrayBuffer = await resp.arrayBuffer();
      const buf = await sharp(Buffer.from(arrayBuffer))
        .resize(PLACEHOLDER_WIDTH)
        .blur(BLUR_SIGMA)
        .jpeg({ quality: 60, mozjpeg: true })
        .toBuffer();
      map[url] = `data:image/jpeg;base64,${buf.toString('base64')}`;
      console.log('OK (remote):', url);
    } catch (err) {
      console.warn('Error (remote):', url, err.message);
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
