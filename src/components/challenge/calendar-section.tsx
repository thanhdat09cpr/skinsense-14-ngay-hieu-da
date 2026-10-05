"use client";

import { CalendarPlusIcon } from "@phosphor-icons/react";
import { getDayContent } from "@/lib/challenge-day-content";
import { tileView } from "@/lib/challenge-rules";
import { addDays, formatDayMonth } from "@/lib/date-utils";
import { downloadReminderIcs } from "@/lib/calendar-reminder-ics";
import { quietButton } from "@/components/ui/button-styles";
import { useChallenge } from "./challenge-provider";
import { DayTile } from "./day-tile";
import { EventStrip } from "./event-strip";
import { ProgressRing } from "./progress-ring";

/** The heart of the page: a torn-calendar sheet with one tile per day. */
export function CalendarSection() {
  const { ready, state, today, availability, currentDay, isDemo, openDay } = useChallenge();
  const started = Boolean(state.startDate && state.programLength);
  const length = state.programLength ?? (availability.kind === "open" ? availability.programLength : 14);
  const loggedCount = Object.keys(state.entries).length;
  const canStart = isDemo || availability.kind === "open";

  return (
    <section id="lich" data-skinnie-stop="lich" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-8">
      <div className="perforated-top rounded-[20px] bg-paper-raised px-4 pb-6 pt-10 soft-shadow sm:px-8 sm:pb-8 sm:pt-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold leading-[1] tracking-tight text-ink-strong sm:text-6xl">Lịch của bạn</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              <CalendarStatusText />
            </p>
          </div>
          {started && ready && (
            <div className="flex items-center gap-4">
              <ProgressRing done={loggedCount} total={length} />
              <button
                type="button"
                className={quietButton}
                onClick={() => state.startDate && state.programLength && downloadReminderIcs(state.startDate, state.programLength)}
              >
                <CalendarPlusIcon weight="bold" className="size-4" />
                Thêm nhắc vào lịch
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <EventStrip />
        </div>

        <div className="mt-4 grid auto-rows-[84px] grid-cols-4 gap-2 sm:auto-rows-[112px] sm:gap-3 lg:auto-rows-[124px] lg:grid-cols-8">
          {Array.from({ length }, (_, index) => {
            const day = index + 1;
            const content = getDayContent(day, length);
            const view =
              started && state.startDate && ready && today
                ? tileView({ day, startDate: state.startDate, today, isLogged: Boolean(state.entries[day]), unlockAll: isDemo })
                : day === 1 && canStart
                  ? ("preview-start" as const)
                  : ("preview" as const);
            return (
              <DayTile
                key={day}
                day={day}
                label={content.tileLabel}
                view={view}
                wide={day === 7 || day === 14}
                onOpen={() => openDay(day)}
              />
            );
          })}
        </div>
        {!started && (
          <p className="mt-6 rounded-[20px] bg-mint px-5 py-3 text-sm leading-relaxed text-ink-strong">
            Bắt đầu đến hết <strong>17/10</strong> để đi đủ 14 ngày. Từ <strong>18/10</strong> đến <strong>24/10</strong>, thử thách rút gọn còn 7 ngày.
          </p>
        )}
        {started && currentDay !== null && currentDay > length && (
          <p className="mt-6 text-sm font-medium text-ink-soft">Bạn đã đi hết chặng. Bấm vào từng ô để xem lại.</p>
        )}
      </div>
    </section>
  );
}

function CalendarStatusText() {
  const { ready, state, availability } = useChallenge();
  if (!ready) return <>Bấm ô Ngày 1, hôm đó là Ngày 1 của riêng bạn.</>;
  if (state.startDate && state.programLength) {
    const finish = formatDayMonth(addDays(state.startDate, state.programLength - 1));
    return (
      <>
        Bạn bắt đầu ngày {formatDayMonth(state.startDate)}, về đích ngày {finish}. Bỏ lỡ một ngày cũng không sao, cứ ghi tiếp.
      </>
    );
  }
  if (availability.kind === "open") {
    const shortRun = availability.programLength === 7;
    return (
      <>
        Bấm ô Ngày 1, hôm đó là Ngày 1 của riêng bạn. Bắt đầu hôm nay, bạn hoàn thành vào {formatDayMonth(availability.finishOn)}.
        {shortRun && " Từ 18/10 thử thách rút gọn còn 7 ngày để kịp tổng kết trước cuối tháng."}
      </>
    );
  }
  if (availability.kind === "not-open") {
    return <>Thử thách mở ngày {formatDayMonth(availability.opensOn)}. Lưu trang lại, hoặc để lại email bên dưới để được báo.</>;
  }
  return <>Đợt này đã khép lại. Để lại email bên dưới để nhận tin đợt sau.</>;
}
