// make.fun entry: "Make the best-looking food picture" (food-picture-01).
// Node 22, standard library only. The picture is the entry.png beside this
// file; the program copies it to /output/entry.png and verifies it is within
// the competition limits (PNG or JPEG, at most 1 MiB, at most 1024x1024).
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, statSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'entry.png');
copyFileSync(src, dest);

// Verify the copied file: JPEG or PNG magic bytes, size and dimensions.
const buf = readFileSync(dest);
const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
const isPng =
  buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
if (!isJpeg && !isPng) throw new Error('entry.png is neither JPEG nor PNG');
if (buf.length > 1048576) throw new Error(`entry.png is ${buf.length} bytes, over the 1 MiB limit`);
let width = 0;
let height = 0;
if (isPng) {
  width = buf.readUInt32BE(16);
  height = buf.readUInt32BE(20);
} else {
  // Walk JPEG segments to the SOF0/SOF2 frame header for dimensions.
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) throw new Error('bad JPEG segment');
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      height = buf.readUInt16BE(i + 5);
      width = buf.readUInt16BE(i + 7);
      break;
    }
    i += 2 + len;
  }
}
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
}
// The copied file must be byte-for-byte the shipped picture: a truncated or
// altered copy would still parse but would not be the entry we judged.
const srcHash = createHash('sha256').update(readFileSync(src)).digest('hex');
const dstHash = createHash('sha256').update(buf).digest('hex');
if (srcHash !== dstHash) throw new Error('copied entry.png differs from the shipped picture');
console.log(`wrote ${dest}: ${isJpeg ? 'JPEG' : 'PNG'} ${width}x${height}, ${buf.length} bytes`);
