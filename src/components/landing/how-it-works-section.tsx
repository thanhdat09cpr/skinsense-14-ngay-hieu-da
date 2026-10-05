"use client";

/**
 * "Cách chơi" on a soft jade colour block. Skinnie bursts out of the block's
 * top edge, the headline is poster-sized, and three cards carry the steps:
 * two photos and a live preview of the real Day 7 chart.
 */
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { HOW_IT_WORKS } from "@/lib/landing-copy";
import { SKINNIE } from "@/lib/skinnie-poses";
import { buildDemoState } from "@/lib/demo-state";
import { TrendChart } from "@/components/challenge/trend-chart";
import { Reveal } from "./reveal";

const SAMPLE_ENTRIES = buildDemoState("2026-10-20").entries;

export function HowItWorksSection() {
  const reduce = useReducedMotion();
  const [first, second, third] = HOW_IT_WORKS;

  return (
    <section id="cach-choi" data-skinnie-stop="cach-choi" className="scroll-mt-20 px-2 pb-10 pt-24 sm:px-4 sm:pt-32">
      <div className="relative rounded-[20px] bg-done-soft text-ink-strong">
        {/* Skinnie breaking out of the block */}
        <motion.div
          className="pointer-events-none absolute -top-20 right-4 w-[130px] sm:-top-28 sm:right-10 sm:w-[190px] lg:w-[230px]"
          initial={reduce ? false : { y: 60, rotate: 10 }}
          whileInView={{ y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
        >
          <Image src={SKINNIE.cheer.src} alt="" width={SKINNIE.cheer.width} height={SKINNIE.cheer.height} sizes="230px" className="h-auto w-full drop-shadow-[0_24px_28px_rgb(31_46_50/0.3)]" />
        </motion.div>

        <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
          <Reveal className="max-w-4xl pr-28 sm:pr-52 lg:pr-0">
            <h2 className="text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
              3 bước,
              <br />
              30 giây mỗi ngày
            </h2>
            <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-ink-soft sm:text-xl">Không đổi routine, không mua gì thêm. Chỉ ghi lại, đều đặn, cùng một cách.</p>
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-2">
            <Reveal className="overflow-hidden rounded-[20px] bg-paper-raised text-ink lg:row-span-2">
              <Image
                src={first.image.src}
                alt={first.image.alt}
                width={first.image.width}
                height={first.image.height}
                sizes="(min-width: 1024px) 620px, 100vw"
                className="aspect-[4/3] h-auto w-full object-cover"
              />
              <StepText number="1" marker={first.marker} title={first.title} body={first.body} className="p-6 sm:p-8" />
            </Reveal>

            <Reveal delay={0.08} className="grid overflow-hidden rounded-[20px] bg-paper-raised text-ink sm:grid-cols-[0.9fr_1fr]">
              <Image
                src={second.image.src}
                alt={second.image.alt}
                width={second.image.width}
                height={second.image.height}
                sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
                className="aspect-[4/3] h-full w-full object-cover sm:aspect-auto"
              />
              <StepText number="2" marker={second.marker} title={second.title} body={second.body} className="p-6" />
            </Reveal>

            <Reveal delay={0.16} className="flex flex-col overflow-hidden rounded-[20px] bg-paper-raised text-ink">
              <StepText number="3" marker={third.marker} title={third.title} body={third.body} className="px-6 pt-6" />
              <div className="px-4 pb-4 pt-2 sm:px-6">
                <TrendChart entries={SAMPLE_ENTRIES} days={13} />
                <p className="mt-1 text-right text-[11px] text-ink-soft">Ví dụ biểu đồ</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepText({ number, marker, title, body, className }: { number: string; marker: string; title: string; body: string; className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-ink-strong font-mono text-base font-bold text-paper">{number}</span>
        <p className="font-mono text-sm font-bold text-accent-text">{marker}</p>
      </div>
      <h3 className="mt-3 text-2xl font-extrabold leading-tight text-ink-strong sm:text-[28px]">{title}</h3>
      <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}
