/**
 * #14NgayHieuDa backend, part 2 of 2: emails, only to people who ticked the
 * email consent, each with a one-click unsubscribe link.
 * - Welcome: once, right after sign-up.
 * - Day 7 check-in: 14-day run only.
 * - Final day: Day 14 (or Day 7 on the 7-day short run).
 * A daily trigger created by setup() runs sendReminders() at 08:00 Vietnam time.
 * Gmail accounts can email 100 recipients a day from Apps Script (Workspace: 1,500).
 */

const LAST_EMAIL_DATE = '2026-10-31';
const SENDER_NAME = 'SkinSense AI';
/** If a morning run was skipped (quota, outage), still send up to this many days late. */
const LATE_GRACE_DAYS = 2;
/** Caps welcome emails so a scripted flood of fake sign-ups cannot spam inboxes. */
const WELCOME_PER_HOUR = 40;

/** Daily trigger entry point. Pass 'YYYY-MM-DD' to simulate a date when testing by hand. */
function sendReminders(dateOverride) {
  const today = typeof dateOverride === 'string' ? dateOverride : todayIso_();
  if (today > LAST_EMAIL_DATE) return { sent: 0, reason: 'campaign_over' };
  const sh = sheet_('join');
  const rows = sh.getDataRange().getValues();
  let sent = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[COL.consentEmail] !== true || row[COL.unsubscribed] === true) continue;
    const start = toIso_(row[COL.start]);
    if (!start) continue;
    const length = Number(row[COL.length]) === 7 ? 7 : 14;
    const day = diffDays_(start, today) + 1;

    let kind = null;
    if (length === 14 && row[COL.sentDay7] !== true && day >= 7 && day <= 7 + LATE_GRACE_DAYS) kind = 'day7';
    else if (row[COL.sentFinal] !== true && day >= length && day <= length + LATE_GRACE_DAYS) kind = 'final';
    if (!kind) continue;

    if (MailApp.getRemainingDailyQuota() < 1) break; // the rest go out tomorrow, within the grace window
    sendTemplate_(kind, String(row[COL.email]), String(row[COL.name] || ''), length);
    sh.getRange(i + 1, (kind === 'day7' ? COL.sentDay7 : COL.sentFinal) + 1).setValue(true);
    sent++;
  }
  return { sent: sent };
}

function sendWelcomeIfAllowed_(sh, rowNumber) {
  const row = sh.getRange(rowNumber, 1, 1, SHEETS.join.headers.length).getValues()[0];
  if (row[COL.sentWelcome] === true || todayIso_() > LAST_EMAIL_DATE) return;
  if (MailApp.getRemainingDailyQuota() < 1 || !withinRateLimit_('welcome-hour', WELCOME_PER_HOUR, 3600)) return;
  sendTemplate_('welcome', String(row[COL.email]), String(row[COL.name] || ''), Number(row[COL.length]) || 14);
  sh.getRange(rowNumber, COL.sentWelcome + 1).setValue(true);
}

function sendTemplate_(kind, email, name, length) {
  const template = template_(kind, length);
  MailApp.sendEmail({
    to: email,
    subject: template.subject,
    name: SENDER_NAME,
    htmlBody: emailHtml_(template, name, kind, email),
    body: template.lines.join('\n\n') + '\n\n' + pageLink_(kind) + '\n\nHủy nhận email: ' + unsubscribeUrl_(email),
  });
}

function template_(kind, length) {
  if (kind === 'day7') {
    return {
      subject: 'Ngày 7 rồi: biểu đồ da 7 ngày của bạn đã sẵn sàng',
      title: 'Bạn đã đi được nửa chặng',
      lines: ['Hôm nay là Ngày 7. Mở ô hôm nay để xem biểu đồ 7 ngày đầu của chính bạn.', 'Chỉ nhìn bằng mắt như thế này đã đủ chưa? Trả lời giúp Skinnie một câu nhé.'],
      cta: 'Xem biểu đồ 7 ngày',
      image: 'skinnie-puzzled.png',
    };
  }
  if (kind === 'final') {
    return {
      subject: 'Ngày tổng kết: nhận thẻ hoàn thành ' + length + ' ngày hiểu da',
      title: 'Bạn đã về đích ' + length + ' ngày hiểu da',
      lines: ['Mở ô cuối cùng để xem lại cả hành trình và nhận thẻ hoàn thành để chia sẻ.', 'Ba câu hỏi ngắn ở ô cuối giúp nhóm hiểu thêm nhu cầu của bạn.'],
      cta: 'Mở ô tổng kết',
      image: 'skinnie-cheer.png',
    };
  }
  return {
    subject: 'Skinnie đã nhận email của bạn',
    title: 'Mình sẽ nhắc bạn đúng hẹn',
    lines: ['Cảm ơn bạn đã tham gia #14NgayHieuDa.', 'Mình sẽ gửi email vào Ngày 7 và ngày tổng kết. Mỗi ngày, bạn chỉ cần mở ô hôm nay và ghi lại trong 30 giây.'],
    cta: 'Mở ô hôm nay',
    image: 'skinnie-wave.png',
  };
}

