"use client";

import { motion, useReducedMotion } from "motion/react";

/** Circular progress "n/total": the ring fills as days are logged. */
export function ProgressRing({ done, total, size = 112 }: { done: number; total: number; size?: number }) {
  const reduce = useReducedMotion();
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const ratio = total > 0 ? Math.min(done / total, 1) : 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Đã ghi ${done} trên ${total} ngày`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? ratio : 0 }}
          animate={{ pathLength: ratio }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold leading-none text-ink-strong">
          {done}/{total}
        </span>
        <span className="mt-1 text-xs text-ink-soft">ngày</span>
      </div>
    </div>
  );
}
