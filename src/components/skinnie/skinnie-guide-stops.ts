/**
 * Where Skinnie rests beside each section (desktop) and what it says there.
 * `y` is the vertical centre as a fraction of the viewport height.
 */
import type { ChallengeState } from "@/lib/challenge-storage";

export type GuideStopId =
  | "hero"
  | "lich"
  | "cach-choi"
  | "nhac-nho"
  | "tuong-chia-se"
  | "rieng-tu"
  | "hoi-dap"
  | "trai-nghiem-som";

interface GuideContext {
  state: ChallengeState;
  currentDay: number | null;
}

interface GuideStop {
  side: "left" | "right";
  y: number;
  hidden?: boolean;
  message: (context: GuideContext) => string;
}

function calendarMessage({ state, currentDay }: GuideContext): string {
  if (!state.startDate || !state.programLength || currentDay === null) return "Bấm ô Ngày 1 để bắt đầu nhé. 30 giây thôi!";
  if (currentDay > state.programLength) return "Bạn đi hết chặng rồi. Bấm từng ô để xem lại nhé.";
  if (state.entries[currentDay]) return "Hôm nay xong rồi. Mai gặp lại nhé!";
  return "Ô hôm nay đang sáng đó. Mở thử đi!";
}

export const GUIDE_STOPS: Record<GuideStopId, GuideStop> = {
  hero: { side: "right", y: 0.3, hidden: true, message: () => "" },
  lich: { side: "right", y: 0.42, message: calendarMessage },
  // Colour blocks with a big Skinnie of their own: the small guide steps aside.
  "cach-choi": { side: "left", y: 0.4, hidden: true, message: () => "" },
  "nhac-nho": { side: "left", y: 0.66, hidden: true, message: () => "" },
  "tuong-chia-se": { side: "right", y: 0.28, message: () => "Sau 14 ngày, câu của bạn cũng có thể ở đây." },
  "rieng-tu": { side: "right", y: 0.5, message: () => "Ảnh của bạn ở yên trong điện thoại. Mình hứa." },
  "hoi-dap": { side: "left", y: 0.72, message: () => "Còn thắc mắc gì không? Mình gom sẵn ở đây." },
  "trai-nghiem-som": { side: "right", y: 0.5, hidden: true, message: () => "" },
};
