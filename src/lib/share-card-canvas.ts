/**
 * Draws the 1080x1920 story card (cream paper, deep-teal ink, big progress
 * number, Skinnie) and shares it through the Web Share API, falling back to a
 * download when sharing files is not supported.
 */
import { HASHTAG, PAGE_URL, asset } from "./campaign-config";

const WIDTH = 1080;
const HEIGHT = 1920;
const PAPER = "#F6F6F0";
const INK = "#205860";
const INK_SOFT = "#3F5A60";
const DONE = "#2E9C94";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

/** Uses the page's loaded Be Vietnam Pro so Vietnamese diacritics render correctly. */
function pageFontFamily(): string {
  return getComputedStyle(document.querySelector("[data-campaign]") ?? document.body).fontFamily;
}

export async function drawShareCard(params: { done: number; total: number; headline: string }): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  const font = pageFontFamily();
  await document.fonts.ready;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = INK;
  ctx.font = `700 44px ${font}`;
  ctx.fillText("SkinSense AI", 96, 150);

  // Progress grid: one square per day, filled for logged days.
  const cell = 92;
  const gap = 18;
  const perRow = 7;
  for (let index = 0; index < params.total; index += 1) {
    const x = 96 + (index % perRow) * (cell + gap);
    const y = 300 + Math.floor(index / perRow) * (cell + gap);
    ctx.fillStyle = index < params.done ? DONE : "rgba(32, 88, 96, 0.12)";
    ctx.beginPath();
    ctx.roundRect(x, y, cell, cell, 20);
    ctx.fill();
  }

  ctx.fillStyle = INK;
  ctx.font = `800 300px ${font}`;
  ctx.fillText(`${params.done}/${params.total}`, 84, 840);

  ctx.font = `700 64px ${font}`;
  wrapText(ctx, params.headline, 96, 960, WIDTH - 192, 82);

  const skinnie = await loadImage(asset("/skinnie/skinnie.png"));
  const skinnieHeight = 620;
  const skinnieWidth = (skinnie.width / skinnie.height) * skinnieHeight;
  ctx.drawImage(skinnie, WIDTH - skinnieWidth - 70, 1130, skinnieWidth, skinnieHeight);

  ctx.fillStyle = INK;
  ctx.font = `700 56px ${font}`;
  ctx.fillText(HASHTAG, 96, 1580);
  ctx.fillStyle = INK_SOFT;
  ctx.font = `500 34px ${font}`;
  ctx.fillText(PAGE_URL.replace("https://", ""), 96, 1640);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))), "image/png");
  });
}

/** Greedy wrap that never leaves one word alone on the last line ("...hiểu / da"). */
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const fits = (words: string[]) => ctx.measureText(words.join(" ")).width <= maxWidth;
  const lines: string[][] = [[]];
  for (const word of text.split(" ")) {
    const line = lines[lines.length - 1];
    if (line.length && !fits([...line, word])) lines.push([word]);
    else line.push(word);
  }
  const last = lines[lines.length - 1];
  const previous = lines[lines.length - 2];
  if (previous && last.length === 1 && previous.length > 2 && fits([previous[previous.length - 1], ...last])) {
    last.unshift(previous.pop() as string);
  }
  lines.forEach((line, index) => ctx.fillText(line.join(" "), x, y + index * lineHeight));
}

/** Share the card on phones; download it elsewhere. Returns how it was delivered. */
export async function shareOrDownloadCard(blob: Blob, fileName: string): Promise<"shared" | "downloaded"> {
  const file = new File([blob], fileName, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "14 ngày hiểu da", text: `${HASHTAG} ${PAGE_URL}` });
      return "shared";
    } catch {
      // User closed the share sheet; fall through to a download so the card is not lost.
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded";
}
