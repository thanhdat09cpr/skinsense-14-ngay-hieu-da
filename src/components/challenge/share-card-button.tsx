"use client";

import { useState } from "react";
import { ShareNetworkIcon } from "@phosphor-icons/react";
import { drawShareCard, shareOrDownloadCard } from "@/lib/share-card-canvas";
import { trackEvent } from "@/lib/tracking";
import { secondaryButton } from "@/components/ui/button-styles";

/** Builds the 1080x1920 story card on demand and shares or downloads it. */
export function ShareCardButton({ done, total, headline, day }: { done: number; total: number; headline: string; day: number }) {
  const [status, setStatus] = useState<"idle" | "working" | "shared" | "downloaded" | "error">("idle");

  const share = async () => {
    setStatus("working");
    trackEvent("share_card", { day });
    try {
      const blob = await drawShareCard({ done, total, headline });
      setStatus(await shareOrDownloadCard(blob, `14-ngay-hieu-da-${done}-${total}.png`));
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={share} disabled={status === "working"} className={secondaryButton}>
        <ShareNetworkIcon weight="bold" className="size-4" />
        {status === "working" ? "Đang tạo thẻ..." : `Chia sẻ thẻ ${done}/${total}`}
      </button>
      {status === "downloaded" && <p className="text-sm text-ink-soft">Đã tải thẻ về máy. Đăng story kèm #14NgayHieuDa nhé.</p>}
      {status === "error" && <p className="text-sm text-accent-text">Chưa tạo được thẻ, bạn thử lại giúp mình.</p>}
    </div>
  );
}
