/**
 * Builds one self-contained HTML page per carousel slide (cover, step, closing).
 * Fonts and icons load from Google Fonts and the Phosphor CDN at render time.
 */
import { BRAND, DEADLINES } from "./carousel-slide-content.mjs";
import { SLIDE_CSS } from "./carousel-slide-styles.mjs";

const FONTS = "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700;800;900&family=JetBrains+Mono:wght@700&display=block";
const ICONS = ["bold", "fill"].map((weight) => `https://unpkg.com/@phosphor-icons/web@2.1.1/src/${weight}/style.css`);

const escapeHtml = (text) => String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
/** Keeps button names (“Đăng ký nhắc nhở”), "Ngày 7" and "3 thanh" from splitting across lines. */
const text = (value) =>
  escapeHtml(value)
    .replace(/“[^”]+”/g, (quoted) => quoted.replaceAll(" ", "\u00a0"))
    .replace(/(Ngày|ngày|Bước) (?=\d)/g, "$1\u00a0")
    .replace(/(\d) (?=\p{L})/gu, "$1\u00a0");
const percent = (value, total) => `${((value / total) * 100).toFixed(3)}%`;

/** Shrinks any [data-fit] line until it fits its box (the cover hashtag). Called after fonts load. */
const FIT_SCRIPT = `window.fitText = () => document.querySelectorAll("[data-fit]").forEach((el) => {
  let size = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollWidth > el.clientWidth && size > 40) { size -= 2; el.style.fontSize = size + "px"; }
});`;

function page(body) {
  const links = [FONTS, ...ICONS].map((href) => `<link rel="stylesheet" href="${href}">`).join("");
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8">${links}<style>${SLIDE_CSS}</style></head>
<body><main class="slide"><div class="grid"></div>${body}</main><script>${FIT_SCRIPT}</script></body></html>`;
}

const topBar = (assets, tag = BRAND.hashtag) =>
  `<header class="top"><span class="brand"><img src="${assets.logo}" alt="">SkinSense AI</span><span class="tag">${escapeHtml(tag)}</span></header>`;

const footer = () => `<footer class="foot">
  <span><i class="ph-fill ph-facebook-logo"></i>${BRAND.facebook}</span>
  <span><i class="ph-bold ph-globe"></i>${BRAND.site}</span>
  <span><i class="ph-bold ph-envelope-simple"></i>${BRAND.email}</span>
</footer>`;

/** Yellow rings + numbers over the screenshot, placed from the captured hotspot boxes. */
function rings(shot, assets) {
  const { width, height } = assets.viewport;
  return (assets.hotspots[shot] ?? [])
    .map(({ n, x, y, w, h }) => {
      const box = `left:${percent(x, width)};top:${percent(y, height)};width:${percent(w, width)};height:${percent(h, height)}`;
      return `<span class="ring" style="${box}"><b class="badge">${n}</b></span>`;
    })
    .join("");
}

function stepSlide(slide, assets) {
  const items = slide.items
    .map((item, index) => {
      const note = item.note ? `<span>${text(item.note)}</span>` : "";
      return `<li><b class="num">${index + 1}</b><div><strong>${text(item.text)}</strong>${note}</div></li>`;
    })
    .join("");
  const card = slide.card
    ? `<figure class="story"><img src="${assets.shot(slide.card)}" alt=""><b class="badge">${slide.items.length}</b></figure>`
    : "";
  return page(`${topBar(assets)}
<section class="head"><p class="kicker yellow">Bước ${slide.step}:</p><h1 class="title">${text(slide.title)}</h1></section>
<section class="body${slide.card ? " has-card" : ""}">
  <div class="left"><ol class="steps">${items}</ol>
    <div class="pose-wrap"><img class="pose${slide.flip ? " flip" : ""}${slide.poseStart ? " start" : ""}" src="${assets.pose(slide.pose)}" alt=""></div></div>
  <div class="phone"><div class="screen"><img src="${assets.shot(slide.shot)}" alt=""></div><div class="marks">${rings(slide.shot, assets)}</div></div>
  ${card}
</section>${footer()}`);
}

function coverSlide(slide, assets) {
  return page(`${topBar(assets, "Hướng dẫn tham gia")}
<section class="cover-head">
  <p class="word yellow">Tham gia</p>
  <p class="hashtag" data-fit>${BRAND.hashtag}</p>
  <p class="word yellow right">như thế nào?</p>
</section>
<span class="tile done" style="left:84px;top:640px;transform:rotate(-10deg)">01<i class="ph-bold ph-check"></i></span>
<span class="tile plain" style="left:150px;top:868px;transform:rotate(7deg)">07<small>Biểu đồ</small></span>
<span class="tile today" style="right:96px;top:780px;transform:rotate(8deg)">14<small>Về đích</small></span>
<img class="cover-pose" src="${assets.pose(slide.pose)}" alt="">
<div class="pills"><span>Miễn phí</span><span>30 giây mỗi ngày</span><span>Không cần đăng ảnh mặt</span>
  <span class="swipe" aria-label="Lướt xem 6 bước"><i class="ph-bold ph-arrow-right"></i></span></div>
${footer()}`);
}

function closingSlide(slide, assets) {
  return page(`${topBar(assets)}
<section class="cover-head"><p class="word yellow">Bắt đầu Ngày 1</p><p class="word">ngay hôm nay</p></section>
<figure class="qr-card"><div class="qr">${assets.qrSvg}</div><figcaption>Quét mã để bắt đầu</figcaption></figure>
<img class="close-pose" src="${assets.pose(slide.pose)}" alt="">
<p class="url">${BRAND.pageUrl}</p>
<div class="deadline"><i class="ph-bold ph-calendar-check"></i>
  <strong>Bắt đầu đến hết ${DEADLINES.fullLastStart} để đi đủ 14 ngày.</strong>
  <span>Từ ${DEADLINES.shortFirstStart} đến ${DEADLINES.shortLastStart} vẫn chơi được bản 7 ngày.</span></div>
${footer()}`);
}

const BUILDERS = { cover: coverSlide, step: stepSlide, closing: closingSlide };

export function slideHtml(slide, assets) {
  return BUILDERS[slide.kind](slide, assets);
}
