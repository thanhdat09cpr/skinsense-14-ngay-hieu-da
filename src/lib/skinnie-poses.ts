/**
 * Skinnie artwork (transparent PNGs in public/skinnie). The poses were
 * generated from the brand reference and trimmed to their visible bounds.
 */
import { asset } from "./campaign-config";
import type { EventTheme } from "./challenge-rules";

export interface SkinniePose {
  src: string;
  width: number;
  height: number;
}

export const SKINNIE = {
  magnifier: { src: asset("/skinnie/skinnie.png"), width: 707, height: 900 },
  wave: { src: asset("/skinnie/skinnie-wave.png"), width: 712, height: 900 },
  puzzled: { src: asset("/skinnie/skinnie-puzzled.png"), width: 612, height: 900 },
  cheer: { src: asset("/skinnie/skinnie-cheer.png"), width: 765, height: 900 },
  flower: { src: asset("/skinnie/skinnie-flower.png"), width: 665, height: 900 },
  halloween: { src: asset("/skinnie/skinnie-halloween.png"), width: 711, height: 900 },
  point: { src: asset("/skinnie/skinnie-point.png"), width: 719, height: 900 },
} satisfies Record<string, SkinniePose>;

/** Hero companion: points at the Day 1 diary page; flower on 20/10, witch hat for Halloween. */
export function heroPose(theme: EventTheme): SkinniePose {
  if (theme === "womens-day") return SKINNIE.flower;
  if (theme === "halloween") return SKINNIE.halloween;
  return SKINNIE.point;
}
