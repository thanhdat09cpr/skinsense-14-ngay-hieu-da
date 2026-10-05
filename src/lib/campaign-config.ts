/**
 * Campaign constants for #14NgayHieuDa.
 * Dates are plain ISO strings (YYYY-MM-DD) in Vietnam local time.
 */

export const SITE_URL = "https://skinsense-ai-coral.vercel.app";
export const PAGE_PATH = "/14-ngay-hieu-da";
export const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

/**
 * Files in /public live under the basePath (next.config.ts), and next/image
 * needs that prefix spelled out: always reference them through asset().
 */
export const asset = (path: string) => `${PAGE_PATH}${path}`;

/** Apps Script web-app URL. While it is a placeholder, payloads go to the console. */
export const SHEET_ENDPOINT = "DAN_URL_APPS_SCRIPT";
/** Sent with every row; the Apps Script rejects rows without it. Filters stray bots, not a secret. */
export const CAMPAIGN_KEY = "14ngay-2026";
/** GA4 measurement id, same as the main website. Placeholder logs events to the console. */
export const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

export const CAMPAIGN_DATES = {
  /** First day anyone can press "Bắt đầu Ngày 1". */
  opensOn: "2026-10-06",
  /** Last start date that still fits a full 14-day run before dataEnd. */
  fullProgramLastStart: "2026-10-17",
  /** Last start date for the 7-day short run. */
  shortProgramLastStart: "2026-10-24",
  /** Final day of data collection for the project report. */
  dataEnd: "2026-10-30",
  womensDay: "2026-10-20",
  halloweenStart: "2026-10-27",
  halloweenEnd: "2026-10-31",
} as const;

export const SITE_LINKS = {
  demo: `${SITE_URL}/demo`,
  privacy: `${SITE_URL}/quyen-rieng-tu`,
  about: `${SITE_URL}/ve-chung-toi`,
  articles: `${SITE_URL}/bai-viet`,
} as const;

export const HASHTAG = "#14NgayHieuDa";

export type ProgramLength = 14 | 7;
