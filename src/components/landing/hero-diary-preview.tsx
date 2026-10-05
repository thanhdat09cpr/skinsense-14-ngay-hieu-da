"use client";

/**
 * Hero visual that shows the activity, not decoration: a Day 1 diary page
 * (built from the page's real slider component) with Skinnie beside it,
 * pointing at the page like a guide. Decorative only; the real diary opens
 * from the calendar.
 */
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { HASHTAG } from "@/lib/campaign-config";
import { DIARY_METRICS } from "@/lib/challenge-day-content";
import { activeEventTheme } from "@/lib/challenge-rules";
import { heroPose } from "@/lib/skinnie-poses";
import { useChallenge } from "@/components/challenge/challenge-provider";
import { RulerSlider } from "@/components/challenge/ruler-slider";

const PREVIEW_VALUES = { oil: 3, acne: 2, feel: 4 } as const;

export function HeroDiaryPreview() {
  const reduce = useReducedMotion();
  const { ready, today } = useChallenge();
  const pose = heroPose(ready ? activeEventTheme(today) : null);

  return (
    <div className="relative mx-auto w-full max-w-[500px] pb-10 pr-16 sm:pr-24" aria-hidden="true" inert>
      {/* Page underneath, so it reads as a notebook rather than a card */}
      <div className="absolute inset-y-4 left-3 right-14 rotate-[3deg] rounded-[20px] bg-done-soft sm:right-20" />

      <motion.div
        className="perforated-top relative -rotate-2 rounded-[20px] bg-paper-raised px-5 pb-5 pt-9 soft-shadow sm:px-7"
        initial={reduce ? false : { y: 24, rotate: -6 }}
        animate={{ y: 0, rotate: -2 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
      >
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-extrabold tracking-tight text-ink-strong sm:text-4xl">Ngày 1</p>
          <p className="font-mono text-xs font-bold text-accent-text">{HASHTAG}</p>
        </div>
        <p className="mt-1 text-sm text-ink-soft">Chụp ảnh mốc, ghi 3 chỉ số.</p>

        <div className="mt-5 flex flex-col gap-3">
          {/* Phones show one slider so the calendar comes into view sooner. */}
          {DIARY_METRICS.map((metric, index) => (
            <div key={metric.key} className={index > 0 ? "max-sm:hidden" : ""}>
              <RulerSlider label={metric.label} low={metric.low} high={metric.high} value={PREVIEW_VALUES[metric.key]} onChange={() => {}} disabled compact />
            </div>
          ))}
        </div>

        {/* The 14 days at a glance: day 1 is today */}
        <div className="mt-5 grid grid-cols-14 gap-1">
          {Array.from({ length: 14 }, (_, index) => (
            <span
              key={index}
              className={`aspect-square rounded-[5px] ${index === 0 ? "bg-accent outline-2 outline-offset-1 outline-highlight" : "border border-line"}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Skinnie points at the page */}
      <motion.div
        className="absolute -right-1 bottom-0 w-[34%] max-w-[210px] sm:-right-2 sm:w-[42%]"
        initial={reduce ? false : { x: 30, rotate: 8 }}
        animate={{ x: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 13, delay: 0.25 }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <Image
            src={pose.src}
            alt=""
            width={pose.width}
            height={pose.height}
            priority
            sizes="(min-width: 640px) 210px, 40vw"
            className="h-auto w-full drop-shadow-[0_20px_24px_rgb(32_88_96/0.3)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
