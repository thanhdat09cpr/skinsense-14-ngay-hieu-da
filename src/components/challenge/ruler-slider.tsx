"use client";

import { useId } from "react";

interface RulerSliderProps {
  label: string;
  low: string;
  high: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  /** Hero preview: no tick row or end labels. */
  compact?: boolean;
}

/** A 1-5 slider drawn like a ruler. Native range input underneath for keyboard and screen readers. */
export function RulerSlider({ label, low, high, value, onChange, disabled, compact }: RulerSliderProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[15px] font-semibold text-ink-strong">
          {label}
        </label>
        <span className="font-mono text-2xl font-bold text-accent-text" aria-hidden="true">
          {value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          onChange(Number(event.target.value));
          if (typeof navigator.vibrate === "function") navigator.vibrate(8);
        }}
        aria-valuetext={`${value} trên 5`}
        className="ruler-range disabled:cursor-default"
      />
      {!compact && (
      <>
      <div className="flex justify-between px-[10px]" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((tick) => (
          <span
            key={tick}
            className={`w-px rounded-full transition-all ${tick === value ? "h-3 bg-accent" : "h-2 bg-ink-soft/40"}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-ink-soft">
        <span>{low}</span>
        <span>{high}</span>
      </div>
      </>
      )}
    </div>
  );
}