function emailHtml_(t, name, kind, email) {
  const hello = name ? 'Chào ' + escapeHtml_(name) + ',' : 'Chào bạn,';
  const paragraphs = t.lines.map(function (line) {
    return '<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#3f5a60">' + escapeHtml_(line) + '</p>';
  }).join('');
  return '<div style="background:#f6f6f0;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">'
    + '<div style="max-width:520px;margin:0 auto;background:#fcfcf8;border-radius:20px;padding:28px">'
    + '<img src="' + PAGE_URL + '/skinnie/' + t.image + '" alt="Skinnie" width="120" style="display:block;margin:0 auto 12px">'
    + '<p style="margin:0 0 6px;font-size:15px;color:#3f5a60">' + hello + '</p>'
    + '<h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;color:#205860">' + escapeHtml_(t.title) + '</h1>'
    + paragraphs
    + '<p style="margin:22px 0"><a href="' + pageLink_(kind) + '" style="background:#0f766e;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 26px;border-radius:999px;display:inline-block">'
    + escapeHtml_(t.cta) + '</a></p>'
    + '<p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#3f5a60">Bạn nhận email này vì đã đồng ý nhận nhắc nhở #14NgayHieuDa từ SkinSense AI, dự án của nhóm sinh viên UEH. '
    + '<a href="' + unsubscribeUrl_(email) + '" style="color:#205860">Hủy nhận email</a>.</p>'
    + '</div></div>';
}

/** Links carry UTM tags so GA4 counts these visits as email sessions. */
function pageLink_(kind) {
  return PAGE_URL + '?utm_source=email&utm_medium=reminder&utm_campaign=14ngayhieuda&utm_content=' + kind;
}

function unsubscribeUrl_(email) {
  return ScriptApp.getService().getUrl() + '?action=unsubscribe&e=' + encodeURIComponent(email) + '&t=' + unsubscribeToken_(email);
}

/** HMAC of the email, so nobody can unsubscribe someone else by editing the link. */
function unsubscribeToken_(email) {
  const secret = PropertiesService.getScriptProperties().getProperty('UNSUBSCRIBE_SECRET') || '';
  const signature = Utilities.computeHmacSha256Signature(String(email).toLowerCase(), secret);
  return Utilities.base64EncodeWebSafe(signature).replace(/=+$/, '').slice(0, 22);
}

function doGet(e) {
  const params = (e && e.parameter) || {};
  if (params.action === 'unsubscribe') {
    const email = String(params.e || '').toLowerCase();
    if (!email || params.t !== unsubscribeToken_(email)) {
      return page_('Liên kết không hợp lệ', 'Liên kết hủy nhận email không đúng. Bạn có thể trả lời email để nhóm hỗ trợ.');
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sh = sheet_('join');
      const rowIndex = findRow_(sh, COL.email, email);
      if (rowIndex > 0) sh.getRange(rowIndex, COL.unsubscribed + 1).setValue(true);
    } finally {
      lock.releaseLock();
    }
    return page_('Đã hủy nhận email', 'Bạn sẽ không nhận thêm email nhắc nhở từ #14NgayHieuDa. Nhật ký trên máy bạn vẫn còn nguyên.');
  }
  return json_({ ok: true, service: '14-ngay-hieu-da' });
}

function page_(title, message) {
  return HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:60px auto;padding:0 16px;color:#205860">'
    + '<h1 style="font-size:24px">' + escapeHtml_(title) + '</h1><p style="font-size:16px;line-height:1.6;color:#3f5a60">' + escapeHtml_(message) + '</p></div>'
  ).setTitle(title);
}

function escapeHtml_(text) {
  return String(text).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* ---------- One-time setup and manual checks (run from the Apps Script editor) ---------- */

/** Run once: creates the four sheets, the unsubscribe secret and the 08:00 daily trigger. */
function setup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('UNSUBSCRIBE_SECRET')) props.setProperty('UNSUBSCRIBE_SECRET', Utilities.getUuid() + Utilities.getUuid());
  Object.keys(SHEETS).forEach(function (key) { sheet_(key); });
  sheet_('join').getRange('D:D').setNumberFormat('@'); // keep start dates as plain text
  const hasTrigger = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'sendReminders'; });
  if (!hasTrigger) ScriptApp.newTrigger('sendReminders').timeBased().atHour(8).everyDays(1).inTimezone(TIMEZONE).create();
}

/** Sends the three emails to your own inbox so the team can check how they look. */
function sendTestEmails() {
  const me = Session.getEffectiveUser().getEmail();
  ['welcome', 'day7', 'final'].forEach(function (kind) { sendTemplate_(kind, me, 'Nhóm SkinSense', 14); });
}
