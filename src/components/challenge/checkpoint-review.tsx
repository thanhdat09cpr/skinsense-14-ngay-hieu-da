"use client";

/**
 * Day 7 of the 14-day run: the participant's own 7-day chart, Skinnie's big
 * question ("is looking with the eye enough?"), one survey question, share card.
 */
import Image from "next/image";
import { useState } from "react";
import { CONSENT_LABELS, SURVEY } from "@/lib/landing-copy";
import { SKINNIE } from "@/lib/skinnie-poses";
import { primaryButton } from "@/components/ui/button-styles";
import { useChallenge } from "./challenge-provider";
import { ConsentCheckbox } from "./consent-checkbox";
import { ShareCardButton } from "./share-card-button";
import { PhotoCompare } from "./photo-compare";
import { TrendChart } from "./trend-chart";

export function CheckpointReview() {
  const { state, submitCheckpointSurvey } = useChallenge();
  const [useful, setUseful] = useState<number | null>(state.checkpointSurvey?.useful ?? null);
  const [allowResearch, setAllowResearch] = useState(state.consents.survey);
  const answered = Boolean(state.checkpointSurvey);
  const logged = Object.keys(state.entries).filter((day) => Number(day) <= 7).length;

  return (
    <div className="flex flex-col gap-8">
      <TrendChart entries={state.entries} days={7} />
      <PhotoCompare upToDay={7} />

      <div className="flex items-start gap-4 rounded-[20px] bg-mint p-4 sm:p-5">
        <Image src={SKINNIE.puzzled.src} alt="" width={SKINNIE.puzzled.width} height={SKINNIE.puzzled.height} className="h-auto w-16 shrink-0 sm:w-20" />
        <div>
          <p className="text-xl font-bold leading-snug text-ink-strong sm:text-2xl">Chỉ nhìn bằng mắt như thế này đã đủ chưa?</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Skinnie cầm kính lúp soi mãi mà vẫn phải đoán. Trong 7 ngày còn lại, bạn thử để ý xem mắt mình bỏ sót điều gì nhé.
          </p>
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-[15px] font-semibold text-ink-strong">{SURVEY.checkpoint}</legend>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              disabled={answered}
              aria-pressed={useful === score}
              onClick={() => setUseful(score)}
              className={`h-12 rounded-full border font-mono text-lg font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                useful === score ? "border-accent bg-accent text-on-accent" : "border-line bg-paper-raised text-ink-strong hover:bg-mint"
              }`}
            >
              {score}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-ink-soft">
          <span>Chưa có ích</span>
          <span>Rất có ích</span>
        </div>
        {!answered && !state.consents.survey && (
          <ConsentCheckbox checked={allowResearch} onChange={setAllowResearch}>
            {CONSENT_LABELS.survey}
          </ConsentCheckbox>
        )}
        {answered ? (
          <p className="text-sm font-medium text-ink-strong">Đã nhận câu trả lời. Cảm ơn bạn!</p>
        ) : (
          <button
            type="button"
            disabled={useful === null}
            onClick={() => useful !== null && submitCheckpointSurvey(useful, allowResearch)}
            className={`${primaryButton} self-start`}
          >
            Gửi câu trả lời
          </button>
        )}
      </fieldset>

      <ShareCardButton done={logged} total={14} headline="Mình đã đi được 7/14 ngày hiểu da" day={7} />
    </div>
  );
}
