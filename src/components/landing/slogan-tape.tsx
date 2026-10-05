"use client";

/**
 * The campaign slogan on a strip of yellow tape stuck slightly askew across
 * the page. The page's single marquee: it keeps "Đừng đoán da, hãy hiểu da"
 * in view without taking a section. Static under reduced motion.
 */
import { SparkleIcon } from "@phosphor-icons/react";
import { HASHTAG } from "@/lib/campaign-config";

const PHRASES = ["Đừng đoán da, hãy hiểu da", HASHTAG, "30 giây mỗi ngày", "Đừng đoán da, hãy hiểu da", HASHTAG, "Miễn phí cho tất cả"];

export function SloganTape() {
  const row = (copy: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={copy > 0}>
      {PHRASES.map((phrase, index) => (
        <span key={`${copy}-${index}`} className="flex items-center gap-6 pr-6 text-xl font-extrabold tracking-tight sm:text-3xl">
          {phrase}
          <SparkleIcon weight="fill" className="size-5 shrink-0 sm:size-6" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative z-[3] -my-3 overflow-hidden py-6 print:hidden">
      <div className="-mx-4 -rotate-[1.5deg] bg-highlight py-3 text-on-highlight soft-shadow sm:py-4">
        <div className="tape-track flex w-max motion-reduce:animate-none">
          {row(0)}
          {row(1)}
        </div>
      </div>
    </div>
  );
}
