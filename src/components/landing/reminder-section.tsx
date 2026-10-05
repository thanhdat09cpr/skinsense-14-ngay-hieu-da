"use client";

/**
 * Reminder sign-up on a deep-teal colour block: big headline, a large Skinnie
 * pointing at the form, and the form itself on a cream card. Open to anyone,
 * any day of the campaign.
 */
import Image from "next/image";
import { CalendarPlusIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { downloadReminderIcs } from "@/lib/calendar-reminder-ics";
import { SKINNIE } from "@/lib/skinnie-poses";
import { useChallenge } from "@/components/challenge/challenge-provider";
import { JoinReminderForm } from "@/components/challenge/join-reminder-form";
import { stageOutlineButton } from "@/components/ui/button-styles";
import { Reveal } from "./reveal";

export function ReminderSection() {
  const { ready, state } = useChallenge();
  const reduce = useReducedMotion();
  const canAddToCalendar = ready && state.startDate && state.programLength;

  return (
    <section id="nhac-nho" data-skinnie-stop="nhac-nho" className="scroll-mt-20 px-2 py-10 sm:px-4">
      <div className="relative overflow-hidden rounded-[20px] bg-stage text-on-stage">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <Reveal>
            <h2 className="text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
              Để Skinnie
              <br />
              <span className="text-accent-bright">nhắc bạn</span>
            </h2>
            <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-on-stage-soft">
              Email nhắc vào Ngày 7 và Ngày 14. Hoặc thêm thẳng nhắc nhở vào lịch điện thoại, khỏi phải nhớ.
            </p>
            {canAddToCalendar && (
              <button
                type="button"
                onClick={() => state.startDate && state.programLength && downloadReminderIcs(state.startDate, state.programLength)}
                className={`${stageOutlineButton} mt-8`}
              >
                <CalendarPlusIcon weight="bold" className="size-5" />
                Thêm nhắc vào lịch
              </button>
            )}
            <motion.div
              className="mt-6 hidden w-[230px] lg:block"
              initial={reduce ? false : { x: -40, rotate: -8 }}
              whileInView={{ x: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 110, damping: 12 }}
            >
              <Image
                src={SKINNIE.point.src}
                alt=""
                width={SKINNIE.point.width}
                height={SKINNIE.point.height}
                sizes="230px"
                className="h-auto w-full -scale-x-100 drop-shadow-[0_28px_32px_rgb(0_0_0/0.35)]"
              />
            </motion.div>
          </Reveal>

          <Reveal delay={0.08} className="rounded-[20px] bg-paper-raised p-5 text-ink shadow-2xl sm:p-8">
            {ready && state.joined && (
              <p className="mb-6 text-[15px] leading-relaxed text-ink-strong">
                Bạn đã đăng ký nhắc với <strong>{state.joined.email}</strong>. Muốn đổi email, điền lại bên dưới.
              </p>
            )}
            <JoinReminderForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
