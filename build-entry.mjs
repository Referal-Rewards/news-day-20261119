#!/usr/bin/env node
// Stories match news.make.fun 2026-11-19.
/**
 * Offline renderer for entry.png (1024×1024). Uses only Node 22 + spawn to ImageMagick.
 * Panel headlines match https://news.make.fun/2026-11-19 (provisional edition).
 * No network. Same inputs → same bytes when build-entry.mjs and magick are unchanged.
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'entry.png');

const panels = [
  ['SUMMIT · SHENZHEN', 'Trump · Xi · Putin', 'First 3-way summit · Declaration on Peace', 'Nuclear risk · UN reform · no breakthrough'],
  ['JUSTICE · THE HAGUE', 'Myanmar genocide', 'ICJ 9–6 vs Rohingya', 'Reparations ordered'],
  ['CLIMATE · ANTALYA', 'COP31 draft cut', 'Fossil language dropped', '$120bn aid goal gone'],
  ['WAR · CRIMEA', 'Ukraine hits bridge', '3rd strike · trains halted', 'Putin vows retaliation'],
  ['STORM · ODISHA', 'Cyclone Akvan', '100k shelters · landfall Fri', 'Winds to 110 km/h'],
  ['MARKETS · NYC', 'Anthropic Nasdaq', '$8bn @ $90 · shares +18%', 'Stocks slide · gold 52-wk low'],
];

/** @type {string[]} */
const args = ['-size', '1024x1024', 'xc:#0f1d32'];

function push(fill, rest) {
  args.push('-fill', fill, ...rest);
}

push('#e85d04', ['-draw', 'rectangle 0,0 1024,120']);
push('white', [
  '-font',
  'DejaVu-Sans-Bold',
  '-pointsize',
  '36',
  '-draw',
  "text 28,48 'THURSDAY 19 NOVEMBER 2026'",
]);
push('#ffe0c2', [
  '-font',
  'DejaVu-Sans',
  '-pointsize',
  '22',
  '-draw',
  "text 28,88 'WORLD NEWS · UTC'",
]);
push('white', [
  '-font',
  'DejaVu-Sans-Bold',
  '-pointsize',
  '28',
  '-draw',
  "text 28,108 '19 NOV 2026'",
]);

const xs = [20, 352, 684];
const ys = [136, 408];
const pw = 320;
const ph = 252;
let i = 0;
for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 3; col++) {
    const [tag, head, ...lines] = panels[i++];
    const x = xs[col];
    const y = ys[row];
    push('#1b3352', ['-draw', `roundrectangle ${x},${y} ${x + pw},${y + ph} 12,12`]);
    push('#e85d04', ['-draw', `rectangle ${x},${y} ${x + pw},${y + 40}`]);
    const esc = (s) => s.replace(/'/g, '');
    push('#0f1d32', [
      '-font',
      'DejaVu-Sans-Bold',
      '-pointsize',
      '15',
      '-draw',
      `text ${x + 12},${y + 28} '${esc(tag)}'`,
    ]);
    push('white', [
      '-font',
      'DejaVu-Sans-Bold',
      '-pointsize',
      '24',
      '-draw',
      `text ${x + 12},${y + 78} '${esc(head)}'`,
    ]);
    let ly = y + 112;
    for (const line of lines) {
      push('#d5e4f4', [
        '-font',
        'DejaVu-Sans',
        '-pointsize',
        '17',
        '-draw',
        `text ${x + 12},${ly} '${esc(line)}'`,
      ]);
      ly += 28;
    }
  }
}

const also =
  'ALSO: GTA VI festival · Greenland pact 109–0 · Saudi vs Houthis · Han verdict overturned · Gaza truce raid · FIFA election';
push('#253d5c', ['-draw', 'roundrectangle 20,680 1004,820 10,10']);
push('white', [
  '-font',
  'DejaVu-Sans-Bold',
  '-pointsize',
  '22',
  '-draw',
  "text 36,718 'ALSO ON 19 NOV'",
]);
push('#dce8f6', [
  '-font',
  'DejaVu-Sans',
  '-pointsize',
  '16',
  '-draw',
  `text 36,756 '${also.slice(0, 90).replace(/'/g, '')}'`,
]);
push('#dce8f6', [
  '-font',
  'DejaVu-Sans',
  '-pointsize',
  '16',
  '-draw',
  `text 36,784 '${also.slice(90).replace(/'/g, '')}'`,
]);
push('#e85d04', ['-draw', 'rectangle 0,840 1024,1024']);
push('white', [
  '-font',
  'DejaVu-Sans-Bold',
  '-pointsize',
  '30',
  '-draw',
  "text 28,900 'PEACE · JUSTICE · CLIMATE · WAR · STORM · MARKETS'",
]);
push('#1a0f05', [
  '-font',
  'DejaVu-Sans',
  '-pointsize',
  '18',
  '-draw',
  "text 28,960 'news-image-20261119 · Referal-Rewards / make.fun'",
]);

args.push('-strip', out);
const r = spawnSync('magick', args, { encoding: 'utf8' });
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
const size = readFileSync(out).length;
if (size > 1024 * 1024) {
  console.error('entry.png exceeds 1 MiB');
  process.exit(1);
}
const id = spawnSync('identify', ['-format', '%wx%h', out], { encoding: 'utf8' });
if (id.stdout.trim() !== '1024x1024') {
  console.error('bad dimensions', id.stdout);
  process.exit(1);
}
console.log('wrote', out, size, 'bytes', id.stdout.trim());