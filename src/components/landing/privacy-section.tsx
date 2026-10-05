"use client";

import { useEffect, useState } from "react";
import { CameraIcon, EnvelopeSimpleIcon, NotebookIcon, PrinterIcon, TrashIcon } from "@phosphor-icons/react";
import { PRIVACY_PROMISES } from "@/lib/landing-copy";
import { SITE_LINKS } from "@/lib/campaign-config";
import { trackEvent } from "@/lib/tracking";
import { useChallenge } from "@/components/challenge/challenge-provider";
import { secondaryButton } from "@/components/ui/button-styles";
import { Reveal } from "./reveal";

const ICONS = { camera: CameraIcon, notebook: NotebookIcon, envelope: EnvelopeSimpleIcon } as const;

/** Three plain promises in large type, plus print and delete controls. */
export function PrivacySection() {
  const { clearAll, isDemo } = useChallenge();
  const [confirming, setConfirming] = useState(false);

  // The delete button needs a second press within a few seconds.
  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 5000);
    return () => clearTimeout(timer);
  }, [confirming]);

  return (
    <section id="rieng-tu" data-skinnie-stop="rieng-tu" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <h2 className="text-4xl font-extrabold leading-[1] tracking-tight text-ink-strong sm:text-6xl">Dữ liệu của bạn</h2>
      </Reveal>
      <ul className="mt-10 flex flex-col">
        {PRIVACY_PROMISES.map((promise, index) => {
          const Icon = ICONS[promise.icon];
          return (
            <li key={promise.icon} className="border-t border-line">
              <Reveal delay={index * 0.06} className="flex items-start gap-5 py-7">
                <Icon weight="duotone" className="mt-1 size-8 shrink-0 text-accent-text" />
                <p className="max-w-[46ch] text-xl font-semibold leading-snug text-ink-strong sm:text-2xl">{promise.text}</p>
              </Reveal>
            </li>
          );
        })}
      </ul>
      <Reveal className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-8">
        <button
          type="button"
          className={secondaryButton}
          onClick={() => {
            trackEvent("print_template");
            window.print();
          }}
        >
          <PrinterIcon weight="bold" className="size-4" />
          In mẫu nhật ký
        </button>
        <button
          type="button"
          className={`${secondaryButton} ${confirming ? "border-accent text-accent-text" : ""}`}
          disabled={isDemo}
          onClick={() => {
            if (!confirming) return setConfirming(true);
            setConfirming(false);
            clearAll();
          }}
        >
          <TrashIcon weight="bold" className="size-4" />
          {confirming ? "Bấm lần nữa để xóa hẳn" : "Xóa toàn bộ dữ liệu của tôi"}
        </button>
        <a href={SITE_LINKS.privacy} className="text-sm font-semibold text-ink-strong underline underline-offset-4">
          Chính sách quyền riêng tư
        </a>
      </Reveal>
    </section>
  );
}
