# Cài đặt Google Sheet và email nhắc cho #14NgayHieuDa

Khoảng 15 phút, làm 1 lần. Không cần server, không tốn phí.

## Hệ thống hoạt động thế nào

```
Trang 14-ngay-hieu-da  ──(chỉ dữ liệu đã được đồng ý)──▶  Apps Script  ──▶  Google Sheet (4 trang tính)
                                                          │
                                                          └─ 08:00 mỗi sáng ──▶  Gmail gửi email Ngày 7 / tổng kết
```

| Trang tính | Lưu gì | Khi nào có dòng mới |
|---|---|---|
| `ThamGia` | Email, tên gọi, ngày bắt đầu, đã gửi email nào, đã hủy chưa | Người dùng tick ô đồng ý email và bấm "Đăng ký nhắc nhở" |
| `TraiNghiemSom` | Email đăng ký trải nghiệm sớm | Form ở cuối trang hoặc popup |
| `KhaoSat` | Câu trả lời Ngày 1, 7, 14 theo **mã khảo sát riêng**, không có email | Người dùng tick ô đồng ý khảo sát |
| `ChiaSe` | Câu chia sẻ chờ duyệt (cột `duyet`) | Người dùng tick ô đồng ý chia sẻ ở Ngày 14 |

Nhật ký và ảnh **không bao giờ** gửi lên đây.

## Các bước

1. **Tạo Google Sheet** bằng tài khoản Gmail mà nhóm muốn dùng để gửi email (email nhắc sẽ đi từ tài khoản này).
2. Trong Sheet: **Tiện ích mở rộng → Apps Script**. Xóa code mẫu.
3. Tạo 2 file và dán nội dung:
   - `backend-intake.gs` ← dán từ `apps-script/backend-intake.gs`
   - `backend-reminder-emails.gs` ← dán từ `apps-script/backend-reminder-emails.gs`
4. **Cài đặt dự án** (biểu tượng bánh răng) → bật "Hiển thị tệp kê khai appsscript.json" → dán nội dung `apps-script/appsscript.json` (để múi giờ là Việt Nam).
5. Chọn hàm **`setup`** → **Chạy**. Google sẽ hỏi quyền: chọn tài khoản → "Nâng cao" → "Đi tới dự án (không an toàn)" → Cho phép. Đây là cảnh báo bình thường với script tự viết. Hàm này tạo 4 trang tính, khóa bí mật cho link hủy nhận, và lịch chạy 08:00 mỗi sáng.
6. **Triển khai → Tùy chọn triển khai mới → Ứng dụng web**:
   - Thực thi với tư cách: **Tôi**
   - Ai có quyền truy cập: **Bất kỳ ai**
   - Bấm Triển khai, sao chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).
7. Dán URL vào `SHEET_ENDPOINT` trong `src/lib/campaign-config.ts`, build và deploy lại website.
8. **Kiểm tra** (sau khi website đã deploy, vì ảnh Skinnie trong email lấy từ `skinsense-ai-coral.vercel.app/skinnie/`):
   - Trong Apps Script, chạy hàm `sendTestEmails`: 3 email mẫu (chào mừng, Ngày 7, tổng kết) gửi vào hộp thư của bạn.
   - Trên trang thật, đăng ký nhắc với email của bạn: dòng mới xuất hiện ở `ThamGia` và có email chào mừng.
   - Mở link "Hủy nhận email" trong email: cột `huy_nhan_email` chuyển thành TRUE.

## Email nào gửi khi nào

| Email | Thời điểm | Ghi chú |
|---|---|---|
| Chào mừng | Ngay khi đăng ký | 1 lần cho mỗi email, tối đa 40 email chào mỗi giờ (chống spam) |
| Ngày 7 | 08:00 sáng Ngày 7 của người đó | Chỉ với chặng 14 ngày |
| Tổng kết | 08:00 sáng Ngày 14 (hoặc Ngày 7 nếu chặng rút gọn) | |

- Ngày được tính theo **ngày bắt đầu riêng của từng người**. Ai đăng ký email trước rồi mới bấm bắt đầu, trang tự gửi ngày bắt đầu lên sau.
- Nếu hôm đó hết hạn mức gửi, email đi vào sáng hôm sau, trễ tối đa 2 ngày. Trễ hơn thì bỏ qua để không gửi lạc thời điểm.
- Mọi email ngừng gửi sau **31/10/2026**.
- Link trong email có UTM (`utm_source=email`) nên GA4 tính đúng lượt quay lại từ email.

## Giới hạn cần biết

- **Gmail cá nhân gửi được 100 người nhận/ngày** qua Apps Script, Google Workspace 1.500/ngày ([Google quotas](https://developers.google.com/apps-script/guides/services/quotas)). Nếu dự kiến hơn khoảng 80 người đăng ký mỗi ngày, dùng tài khoản Workspace hoặc chuyển email nhắc sang Benchmark.
- `CAMPAIGN_KEY` chỉ để chặn bot ngẫu nhiên, **không phải mật khẩu** (ai xem mã trang cũng thấy). Script còn giới hạn 20 lần gửi / 10 phút cho mỗi mã người dùng, cắt độ dài mọi trường, và vô hiệu hóa công thức (`=...`) người dùng gõ vào.

## Vận hành trong chiến dịch

- **Duyệt câu chia sẻ:** ở trang tính `ChiaSe`, gõ `TRUE` vào cột `duyet` cho câu muốn đăng.
- **Đưa danh sách sang Benchmark:** `TraiNghiemSom` và `ThamGia` → Tệp → Tải xuống → CSV. Chỉ lấy dòng `huy_nhan_email` khác TRUE.
- **Sửa code sau khi đã triển khai:** Triển khai → Quản lý bản triển khai → Chỉnh sửa → Phiên bản mới. URL giữ nguyên, không phải sửa website.
- **Sau khi dự án kết thúc** (ví dụ 31/12/2026): xóa Sheet hoặc xóa cột email, đúng như đã hứa "chỉ dùng để gửi nhắc nhở và cải thiện dự án".

## Kiểm thử không cần tài khoản Google

`npm run test:apps-script` chạy 11 bài kiểm tra trên bản giả lập Sheet/Gmail: lưu một dòng mỗi email, từ chối khi thiếu đồng ý, công thức bị vô hiệu, email Ngày 7 và tổng kết đúng ngày và không gửi trùng, hủy nhận hoạt động và link giả không có tác dụng, hết hạn mức thì chờ, chặn gửi dồn dập.
