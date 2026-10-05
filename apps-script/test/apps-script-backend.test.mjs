/**
 * Runs the two .gs files against in-memory fakes of the Google services they
 * use (Sheets, Mail, Cache, Lock, Properties, Utilities, Script), so the
 * storage, consent, anti-spam and email-schedule logic can be checked without
 * a Google account. Run: npm run test:apps-script
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const dir = new URL("../", import.meta.url);
const SOURCES = ["backend-intake.gs", "backend-reminder-emails.gs"].map((file) => readFileSync(new URL(file, dir), "utf8"));
const KEY = "14ngay-2026";

function createFakeSheet(name) {
  const rows = [];
  const sheet = {
    name,
    rows,
    appendRow: (row) => rows.push([...row]),
    getLastRow: () => rows.length,
    setFrozenRows: () => {},
    getDataRange: () => ({ getValues: () => rows.map((r) => [...r]) }),
    getRange: (a, col = 1, numRows = 1, numCols = 1) => {
      if (typeof a === "string") return { setNumberFormat: () => {} };
      const read = () => rows.slice(a - 1, a - 1 + numRows).map((r) => r.slice(col - 1, col - 1 + numCols));
      return {
        getValues: read,
        setValues: (values) => values.forEach((v, i) => v.forEach((cell, j) => (rows[a - 1 + i][col - 1 + j] = cell))),
        setValue: (value) => (rows[a - 1][col - 1] = value),
      };
    },
  };
  return sheet;
}

function createBackend({ quota = 100 } = {}) {
  const sheets = new Map();
  const cache = new Map();
  const props = new Map();
  const outbox = [];
  let remainingQuota = quota;
  const spreadsheet = {
    getSheetByName: (name) => sheets.get(name) ?? null,
    insertSheet: (name) => {
      const sh = createFakeSheet(name);
      sheets.set(name, sh);
      return sh;
    },
  };
  const context = vm.createContext({
    console,
    Date,
    JSON,
    Math,
    SpreadsheetApp: { getActiveSpreadsheet: () => spreadsheet, openById: () => spreadsheet },
    LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
    CacheService: { getScriptCache: () => ({ get: (k) => cache.get(k) ?? null, put: (k, v) => cache.set(k, v) }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props.get(k) ?? null, setProperty: (k, v) => props.set(k, v) }) },
    MailApp: {
      getRemainingDailyQuota: () => remainingQuota,
      sendEmail: (message) => {
        remainingQuota -= 1;
        outbox.push(message);
      },
    },
    Utilities: {
      getUuid: () => randomUUID(),
      computeHmacSha256Signature: (value, secret) => [...createHmac("sha256", secret).update(value).digest()],
      base64EncodeWebSafe: (bytes) => Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_"),
      formatDate: (date) => date.toISOString().slice(0, 10),
    },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (text) => ({ text, setMimeType() { return this; } }) },
    HtmlService: { createHtmlOutput: (html) => ({ html, setTitle() { return this; } }) },
    ScriptApp: {
      getService: () => ({ getUrl: () => "https://script.google.com/macros/s/TEST/exec" }),
      getProjectTriggers: () => [],
      newTrigger: () => ({ timeBased: () => ({ atHour: () => ({ everyDays: () => ({ inTimezone: () => ({ create: () => {} }) }) }) }) }),
    },
    Session: { getEffectiveUser: () => ({ getEmail: () => "team@example.com" }) },
  });
  SOURCES.forEach((source) => vm.runInContext(source, context));
  context.setup();
  const post = (body) => JSON.parse(context.doPost({ postData: { contents: JSON.stringify({ key: KEY, ...body }) } }).text);
  const rowsOf = (name) => sheets.get(name).rows.slice(1);
  const setQuota = (value) => (remainingQuota = value);
  return { context, post, rowsOf, outbox, props, setQuota };
}

const join = (overrides = {}) => ({
  type: "join",
  pid: "pid-1",
  day: "",
  payload: { name: "Linh", email: "Linh@Example.com", intent: "reminder", startDate: "2026-10-08", programLength: 14, consents: { email: true, survey: true, share: false }, ...overrides },
});

test("sign-up stores one row per email and sends exactly one welcome email", () => {
  const b = createBackend();
  assert.equal(b.post(join()).ok, true);
  assert.equal(b.post(join({ name: "Linh N." })).created, false);
  const rows = b.rowsOf("ThamGia");
  assert.equal(rows.length, 1);
  assert.equal(rows[0][0], "linh@example.com");
  assert.equal(rows[0][1], "Linh N.");
  assert.equal(b.outbox.length, 1);
  assert.match(b.outbox[0].subject, /Skinnie đã nhận email/);
  assert.match(b.outbox[0].htmlBody, /action=unsubscribe/);
});

test("rows without the campaign key, consent or a valid email are rejected", () => {
  const b = createBackend();
  const noKey = JSON.parse(b.context.doPost({ postData: { contents: JSON.stringify({ ...join(), key: "wrong" }) } }).text);
  assert.equal(noKey.error, "bad_key");
  assert.equal(b.post(join({ consents: { email: false } })).error, "no_email_consent");
  assert.equal(b.post(join({ email: "not-an-email" })).error, "bad_email");
  assert.equal(b.rowsOf("ThamGia").length, 0);
  assert.equal(b.outbox.length, 0);
});

test("survey and share rows use the survey id and neutralise formulas", () => {
  const b = createBackend();
  b.post({ type: "survey", pid: "survey-9", day: 1, payload: { targets: ["Độ dầu", "Mụn"], source: "TikTok", utm: { utm_source: "tiktok" }, programLength: 14 } });
  b.post({ type: "survey", pid: "survey-9", day: 14, payload: { learned: "=IMPORTXML(\"x\")", wantDevice: "Có", price: "1 đến 1,5 triệu" } });
  b.post({ type: "share", pid: "survey-9", day: 14, payload: { text: "Da mình dầu hơn khi ngủ ít." } });
  const surveys = b.rowsOf("KhaoSat");
  assert.equal(surveys.length, 2);
  assert.equal(surveys[0][3], "Độ dầu, Mụn");
  assert.equal(surveys[1][8], "'=IMPORTXML(\"x\")");
  assert.equal(b.rowsOf("ChiaSe")[0][4], "", "share rows wait for approval");
  assert.equal(b.rowsOf("ThamGia").length, 0, "survey data never creates an email row");
});

test("early access emails are stored once", () => {
  const b = createBackend();
  b.post({ type: "join", pid: "p", payload: { email: "a@b.vn", intent: "early_access" } });
  b.post({ type: "join", pid: "p", payload: { email: "A@b.vn", intent: "early_access" } });
  assert.equal(b.rowsOf("TraiNghiemSom").length, 1);
  assert.equal(b.outbox.length, 0, "early access does not trigger reminder emails");
});

test("Day 7 and final emails go out on the right days, once each", () => {
  const b = createBackend();
  b.post(join());
  b.outbox.length = 0;
  assert.equal(b.context.sendReminders("2026-10-13").sent, 0, "Day 6: nothing yet");
  assert.equal(b.context.sendReminders("2026-10-14").sent, 1, "Day 7 email");
  assert.match(b.outbox[0].subject, /Ngày 7/);
  assert.match(b.outbox[0].htmlBody, /utm_content=day7/);
  assert.equal(b.context.sendReminders("2026-10-15").sent, 0, "not twice");
  assert.equal(b.context.sendReminders("2026-10-21").sent, 1, "Day 14 final email");
  assert.match(b.outbox[1].subject, /14 ngày/);
  assert.equal(b.context.sendReminders("2026-10-22").sent, 0);
});

test("the 7-day short run gets only the final email, on its Day 7", () => {
  const b = createBackend();
  b.post(join({ startDate: "2026-10-20", programLength: 7 }));
  b.outbox.length = 0;
  assert.equal(b.context.sendReminders("2026-10-26").sent, 1);
  assert.match(b.outbox[0].subject, /7 ngày hiểu da/);
});

test("starting after signing up updates the start date used for reminders", () => {
  const b = createBackend();
  b.post(join({ startDate: null, programLength: null }));
  b.post(join({ startDate: "2026-10-10", programLength: 14 }));
  b.outbox.length = 0;
  assert.equal(b.context.sendReminders("2026-10-16").sent, 1, "Day 7 counted from 10/10");
});

test("unsubscribe link stops emails; a forged link does nothing", () => {
  const b = createBackend();
  b.post(join());
  const link = b.outbox[0].htmlBody.match(/action=unsubscribe&e=([^&]+)&t=([^"]+)/);
  const forged = b.context.doGet({ parameter: { action: "unsubscribe", e: "linh@example.com", t: "forged" } });
  assert.match(forged.html, /không hợp lệ/);
  const ok = b.context.doGet({ parameter: { action: "unsubscribe", e: decodeURIComponent(link[1]), t: link[2] } });
  assert.match(ok.html, /Đã hủy nhận email/);
  b.outbox.length = 0;
  assert.equal(b.context.sendReminders("2026-10-14").sent, 0);
});

test("when the Gmail quota runs out, Day 7 emails wait and go out late within the grace window", () => {
  const b = createBackend({ quota: 3 });
  ["a", "b", "c"].forEach((n) => b.post(join({ email: `${n}@x.vn` })));
  assert.equal(b.outbox.length, 3, "three welcomes use the whole quota");
  assert.equal(b.context.sendReminders("2026-10-14").sent, 0, "Day 7: quota empty, nothing sent");
  b.setQuota(100); // quota resets the next day
  assert.equal(b.context.sendReminders("2026-10-16").sent, 3, "Day 9: sent late, still within the 2-day grace");
});

test("reminders older than the grace window are skipped, not sent days late", () => {
  const b = createBackend();
  ["a", "b", "c"].forEach((n) => b.post(join({ email: `${n}@x.vn` })));
  assert.equal(b.context.sendReminders("2026-10-17").sent, 0, "Day 10 with quota available: Day 7 email is skipped");
});

test("a flood of posts from one id is rate limited", () => {
  const b = createBackend();
  const results = Array.from({ length: 25 }, () => b.post({ type: "share", pid: "flood", day: 1, payload: { text: "spam" } }));
  assert.equal(results.filter((r) => r.error === "rate_limited").length, 5);
});
