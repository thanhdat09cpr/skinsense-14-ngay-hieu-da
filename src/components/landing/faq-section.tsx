"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { FAQ_ITEMS } from "@/lib/landing-copy";
import { Reveal } from "./reveal";

export function FaqSection() {
  return (
    <section id="hoi-dap" data-skinnie-stop="hoi-dap" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <h2 className="text-4xl font-extrabold leading-[1] tracking-tight text-ink-strong sm:text-6xl lg:sticky lg:top-28">Câu hỏi thường gặp</h2>
        </Reveal>
        <Reveal delay={0.06} className="flex flex-col">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-lg font-semibold text-ink-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                {item.q}
                <PlusIcon weight="bold" className="size-5 shrink-0 text-accent-text transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-[60ch] pb-6 text-base leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
