import { copyFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** news-image-20261119: Nov 19 2026 world-news collage, deterministic output */

function outputPath(): string {
  return join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png');
}

function sourcePath(): string {
  return new URL('./entry.png', import.meta.url).pathname;
}

function errnoOf(err: unknown): string {
  if (err !== null && typeof err === 'object' && 'code' in err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (typeof code === 'string' && code.length > 0) return code;
  }
  return 'UNKNOWN';
}

function die(context: string, err: unknown): never {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`${context} [${errnoOf(err)}]: ${msg}`);
  process.exit(1);
}

function requireSourceFile(path: string): void {
  try {
    const st = statSync(path);
    if (!st.isFile()) {
      console.error(`source is not a file [ENOTFILE]: ${path}`);
      process.exit(1);
    }
  } catch (err) {
    die(`stat source ${path}`, err);
  }
}

function copyDeterministic(src: string, dest: string): void {
  let srcSize: number;
  try {
    srcSize = statSync(src).size;
  } catch (err) {
    die(`stat source before copy ${src}`, err);
  }

  try {
    copyFileSync(src, dest);
  } catch (err) {
    die(`copy to ${dest}`, err);
  }

  try {
    const destSize = statSync(dest).size;
    if (destSize !== srcSize) {
      console.error(
        `output size mismatch [EIO]: ${dest} is ${destSize} bytes, expected ${srcSize}`,
      );
      process.exit(1);
    }
  } catch (err) {
    die(`stat output ${dest}`, err);
  }
}

function main(): void {
  const src = sourcePath();
  const dest = outputPath();
  requireSourceFile(src);
  copyDeterministic(src, dest);
}

main();