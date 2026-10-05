/**
 * Shape lock for the campaign: every interactive control is a full pill,
 * every surface (tile, card, sheet, input) uses a 20px radius.
 */

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60";

export const primaryButton = `${base} h-12 px-6 text-[15px] bg-accent text-on-accent hover:brightness-110 soft-shadow`;
export const secondaryButton = `${base} h-12 px-6 text-[15px] border border-line bg-paper-raised text-ink-strong hover:bg-mint`;
/** Primary action on the teal stage: cream pill, dark teal text, no glow. */
export const paperButton = `${base} h-14 px-7 text-base bg-on-stage text-[#205860] hover:bg-white`;
export const stageOutlineButton = `${base} h-14 px-7 text-base border border-stage-line text-on-stage hover:bg-stage-raised`;
export const smallPrimaryButton = `${base} h-10 px-4 text-sm bg-accent text-on-accent hover:brightness-110`;
export const quietButton = `${base} h-10 px-4 text-sm text-ink-strong hover:bg-mint`;

export const chipClass = (selected: boolean) =>
  `inline-flex items-center gap-1.5 rounded-full border px-4 h-10 text-sm font-medium transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
    selected ? "border-accent bg-accent text-on-accent" : "border-line bg-paper-raised text-ink-strong hover:bg-mint"
  }`;

export const inputClass =
  "w-full rounded-[20px] border border-line bg-paper-raised px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft focus:outline-2 focus:outline-offset-2 focus:outline-accent";
