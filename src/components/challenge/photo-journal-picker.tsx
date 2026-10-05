"use client";

/**
 * "Thêm ảnh hôm nay": take or pick a photo for this diary day. The photo is
 * compressed and kept in this browser only; the copy says exactly that, so the
 * participant knows nothing is uploaded. Demo mode keeps photos in memory.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CameraPlusIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { compressPhoto, deletePhoto, loadPhoto, savePhoto } from "@/lib/photo-journal-store";
import { quietButton } from "@/components/ui/button-styles";
import { useChallenge } from "./challenge-provider";

type Status = "idle" | "saving" | "saved" | "error";

export function PhotoJournalPicker({ day, editable }: { day: number; editable: boolean }) {
  const { isDemo } = useChallenge();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  // Show the photo already stored for this day, if any.
  useEffect(() => {
    if (isDemo) return;
    let objectUrl: string | null = null;
    loadPhoto(day).then((blob) => {
      if (!blob) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [day, isDemo]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setStatus("saving");
    try {
      const blob = await compressPhoto(file);
      const ok = isDemo || (await savePhoto(day, blob));
      if (!ok) throw new Error("storage unavailable");
      setUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(blob);
      });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  const remove = async () => {
    if (!isDemo) await deletePhoto(day);
    setUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setStatus("idle");
  };

  if (!editable && !url) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[15px] font-semibold text-ink-strong">Ảnh hôm nay</p>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => onFile(event.target.files?.[0])} />

      {url ? (
        <div className="relative overflow-hidden rounded-[20px] border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL, not optimisable */}
          <img src={url} alt={`Ảnh nhật ký Ngày ${day}`} className="aspect-[4/5] w-full object-cover sm:aspect-[4/3]" />
          {status === "saved" && (
            <motion.p
              className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-paper-raised px-3 py-1.5 text-[13px] font-semibold text-ink-strong shadow-md"
              initial={reduce ? false : { scale: 1.4, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
            >
              <CheckCircleIcon weight="fill" className="size-4 text-done" />
              Đã lưu vào nhật ký trên máy bạn
            </motion.p>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "saving"}
          className="flex flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-dashed border-line bg-paper px-4 py-7 text-center transition hover:border-accent hover:bg-mint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <CameraPlusIcon weight="duotone" className="size-8 text-accent-text" />
          <span className="text-[15px] font-semibold text-ink-strong">{status === "saving" ? "Đang lưu ảnh..." : "Thêm ảnh hôm nay"}</span>
          <span className="max-w-[34ch] text-[13px] leading-relaxed text-ink-soft">Không bắt buộc. Ảnh chỉ lưu trên máy bạn, không gửi đi đâu.</span>
        </button>
      )}

      {status === "error" && <p className="text-sm font-medium text-accent-text">Chưa lưu được ảnh trên trình duyệt này. Ảnh vẫn nằm trong thư viện điện thoại của bạn.</p>}
      {url && editable && (
        <div className="flex gap-2">
          <button type="button" className={quietButton} onClick={() => inputRef.current?.click()}>
            Đổi ảnh
          </button>
          <button type="button" className={quietButton} onClick={remove}>
            Xóa ảnh
          </button>
        </div>
      )}
    </div>
  );
}
