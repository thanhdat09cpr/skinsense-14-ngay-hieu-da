/**
 * `?demo=1` lets the team and lecturer see every tile. The data below is
 * clearly illustrative and is never written to localStorage.
 */
import { addDays } from "./date-utils";
import { createEmptyState, type ChallengeState, type DiaryEntry } from "./challenge-storage";

const SAMPLE_ROWS: Array<[number, number, number, string]> = [
  [4, 3, 3, "Chụp 7h sáng cạnh cửa sổ."],
  [4, 3, 3, "Hôm qua ngủ trễ."],
  [3, 3, 4, "Chụp lại đúng 7h."],
  [3, 4, 3, "Ngủ 5 tiếng, sáng dậy da bóng hơn."],
  [3, 3, 3, "Đổi sang sữa rửa mặt mới từ hôm nay."],
  [3, 3, 4, "Xem lại ảnh Ngày 1."],
  [3, 2, 4, "Tuần đầu, da dịu hơn mình nghĩ."],
  [4, 2, 3, "Trời nóng ẩm cả ngày."],
  [3, 2, 4, "Đi nắng buổi trưa."],
  [3, 2, 4, "Tò mò vì sao chiều nào cũng bóng dầu."],
  [2, 2, 4, "Chụp thêm góc nghiêng."],
  [2, 2, 5, "Xem lại ghi chú cả tuần."],
  [2, 1, 5, "Còn 1 ngày."],
];

export function buildDemoState(today: string): ChallengeState {
  const startDate = addDays(today, -13);
  const entries: Record<number, DiaryEntry> = {};
  SAMPLE_ROWS.forEach(([oil, acne, feel, note], index) => {
    entries[index + 1] = { oil, acne, feel, note, savedAt: addDays(startDate, index) };
  });
  return {
    ...createEmptyState(),
    startDate,
    programLength: 14,
    entries,
    dayOneExtras: { targets: ["Độ dầu", "Mụn"], source: "TikTok" },
    joinPromptHandled: true,
    checkpointSurvey: { useful: 4 },
  };
}
