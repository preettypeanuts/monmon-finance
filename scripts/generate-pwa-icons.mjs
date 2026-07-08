#!/usr/bin/env node
/**
 * Regenerate PWA icons + browser favicon from public/W.png.
 * Usage: npm run pwa:icons
 */
import { copyFileSync, existsSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..");
const publicDir = join(root, "public");
const appDir = join(root, "app");
const source = join(publicDir, "W.png");

if (!existsSync(source)) {
  console.error("Missing public/W.png");
  process.exit(1);
}

const outputs = [
  { out: "icon-192.png", size: 192 },
  { out: "icon-512.png", size: 512 },
  { out: "apple-touch-icon.png", size: 180 },
];

for (const { out, size } of outputs) {
  await sharp(source).resize(size, size).png().toFile(join(publicDir, out));
}

copyFileSync(join(publicDir, "icon-192.png"), join(appDir, "icon.png"));
copyFileSync(
  join(publicDir, "apple-touch-icon.png"),
  join(appDir, "apple-icon.png"),
);

/** Build a multi-size .ico whose entries store PNG payloads. */
function buildPngIco(entries) {
  const count = entries.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;

  const directory = Buffer.alloc(headerSize);
  directory.writeUInt16LE(0, 0);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(count, 4);

  for (let i = 0; i < count; i += 1) {
    const { size, png } = entries[i];
    const entryOffset = 6 + i * 16;
    directory.writeUInt8(size >= 256 ? 0 : size, entryOffset);
    directory.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1);
    directory.writeUInt8(0, entryOffset + 2);
    directory.writeUInt8(0, entryOffset + 3);
    directory.writeUInt16LE(1, entryOffset + 4);
    directory.writeUInt16LE(32, entryOffset + 6);
    directory.writeUInt32LE(png.length, entryOffset + 8);
    directory.writeUInt32LE(offset, entryOffset + 12);
    offset += png.length;
  }

  return Buffer.concat([directory, ...entries.map((entry) => entry.png)]);
}

const faviconEntries = [];
for (const size of [16, 32, 48]) {
  const png = await sharp(source).resize(size, size).png().toBuffer();
  faviconEntries.push({ size, png });
}

writeFileSync(join(appDir, "favicon.ico"), buildPngIco(faviconEntries));

const legacy = [
  "W-light.png",
  "apple-touch-icon-dark.png",
  "apple-touch-icon-light.png",
];

for (const file of legacy) {
  const path = join(publicDir, file);
  if (existsSync(path)) {
    unlinkSync(path);
  }
}

console.log("PWA icons + favicon updated from public/W.png");
