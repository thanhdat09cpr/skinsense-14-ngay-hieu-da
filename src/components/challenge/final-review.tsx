"use client";

/**
 * Last day (14, or 7 on the short run): full chart, three survey questions,
 * completion card, and the invitation to SkinSense early access.
 */
import Image from "next/image";
import { useId, useState } from "react";
import { SKINNIE } from "@/lib/skinnie-poses";
import { CONSENT_LABELS, SURVEY } from "@/lib/landing-copy";
import type { FinalSurvey } from "@/lib/challenge-storage";
import { trackEvent } from "@/lib/tracking";
import { chipClass, inputClass, primaryButton, secondaryButton } from "@/components/ui/button-styles";
import { useChallenge } from "./challenge-provider";
import { ConsentCheckbox } from "./consent-checkbox";
import { ShareCardButton } from "./share-card-button";
import { PhotoCompare } from "./photo-compare";
import { TrendChart } from "./trend-chart";

export function FinalReview() {
  const { state, submitFinalSurvey, closeSheet } = useChallenge();
  const total = state.programLength ?? 14;
  const learnedId = useId();
  const [answers, setAnswers] = useState<FinalSurvey>(state.finalSurvey ?? { learned: "", wantDevice: "", price: "" });
  const [allowResearch, setAllowResearch] = useState(state.consents.survey);
  const [allowShare, setAllowShare] = useState(state.consents.share);
  const answered = Boolean(state.finalSurvey);
  const logged = Object.keys(state.entries).length;
  const learnedLabel = total === 7 ? SURVEY.learned.replace("14 ngày", "7 ngày") : SURVEY.learned;

  const goToEarlyAccess = () => {
    trackEvent("early_access_click", { from: "final_tile" });
    closeSheet();
    setTimeout(() => document.getElementById("trai-nghiem-som")?.scrollIntoView({ behavior: "smooth" }), 250);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 rounded-[20px] bg-mint p-4 sm:p-5">
        <Image src={SKINNIE.cheer.src} alt="" width={SKINNIE.cheer.width} height={SKINNIE.cheer.height} className="h-auto w-20 shrink-0 sm:w-24" />
        <div>
          <p className="text-2xl font-extrabold leading-tight text-ink-strong sm:text-3xl">Bạn đã đi hết {total} ngày hiểu da.</p>
          <p className="mt-2 text-sm text-ink-soft">
            Bạn ghi được {logged}/{total} ngày. Đây là làn da của bạn qua chính những con số bạn ghi.
          </p>
        </div>
      </div>
      <TrendChart entries={state.entries} days={total} />
      <PhotoCompare upToDay={total} />

      <form
        className="flex flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          submitFinalSurvey(answers, allowResearch, allowShare);
        }}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor={learnedId} className="text-[15px] font-semibold text-ink-strong">
            {learnedLabel}
          </label>
          <textarea
            id={learnedId}
            rows={3}
            maxLength={280}
            disabled={answered}
            value={answers.learned}
            onChange={(e) => setAnswers((prev) => ({ ...prev, learned: e.target.value }))}
            className={inputClass}
          />
        </div>
        <ChoiceGroup legend={SURVEY.wantDevice} options={SURVEY.wantDeviceOptions} value={answers.wantDevice} disabled={answered} onChange={(wantDevice) => setAnswers((prev) => ({ ...prev, wantDevice }))} />
        <ChoiceGroup legend={SURVEY.price} options={SURVEY.priceOptions} value={answers.price} disabled={answered} onChange={(price) => setAnswers((prev) => ({ ...prev, price }))} />

        {!answered && (
          <div className="flex flex-col gap-3">
            {!state.consents.survey && (
              <ConsentCheckbox checked={allowResearch} onChange={setAllowResearch}>
                {CONSENT_LABELS.survey}
              </ConsentCheckbox>
            )}
            <ConsentCheckbox checked={allowShare} onChange={setAllowShare}>
              {CONSENT_LABELS.share}
            </ConsentCheckbox>
          </div>
        )}
        {answered ? (
          <p className="text-sm font-medium text-ink-strong">Đã nhận câu trả lời. Cảm ơn bạn đã đi cùng Skinnie!</p>
        ) : (
          <button type="submit" disabled={!answers.wantDevice || !answers.price} className={`${primaryButton} self-start`}>
            Gửi câu trả lời
          </button>
        )}
      </form>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ShareCardButton done={logged} total={total} headline={`Mình đã đi hết ${total} ngày hiểu da`} day={total} />
        <button type="button" onClick={goToEarlyAccess} className={secondaryButton}>
          Đăng ký trải nghiệm sớm
        </button>
      </div>
    </div>
  );
}

function ChoiceGroup(props: {
  legend: string;
  options: readonly string[];
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-[15px] font-semibold text-ink-strong">{props.legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {props.options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={props.disabled}
            aria-pressed={props.value === option}
            onClick={() => props.onChange(option)}
            className={chipClass(props.value === option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
