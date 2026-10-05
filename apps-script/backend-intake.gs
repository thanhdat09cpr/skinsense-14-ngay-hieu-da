/**
 * #14NgayHieuDa backend, part 1 of 2: receives rows from the landing page and
 * stores them in this Google Sheet. Setup steps: docs/apps-script-setup.md.
 *
 * What lands here, and only with the matching consent ticked on the page:
 * - ThamGia: name + email for reminder emails (email consent).
 * - TraiNghiemSom: emails for SkinSense early access.
 * - KhaoSat: survey answers, keyed by a survey id that is NOT linked to any email.
 * - ChiaSe: quotes offered for the share wall, shown only after "duyet" is TRUE.
 * Diary entries and photos never reach this script.
 */

/** Must match CAMPAIGN_KEY in src/lib/campaign-config.ts. Filters stray bots; it is not a secret. */
const CAMPAIGN_KEY = '14ngay-2026';
const TIMEZONE = 'Asia/Ho_Chi_Minh';
const PAGE_URL = 'https://skinsense-ai-coral.vercel.app/14-ngay-hieu-da';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SHEETS = {
  join: {
    name: 'ThamGia',
    headers: ['email', 'ten_goi', 'ma_nguoi_tham_gia', 'ngay_bat_dau', 'so_ngay', 'dong_y_email', 'dong_y_khao_sat', 'dong_y_chia_se',
      'tao_luc', 'cap_nhat_luc', 'da_gui_chao', 'da_gui_ngay_7', 'da_gui_tong_ket', 'huy_nhan_email'],
  },
  early: { name: 'TraiNghiemSom', headers: ['email', 'ma_nguoi_tham_gia', 'tao_luc'] },
  survey: {
    name: 'KhaoSat',
    headers: ['thoi_gian', 'ma_khao_sat', 'ngay', 'muc_tieu_theo_doi', 'biet_tu_dau', 'utm', 'so_ngay', 'muc_huu_ich', 'hieu_them_dieu_gi', 'muon_dung_thu', 'muc_gia'],
  },
  share: { name: 'ChiaSe', headers: ['thoi_gian', 'ma_khao_sat', 'ngay', 'cau_chia_se', 'duyet'] },
};

/** Column positions (0-based) in ThamGia, shared with the reminder file. */
const COL = { email: 0, name: 1, pid: 2, start: 3, length: 4, consentEmail: 5, consentSurvey: 6, consentShare: 7, created: 8, updated: 9, sentWelcome: 10, sentDay7: 11, sentFinal: 12, unsubscribed: 13 };

function doPost(e) {
  let body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'bad_json' });
  }
  if (body.key !== CAMPAIGN_KEY) return json_({ ok: false, error: 'bad_key' });
  const pid = clean_(body.pid, 64);
  if (!pid || !withinRateLimit_('post:' + pid, 20, 600)) return json_({ ok: false, error: 'rate_limited' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    return json_(route_(String(body.type || ''), pid, body.day, body.payload || {}));
  } finally {
    lock.releaseLock();
  }
}

function route_(type, pid, day, payload) {
  if (type === 'join' && payload.intent === 'early_access') return saveEarlyAccess_(pid, payload);
  if (type === 'join') return upsertParticipant_(pid, payload);
  if (type === 'survey') return saveSurvey_(pid, day, payload);
  if (type === 'share') return saveShare_(pid, day, payload);
  return { ok: false, error: 'unknown_type' };
}

