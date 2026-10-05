"use client";

import Image from "next/image";
import { SITE_LINKS } from "@/lib/campaign-config";
import { trackEvent } from "@/lib/tracking";
import { usePrimaryCta } from "@/components/challenge/use-primary-cta";
import { smallPrimaryButton } from "@/components/ui/button-styles";

export function SiteHeader() {
  const cta = usePrimaryCta();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-tight text-ink-strong">
          <Image src="/brand/logo-mark.png" alt="" width={212} height={212} className="size-9 rounded-full ring-1 ring-line" priority />
          <span>
            SkinSense <span className="text-accent-text">AI</span>
          </span>
        </a>
        <nav className="flex items-center gap-2 sm:gap-5">
          <a
            href={SITE_LINKS.demo}
            onClick={() => trackEvent("demo_click", { from: "header" })}
            className="hidden text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink-strong hover:underline md:inline"
          >
            Thử demo nhu cầu da
          </a>
          <button type="button" onClick={cta.onClick} className={smallPrimaryButton}>
            {cta.label}
          </button>
        </nav>
      </div>
    </header>
  );
}
