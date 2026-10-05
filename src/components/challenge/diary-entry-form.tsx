"use client";

/**
 * The flipped-open tile: today's small task, Skinnie's tip, three ruler
 * sliders and a one-line note. Day 1 also asks what to track and where the
 * participant heard about the challenge.
 */
import Image from "next/image";
import { useId, useState } from "react";
import { CameraIcon } from "@phosphor-icons/react";
import { DIARY_METRICS, DISCOVERY_SOURCES, TRACKING_TARGETS, getDayContent, type MetricKey } from "@/lib/challenge-day-content";
import type { ProgramLength } from "@/lib/campaign-config";
import { chipClass, inputClass, primaryButton } from "@/components/ui/button-styles";
import { useChallenge } from "./challenge-provider";
import { PhotoJournalPicker } from "./photo-journal-picker";
import { SKINNIE } from "@/lib/skinnie-poses";
import { RulerSlider } from "./ruler-slider";

const NOTE_LIMIT = 140;

export function DiaryEntryForm({ day, programLength, editable, onSaved }: { day: number; programLength: ProgramLength; editable: boolean; onSaved: () => void }) {
  const { state, saveEntry } = useChallenge();
  const content = getDayContent(day, programLength);
  const existing = state.entries[day];
  const noteId = useId();
  const [values, setValues] = useState<Record<MetricKey, number>>({
    oil: existing?.oil ?? 3,
    acne: existing?.acne ?? 3,
    feel: existing?.feel ?? 3,
  });
  const [note, setNote] = useState(existing?.note ?? "");
  const [targets, setTargets] = useState<string[]>(state.dayOneExtras?.targets ?? []);
  const [source, setSource] = useState<string | null>(state.dayOneExtras?.source ?? null);
  const isDayOne = day === 1;

  const toggleTarget = (target: string) =>
    setTargets((prev) => (prev.includes(target) ? prev.filter((item) => item !== target) : prev.length >= 2 ? prev : [...prev, target]));

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    saveEntry(day, { ...values, note: note.trim() }, isDayOne ? { targets, source } : undefined);
    onSaved();
  };

  return (
    <form onSubmit={save} className="flex flex-col gap-7">
      <div>
        <p className="text-sm font-semibold text-accent-text">Việc hôm nay</p>
        <p className="mt-1 text-lg font-semibold leading-snug text-ink-strong">{content.task}</p>
      </div>

      {content.tip && (
        <div className="flex items-center gap-3 rounded-[20px] bg-mint px-4 py-3">
          <Image src={SKINNIE.magnifier.src} alt="" width={SKINNIE.magnifier.width} height={SKINNIE.magnifier.height} className="h-auto w-9 shrink-0" />
          <p className="text-sm leading-relaxed text-ink-strong">
            <span className="font-semibold">Skinnie mách nhỏ:</span> {content.tip}
          </p>
        </div>
      )}

      {isDayOne && (
        <>
          <fieldset className="flex flex-col gap-3" disabled={!editable}>
            <legend className="text-[15px] font-semibold text-ink-strong">Bạn muốn theo dõi điều gì? (chọn 1 đến 2)</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {TRACKING_TARGETS.map((target) => (
                <button key={target} type="button" aria-pressed={targets.includes(target)} onClick={() => toggleTarget(target)} className={chipClass(targets.includes(target))}>
                  {target}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex items-start gap-3 rounded-[20px] border border-line px-4 py-3 text-sm leading-relaxed text-ink-soft">
            <CameraIcon weight="bold" className="mt-0.5 size-5 shrink-0 text-ink-strong" />
            <p>
              <span className="font-semibold text-ink-strong">Chụp ảnh Ngày 1:</span> cùng chỗ, cùng giờ, cùng ánh sáng. Đây là ảnh mốc để các ngày sau so lại.
            </p>
          </div>
        </>
      )}

      <PhotoJournalPicker day={day} editable={editable} />

      <div className="flex flex-col gap-6">
        {DIARY_METRICS.map((metric) => (
          <RulerSlider
            key={metric.key}
            label={metric.label}
            low={metric.low}
            high={metric.high}
            value={values[metric.key]}
            disabled={!editable}
            onChange={(value) => setValues((prev) => ({ ...prev, [metric.key]: value }))}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor={noteId} className="text-[15px] font-semibold text-ink-strong">
            Một dòng ghi chú
          </label>
          <span className="font-mono text-xs text-ink-soft">
            {note.length}/{NOTE_LIMIT}
          </span>
        </div>
        <textarea
          id={noteId}
          rows={2}
          maxLength={NOTE_LIMIT}
          value={note}
          disabled={!editable}
          placeholder={content.notePrompt}
          onChange={(event) => setNote(event.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {isDayOne && (
        <fieldset className="flex flex-col gap-3" disabled={!editable}>
          <legend className="text-[15px] font-semibold text-ink-strong">Bạn biết thử thách này từ đâu?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {DISCOVERY_SOURCES.map((item) => (
              <button key={item} type="button" aria-pressed={source === item} onClick={() => setSource(item)} className={chipClass(source === item)}>
                {item}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {editable && (
        <button type="submit" disabled={isDayOne && targets.length === 0} className={`${primaryButton} self-start`}>
          {existing ? `Cập nhật Ngày ${day}` : `Lưu Ngày ${day}`}
        </button>
      )}
    </form>
  );
}
