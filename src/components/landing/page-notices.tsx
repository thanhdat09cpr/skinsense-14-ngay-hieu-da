"use client";

/**
 * Thin notices above the header: demo/simulated-date mode for reviewers, and a
 * warning when the page is open inside a social app's built-in browser.
 */
import { useState, useSyncExternalStore } from "react";
import { XIcon } from "@phosphor-icons/react";
import { detectInAppBrowser } from "@/lib/in-app-browser";
import { formatDayMonth, localTodayIso } from "@/lib/date-utils";
import { useChallenge } from "@/components/challenge/challenge-provider";

const noopSubscribe = () => () => {};

export function PageNotices() {
  const { ready, isDemo, today } = useChallenge();
  const inApp = useSyncExternalStore(noopSubscribe, () => detectInAppBrowser(navigator.userAgent), () => null);
  const [inAppDismissed, setInAppDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const simulated = ready && today !== localTodayIso();

  return (
    <div className="relative z-50 print:hidden">
      {(isDemo || simulated) && (
        <p className="bg-ink-strong px-4 py-2 text-center text-[13px] font-medium text-paper">
          {isDemo ? "Đang xem dữ liệu minh họa. Không có gì được lưu hay gửi đi." : ""}
          {isDemo && simulated ? " " : ""}
          {simulated ? `Đang giả lập ngày ${formatDayMonth(today)}.` : ""}
        </p>
      )}
      {inApp && !inAppDismissed && (
        <div className="flex items-start gap-3 bg-mint px-4 py-3 text-[13px] leading-relaxed text-ink-strong sm:items-center sm:justify-center">
          <p>
            Bạn đang mở trong {inApp}. Mở bằng Safari hoặc Chrome để nhật ký không bị mất khi quay lại.
          </p>
          <button
            type="button"
            className="shrink-0 rounded-full border border-line bg-paper-raised px-3 py-1 font-semibold"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? "Đã chép link" : "Chép link"}
          </button>
          <button type="button" aria-label="Ẩn thông báo" onClick={() => setInAppDismissed(true)} className="shrink-0 p-1">
            <XIcon weight="bold" className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
