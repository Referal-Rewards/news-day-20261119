import { copyFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** news-image-20261119: Nov 19 2026 world-news collage, deterministic output */
function outputPath(): string {
  return join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png');
}

function sourcePath(): string {
  return new URL('./entry.png', import.meta.url).pathname;
}

function assertSourceExists(path: string): void {
  statSync(path);
}

const src = sourcePath();
const dest = outputPath();
assertSourceExists(src);
copyFileSync(src, dest);