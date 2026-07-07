#!/usr/bin/env node
/**
 * Regenerate PWA icons from public/W.png
 * Usage: npm run pwa:icons
 */
import { copyFileSync, existsSync } from "node:fs";
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

const metadata = await sharp(source).metadata();
const size = metadata.width ?? 2000;

async function createLightSource() {
  const whiteBackground = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  return sharp(whiteBackground)
    .composite([{ input: source, blend: "screen" }])
    .png()
    .toBuffer();
}

const lightSource = await createLightSource();

await sharp(lightSource).png().toFile(join(publicDir, "W-light.png"));

const outputs = [
  { out: "icon-192.png", size: 192, input: source },
  { out: "icon-512.png", size: 512, input: source },
  { out: "apple-touch-icon-dark.png", size: 180, input: source },
  { out: "apple-touch-icon-light.png", size: 180, input: lightSource },
];

for (const { out, size: iconSize, input } of outputs) {
  await sharp(input).resize(iconSize, iconSize).png().toFile(join(publicDir, out));
}

copyFileSync(
  join(publicDir, "apple-touch-icon-dark.png"),
  join(publicDir, "apple-touch-icon.png"),
);
copyFileSync(join(publicDir, "icon-192.png"), join(appDir, "icon.png"));
copyFileSync(
  join(publicDir, "apple-touch-icon-dark.png"),
  join(appDir, "apple-icon.png"),
);

console.log("PWA icons updated from public/W.png");
