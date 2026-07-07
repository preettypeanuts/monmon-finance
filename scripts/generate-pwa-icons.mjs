#!/usr/bin/env node
/**
 * Regenerate PWA icons from public/W.png (transparent — OS picks tile bg).
 * Usage: npm run pwa:icons
 */
import { copyFileSync, existsSync, unlinkSync } from "node:fs";
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
  await sharp(source)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, out));
}

copyFileSync(join(publicDir, "icon-192.png"), join(appDir, "icon.png"));
copyFileSync(join(publicDir, "apple-touch-icon.png"), join(appDir, "apple-icon.png"));

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

console.log("PWA icons updated from public/W.png");
