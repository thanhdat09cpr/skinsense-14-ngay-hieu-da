"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * A hand-drawn ink stroke under a phrase, drawn once on load: the notebook's
 * "nét ghi chép", used for the one phrase that matters in the hero.
 */
export function InkUnderline({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg aria-hidden="true" viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute -bottom-[0.14em] left-0 h-[0.2em] w-full overflow-visible">
        <motion.path
          d="M3 9 C 45 3, 85 13, 128 6 S 182 8, 197 4"
          fill="none"
          stroke="var(--done)"
          strokeWidth={5}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 0.9, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
    </span>
  );
}
