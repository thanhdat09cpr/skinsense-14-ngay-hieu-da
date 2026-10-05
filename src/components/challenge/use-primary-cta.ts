"use client";

/**
 * One label per intent: header, hero and calendar all show the same primary
 * action, derived from where the participant is in their run.
 */
import { formatDayMonth } from "@/lib/date-utils";
import { useChallenge } from "./challenge-provider";

export interface PrimaryCta {
  label: string;
  onClick: () => void;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function usePrimaryCta(): PrimaryCta {
  const { ready, state, availability, currentDay, isDemo, startChallenge, openDay, say } = useChallenge();

  if (!ready) return { label: "Bắt đầu Ngày 1", onClick: () => scrollToSection("lich") };

  if (state.startDate && state.programLength && currentDay !== null) {
    if (currentDay > state.programLength) {
      return { label: "Xem lại hành trình", onClick: () => openDay(state.programLength ?? 14) };
    }
    if (!state.entries[currentDay]) return { label: "Mở ô hôm nay", onClick: () => openDay(currentDay) };
    return { label: "Xem lịch của bạn", onClick: () => scrollToSection("lich") };
  }

  if (isDemo || availability.kind === "open") return { label: "Bắt đầu Ngày 1", onClick: startChallenge };

  if (availability.kind === "not-open") {
    return {
      label: `Mở vào ${formatDayMonth(availability.opensOn)}`,
      onClick: () => {
        scrollToSection("nhac-nho");
        say(`Thử thách mở ngày ${formatDayMonth(availability.opensOn)}. Để lại email, mình báo bạn nhé.`);
      },
    };
  }

  return { label: "Nhận tin đợt sau", onClick: () => scrollToSection("nhac-nho") };
}
