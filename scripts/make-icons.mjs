/**
 * public/apple-touch-icon.png из public/favicon.svg.
 * iOS не понимает SVG в apple-touch-icon, поэтому растр нужен отдельным файлом.
 * Запуск: npm run icons   (sharp приходит вместе с Astro)
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'public', 'favicon.svg');
const out = path.join(root, 'public', 'apple-touch-icon.png');

const info = await sharp(await readFile(src), { density: 600 })
  .resize(180, 180)
  .png()
  .toFile(out);

console.log(`apple-touch-icon.png — ${info.width}×${info.height}, ${Math.round(info.size / 1024)} КБ`);
