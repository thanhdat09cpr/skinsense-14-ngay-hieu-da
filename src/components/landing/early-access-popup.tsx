"use client";

/**
 * Early-access popup, so the offer is seen even by visitors who never scroll
 * to the bottom. It waits for real interest instead of firing on load:
 * past ~60% of the page, exit intent on desktop, or 45s on the page; never in
 * the first 12s, never over an open diary sheet, at most once per 3 days, and
 * never again after the visitor has signed up. `?popup=1` opens it right away
 * for reviewers and does not snooze it on close.
 */
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { XIcon } from "@phosphor-icons/react";
import { SKINNIE } from "@/lib/skinnie-poses";
import { useChallenge } from "@/components/challenge/challenge-provider";
import { EarlyAccessForm } from "./early-access-form";

const SNOOZE_KEY = "skinsense-14-ngay:popup-snoozed-until";
const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;
const MIN_DELAY_MS = 12_000;
const TIME_TRIGGER_MS = 45_000;

function isSnoozed(): boolean {
  try {
    return Number(window.localStorage.getItem(SNOOZE_KEY) ?? 0) > Date.now();
  } catch {
    return false;
  }
}

function snooze() {
  try {
    window.localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
  } catch {
    // Without storage the popup may show again next visit; acceptable.
  }
}

export function EarlyAccessPopup() {
  const { ready, state, sheet } = useChallenge();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [wanted, setWanted] = useState(false);
  const mountedAt = useRef(0);
  const previewMode = useRef(false);
  const eligible = ready && !state.earlyAccess;

  useEffect(() => {
    mountedAt.current = Date.now();
    previewMode.current = new URLSearchParams(window.location.search).get("popup") === "1";
    if (!previewMode.current) return;
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Collect triggers; the popup itself opens only when nothing else is in the way.
  const want = useCallback(() => setWanted(true), []);
  useEffect(() => {
    if (!eligible) return;
    const timer = setTimeout(want, TIME_TRIGGER_MS);
    const deepSection = document.getElementById("tuong-chia-se");
    const observer = new IntersectionObserver((records) => records.some((r) => r.isIntersecting) && want(), { threshold: 0.2 });
    if (deepSection) observer.observe(deepSection);
    const onLeave = (event: MouseEvent) => event.clientY <= 0 && want();
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [eligible, want]);

  useEffect(() => {
    if (!wanted || open || !eligible || sheet || isSnoozed()) return;
    const wait = Math.max(0, MIN_DELAY_MS - (Date.now() - mountedAt.current));
    const timer = setTimeout(() => setOpen(true), wait);
    return () => clearTimeout(timer);
  }, [wanted, open, eligible, sheet]);

  const close = useCallback(() => {
    if (!previewMode.current) snooze();
    setOpen(false);
    setWanted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center sm:p-6 print:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="early-access-title"
            onClick={(event) => event.stopPropagation()}
            className="relative grid w-full overflow-hidden rounded-t-[20px] bg-paper-raised shadow-2xl sm:max-w-3xl sm:rounded-[20px] md:grid-cols-[0.9fr_1.1fr]"
            initial={reduce ? { opacity: 0 } : { y: 60, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <button type="button" onClick={close} aria-label="Đóng" className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-paper-raised/90 text-ink-strong shadow-md hover:bg-mint">
              <XIcon weight="bold" className="size-5" />
            </button>

            {/* Stage side: Skinnie and the hook */}
            <div className="relative flex items-center gap-4 bg-stage px-6 pb-4 pt-8 text-on-stage md:flex-col md:items-start md:justify-between md:p-8">
              <p id="early-access-title" className="max-w-[14ch] text-3xl font-extrabold leading-[1.02] tracking-tight md:text-4xl">
                Muốn theo dõi da <span className="text-accent-bright">chính xác hơn?</span>
              </p>
              <motion.div
                className="relative w-[110px] shrink-0 md:mx-auto md:w-[220px]"
                initial={reduce ? false : { y: 20, rotate: -6 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.15 }}
              >
                <span className="absolute left-1/2 top-1/2 aspect-square w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-stage-raised" />
                <Image src={SKINNIE.magnifier.src} alt="" width={SKINNIE.magnifier.width} height={SKINNIE.magnifier.height} sizes="220px" className="relative h-auto w-full drop-shadow-[0_20px_24px_rgb(0_0_0/0.35)]" />
              </motion.div>
            </div>

            {/* Paper side: the offer and the form */}
            <div className="flex flex-col gap-4 p-6 md:p-8">
              <p className="font-mono text-sm font-bold text-accent-text">SkinSense AI đang phát triển</p>
              <h2 className="text-2xl font-extrabold leading-tight text-ink-strong">Đăng ký trải nghiệm sớm thiết bị soi da cá nhân</h2>
              <p className="text-[15px] leading-relaxed text-ink-soft">Ghi nhận da trong cùng một điều kiện, thấy thay đổi theo thời gian. Người đăng ký sớm được báo đầu tiên khi có bản dùng thử.</p>
              <EarlyAccessForm tone="paper" source="popup" />
              <button type="button" onClick={close} className="self-start text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-ink-strong">
                Để sau
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
