# #14NgayHieuDa: landing page SkinSense AI

Trang chiến dịch "Đừng đoán da, hãy hiểu da" (04/10 - 31/10/2026). Người tham gia mở mỗi ngày một ô lịch, ghi 3 chỉ số về da trong 30 giây, xem biểu đồ của chính mình ở Ngày 7 và Ngày 14. Linh vật Skinnie đồng hành suốt hành trình. Đây là bản prototype Next.js để duyệt, sau đó ghép vào website `skinsense-ai-coral.vercel.app` tại đường dẫn `/14-ngay-hieu-da`.

## Chạy thử trên máy

```bash
npm install
npm run dev          # http://localhost:3000/14-ngay-hieu-da (địa chỉ gốc tự chuyển về đây)
# hoặc bản giống production:
npm run build && npm run start
```

### Link xem thử cho nhóm và giảng viên

| Thêm vào link | Tác dụng |
|---|---|
| `?today=2026-10-08` | Giả lập "hôm nay" là ngày bất kỳ (trang mở thử thách từ 05/10) |
| `?demo=1` | Mở khóa cả 14 ô với dữ liệu minh họa, không lưu gì vào máy |
| `?today=2026-10-20` | Xem ô và màu riêng ngày 20/10 |
| `?demo=1&today=2026-10-28` | Xem chế độ Halloween |
| `?popup=1` | Hiện ngay popup đăng ký trải nghiệm sớm (đóng không bị ẩn 3 ngày) |

Ví dụ: `http://localhost:3000/14-ngay-hieu-da?demo=1&today=2026-10-20`

## Trang có gì

- **Lịch 14 ô theo ngày bắt đầu riêng** của từng người. Ô hôm nay sáng lên, ô đã qua hiện "Đã qua", ô chưa tới hiện ngày mở.
- **Phiếu nhật ký** lật mở như tờ lịch: việc hôm nay, mẹo của Skinnie, 3 thanh trượt (độ dầu, mụn, cảm giác da), 1 dòng ghi chú, ảnh không bắt buộc.
- **Ảnh chỉ lưu trên máy người dùng** (IndexedDB). Ngày 7 và Ngày 14 có màn so sánh Ngày 1 với hôm nay, chỉ họ thấy.
- **Ngày 7:** biểu đồ 7 ngày, câu hỏi "Chỉ nhìn bằng mắt đã đủ chưa?", khảo sát 1 câu, thẻ story 7/14.
- **Ngày 14:** biểu đồ cả chặng, 3 câu khảo sát (có câu về mức giá), thẻ hoàn thành 1080x1920, mời đăng ký trải nghiệm sớm.
- **Ô sự kiện chung:** 20/10 (màu hồng, Skinnie cầm hoa) và Halloween 27/10 - 31/10 (màu cam, Skinnie đội mũ phù thủy, 3 ô makeup).
- **Giữ người dùng quay lại:** email nhắc Ngày 7 và tổng kết, file lịch `.ics` thêm nhắc vào điện thoại, thanh nút dính đáy trên điện thoại, popup trải nghiệm sớm khi người dùng đã quan tâm.
- **Khác:** in mẫu nhật ký A4, nút xóa toàn bộ dữ liệu, cảnh báo khi mở trong trình duyệt của TikTok/Facebook (để nhật ký không bị mất), chế độ tối.

## Mốc thời gian

| Bắt đầu trong khoảng | Người dùng đi | Về đích muộn nhất |
|---|---|---|
| 05/10 - 17/10 | 14 ngày | 30/10 |
| 18/10 - 24/10 | 7 ngày (bản rút gọn) | 30/10 |
| Sau 24/10 | Đóng đợt, mời để lại email nhận tin | |

Sửa các mốc trong `src/lib/campaign-config.ts` (`CAMPAIGN_DATES`).

## Dữ liệu và quyền riêng tư

| Dữ liệu | Ở đâu | Điều kiện |
|---|---|---|
| Nhật ký, ghi chú, ảnh | Chỉ trên trình duyệt của người dùng | Không bao giờ gửi đi |
| Tên gọi, email nhắc | Google Sheet `ThamGia` | Tick ô đồng ý email |
| Khảo sát Ngày 1, 7, 14 | Google Sheet `KhaoSat`, mã riêng không nối được với email | Tick ô đồng ý khảo sát |
| Câu chia sẻ | Google Sheet `ChiaSe`, chờ nhóm duyệt | Tick ô đồng ý chia sẻ |
| Email trải nghiệm sớm | Google Sheet `TraiNghiemSom` | Tick ô đồng ý trong form |
| Lượt xem, bấm nút | GA4 (sự kiện theo brief mục 9) | |

