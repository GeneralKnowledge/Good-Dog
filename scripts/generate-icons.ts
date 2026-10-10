import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * Renders scripts/assets/app-icon.svg to the PNG sizes the app needs.
 * Re-run with `npm run icons:generate` after changing the artwork.
 * To use your own artwork, replace the SVG (keep the important shapes inside
 * the central 80% so Android's maskable crop does not cut them off).
 */
const root = path.resolve(__dirname, "..");
const svg = fs.readFileSync(path.join(__dirname, "assets/app-icon.svg"), "utf8");

const targets: Array<{ file: string; size: number }> = [
  { file: "public/icons/icon-192.png", size: 192 },
  { file: "public/icons/icon-512.png", size: 512 },
  { file: "public/icons/icon-maskable-512.png", size: 512 },
  { file: "src/app/apple-icon.png", size: 180 },
  { file: "src/app/icon.png", size: 32 },
];

async function main() {
  const browser = await chromium.launch();
  try {
    for (const { file, size } of targets) {
      const page = await browser.newPage({
        viewport: { width: size, height: size },
        deviceScaleFactor: 1,
      });
      const html = `<!doctype html><style>html,body{margin:0;padding:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`;
      await page.setContent(html);
      const out = path.join(root, file);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      await page.screenshot({ path: out, clip: { x: 0, y: 0, width: size, height: size } });
      await page.close();
      console.log(`wrote ${file} (${size}x${size})`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