/** One row per email. A second sign-up (or starting the run later) updates the same row. */
function upsertParticipant_(pid, p) {
  const email = clean_(p.email, 120).toLowerCase();
  const consents = p.consents || {};
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: 'bad_email' };
  if (consents.email !== true) return { ok: false, error: 'no_email_consent' };

  const sh = sheet_('join');
  const now = new Date();
  const startDate = isIsoDate_(p.startDate) ? p.startDate : '';
  const length = p.programLength === 7 || p.programLength === 14 ? p.programLength : '';
  const rowIndex = findRow_(sh, COL.email, email);

  if (rowIndex === -1) {
    sh.appendRow(sanitizeRow_([email, clean_(p.name, 40), pid, startDate, length, true, consents.survey === true, consents.share === true,
      now, now, false, false, false, false]));
    sendWelcomeIfAllowed_(sh, sh.getLastRow());
    return { ok: true, created: true };
  }

  const width = SHEETS.join.headers.length;
  const row = sh.getRange(rowIndex, 1, 1, width).getValues()[0];
  if (p.name) row[COL.name] = clean_(p.name, 40);
  row[COL.pid] = pid;
  if (startDate) {
    row[COL.start] = startDate;
    row[COL.length] = length || row[COL.length];
  }
  row[COL.consentSurvey] = consents.survey === true || row[COL.consentSurvey] === true;
  row[COL.consentShare] = consents.share === true || row[COL.consentShare] === true;
  row[COL.updated] = now;
  row[COL.unsubscribed] = false; // Signing up again with the email box ticked means "send me emails".
  sh.getRange(rowIndex, 1, 1, width).setValues([sanitizeRow_(row)]);
  return { ok: true, created: false };
}

function saveEarlyAccess_(pid, p) {
  const email = clean_(p.email, 120).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: 'bad_email' };
  const sh = sheet_('early');
  if (findRow_(sh, 0, email) === -1) sh.appendRow(sanitizeRow_([email, pid, new Date()]));
  return { ok: true };
}

function saveSurvey_(surveyId, day, p) {
  const dayNumber = Number(day);
  if (!(dayNumber >= 1 && dayNumber <= 14)) return { ok: false, error: 'bad_day' };
  const targets = Array.isArray(p.targets) ? p.targets.slice(0, 4).map(function (t) { return clean_(t, 40); }).join(', ') : '';
  sheet_('survey').appendRow(sanitizeRow_([
    new Date(), surveyId, dayNumber, targets, clean_(p.source, 30), p.utm ? clean_(JSON.stringify(p.utm), 400) : '',
    p.programLength === 7 || p.programLength === 14 ? p.programLength : '',
    Number(p.useful) >= 1 && Number(p.useful) <= 5 ? Number(p.useful) : '',
    clean_(p.learned, 280), clean_(p.wantDevice, 20), clean_(p.price, 30),
  ]));
  return { ok: true };
}

function saveShare_(surveyId, day, p) {
  const text = clean_(p.text, 280);
  if (!text) return { ok: false, error: 'empty' };
  sheet_('share').appendRow(sanitizeRow_([new Date(), surveyId, Number(day) || '', text, '']));
  return { ok: true };
}

/* ---------- Helpers shared with backend-reminder-emails.gs ---------- */

function sheet_(key) {
  const def = SHEETS[key];
  const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const ss = sheetId ? SpreadsheetApp.openById(sheetId) : SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(def.name);
  if (!sh) {
    sh = ss.insertSheet(def.name);
    sh.appendRow(def.headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

/** 1-based row number whose column `col` (0-based) equals `value`, or -1. */
function findRow_(sh, col, value) {
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][col]).toLowerCase() === value) return i + 1;
  }
  return -1;
}

function clean_(value, maxLength) {
  if (value === undefined || value === null) return '';
  return String(value).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, maxLength);
}

/** Stops typed text such as "=IMPORTXML(...)" from running as a formula when the sheet is opened. */
function sanitizeRow_(row) {
  return row.map(function (cell) {
    return typeof cell === 'string' && /^[=+\-@]/.test(cell) ? "'" + cell : cell;
  });
}

function withinRateLimit_(key, max, seconds) {
  const cache = CacheService.getScriptCache();
  const count = Number(cache.get(key) || 0);
  if (count >= max) return false;
  cache.put(key, String(count + 1), seconds);
  return true;
}

function isIsoDate_(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** Sheets may turn "2026-10-08" into a Date; normalise either back to YYYY-MM-DD. */
function toIso_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, TIMEZONE, 'yyyy-MM-dd');
  return isIsoDate_(String(value)) ? String(value) : '';
}

function todayIso_() {
  return Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd');
}

function diffDays_(fromIso, toIsoDate) {
  return Math.round((Date.parse(toIsoDate + 'T00:00:00Z') - Date.parse(fromIso + 'T00:00:00Z')) / 86400000);
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
