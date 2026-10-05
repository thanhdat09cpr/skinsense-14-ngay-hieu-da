"use client";

/**
 * Three lines (oil, acne, comfort) across the participant's own days, drawn in
 * plain SVG. Lines are told apart by dash pattern AND an end label, not by
 * colour alone.
 */
import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { DiaryEntry } from "@/lib/challenge-storage";

const WIDTH = 560;
const HEIGHT = 240;
const PAD = { top: 16, right: 92, bottom: 32, left: 28 };

const SERIES = [
  { key: "oil", label: "Độ dầu", color: "var(--ink-strong)", dash: undefined },
  { key: "acne", label: "Mụn", color: "var(--accent)", dash: "8 6" },
  { key: "feel", label: "Cảm giác", color: "var(--ink-soft)", dash: "2 6" },
] as const;

export function TrendChart({ entries, days }: { entries: Record<number, DiaryEntry>; days: number }) {
  const reduce = useReducedMotion();
  const clipId = `trend-reveal-${useId().replace(/:/g, "")}`;
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (day: number) => PAD.left + ((day - 1) / Math.max(days - 1, 1)) * innerW;
  const y = (value: number) => PAD.top + ((5 - value) / 4) * innerH;
  const loggedDays = Array.from({ length: days }, (_, index) => index + 1).filter((day) => entries[day]);

  if (loggedDays.length < 2) {
    return <p className="rounded-[20px] bg-mint px-4 py-6 text-sm text-ink-soft">Cần ít nhất 2 ngày nhật ký để vẽ biểu đồ.</p>;
  }

  // End labels sit next to each line's last point; nudge them apart when values coincide.
  const lastDay = loggedDays[loggedDays.length - 1];
  const labelY = new Map<string, number>();
  [...SERIES]
    .map((series) => ({ key: series.key, y: y(entries[lastDay][series.key]) + 4 }))
    .sort((a, b) => a.y - b.y)
    .forEach((item, index, list) => {
      const previous = index > 0 ? labelY.get(list[index - 1].key) ?? -Infinity : -Infinity;
      labelY.set(item.key, Math.max(item.y, previous + 15));
    });

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label={`Biểu đồ ${days} ngày: độ dầu, mụn, cảm giác da`}>
      {/* Lines are revealed left to right through a growing clip, so dash patterns stay intact. */}
      <defs>
        <clipPath id={clipId}>
          <motion.rect
            x={0}
            y={0}
            height={HEIGHT}
            initial={{ width: reduce ? WIDTH : 0 }}
            animate={{ width: WIDTH }}
            transition={{ duration: reduce ? 0 : 1.6, ease: [0.65, 0, 0.35, 1] }}
          />
        </clipPath>
      </defs>
      {[1, 2, 3, 4, 5].map((level) => (
        <g key={level}>
          <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(level)} y2={y(level)} stroke="var(--line)" />
          <text x={PAD.left - 10} y={y(level) + 4} textAnchor="end" className="fill-ink-soft font-mono text-[11px]">
            {level}
          </text>
        </g>
      ))}
      <text x={x(1)} y={HEIGHT - 8} className="fill-ink-soft text-[11px]">
        Ngày 1
      </text>
      <text x={x(days)} y={HEIGHT - 8} textAnchor="end" className="fill-ink-soft text-[11px]">
        Ngày {days}
      </text>

      {SERIES.map((series, seriesIndex) => {
        const points = loggedDays.map((day) => [x(day), y(entries[day][series.key])] as const);
        const path = points.map(([px, py], index) => `${index === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
        const [lastX] = points[points.length - 1];
        return (
          <g key={series.key}>
            <g clipPath={`url(#${clipId})`}>
              <path
                d={path}
                fill="none"
                stroke={series.color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={series.dash}
              />
              {points.map(([px, py], index) => (
                <circle key={index} cx={px} cy={py} r={3.5} fill={series.color} />
              ))}
            </g>
            <motion.text
              x={lastX + 10}
              y={labelY.get(series.key)}
              className="text-[12px] font-semibold"
              fill={series.color}
              initial={{ opacity: reduce ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduce ? 0 : 1.4 + seriesIndex * 0.15 }}
            >
              {series.label}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}
