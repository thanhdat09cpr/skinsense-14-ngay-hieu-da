/**
 * Outbound data: GA4 events and consented rows for the Google Sheet.
 * While the endpoint / measurement id are placeholders, everything is logged
 * to the console instead of being sent (brief, phase A).
 */
import { CAMPAIGN_KEY, GA_MEASUREMENT_ID, SHEET_ENDPOINT } from "./campaign-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const isGaConfigured = /^G-[A-Z0-9]{6,}$/.test(GA_MEASUREMENT_ID) && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX";
const isSheetConfigured = SHEET_ENDPOINT.startsWith("https://");

export type GaEvent =
  | "challenge_start"
  | "join_submit"
  | "tile_open"
  | "diary_logged"
  | "day7_reached"
  | "day14_completed"
  | "survey_submit"
  | "share_card"
  | "print_template"
  | "early_access_click"
  | "demo_click";

export function trackEvent(name: GaEvent, params: Record<string, string | number | boolean> = {}): void {
  if (isGaConfigured && typeof window.gtag === "function") {
    window.gtag("event", name, params);
    return;
  }
  console.info("[GA4 chưa cấu hình]", name, params);
}

export type SheetRowType = "join" | "survey" | "share";

/**
 * Sends one row to the Apps Script web app. Callers must only call this for
 * data the participant consented to share.
 */
export function sendToSheet(type: SheetRowType, id: string, day: number | "", payload: Record<string, unknown>): void {
  const body = JSON.stringify({ key: CAMPAIGN_KEY, type, pid: id, day, payload });
  if (!isSheetConfigured) {
    console.info("[Google Sheet chưa cấu hình]", JSON.parse(body));
    return;
  }
  fetch(SHEET_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body,
    // Survives the tab closing right after a click, e.g. "Lưu" then leaving the page.
    keepalive: true,
  }).catch(() => {
    // no-cors gives no readable response; a network failure here is not user-facing.
  });
}

/** utm_* params from the landing URL, so the Day 1 row can be matched to a channel. */
export function readUtmParams(search: string): Record<string, string> | null {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.startsWith("utm_")) utm[key] = value.slice(0, 100);
  });
  return Object.keys(utm).length > 0 ? utm : null;
}
