"use client";

/**
 * Skinnie as a travelling companion. On desktop it flies to a resting spot
 * beside each section as the visitor scrolls; on phones it sits small in the
 * bottom-right corner and hops when it has something to say. Hidden over the
 * hero and the closing section, where a large Skinnie is already on screen.
 */
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useChallenge } from "@/components/challenge/challenge-provider";
import { SKINNIE } from "@/lib/skinnie-poses";
import { GUIDE_STOPS, type GuideStopId } from "./skinnie-guide-stops";

const GUIDE_WIDTH = 116;
const POSE = SKINNIE.point;
const GUIDE_HEIGHT = Math.round(GUIDE_WIDTH * (POSE.height / POSE.width));
const DESKTOP_MIN = 1024;

function subscribeResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}
const readViewport = () => `${window.innerWidth}x${window.innerHeight}`;

export function SkinnieGuide() {
  const challenge = useChallenge();
  const reduce = useReducedMotion();
  const [width, height] = useSyncExternalStore(subscribeResize, readViewport, () => "0x0").split("x").map(Number);
  const [stop, setStop] = useState<GuideStopId>("hero");
  const [stopBubble, setStopBubble] = useState<{ text: string; key: number } | null>(null);
  const [dismissedKey, setDismissedKey] = useState(0);
  const messageFor = useRef<(id: GuideStopId) => string>(() => "");

  // Keep the latest state-aware message builder for the observer callback.
  useEffect(() => {
    messageFor.current = (id) => GUIDE_STOPS[id].message(challenge);
  });

  // The section crossing the middle band of the viewport is where Skinnie rests.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-skinnie-stop]"));
    const observer = new IntersectionObserver(
      (records) => {
        const hit = records.find((record) => record.isIntersecting);
        const id = hit?.target.getAttribute("data-skinnie-stop") as GuideStopId | null;
        if (!id || !(id in GUIDE_STOPS)) return;
        setStop(id);
        const text = messageFor.current(id);
        setStopBubble(text ? { text, key: Date.now() } : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Newest message wins: a section greeting or something the page asked Skinnie to say.
  const latest =
    challenge.guideMessage && (!stopBubble || challenge.guideMessage.key > stopBubble.key) ? challenge.guideMessage : stopBubble;
  const bubbleVisible = Boolean(latest && latest.key !== dismissedKey);

  useEffect(() => {
    if (!latest) return;
    const timer = setTimeout(() => setDismissedKey(latest.key), 5500);
    return () => clearTimeout(timer);
  }, [latest]);

  if (!width) return null;
  const config = GUIDE_STOPS[stop];
  const isDesktop = width >= DESKTOP_MIN;
  const hidden = config.hidden;
  const onLeft = isDesktop && config.side === "left";

  const target = isDesktop
    ? {
        x: hidden ? width * 0.7 : onLeft ? 24 : width - GUIDE_WIDTH - 28,
        y: hidden ? height * 0.18 : height * config.y - GUIDE_HEIGHT / 2,
        scale: hidden ? 1.7 : 1,
        opacity: hidden ? 0 : 1,
      }
    : {
        x: width - 72 - 12,
        y: height - 92 - 84, // clears the sticky CTA bar
        scale: hidden ? 0.6 : 1,
        opacity: hidden ? 0 : 1,
      };

  const replay = () => {
    const text = messageFor.current(stop);
    if (text) setStopBubble({ text, key: Date.now() });
  };

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[60] print:hidden"
      style={{ width: isDesktop ? GUIDE_WIDTH : 72 }}
      initial={false}
      animate={target}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 55, damping: 14, mass: 1.1 }}
    >
      <AnimatePresence>
        {bubbleVisible && latest && !hidden && (
          <motion.p
            key={latest.key}
            role="status"
            className={`absolute w-max max-w-[220px] rounded-[20px] border border-line bg-paper-raised px-4 py-2.5 text-[13px] font-medium leading-snug text-ink-strong soft-shadow ${
              isDesktop
                ? onLeft
                  ? "left-full top-2 ml-2 rounded-tl-md"
                  : "right-full top-2 mr-2 rounded-tr-md"
                : "bottom-full right-0 mb-2 rounded-br-md"
            }`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            {latest.text}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={replay}
        aria-label="Skinnie, bấm để nghe lại lời nhắn"
        tabIndex={hidden ? -1 : 0}
        className={`block w-full ${hidden ? "" : "pointer-events-auto"} cursor-pointer focus-visible:outline-2 focus-visible:outline-accent`}
        animate={reduce || hidden ? undefined : { y: [0, -8, 0], rotate: onLeft ? [2, -2, 2] : [-2, 2, -2] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={POSE.src}
          alt=""
          width={POSE.width}
          height={POSE.height}
          sizes="116px"
          className={`h-auto w-full drop-shadow-[0_18px_22px_rgb(32_88_96/0.28)] ${onLeft ? "-scale-x-100" : ""}`}
        />
      </motion.button>
    </motion.div>
  );
}
