/**
 * Builds an .ics file with one evening reminder per challenge day, so the
 * phone's own calendar nudges the participant back (no server needed).
 */
import { PAGE_URL, type ProgramLength } from "./campaign-config";

const pad = (value: number) => String(value).padStart(2, "0");

/** 20:30 Vietnam time (UTC+7) expressed in UTC: 13:30Z. */
function reminderStampUtc(isoDate: string): string {
  return `${isoDate.replaceAll("-", "")}T133000Z`;
}

export function buildReminderIcs(startDate: string, programLength: ProgramLength): string {
  const now = new Date();
  const dtStamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SkinSense AI//14 ngay hieu da//VI",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${startDate}-${programLength}@skinsense-14-ngay`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${reminderStampUtc(startDate)}`,
    "DURATION:PT10M",
    `RRULE:FREQ=DAILY;COUNT=${programLength}`,
    `SUMMARY:Mở ô hôm nay - ${programLength} ngày hiểu da`,
    `DESCRIPTION:30 giây ghi lại làn da hôm nay: ${PAGE_URL}`,
    `URL:${PAGE_URL}`,
    "BEGIN:VALARM",
    "TRIGGER:PT0M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Skinnie nhắc bạn mở ô hôm nay",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function downloadReminderIcs(startDate: string, programLength: ProgramLength): void {
  const blob = new Blob([buildReminderIcs(startDate, programLength)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${programLength}-ngay-hieu-da.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