Ba ô đồng ý tách riêng, không bao giờ đánh sẵn. Không có giá bán, không có nút mua, không dùng từ ngữ y khoa.

## Cài đặt Google Sheet và email nhắc

Làm theo **[docs/apps-script-setup.md](docs/apps-script-setup.md)** (khoảng 15 phút): tạo Sheet, dán 2 file trong `apps-script/`, chạy `setup`, triển khai ứng dụng web, dán URL vào `SHEET_ENDPOINT`. Khi chưa dán URL, mọi dữ liệu chỉ in ra console của trình duyệt để kiểm tra.

## Cấu trúc thư mục

```
src/app/                                trang chiến dịch (chạy dưới /14-ngay-hieu-da, xem next.config.ts)
src/components/challenge/               lịch, phiếu nhật ký, ảnh, biểu đồ, khảo sát, form nhắc
src/components/landing/                 các phần của trang: hero, cách chơi, nhắc nhở, FAQ, popup...
src/components/skinnie/                 Skinnie bay theo khi cuộn
src/lib/                                cấu hình chiến dịch, luật ngày, lưu trữ, tracking, nội dung chữ
public/skinnie/, public/images/         10 tư thế Skinnie, 2 ảnh minh họa
public/brand/logo-mark.png              logo TẠM (cắt từ poster), cần thay bằng file gốc
apps-script/                            backend Google Sheet + email, kèm bộ test giả lập
docs/                                   design system, hướng dẫn cài Apps Script
marketing/carousel/                     ảnh hướng dẫn tham gia cho Facebook (xem mục bên dưới)
```

## Ghép vào website thật (khoảng 10 phút, không chép code)

