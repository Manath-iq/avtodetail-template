/**
 * Генерация public/og.png из SVG — визуал в языке шаблона: лист заказ-наряда.
 * Запуск: npm run og   (sharp приходит вместе с Astro)
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const rows = [
  ['01', 'Диагностика ходовой части', '40 мин', '1 500'],
  ['02', 'Замена стоек стабилизатора', '1 ч 20', '4 800'],
  ['03', 'Сход-развал с распечаткой', '40 мин', '2 400'],
];

const rowSvg = rows
  .map(
    ([no, name, time, price], i) => `
    <g transform="translate(0 ${520 + i * 58})" font-family="JetBrains Mono, monospace">
      <text x="80" y="0" fill="#8D97A3" font-size="20">${no}</text>
      <text x="130" y="0" fill="#1F2933" font-size="24" font-family="Onest, sans-serif">${name}</text>
      <text x="800" y="0" fill="#5C6875" font-size="20" text-anchor="end">${time}</text>
      <text x="1000" y="0" fill="#111418" font-size="24" font-weight="600" text-anchor="end">${price}</text>
      <path d="M80 20h920" stroke="#D5CEC2" stroke-width="1.5" stroke-dasharray="6 6"/>
    </g>`,
  )
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M28 0H0v28" fill="none" stroke="#D5CEC2" stroke-opacity="0.5" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="#F7F4EF"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect x="1040" y="0" width="160" height="630" fill="#111418"/>
  <circle cx="1120" cy="500" r="46" fill="none" stroke="#D94A3A" stroke-width="4"/>
  <text x="1120" y="495" fill="#D94A3A" font-family="JetBrains Mono, monospace" font-size="15" font-weight="700" text-anchor="middle">НАРЯД</text>
  <text x="1120" y="516" fill="#D94A3A" font-family="JetBrains Mono, monospace" font-size="15" font-weight="700" text-anchor="middle">ЗАКРЫТ</text>

  <text x="80" y="110" fill="#8D97A3" font-family="JetBrains Mono, monospace" font-size="20" letter-spacing="4">ЗАКАЗ-НАРЯД № 000-241</text>

  <text x="80" y="215" fill="#111418" font-family="Unbounded, sans-serif" font-size="60" font-weight="600">Сначала план работ,</text>
  <text x="80" y="290" fill="#111418" font-family="Unbounded, sans-serif" font-size="60" font-weight="600">потом машина в боксе</text>

  <text x="80" y="360" fill="#5C6875" font-family="Onest, sans-serif" font-size="27">Диагностика, ремонт и детейлинг с понятной сметой,</text>
  <text x="80" y="400" fill="#5C6875" font-family="Onest, sans-serif" font-size="27">сроком и согласованием допработ.</text>

  <path d="M80 450h920" stroke="#1F2933" stroke-width="2"/>
  <text x="80" y="490" fill="#8D97A3" font-family="JetBrains Mono, monospace" font-size="16" letter-spacing="3">ПОЗ.   НАИМЕНОВАНИЕ РАБОТ</text>
  <text x="1000" y="490" fill="#8D97A3" font-family="JetBrains Mono, monospace" font-size="16" letter-spacing="3" text-anchor="end">СУММА, ₽</text>
  ${rowSvg}

  <text x="80" y="732" fill="#111418" font-size="30"></text>
  <rect x="80" y="690" width="1" height="1" fill="none"/>
</svg>`;

const out = path.resolve(fileURLToPath(new URL('../public/og.png', import.meta.url)));
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
await writeFile(
  path.resolve(fileURLToPath(new URL('../public/og.svg', import.meta.url))),
  svg,
  'utf8',
);
console.log('og.png готов:', out);
