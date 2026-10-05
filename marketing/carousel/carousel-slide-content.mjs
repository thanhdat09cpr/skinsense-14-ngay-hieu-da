/**
 * Copy and layout choices for the 8 "how to join" carousel slides.
 * Each step slide pairs a numbered list with a real screenshot from ./shots/.
 * The numbered rings drawn on a screenshot come from shots/hotspots.json; ring n matches list item n.
 * Text rules: no em dashes, Vietnamese with full diacritics, one short line per item.
 * URL, hashtag and deadlines come from the site config so the slides cannot drift from the page.
 */
import { CAMPAIGN_DATES, HASHTAG, PAGE_URL, SITE_URL } from "../../src/lib/campaign-config.ts";

const dayMonth = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const nextDay = (iso) => new Date(Date.parse(`${iso}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

export const BRAND = {
  facebook: "Skinsense AI",
  site: SITE_URL.replace("https://", ""),
  pageUrl: PAGE_URL.replace("https://", ""),
  email: "skinsenseai@gmail.com",
  hashtag: HASHTAG,
};

/** Start by this date for the full 14 days; the 7-day run covers the week after. */
export const DEADLINES = {
  fullLastStart: dayMonth(CAMPAIGN_DATES.fullProgramLastStart),
  shortFirstStart: dayMonth(nextDay(CAMPAIGN_DATES.fullProgramLastStart)),
  shortLastStart: dayMonth(CAMPAIGN_DATES.shortProgramLastStart),
};

/** QR target; UTM tags let GA4 count carousel scans as their own source. */
export const QR_URL = process.env.QR_URL ?? `${PAGE_URL}?utm_source=facebook&utm_medium=carousel&utm_campaign=14ngayhieuda`;

export const SLIDES = [
  { kind: "cover", file: "01-bia", pose: "skinnie-phone" },
  {
    kind: "step",
    file: "02-buoc-1",
    step: 1,
    title: "Mở trang, bấm “Bắt đầu Ngày 1”",
    shot: "01-hero",
    pose: "skinnie-point",
    flip: true,
    items: [
      { text: "Mở link trong bài viết", note: "Hoặc quét mã QR ở ảnh cuối." },
      { text: "Bấm “Bắt đầu Ngày 1”", note: "Không cần tạo tài khoản, không cần cài app." },
    ],
  },
  {
    kind: "step",
    file: "03-buoc-2",
    step: 2,
    title: "Ngày 1: ghi lại mốc đầu tiên",
    shot: "02-day1",
    pose: "skinnie-writing",
    items: [
      { text: "Chọn 1 đến 2 điều muốn theo dõi" },
      { text: "Chụp ảnh mốc nếu muốn", note: "Ảnh chỉ lưu trên máy bạn, không gửi đi đâu." },
      { text: "Kéo 3 thanh chỉ số, bấm Lưu", note: "Độ dầu, mụn và cảm giác da." },
    ],
  },
  {
    kind: "step",
    file: "04-buoc-3",
    step: 3,
    title: "Để Skinnie nhắc bạn qua email",
    shot: "03-reminder",
    pose: "skinnie-wave",
    items: [
      { text: "Điền tên gọi và email" },
      { text: "Tick ô đồng ý nhận email" },
      { text: "Bấm “Đăng ký nhắc nhở”", note: "Email nhắc vào Ngày 7 và ngày tổng kết. Hủy lúc nào cũng được." },
    ],
  },
  {
    kind: "step",
    file: "05-buoc-4",
    step: 4,
    title: "Mỗi ngày mở 1 ô, chỉ 30 giây",
    shot: "04-calendar",
    pose: "skinnie-calendar",
    items: [
      { text: "Mở ô hôm nay, kéo 3 thanh, bấm Lưu" },
      { text: "Bấm “Thêm nhắc vào lịch”", note: "Điện thoại nhắc bạn lúc 20:30 mỗi tối." },
      { text: "Lỡ một ngày cũng không sao", note: "Cứ ghi tiếp ô của hôm nay." },
    ],
  },
  {
    kind: "step",
    file: "06-buoc-5",
    step: 5,
    title: "Ngày 7: xem biểu đồ da của chính bạn",
    shot: "05-day7",
    pose: "skinnie-puzzled",
    items: [
      { text: "Xem biểu đồ 7 ngày", note: "Vẽ từ chính những con số bạn ghi." },
      { text: "Trả lời 1 câu hỏi nhanh" },
      { text: "Chia sẻ thẻ 7/14 nếu muốn" },
    ],
  },
  {
    kind: "step",
    file: "07-buoc-6",
    step: 6,
    title: "Ngày 14: tổng kết và nhận thẻ",
    shot: "06-final",
    card: "07-share-card",
    pose: "skinnie-cheer",
    poseStart: true,
    items: [
      { text: "Xem lại cả 14 ngày" },
      { text: "Trả lời 3 câu hỏi ngắn" },
      { text: "Nhận thẻ, đăng story", note: "Nhớ gắn #14NgayHieuDa nhé." },
    ],
  },
  { kind: "closing", file: "08-bat-dau", pose: "skinnie" },
];
