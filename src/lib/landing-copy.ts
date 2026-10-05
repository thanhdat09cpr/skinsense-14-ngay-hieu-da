/**
 * Visible copy for the static sections. Voice: "SkinSense / tụi mình" talking
 * to "bạn", numbers over adjectives, no medical claims, no em dashes.
 */

/** Three illustrated steps; the artwork carries the section, copy stays short. */
export const HOW_IT_WORKS = [
  {
    marker: "Ngày 1",
    title: "Chụp một tấm ảnh làm mốc",
    body: "Cùng chỗ, cùng giờ, cùng ánh sáng. Chọn 1 đến 2 điều muốn theo dõi: dầu, mụn, đỏ da.",
    image: { src: "/images/scene-phone-window.jpg", alt: "Điện thoại dựng cạnh cửa sổ trong nắng sớm", width: 1400, height: 1050 },
  },
  {
    marker: "Mỗi ngày",
    title: "Mở một ô, ghi 3 chỉ số",
    body: "Độ dầu, mụn, cảm giác da và một dòng ghi chú. Khoảng 30 giây.",
    image: { src: "/images/scene-notebook-calendar.jpg", alt: "Cuốn sổ mở với lưới lịch 14 ô và bút dạ quang", width: 1400, height: 1050 },
  },
  {
    marker: "Ngày 7 và Ngày 14",
    title: "Nhìn lại làn da của chính bạn",
    body: "Biểu đồ của riêng bạn hiện ra, kèm thẻ hoàn thành để chia sẻ nếu muốn.",
    image: { src: "/skinnie/skinnie-cheer.png", alt: "Skinnie giơ tay ăn mừng", width: 765, height: 900 },
  },
] as const;

/** Illustrative only: the wall is labelled "Câu minh họa" until real, approved quotes exist. */
export const SAMPLE_SHARES = [
  {
    quote: "Mình tưởng da dầu nhất vào buổi trưa. Ghi lại mới thấy là những hôm ngủ ít.",
    name: "Ngọc Hân",
    role: "sinh viên năm 3",
  },
  {
    quote: "Ngày nóng ẩm và ngày ngồi phòng lạnh, cảm giác da khác nhau rõ. Trước giờ mình không để ý.",
    name: "Minh Khoa",
    role: "nhân viên văn phòng",
  },
  {
    quote: "Chụp cùng chỗ, cùng giờ khó hơn mình nghĩ. Nhưng nhờ vậy ảnh Ngày 1 và Ngày 14 mới so được.",
    name: "Bảo Trân",
    role: "sinh viên năm 2",
  },
] as const;

export const PRIVACY_PROMISES = [
  { icon: "camera", text: "Ảnh da của bạn ở lại trên máy bạn. Ảnh thêm vào nhật ký chỉ lưu trong trình duyệt, không gửi đi đâu." },
  { icon: "notebook", text: "Nhật ký lưu trên trình duyệt của bạn. Bấm Xóa dữ liệu là xóa hết." },
  {
    icon: "envelope",
    text: "Tụi mình chỉ nhận tên gọi, email và câu trả lời khảo sát khi bạn đồng ý, để gửi nhắc nhở và cải thiện dự án.",
  },
] as const;

export const FAQ_ITEMS = [
  { q: "Có mất phí không?", a: "Hoàn toàn miễn phí." },
  { q: "Có phải đổi routine không?", a: "Không. Bạn giữ nguyên routine, chỉ ghi lại." },
  {
    q: "Có cần đăng ảnh không?",
    a: "Không. Bạn có thể thêm ảnh vào nhật ký để tự so sánh, ảnh chỉ lưu trên máy bạn. Nếu muốn chia sẻ hành trình, bạn có thể đăng story với #14NgayHieuDa, không cần lộ mặt.",
  },
  { q: "Bỏ lỡ một ngày thì sao?", a: "Không sao, mở ô hôm nay và ghi tiếp." },
  {
    q: "Bắt đầu muộn thì sao?",
    a: "Bắt đầu đến hết 17/10, bạn đi đủ 14 ngày. Từ 18/10 đến 24/10, thử thách rút gọn còn 7 ngày để kịp tổng kết trước cuối tháng.",
  },
  {
    q: "Dữ liệu của tôi đi đâu?",
    a: "Nhật ký và ảnh lưu trên trình duyệt của bạn, không gửi đi. Tên gọi, email, câu trả lời khảo sát chỉ gửi khi bạn đồng ý.",
  },
  {
    q: "SkinSense AI là gì?",
    a: "Ý tưởng thiết bị soi da cá nhân kết hợp ứng dụng, giúp ghi nhận da trong điều kiện ổn định và theo dõi thay đổi theo thời gian. Đang phát triển, không thay thế bác sĩ da liễu.",
  },
] as const;

export const CONSENT_LABELS = {
  email: "Tôi đồng ý nhận email nhắc nhở Ngày 7, Ngày 14 và thông tin từ SkinSense AI. Có thể hủy bất cứ lúc nào.",
  survey: "Tôi đồng ý để câu trả lời khảo sát của mình được dùng ẩn danh cho nghiên cứu của dự án.",
  share: "Tôi đồng ý để câu chia sẻ của mình được đăng ẩn danh trên trang này.",
} as const;

export const SURVEY = {
  checkpoint: "Đến giờ, thử thách có ích với bạn không?",
  learned: "Sau 14 ngày, bạn hiểu thêm điều gì về làn da mình?",
  wantDevice: "Bạn có muốn dùng thử một thiết bị giúp theo dõi việc này chính xác hơn không?",
  wantDeviceOptions: ["Có", "Có thể", "Không"],
  price: "Mức giá nào bạn thấy hợp lý cho một thiết bị như vậy?",
  priceOptions: ["Dưới 1 triệu", "1 đến 1,5 triệu", "1,5 đến 2 triệu", "2 đến 2,5 triệu", "Trên 2,5 triệu"],
} as const;
