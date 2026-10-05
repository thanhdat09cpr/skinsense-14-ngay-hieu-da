"use client";

/**
 * "Điều mình hiểu hơn về làn da": notes pinned slightly askew like sticky
 * notes on a desk. Only consented, team-approved quotes will appear here;
 * until then the three samples are clearly labelled as illustrations.
 */
import { motion, useReducedMotion } from "motion/react";
import { SAMPLE_SHARES } from "@/lib/landing-copy";
import { Reveal } from "./reveal";

const TILTS = [-2.5, 1.5, -1];
// Paper notes in the brand's jade and cream tones, all with dark ink text.
const NOTE_TONES = ["bg-done-soft text-ink-strong", "bg-paper-raised text-ink-strong border border-line", "bg-mint text-ink-strong"];
const OFFSETS = ["md:mt-0", "md:mt-16", "md:mt-6"];

export function ShareWallSection() {
  const reduce = useReducedMotion();
  return (
    <section id="tuong-chia-se" data-skinnie-stop="tuong-chia-se" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-4xl font-extrabold leading-[1] tracking-tight text-ink-strong sm:text-6xl">Điều mình hiểu hơn về làn da</h2>
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-soft">Câu minh họa</span>
        </div>
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-ink-soft">
          Câu thật của người tham gia sẽ hiện ở đây khi người gửi đồng ý và nhóm đã duyệt.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
        {SAMPLE_SHARES.map((share, index) => (
          <motion.figure
            key={share.name}
            className={`rounded-[20px] p-7 soft-shadow ${NOTE_TONES[index]} ${OFFSETS[index]}`}
            initial={reduce ? false : { opacity: 0, y: 30, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: TILTS[index] }}
            whileHover={reduce ? undefined : { rotate: 0, y: -4 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 140, damping: 18, delay: index * 0.08 }}
          >
            <blockquote className="text-xl font-semibold leading-snug">“{share.quote}”</blockquote>
            <figcaption className="mt-5 text-sm opacity-80">
              <span className="font-bold">{share.name}</span>, {share.role}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
