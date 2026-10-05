"use client";

import { useId, useState } from "react";
import { CONSENT_LABELS } from "@/lib/landing-copy";
import type { Consents } from "@/lib/challenge-storage";
import { inputClass, primaryButton, quietButton } from "@/components/ui/button-styles";
import { useChallenge } from "./challenge-provider";
import { ConsentCheckbox } from "./consent-checkbox";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Name + email (required here) + three separate, unticked consents.
 * Playing itself never requires an email: the Day 1 prompt can be skipped
 * with "Để sau". Nothing is sent without the matching tick.
 */
export function JoinReminderForm({ onSkip }: { onSkip?: () => void }) {
  const { state, submitJoin } = useChallenge();
  const nameId = useId();
  const emailId = useId();
  const [name, setName] = useState(state.joined?.name ?? "");
  const [email, setEmail] = useState(state.joined?.email ?? "");
  const [consents, setConsents] = useState<Consents>(state.consents);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="rounded-[20px] bg-mint px-4 py-4 text-[15px] text-ink-strong">
        {consents.email && email ? `Đã lưu. Skinnie sẽ nhắc bạn qua ${email}.` : "Đã lưu lựa chọn của bạn. Bạn vẫn chơi bình thường."}
      </p>
    );
  }

  const toggle = (key: keyof Consents) => (checked: boolean) => setConsents((prev) => ({ ...prev, [key]: checked }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return setError("Bạn điền email để Skinnie nhắc bạn nhé.");
    if (!EMAIL_PATTERN.test(cleanEmail)) return setError("Email chưa đúng định dạng, bạn kiểm tra lại nhé.");
    if (!consents.email) return setError("Tick ô đồng ý đầu tiên để tụi mình được gửi email nhắc bạn.");
    setError("");
    submitJoin({ name, email: cleanEmail, consents });
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={nameId} className="text-sm font-semibold text-ink-strong">
            Tên gọi
          </label>
          <input id={nameId} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoComplete="given-name" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={emailId} className="text-sm font-semibold text-ink-strong">
            Email <span aria-hidden="true" className="text-accent-text">*</span>
          </label>
          <input
            id={emailId}
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            aria-required="true"
            className={inputClass}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${emailId}-error` : undefined}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <ConsentCheckbox checked={consents.email} onChange={toggle("email")}>
          {CONSENT_LABELS.email}
        </ConsentCheckbox>
        <ConsentCheckbox checked={consents.survey} onChange={toggle("survey")}>
          {CONSENT_LABELS.survey}
        </ConsentCheckbox>
        <ConsentCheckbox checked={consents.share} onChange={toggle("share")}>
          {CONSENT_LABELS.share}
        </ConsentCheckbox>
      </div>
      {error && (
        <p id={`${emailId}-error`} role="alert" className="text-sm font-medium text-accent-text">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className={primaryButton}>
          Đăng ký nhắc nhở
        </button>
        {onSkip && (
          <button type="button" onClick={onSkip} className={quietButton}>
            Để sau
          </button>
        )}
      </div>
    </form>
  );
}
