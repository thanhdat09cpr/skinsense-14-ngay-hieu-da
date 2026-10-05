"use client";

/**
 * The only place the product appears: after the visitor has felt the limits
 * of eyeballing their skin, SkinSense is offered as "a better magnifier".
 * Deep-teal block near the end, with a big Skinnie and a cream CTA.
 * No price, no buy button (brief section 10).
 */
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { SITE_LINKS } from "@/lib/campaign-config";
import { SKINNIE } from "@/lib/skinnie-poses";
import { trackEvent } from "@/lib/tracking";
import { stageOutlineButton } from "@/components/ui/button-styles";
import { EarlyAccessForm } from "./early-access-form";
import { Reveal } from "./reveal";

export function ClosingSection() {
  const reduce = useReducedMotion();

  return (
    <section id="trai-nghiem-som" data-skinnie-stop="trai-nghiem-som" className="scroll-mt-20 px-2 pb-2 pt-10 sm:px-4 sm:pb-4">
      <div className="relative overflow-hidden rounded-[20px] bg-stage text-on-stage">
        <div className="mx-auto grid max-w-[1200px] items-center gap-6 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal>
            <h2 className="max-w-[16ch] text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-7xl">
              Sau 14 ngày, muốn theo dõi <span className="text-accent-bright">chính xác hơn?</span>
            </h2>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-on-stage-soft">
              SkinSense AI là thiết bị soi da cá nhân kết hợp ứng dụng, đang được phát triển. Nó ghi nhận da trong cùng một điều kiện để bạn thấy thay đổi theo thời gian. Không thay thế bác sĩ da liễu.
            </p>

            <div className="mt-8 max-w-xl">
              <EarlyAccessForm tone="stage" source="closing" />
            </div>
            <a href={SITE_LINKS.demo} onClick={() => trackEvent("demo_click", { from: "closing" })} className={`${stageOutlineButton} mt-6`}>
              Thử demo nhu cầu da
            </a>
          </Reveal>

          <motion.div
            className="relative mx-auto w-full max-w-[380px]"
            initial={reduce ? false : { y: 50, rotate: 6 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
          >
            <span className="absolute left-1/2 top-1/2 aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-stage-raised" />
            <span className="absolute left-1/2 top-1/2 aspect-square w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-stage-line" />
            <Image
              src={SKINNIE.magnifier.src}
              alt="Skinnie, linh vật của SkinSense, cầm kính lúp"
              width={SKINNIE.magnifier.width}
              height={SKINNIE.magnifier.height}
              sizes="380px"
              className="relative h-auto w-full drop-shadow-[0_34px_40px_rgb(0_0_0/0.4)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
