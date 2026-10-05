"use client";

/**
 * Day 1 next to the latest photo, shown only to the participant on their own
 * device at Day 7 and the final day. Framed as "same conditions?", never as a
 * before/after result claim.
 */
import { useEffect, useState } from "react";
import { loadPhoto } from "@/lib/photo-journal-store";
import { useChallenge } from "./challenge-provider";

interface Shot {
  day: number;
  url: string;
}

export function PhotoCompare({ upToDay }: { upToDay: number }) {
  const { isDemo } = useChallenge();
  const [shots, setShots] = useState<[Shot, Shot] | null>(null);

  useEffect(() => {
    if (isDemo) return;
    const urls: string[] = [];
    (async () => {
      const first = await loadPhoto(1);
      if (!first) return;
      for (let day = upToDay; day >= 2; day -= 1) {
        const latest = await loadPhoto(day);
        if (latest) {
          const pair: [Shot, Shot] = [
            { day: 1, url: URL.createObjectURL(first) },
            { day, url: URL.createObjectURL(latest) },
          ];
          urls.push(pair[0].url, pair[1].url);
          setShots(pair);
          return;
        }
      }
    })();
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [isDemo, upToDay]);

  if (!shots) return null;

  return (
    <figure className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {shots.map((shot) => (
          <div key={shot.day} className="relative overflow-hidden rounded-[20px] border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL from IndexedDB */}
            <img src={shot.url} alt={`Ảnh Ngày ${shot.day}`} className="aspect-[4/5] w-full object-cover" />
            <span className="absolute left-2 top-2 rounded-full bg-paper-raised px-2.5 py-1 font-mono text-xs font-bold text-ink-strong">Ngày {shot.day}</span>
          </div>
        ))}
      </div>
      <figcaption className="text-[13px] leading-relaxed text-ink-soft">
        Chỉ bạn nhìn thấy, ảnh không rời khỏi máy. Hai ảnh có cùng chỗ, cùng giờ, cùng ánh sáng không? So sánh chỉ có ý nghĩa khi điều kiện giống nhau.
      </figcaption>
    </figure>
  );
}
