/**
 * What each calendar tile asks for. Tips only talk about how to observe,
 * never medical advice (brief section 5).
 */

export interface DayContent {
  day: number;
  /** Short label shown on the tile itself. */
  tileLabel: string;
  task: string;
  tip?: string;
  /** Placeholder for the one-line note, nudging the day's extra question. */
  notePrompt: string;
}

export const DAY_CONTENT: DayContent[] = [
  {
    day: 1,
    tileLabel: "Mốc đầu tiên",
    task: "Chọn điều muốn theo dõi, chụp ảnh Ngày 1, ghi 3 chỉ số.",
    tip: "Tắt chế độ làm đẹp của camera trước khi chụp.",
    notePrompt: "Ghi giờ và chỗ bạn vừa chụp, mai chụp lại y vậy.",
  },
  {
    day: 2,
    tileLabel: "Ghi nhật ký",
    task: "Ghi nhật ký hôm nay.",
    tip: "Ghi luôn giờ chụp để mai chụp đúng giờ.",
    notePrompt: "Hôm nay da có gì khác hôm qua?",
  },
  {
    day: 3,
    tileLabel: "Chụp đúng giờ",
    task: "Chụp lại đúng giờ hôm qua.",
    tip: "Đánh dấu một chỗ cố định để đặt điện thoại.",
    notePrompt: "Bạn chụp lúc mấy giờ, ở đâu?",
  },
  {
    day: 4,
    tileLabel: "Giấc ngủ",
    task: "Ghi nhật ký, thêm một dòng về giấc ngủ đêm qua.",
    tip: "Không cần đúng, chỉ cần ghi thật.",
    notePrompt: "Đêm qua bạn ngủ mấy tiếng, ngủ có sâu không?",
  },
  {
    day: 5,
    tileLabel: "Đã dùng gì",
    task: "Ghi lại hôm nay bạn đã dùng những gì.",
    tip: "Khi bắt đầu một sản phẩm mới, ghi rõ ngày bắt đầu.",
    notePrompt: "Sữa rửa mặt, kem dưỡng, chống nắng...",
  },
  {
    day: 6,
    tileLabel: "Xem lại ảnh",
    task: "Ghi nhật ký, xem lại ảnh Ngày 1 nhưng chưa so.",
    tip: "So sánh chỉ có ý nghĩa khi cùng điều kiện chụp.",
    notePrompt: "Một dòng về hôm nay.",
  },
  {
    day: 7,
    tileLabel: "Nhìn lại 7 ngày",
    task: "Ghi nhật ký rồi nhìn lại biểu đồ 7 ngày đầu của bạn.",
    notePrompt: "Tuần này da bạn thế nào?",
  },
  {
    day: 8,
    tileLabel: "Thời tiết",
    task: "Ghi nhật ký, thêm một dòng về thời tiết.",
    tip: "Ngày nóng ẩm và ngày hanh khô có thể làm da cảm giác khác nhau.",
    notePrompt: "Hôm nay nóng, ẩm hay hanh khô?",
  },
  {
    day: 9,
    tileLabel: "Điều khác thường",
    task: "Ghi nhật ký, ghi một điều khác thường trong ngày.",
    notePrompt: "Thức khuya, đi nắng, đổi chỗ ở...",
  },
  {
    day: 10,
    tileLabel: "Điều tò mò",
    task: "Viết một câu: điều bạn tò mò nhất về da mình.",
    notePrompt: "Mình tò mò nhất là...",
  },
  {
    day: 11,
    tileLabel: "Góc chụp mới",
    task: "Ghi nhật ký, chụp thêm một góc khác.",
    notePrompt: "Bạn chụp thêm góc nào?",
  },
  {
    day: 12,
    tileLabel: "Ghi nhật ký",
    task: "Ghi nhật ký hôm nay.",
    tip: "Chuẩn bị cho tổng kết: xem lại ghi chú các ngày.",
    notePrompt: "Một dòng về hôm nay.",
  },
  {
    day: 13,
    tileLabel: "Còn 1 ngày",
    task: "Ghi nhật ký hôm nay.",
    tip: "Còn 1 ngày nữa.",
    notePrompt: "Một dòng về hôm nay.",
  },
  {
    day: 14,
    tileLabel: "Tổng kết",
    task: "Ghi nhật ký cuối cùng rồi xem lại cả 14 ngày.",
    notePrompt: "Điều bạn nhớ nhất trong 14 ngày qua?",
  },
];

/** Content for a tile, adapted when the participant is on the 7-day short run. */
export function getDayContent(day: number, programLength: 7 | 14): DayContent {
  const base = DAY_CONTENT[day - 1];
  if (programLength === 7 && day === 7) {
    return {
      ...base,
      tileLabel: "Tổng kết",
      task: "Ghi nhật ký cuối cùng rồi xem lại cả 7 ngày.",
      notePrompt: "Điều bạn nhớ nhất trong 7 ngày qua?",
    };
  }
  return base;
}

export const TRACKING_TARGETS = ["Độ dầu", "Mụn", "Đỏ da", "Phản ứng sau sản phẩm mới"] as const;
export const DISCOVERY_SOURCES = ["TikTok", "Facebook", "Instagram", "Email", "Bạn bè", "Khác"] as const;

export const DIARY_METRICS = [
  { key: "oil", label: "Độ dầu", low: "Khô ráo", high: "Rất dầu" },
  { key: "acne", label: "Mụn", low: "Không mụn", high: "Nhiều mụn" },
  { key: "feel", label: "Cảm giác da", low: "Rất khó chịu", high: "Rất dễ chịu" },
] as const;

export type MetricKey = (typeof DIARY_METRICS)[number]["key"];
