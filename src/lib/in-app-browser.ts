/**
 * Social apps open links in their own webview, whose storage is separate from
 * Safari/Chrome. A diary started there can look "lost" when the participant
 * later opens a reminder email in the real browser, so we warn up front.
 */
const IN_APP_PATTERNS: Array<[RegExp, string]> = [
  [/FBAN|FBAV|FB_IAB/i, "Facebook"],
  [/Instagram/i, "Instagram"],
  [/musical_ly|TikTok|BytedanceWebview/i, "TikTok"],
  [/Zalo/i, "Zalo"],
  [/Line\//i, "LINE"],
  [/Messenger/i, "Messenger"],
];

export function detectInAppBrowser(userAgent: string): string | null {
  for (const [pattern, name] of IN_APP_PATTERNS) {
    if (pattern.test(userAgent)) return name;
  }
  return null;
}
