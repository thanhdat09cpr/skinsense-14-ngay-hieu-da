"use client";

/**
 * Email + one unticked consent for SkinSense early access. Shared by the
 * closing section (on the teal stage) and the popup (on paper), so the copy,
 * validation and tracking stay identical in both places.
 */
import { useId, useState } from "react";
import { trackEvent } from "@/lib/tracking";
import { useChallenge } from "@/components/challenge/challenge-provider";
import { ConsentCheckbox } from "@/components/challenge/consent-checkbox";
import { inputClass, paperButton, primaryButton } from "@/components/ui/button-styles";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function EarlyAccessForm({ tone, source }: { tone: "stage" | "paper"; source: "closing" | "popup" }) {
  const { submitEarlyAccess } = useChallenge();
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const onStage = tone === "stage";

  if (sent) {
    return (
      <p className="rounded-[20px] bg-paper-raised px-5 py-4 text-[15px] font-medium text-ink-strong">
        Đã nhận. Khi có bản dùng thử, SkinSense sẽ báo bạn đầu tiên.
      </p>
    );
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    trackEvent("early_access_click", { from: source });
    if (!EMAIL_PATTERN.test(email.trim())) return setError("Email chưa đúng định dạng, bạn kiểm tra lại nhé.");
    if (!consent) return setError("Tick ô đồng ý để tụi mình được gửi tin cho bạn.");
    setError("");
    submitEarlyAccess(email);
    setSent(true);
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <label htmlFor={emailId} className={`text-sm font-semibold ${onStage ? "text-on-stage" : "text-ink-strong"}`}>
        Email của bạn
      </label>
      {/* Side by side only on the wide closing block; the popup column is too narrow for that. */}
      <div className={onStage ? "flex flex-col gap-3 sm:flex-row" : "flex flex-col gap-3"}>
        <input id={emailId} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        <button type="submit" className={onStage ? paperButton : `${primaryButton} w-full`}>
          Đăng ký trải nghiệm sớm
        </button>
      </div>
      <div className={onStage ? "rounded-[20px] bg-paper-raised px-4 py-3" : ""}>
        <ConsentCheckbox checked={consent} onChange={setConsent}>
          Tôi đồng ý nhận thông tin về bản dùng thử từ SkinSense AI. Có thể hủy bất cứ lúc nào.
        </ConsentCheckbox>
      </div>
      {error && (
        <p role="alert" className={`text-sm font-semibold ${onStage ? "text-accent-bright" : "text-accent-text"}`}>
          {error}
        </p>
      )}
    </form>
  );
}
