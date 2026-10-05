"use client";

/**
 * Compact hero on cream paper, matching the teaser posts: label, headline with
 * one ink stroke, one line of copy, one primary action. On the right, a Day 1
 * diary page with Skinnie pointing at it, so the visitor sees what they will
 * do. Kept short so the calendar peeks in below the fold line.
 */
import { motion, useReducedMotion } from "motion/react";
import { usePrimaryCta } from "@/components/challenge/use-primary-cta";
import { primaryButton } from "@/components/ui/button-styles";
import { InkUnderline } from "@/components/ui/ink-underline";
import { HeroDiaryPreview } from "./hero-diary-preview";

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const cta = usePrimaryCta();
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce ? {} : { initial: { y: 16 }, animate: { y: 0 }, transition: { duration: 0.7, delay, ease: EASE } };

  return (
    <section id="dau-trang" data-skinnie-stop="hero">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 pb-8 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-12 lg:pt-14">
        <div className="max-w-xl">
          <motion.p {...enter(0)} className="inline-flex rounded-full border border-line bg-paper-raised px-4 py-2 text-[13px] font-medium text-ink-soft">
            Miễn phí. Không cần mua gì. Không cần đăng ảnh mặt.
          </motion.p>
          <motion.h1 {...enter(0.05)} className="mt-6 text-balance text-[52px] font-extrabold leading-[1] tracking-tight text-ink-strong sm:text-7xl lg:text-[84px]">
            14 ngày <InkUnderline>hiểu da</InkUnderline>
          </motion.h1>
          <motion.p {...enter(0.1)} className="mt-6 max-w-[34ch] text-lg leading-relaxed text-ink-soft sm:text-xl">
            Da bạn tuần này khác tuần trước ở đâu? Trả lời bằng nhật ký, không bằng cảm giác.
          </motion.p>
          <motion.div id="hero-cta" {...enter(0.15)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button type="button" onClick={cta.onClick} className={`${primaryButton} h-14 px-8 text-base`}>
              {cta.label}
            </button>
            <a href="#cach-choi" className="text-[15px] font-semibold text-ink-strong underline decoration-2 underline-offset-4 hover:text-accent-text">
              Xem cách chơi
            </a>
          </motion.div>
        </div>
        <HeroDiaryPreview />
      </div>
    </section>
  );
}
