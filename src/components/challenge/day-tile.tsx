"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckIcon, LockSimpleIcon } from "@phosphor-icons/react";
import type { TileView } from "@/lib/challenge-rules";

interface DayTileProps {
  day: number;
  label: string;
  view: TileView | "preview-start" | "preview";
  wide: boolean;
  onOpen: () => void;
}

/**
 * One calendar square. Only today's tile "breathes"; everything else is still
 * so the eye goes straight to the one action that matters.
 */
export function DayTile({ day, label, view, wide, onOpen }: DayTileProps) {
  const reduce = useReducedMotion();
  const status = typeof view === "string" ? view : view.status;
  const isToday = status === "today" || status === "preview-start";
  const isDone = status === "done";

  const tone = isToday
    ? "bg-accent text-on-accent border-transparent outline-4 outline-offset-2 outline-highlight"
    : isDone
      ? "bg-done-soft text-ink-strong border-transparent"
      : status === "missed"
        ? "bg-transparent text-ink-soft border-dashed border-line"
        : "bg-paper-raised text-ink-strong border-line";

  const caption =
    status === "preview-start"
      ? "Bắt đầu"
      : status === "today"
        ? "Hôm nay"
        : status === "missed"
          ? "Đã qua"
          : status === "locked" && typeof view !== "string"
            ? view.unlockShort
            : label;

  const showCaptionOnPhone = wide || (status !== "done" && status !== "preview");

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] border p-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:p-3.5 ${wide ? "col-span-2" : ""} ${tone}`}
      style={{ transformPerspective: 600 }}
      whileHover={reduce || status === "locked" ? undefined : { y: -3 }}
      whileTap={reduce ? undefined : { rotateX: 18, scale: 0.97 }}
      animate={isToday && !reduce ? { scale: [1, 1.035, 1] } : undefined}
      transition={isToday ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className={`font-mono font-bold leading-none ${wide ? "text-3xl sm:text-4xl" : "text-xl sm:text-3xl"}`}>
        <span className="sr-only">Ngày </span>
        {String(day).padStart(2, "0")}
        {isDone && <span className="sr-only">, đã ghi</span>}
      </span>

      {isDone && (
        <motion.span
          className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-done text-white sm:right-3 sm:top-3 sm:size-8"
          initial={reduce ? false : { scale: 1.8, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 16 }}
        >
          <CheckIcon weight="bold" className="size-3.5 sm:size-4" />
        </motion.span>
      )}

      <span className="flex min-w-0 items-center gap-1 text-[11px] font-medium leading-tight sm:text-[13px]">
        {status === "locked" && <LockSimpleIcon weight="bold" className="size-3 shrink-0 opacity-70" />}
        {/* Small phone tiles only fit short captions; topic labels show from sm up. */}
        {status === "locked" && <span className="sr-only">Mở vào </span>}
        <span className={`truncate ${showCaptionOnPhone ? "" : "max-sm:hidden"}`}>{caption}</span>
      </span>
    </motion.button>
  );
}
