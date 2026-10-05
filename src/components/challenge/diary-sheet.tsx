"use client";

/**
 * Modal that "flips open" like a page torn from a desk calendar (rotating down
 * from its top edge). Routes to the diary form, the Day 7 / final reviews, the
 * reminder sign-up after Day 1, or a shared event tile.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckCircleIcon, XIcon } from "@phosphor-icons/react";
import { EVENT_TILES } from "@/lib/event-tile-content";
import { getDayContent } from "@/lib/challenge-day-content";
import { addDays, formatDayMonth } from "@/lib/date-utils";
import { currentDayNumber, isCheckpointDay, isFinalDay } from "@/lib/challenge-rules";
import { quietButton } from "@/components/ui/button-styles";
import { useChallenge, type SheetTarget } from "./challenge-provider";
import { CheckpointReview } from "./checkpoint-review";
import { DiaryEntryForm } from "./diary-entry-form";
import { EventTilePanel } from "./event-tile-panel";
import { FinalReview } from "./final-review";
import { JoinReminderForm } from "./join-reminder-form";

export function DiarySheet() {
  const { sheet, closeSheet } = useChallenge();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeSheet();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheet, closeSheet]);

  return (
    <AnimatePresence>
      {sheet && (
        <motion.div
          key="sheet-backdrop"
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/45 backdrop-blur-sm sm:items-center sm:p-6 print:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSheet}
          style={{ perspective: 1400 }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={sheetTitle(sheet)}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            className="perforated-top relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[20px] bg-paper-raised px-5 pb-8 pt-9 outline-none soft-shadow sm:max-w-xl sm:rounded-[20px] sm:px-8"
            style={{ transformOrigin: "top center" }}
            initial={reduce ? { opacity: 0 } : { rotateX: -78, opacity: 0, y: -20 }}
            animate={reduce ? { opacity: 1 } : { rotateX: 0, opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { rotateX: 60, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
          >
            <button type="button" onClick={closeSheet} aria-label="Đóng" className="absolute right-4 top-6 grid size-10 place-items-center rounded-full text-ink-strong hover:bg-mint">
              <XIcon weight="bold" className="size-5" />
            </button>
            {sheet.kind === "event" ? <EventSheetBody id={sheet.id} /> : <DaySheetBody key={sheet.day} day={sheet.day} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function sheetTitle(sheet: NonNullable<SheetTarget>): string {
  if (sheet.kind === "day") return `Ngày ${sheet.day}`;
  return EVENT_TILES.find((tile) => tile.id === sheet.id)?.title ?? "Ô sự kiện";
}

function EventSheetBody({ id }: { id: (typeof EVENT_TILES)[number]["id"] }) {
  const tile = EVENT_TILES.find((item) => item.id === id);
  return (
    <>
      <p className="font-mono text-sm font-semibold text-accent-text">{tile?.dateLabel}</p>
      <h2 className="mb-6 mt-1 pr-10 text-3xl font-extrabold tracking-tight text-ink-strong">{tile?.title}</h2>
      <EventTilePanel id={id} />
    </>
  );
}

type Phase = "form" | "join" | "review" | "saved";

function DaySheetBody({ day }: { day: number }) {
  const { state, today, isDemo, skipJoin } = useChallenge();
  const length = state.programLength ?? 14;
  const start = state.startDate ?? today;
  const logged = Boolean(state.entries[day]);
  const isMilestone = isCheckpointDay(day, length) || isFinalDay(day, length);
  const editable = isDemo || currentDayNumber(start, today) === day;
  const [phase, setPhase] = useState<Phase>(logged && isMilestone ? "review" : "form");

  const afterSave = () => {
    if (day === 1 && !state.joinPromptHandled) setPhase("join");
    else if (isMilestone) setPhase("review");
    else setPhase("saved");
  };

  return (
    <>
      <p className="font-mono text-sm font-semibold text-accent-text">{formatDayMonth(addDays(start, day - 1))}</p>
      <h2 className="mt-1 pr-10 text-3xl font-extrabold tracking-tight text-ink-strong sm:text-4xl">
        Ngày {day}
        <span className="ml-3 text-lg font-semibold text-ink-soft">{getDayContent(day, length).tileLabel}</span>
      </h2>
      <div className="mt-6">
        {phase === "form" && <DiaryEntryForm day={day} programLength={length} editable={editable} onSaved={afterSave} />}
        {phase === "join" && (
          <div className="flex flex-col gap-5">
            <SavedStamp text="Đã lưu Ngày 1. Mở đầu suôn sẻ!" />
            <div>
              <p className="text-xl font-bold text-ink-strong">Nhắc mình Ngày 7 nhé?</p>
              <p className="mt-1 text-sm text-ink-soft">Không để lại email vẫn chơi bình thường.</p>
            </div>
            <JoinReminderForm
              onSkip={() => {
                skipJoin();
                setPhase("saved");
              }}
            />
          </div>
        )}
        {phase === "review" && (isFinalDay(day, length) ? <FinalReview /> : <CheckpointReview />)}
        {phase === "saved" && <SavedPanel day={day} />}
      </div>
    </>
  );
}

function SavedStamp({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="flex items-center gap-3 text-ink-strong"
      initial={reduce ? false : { scale: 1.4, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 18 }}
    >
      <CheckCircleIcon weight="fill" className="size-10 text-done" />
      <p className="text-lg font-bold">{text}</p>
    </motion.div>
  );
}

function SavedPanel({ day }: { day: number }) {
  const { state, closeSheet } = useChallenge();
  const length = state.programLength ?? 14;
  const next = day + 1;
  return (
    <div className="flex flex-col gap-5">
      <SavedStamp text={`Đã lưu Ngày ${day}.`} />
      <p className="text-[15px] leading-relaxed text-ink-soft">
        {next <= length ? `Ô Ngày ${next} mở vào ngày mai. Skinnie đợi bạn nhé.` : "Bạn đã đi hết chặng."}
      </p>
      <button type="button" onClick={closeSheet} className={`${quietButton} self-start border border-line`}>
        Về lịch
      </button>
    </div>
  );
}