Landing là một app riêng chạy dưới đường dẫn `/14-ngay-hieu-da`. Website chính chỉ cần **chuyển tiếp** đường dẫn đó sang landing (Next.js gọi là [multi-zones](https://nextjs.org/docs/pages/guides/multi-zones)). Không chép thư mục, không đụng CSS hay Tailwind của website, hai bên deploy độc lập. Người dùng vẫn thấy địa chỉ `skinsense-ai-coral.vercel.app/14-ngay-hieu-da`, nên GA4 tính chung một website.

**Bước 1. Deploy landing lên Vercel**
- vercel.com → **Add New → Project** → import repo `skinsense-14-ngay-hieu-da` → Deploy (để nguyên mặc định).
- Ghi lại địa chỉ Vercel cấp, ví dụ `https://skinsense-14-ngay-hieu-da.vercel.app`. Kiểm tra: mở `.../14-ngay-hieu-da` thấy trang.

**Bước 2. Thêm 1 đoạn vào `next.config` của website chính**

```js
// next.config.js (hoặc .mjs / .ts) của website SkinSense
const LANDING_URL = "https://skinsense-14-ngay-hieu-da.vercel.app"; // địa chỉ ở Bước 1

const nextConfig = {
  // ...giữ nguyên cấu hình đang có
  async rewrites() {
    return [
      { source: "/14-ngay-hieu-da", destination: `${LANDING_URL}/14-ngay-hieu-da` },
      { source: "/14-ngay-hieu-da/:path*", destination: `${LANDING_URL}/14-ngay-hieu-da/:path*` },
    ];
  },
};
```

Nếu website đã có `rewrites()`, chỉ cần thêm 2 dòng `{ source: ... }` vào danh sách đang có. Website không được có sẵn trang hay thư mục `public/14-ngay-hieu-da` (sẽ chiếm mất đường dẫn).

**Bước 3. Thêm đường vào trang trên website**
- Thanh thông báo: "#14NgayHieuDa đang diễn ra, tham gia miễn phí", trỏ về `/14-ngay-hieu-da`. Thêm mục này vào menu.
- Dùng thẻ `<a href="/14-ngay-hieu-da">` thường, **không dùng `<Link>`** của Next, vì đây là app khác.
- Deploy website chính. Xong.

Việc riêng của website chính, nên làm luôn: sửa `metadataBase` đang trỏ `http://localhost:3000` thành `https://skinsense-ai-coral.vercel.app` (lỗi ảnh xem trước khi chia sẻ link).

Lần sau sửa landing: chỉ cần push lên repo landing, Vercel tự deploy lại, website chính không phải làm gì.

## Ảnh hướng dẫn tham gia (carousel Facebook)

8 ảnh dọc 4:5 (2160x2700) trong `marketing/carousel/output/`: ảnh bìa, 6 bước, ảnh cuối có mã QR. Đăng theo thứ tự tên file. Caption nhớ có link trang, vì Bước 1 ghi "Mở link trong bài viết".

Ảnh dựng bằng code từ màn hình thật của landing, chữ tiếng Việt luôn đúng dấu. Sửa giao diện hoặc chữ thì chạy lại:

```bash
npm run build && npm run start   # landing ở localhost:3000
npm run carousel:shots           # chụp 6 màn hình + thẻ story vào marketing/carousel/shots/
npm run carousel:render          # dựng 8 ảnh vào marketing/carousel/output/
```

- Sửa chữ trên ảnh: `marketing/carousel/carousel-slide-content.mjs`. Link, hashtag và hạn 17/10, 24/10 lấy thẳng từ `src/lib/campaign-config.ts`.
- Mã QR trỏ tới `PAGE_URL` kèm `utm_source=facebook&utm_medium=carousel`, để GA4 đếm riêng lượt quét. Đổi link: `QR_URL=https://... npm run carousel:render`.
- Bước 1 đến 4 đi đúng luồng thật; Bước 5, 6 dùng dữ liệu minh họa (`?demo=1`).
- Cần mạng (font Google, icon Phosphor) và Chrome (đặt `CHROME_PATH` nếu Chrome không ở chỗ mặc định của macOS).

## Kiểm tra trước khi chạy thật

- [ ] Thay `public/brand/logo-mark.png` bằng logo gốc, đối chiếu màu với 2 bài teaser
- [ ] Điền `SHEET_ENDPOINT`, chạy `sendTestEmails` thấy đủ 3 email
- [ ] Điền `GA_MEASUREMENT_ID` (cùng mã GA4 với website chính), thấy sự kiện trong GA4 DebugView
- [ ] Thử trên điện thoại thật: mở link từ TikTok/Facebook, bắt đầu Ngày 1, thêm ảnh, đăng ký nhắc
- [ ] Ảnh xem trước khi chia sẻ link (Open Graph 1200x630): chưa làm
- [ ] Trước khi đăng carousel: mở thử link trong mã QR (ảnh `08-bat-dau.png`), phải ra đúng landing
- [ ] Link `/quyen-rieng-tu` trên website nhắc đến việc lưu nhật ký và ảnh trên máy người dùng

## Lệnh kiểm tra

```bash
npm run lint              # ESLint
npm run build             # build + TypeScript
npm run test:apps-script  # 11 test cho backend: lưu dữ liệu, đồng ý, chống spam, lịch gửi email, hủy nhận
```

## Còn mở, cần nhóm quyết

- Gửi **logo gốc** và **2 bài teaser** để chỉnh màu cho khớp nhận diện.
- **Tường chia sẻ** đang hiện 3 câu minh họa. Câu thật đã duyệt (cột `duyet` = TRUE) chưa tự hiện lên trang, cần thêm 1 bước nối.
- **Đồng hồ đếm ngược** trong popup: chỉ làm nếu có ngày chốt danh sách trải nghiệm sớm thật.
- **Bộ đếm người tham gia** (bằng chứng xã hội): làm được từ số dòng trong Sheet, nên bật khi đủ khoảng 50 người.
- **Tốc độ:** Lighthouse 88, LCP 3.9 giây khi mô phỏng 4G chậm (chuẩn dưới 2.5 giây). Tối ưu tiếp khi giao diện đã chốt.

## Tài liệu liên quan

- [docs/design-system.md](docs/design-system.md): màu, chữ, bo góc, chuyển động, Skinnie, các điều cấm
- [docs/apps-script-setup.md](docs/apps-script-setup.md): cài Google Sheet và email nhắc
- Brief gốc: `landing-14-ngay-hieu-da-brief.md`
