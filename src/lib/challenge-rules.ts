/**
 * Pure rules for the personal 14-day calendar: who can start, which program
 * they get, and what state each tile is in. No React, no storage.
 */
import { CAMPAIGN_DATES, type ProgramLength } from "./campaign-config";
import { addDays, diffDays, formatDayMonth, isWithin } from "./date-utils";
import type { EventTile } from "./event-tile-content";

export type StartAvailability =
  | { kind: "not-open"; opensOn: string }
  | { kind: "open"; programLength: ProgramLength; finishOn: string }
  | { kind: "closed" };

/**
 * 14 days if starting by 17/10, the 7-day short run until 24/10, closed after.
 * Keeps every run finishing on or before the 30/10 data deadline.
 */
export function startAvailability(today: string): StartAvailability {
  if (today < CAMPAIGN_DATES.opensOn) return { kind: "not-open", opensOn: CAMPAIGN_DATES.opensOn };
  if (today <= CAMPAIGN_DATES.fullProgramLastStart) {
    return { kind: "open", programLength: 14, finishOn: addDays(today, 13) };
  }
  if (today <= CAMPAIGN_DATES.shortProgramLastStart) {
    return { kind: "open", programLength: 7, finishOn: addDays(today, 6) };
  }
  return { kind: "closed" };
}

/** 1-based day number of `today` within a run that began on `startDate`. */
export function currentDayNumber(startDate: string, today: string): number {
  return diffDays(startDate, today) + 1;
}

/** Day 7 is a mid-run checkpoint only on the 14-day program. */
export function isCheckpointDay(day: number, programLength: ProgramLength): boolean {
  return programLength === 14 && day === 7;
}

export function isFinalDay(day: number, programLength: ProgramLength): boolean {
  return day === programLength;
}

export type TileStatus = "done" | "today" | "missed" | "locked";

export interface TileView {
  status: TileStatus;
  /** Human label for locked tiles: "Mở vào ngày mai" or "Mở vào dd/mm". */
  unlockLabel?: string;
  /** Compact form for small tiles: "Ngày mai" or "dd/mm". */
  unlockShort?: string;
}

export function tileView(params: {
  day: number;
  startDate: string;
  today: string;
  isLogged: boolean;
  unlockAll: boolean;
}): TileView {
  const { day, startDate, today, isLogged, unlockAll } = params;
  if (isLogged) return { status: "done" };
  const current = currentDayNumber(startDate, today);
  if (day === current || unlockAll) return { status: "today" };
  if (day < current) return { status: "missed" };
  const unlockOn = addDays(startDate, day - 1);
  const isTomorrow = day === current + 1;
  return {
    status: "locked",
    unlockLabel: isTomorrow ? "Mở vào ngày mai" : `Mở vào ${formatDayMonth(unlockOn)}`,
    unlockShort: isTomorrow ? "Ngày mai" : formatDayMonth(unlockOn),
  };
}

export type EventTheme = "womens-day" | "halloween" | null;

export function activeEventTheme(today: string): EventTheme {
  if (today === CAMPAIGN_DATES.womensDay) return "womens-day";
  if (isWithin(today, CAMPAIGN_DATES.halloweenStart, CAMPAIGN_DATES.halloweenEnd)) return "halloween";
  return null;
}

export function eventTileOpen(tile: EventTile, today: string, unlockAll: boolean): boolean {
  return unlockAll || isWithin(today, tile.opensOn, tile.closesOn);
}
