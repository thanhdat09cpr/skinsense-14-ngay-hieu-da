/**
 * Participant state kept only in this browser (localStorage). Diary content
 * never leaves the device; see tracking.ts for what may be sent with consent.
 * Every storage access is wrapped: private mode or blocked storage must not
 * break the page.
 */
import type { ProgramLength } from "./campaign-config";
import type { EventTileId } from "./event-tile-content";

const STORAGE_KEY = "skinsense-14-ngay:v1";

export interface DiaryEntry {
  oil: number;
  acne: number;
  feel: number;
  note: string;
  savedAt: string;
}

export interface Consents {
  email: boolean;
  survey: boolean;
  share: boolean;
}

export interface FinalSurvey {
  learned: string;
  wantDevice: string;
  price: string;
}

export interface ChallengeState {
  version: 1;
  /** Joins the sign-up row only. */
  participantId: string;
  /** Separate id for survey rows so answers are not linked to an email. */
  surveyId: string;
  startDate: string | null;
  programLength: ProgramLength | null;
  entries: Record<number, DiaryEntry>;
  dayOneExtras: { targets: string[]; source: string | null } | null;
  consents: Consents;
  joined: { name: string; email: string } | null;
  joinPromptHandled: boolean;
  checkpointSurvey: { useful: number } | null;
  finalSurvey: FinalSurvey | null;
  eventChecks: Partial<Record<EventTileId, string[]>>;
  utm: Record<string, string> | null;
  /** Already left an email for SkinSense early access, so the popup stays away. */
  earlyAccess: boolean;
}

function randomId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function createEmptyState(): ChallengeState {
  return {
    version: 1,
    participantId: randomId(),
    surveyId: randomId(),
    startDate: null,
    programLength: null,
    entries: {},
    dayOneExtras: null,
    consents: { email: false, survey: false, share: false },
    joined: null,
    joinPromptHandled: false,
    checkpointSurvey: null,
    finalSurvey: null,
    eventChecks: {},
    utm: null,
    earlyAccess: false,
  };
}

export function loadState(): ChallengeState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();
    const parsed = JSON.parse(raw) as Partial<ChallengeState>;
    if (parsed.version !== 1) return createEmptyState();
    return { ...createEmptyState(), ...parsed };
  } catch {
    return createEmptyState();
  }
}

export function saveState(state: ChallengeState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage blocked or full: the session still works, it just will not persist.
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored or storage blocked; either way there is nothing left to clear.
  }
}
