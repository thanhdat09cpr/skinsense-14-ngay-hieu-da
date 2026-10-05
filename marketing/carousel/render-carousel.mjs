/**
 * Step 2 of the "how to join" carousel: renders the 8 slides to PNG
 * (1080x1350 layout at 2x, so 2160x2700) into ./output/.
 *
 *   npm run carousel:render            # after npm run carousel:shots
 *
 * Env: CHROME_PATH (default: Google Chrome on macOS), QR_URL (default: the page URL with UTM tags).
 * Needs internet for Google Fonts and the Phosphor icon font.
 */
import puppeteer from "puppeteer-core";
import QRCode from "qrcode";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { QR_URL, SLIDES } from "./carousel-slide-content.mjs";
import { slideHtml } from "./carousel-slide-template.mjs";

const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const here = (path) => fileURLToPath(new URL(path, import.meta.url));
const SHOTS_DIR = here("./shots/");
const PUBLIC_DIR = here("../../public/");
const OUT_DIR = here("./output/");
const fileUrl = (path) => pathToFileURL(path).href;

const { viewport, shots: hotspots } = JSON.parse(readFileSync(join(SHOTS_DIR, "hotspots.json"), "utf8"));
const assets = {
  logo: fileUrl(join(PUBLIC_DIR, "brand/logo-mark.png")),
  pose: (name) => fileUrl(join(PUBLIC_DIR, "skinnie", `${name}.png`)),
  shot: (name) => fileUrl(join(SHOTS_DIR, `${name}.png`)),
  qrSvg: await QRCode.toString(QR_URL, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#205860", light: "#00000000" } }),
  hotspots,
  viewport,
};

mkdirSync(OUT_DIR, { recursive: true });
const workDir = mkdtempSync(join(tmpdir(), "skinsense-carousel-"));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
  for (const slide of SLIDES) {
    const htmlPath = join(workDir, `${slide.file}.html`);
    writeFileSync(htmlPath, slideHtml(slide, assets));
    await page.goto(fileUrl(htmlPath), { waitUntil: "networkidle0" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
      window.fitText();
    });
    await page.screenshot({ path: join(OUT_DIR, `${slide.file}.png`), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    console.log("rendered", slide.file);
  }
  console.log("QR points to", QR_URL);
} finally {
  await browser.close();
  rmSync(workDir, { recursive: true, force: true });
}
