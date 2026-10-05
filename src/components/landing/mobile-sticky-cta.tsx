"use client";

/**
 * Phones only: once the hero scrolls away, the primary action stays pinned to
 * the bottom of the screen ("Bắt đầu Ngày 1" / "Mở ô hôm nay"). Hidden while the
 * hero's own button is on screen (tracked on the button itself, below the sticky
 * header, since a sliver of hero can stay visible), over the closing block, and
 * while a sheet is open.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useChallenge } from "@/components/challenge/challenge-provider";
import { usePrimaryCta } from "@/components/challenge/use-primary-cta";
import { paperButton } from "@/components/ui/button-styles";

export function MobileStickyCta() {
  const { sheet } = useChallenge();
  const cta = usePrimaryCta();
  const reduce = useReducedMotion();
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);
  const [closingVisible, setClosingVisible] = useState(false);

  useEffect(() => {
    const heroCta = document.getElementById("hero-cta");
    const closing = document.getElementById("trai-nghiem-som");
    // The sticky header (64px) covers the top of the viewport, so it does not count as visible.
    const heroObserver = new IntersectionObserver(([record]) => setHeroCtaVisible(record.isIntersecting), { rootMargin: "-64px 0px 0px 0px" });
    const closingObserver = new IntersectionObserver(([record]) => setClosingVisible(record.isIntersecting));
    if (heroCta) heroObserver.observe(heroCta);
    if (closing) closingObserver.observe(closing);
    return () => {
      heroObserver.disconnect();
      closingObserver.disconnect();
    };
  }, []);

  const show = !heroCtaVisible && !closingVisible && !sheet;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[55] border-t border-stage-line bg-stage/95 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur-md lg:hidden print:hidden"
          initial={reduce ? { opacity: 0 } : { y: 90 }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: 90 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <button type="button" onClick={cta.onClick} className={`${paperButton} h-12 w-full`}>
            {cta.label}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
