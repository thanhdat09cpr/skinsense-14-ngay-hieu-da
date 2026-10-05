"use client";

import Image from "next/image";
import { EVENT_TILES, type EventTileId } from "@/lib/event-tile-content";
import { SKINNIE } from "@/lib/skinnie-poses";
import { useChallenge } from "./challenge-provider";
import { ConsentCheckbox } from "./consent-checkbox";

/** Content of a shared-calendar tile: a short intro and a tickable checklist. */
export function EventTilePanel({ id }: { id: EventTileId }) {
  const { state, toggleEventCheck } = useChallenge();
  const tile = EVENT_TILES.find((item) => item.id === id);
  if (!tile) return null;
  const done = state.eventChecks[id] ?? [];
  const pose = id === "womens-day" ? SKINNIE.flower : SKINNIE.halloween;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Image src={pose.src} alt="" width={pose.width} height={pose.height} className="h-auto w-20 shrink-0" />
        <p className="text-lg font-semibold leading-relaxed text-ink-strong">{tile.intro}</p>
      </div>
      <div className="flex flex-col gap-3">
        {tile.checklist.map((item) => (
          <ConsentCheckbox key={item} checked={done.includes(item)} onChange={() => toggleEventCheck(id, item)}>
            <span className="text-[15px] text-ink">{item}</span>
          </ConsentCheckbox>
        ))}
      </div>
      {id !== "womens-day" && (
        <p className="rounded-[20px] bg-mint px-4 py-3 text-sm leading-relaxed text-ink-strong">
          Nhớ chụp cùng chỗ, cùng giờ, cùng ánh sáng để ba lần ghi so được với nhau. Ảnh vẫn ở lại trong điện thoại của bạn.
        </p>
      )}
      {done.length >= tile.checklist.length && <p className="text-sm font-semibold text-accent-text">Xong ô này rồi. Giỏi ghê!</p>}
    </div>
  );
}
