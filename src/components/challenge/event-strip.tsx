"use client";

import { CheckIcon, LockSimpleIcon } from "@phosphor-icons/react";
import { EVENT_TILES } from "@/lib/event-tile-content";
import { eventTileOpen } from "@/lib/challenge-rules";
import { useChallenge } from "./challenge-provider";

/**
 * Shared-calendar tiles (20/10, Halloween). Kept on their own strip so they
 * never get confused with the participant's personal Day 1..14.
 */
export function EventStrip() {
  const { today, isDemo, state, openEvent } = useChallenge();

  return (
    <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 sm:gap-3">
      {EVENT_TILES.map((tile) => {
        const open = Boolean(today) && eventTileOpen(tile, today, isDemo);
        const complete = (state.eventChecks[tile.id]?.length ?? 0) >= tile.checklist.length;
        const accent = tile.id === "womens-day" ? "text-[#b8455f] dark:text-[#e28ca0]" : "text-accent-text";
        return (
          <button
            key={tile.id}
            type="button"
            onClick={() => openEvent(tile.id)}
            className={`flex min-w-[148px] snap-start flex-col gap-1 rounded-[20px] border px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              open ? "border-accent bg-paper-raised hover:bg-mint" : "border-line border-dashed bg-transparent"
            }`}
          >
            <span className={`flex items-center gap-1.5 font-mono text-xs font-semibold ${open ? accent : "text-ink-soft"}`}>
              {!open && <LockSimpleIcon weight="bold" className="size-3" />}
              {complete && <CheckIcon weight="bold" className="size-3" />}
              {tile.dateLabel}
            </span>
            <span className={`text-sm font-semibold ${open ? "text-ink-strong" : "text-ink-soft"}`}>{tile.title}</span>
          </button>
        );
      })}
    </div>
  );
}
