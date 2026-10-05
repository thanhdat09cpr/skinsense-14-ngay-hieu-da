/**
 * Step 1 of the "how to join" carousel: walks through the real landing on a
 * phone-sized viewport and saves one screenshot per step into ./shots/, plus
 * hotspots.json (where each control the slide points at sits on screen) and
 * the real 1080x1920 story card.
 *
 *   npm run build && npm run start        # landing on http://localhost:3000/14-ngay-hieu-da
 *   npm run carousel:shots
 *
 * Env: LANDING_URL (default http://localhost:3000/14-ngay-hieu-da),
 *      CHROME_PATH (default: Google Chrome on macOS).
 * Steps 1-4 go through the real flow; Day 7 and Day 14 use ?demo=1 (illustrative data).
 */
import puppeteer from "puppeteer-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const LANDING = process.env.LANDING_URL ?? "http://localhost:3000/14-ngay-hieu-da";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT_DIR = fileURLToPath(new URL("./shots/", import.meta.url));
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const DIALOG = "[role=dialog]";
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

mkdirSync(OUT_DIR, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const hotspotsByShot = {};

/** Loads a page state and hides the reviewer banner, flying Skinnie guide and sticky bar. */
async function goto(page, query) {
  await page.goto(`${LANDING}${query}`, { waitUntil: "networkidle0" });
  await wait(1500);
  await page.addStyleTag({ content: `.relative.z-50, .fixed.left-0.top-0, .fixed.inset-x-0.bottom-0 { display: none !important; }` });
}

async function newPhonePage(query) {
  const page = await (await browser.createBrowserContext()).newPage();
  await page.setViewport(PHONE);
  await goto(page, query);
  return page;
}

/**
 * Finds each control on screen and records its box (viewport CSS px).
 * spec: { n, sel, text?, exact?, upTo? (grow to the first ancestor containing this text),
 *         upToSel? (grow to the first ancestor containing this selector) }
 */
const measure = (page, specs) =>
  page.evaluate((list) => {
    const pad = 6;
    return list.map((spec) => {
      let el = [...document.querySelectorAll(spec.sel)].find((candidate) => {
        if (!candidate.getClientRects().length) return false;
        const content = candidate.textContent.trim();
        return !spec.text || (spec.exact ? content === spec.text : content.includes(spec.text));
      });
      if (!el) throw new Error(`Hotspot not found: ${JSON.stringify(spec)}`);
      while (spec.upTo && el.parentElement && !el.textContent.includes(spec.upTo)) el = el.parentElement;
      while (spec.upToSel && el.parentElement && !el.querySelector(spec.upToSel)) el = el.parentElement;
      const r = el.getBoundingClientRect();
      return { n: spec.n, x: Math.round(r.left - pad), y: Math.round(r.top - pad), w: Math.round(r.width + pad * 2), h: Math.round(r.height + pad * 2) };
    });
  }, specs);

async function shoot(page, name, specs = []) {
  await wait(400);
  hotspotsByShot[name] = await measure(page, specs);
  await page.screenshot({ path: `${OUT_DIR}${name}.png` });
  console.log("saved", name);
}

async function click(page, label, scope = "body") {
  const found = await page.evaluate(
    ([text, root]) => {
      const button = [...document.querySelectorAll(`${root} button`)].find((b) => b.textContent.trim().startsWith(text) && b.offsetParent);
      button?.click();
      return Boolean(button);
    },
    [label, scope],
  );
  if (!found) throw new Error(`Button not found: ${label}`);
  await wait(900);
}

const scrollSheet = (page, top) => page.evaluate((y) => document.querySelector("[role=dialog]").scrollTo(0, y), top);
const scrollToCalendar = (page) => page.evaluate(() => window.scrollTo(0, document.getElementById("lich").offsetTop - 6));
const openTile = (page, day) =>
  page.evaluate((d) => {
    const label = "Ngày " + String(d).padStart(2, "0");
    [...document.querySelectorAll("#lich button")].find((b) => b.textContent.replace(/\s+/g, " ").trim().startsWith(label))?.click();
  }, day);

// 1. Hero on opening day
const page = await newPhonePage("?today=2026-10-05");
await shoot(page, "01-hero", [{ n: 2, sel: "#hero-cta button", text: "Bắt đầu Ngày 1" }]);

// 2. Day 1: two things to track, the photo slot and the first slider in view
await click(page, "Bắt đầu Ngày 1", "#hero-cta");
await wait(600);
await click(page, "Độ dầu", DIALOG);
await click(page, "Mụn", DIALOG);
await scrollSheet(page, 230);
await shoot(page, "02-day1", [
  { n: 1, sel: `${DIALOG} button`, text: "Độ dầu", upTo: "Phản ứng" },
  { n: 2, sel: `${DIALOG} button`, text: "Thêm ảnh hôm nay" },
  { n: 3, sel: `${DIALOG} input[type=range]`, upTo: "Khô ráo" },
]);

// 3. Reminder sign-up right after saving Day 1
await scrollSheet(page, 99999);
await click(page, "TikTok", DIALOG);
await click(page, "Lưu Ngày 1", DIALOG);
await wait(800);
await page.type(`${DIALOG} input[autocomplete=given-name]`, "Linh");
await page.type(`${DIALOG} input[type=email]`, "linh@example.com");
await page.evaluate(() => document.querySelector("[role=dialog] input[type=checkbox]").click());
await scrollSheet(page, 0);
await shoot(page, "03-reminder", [
  { n: 1, sel: `${DIALOG} input[autocomplete=given-name]`, upTo: "Email" },
  { n: 2, sel: `${DIALOG} label`, text: "nhận email nhắc nhở" },
  { n: 3, sel: `${DIALOG} button`, text: "Đăng ký nhắc nhở" },
]);
await click(page, "Đăng ký nhắc nhở", DIALOG);

// 4. The same diary on Day 5: Days 2-4 added to the real saved state
await page.evaluate(() => {
  const key = "skinsense-14-ngay:v1";
  const state = JSON.parse(localStorage.getItem(key));
  const rows = [[4, 3, 3, "Hôm qua ngủ trễ."], [3, 3, 4, "Chụp lại đúng 7h."], [3, 2, 4, "Uống nhiều nước hơn."]];
  rows.forEach(([oil, acne, feel, note], index) => {
    state.entries[index + 2] = { oil, acne, feel, note, savedAt: `2026-10-0${index + 6}` };
  });
  localStorage.setItem(key, JSON.stringify(state));
});
await goto(page, "?today=2026-10-09");
await scrollToCalendar(page);
await wait(1400);
await shoot(page, "04-calendar", [
  { n: 1, sel: "#lich button", text: "Hôm nay" },
  { n: 2, sel: "#lich button", text: "Thêm nhắc vào lịch" },
]);

// 5. Day 7: the participant's own chart (illustrative data)
const demo = await newPhonePage("?demo=1&today=2026-10-18");
await scrollToCalendar(demo);
await wait(1400);
await openTile(demo, 7);
await wait(2800);
await shoot(demo, "05-day7", [
  { n: 1, sel: `${DIALOG} svg[role=img]` },
  { n: 2, sel: `${DIALOG} button`, text: "4", exact: true, upTo: "Rất có ích" },
  { n: 3, sel: `${DIALOG} button`, text: "Chia sẻ thẻ" },
]);

// 6. Day 14: wrap-up, then the story card the participant gets
await demo.keyboard.press("Escape");
await wait(900);
await openTile(demo, 14);
await wait(1200);
await click(demo, "Lưu Ngày 14", DIALOG);
await wait(2800);
await shoot(demo, "06-final", [
  { n: 1, sel: `${DIALOG} h2, ${DIALOG} h3, ${DIALOG} p`, text: "Bạn đã đi hết", upToSel: "img" },
  { n: 2, sel: `${DIALOG} textarea`, upTo: "Sau 14 ngày" },
]);

// Catch the card blob instead of letting the page download it into ~/Downloads.
await demo.evaluate(() => {
  Object.defineProperty(navigator, "canShare", { value: undefined, configurable: true });
  const createObjectURL = URL.createObjectURL.bind(URL);
  URL.createObjectURL = (blob) => {
    const reader = new FileReader();
    reader.onload = () => (window.__shareCard = reader.result);
    reader.readAsDataURL(blob);
    return createObjectURL(blob);
  };
  const nativeClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (!this.download) nativeClick.call(this);
  };
});
await click(demo, "Chia sẻ thẻ", DIALOG);
await demo.waitForFunction(() => window.__shareCard, { timeout: 15000 });
const card = await demo.evaluate(() => window.__shareCard);
writeFileSync(`${OUT_DIR}07-share-card.png`, Buffer.from(card.split(",")[1], "base64"));
console.log("saved 07-share-card");

writeFileSync(`${OUT_DIR}hotspots.json`, `${JSON.stringify({ viewport: { width: PHONE.width, height: PHONE.height }, shots: hotspotsByShot }, null, 2)}\n`);
console.log("saved hotspots.json");
await browser.close();
