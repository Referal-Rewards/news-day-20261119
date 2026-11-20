import { copyFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

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

function formatError(code: string, what: string, detail: string): string {
  return `${code}: ${what} — ${detail}`;
}

function fail(code: string, what: string, detail: string): never {
  console.error(formatError(code, what, detail));
  process.exit(1);
}

function failErr(what: string, err: unknown): never {
  const detail = err instanceof Error ? err.message : String(err);
  fail(errnoOf(err), what, detail);
}

function requireSourceFile(path: string): void {
  try {
    const st = statSync(path);
    if (!st.isFile()) {
      fail('ENOTFILE', `read source ${path}`, 'not a regular file');
    }
  } catch (err) {
    failErr(`stat source ${path}`, err);
  }
}

function copyDeterministic(src: string, dest: string): void {
  let srcSize: number;
  try {
    srcSize = statSync(src).size;
  } catch (err) {
    failErr(`stat source before copy ${src}`, err);
  }

  try {
    copyFileSync(src, dest);
  } catch (err) {
    failErr(`copy to ${dest}`, err);
  }

  try {
    const destSize = statSync(dest).size;
    if (destSize !== srcSize) {
      fail(
        'EIO',
        `verify output ${dest}`,
        `${destSize} bytes written, expected ${srcSize}`,
      );
    }
  } catch (err) {
    failErr(`stat output ${dest}`, err);
  }
}

/**
 * Program entrypoint for news-image-20261119 (v4): copy the bundled collage
 * PNG to the harness output path. Uses only Node stdlib, performs no network I/O,
 * and is deterministic across runs (same source bytes → same destination bytes).
 */
function main(): void {
  const src = sourcePath();
  const dest = outputPath();
  requireSourceFile(src);
  copyDeterministic(src, dest);
}

main();