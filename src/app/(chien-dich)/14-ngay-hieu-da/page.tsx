import type { Metadata } from "next";
import { PAGE_PATH } from "@/lib/campaign-config";
import { CalendarSection } from "@/components/challenge/calendar-section";
import { ClosingSection } from "@/components/landing/closing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PrivacySection } from "@/components/landing/privacy-section";
import { ReminderSection } from "@/components/landing/reminder-section";
import { ShareWallSection } from "@/components/landing/share-wall-section";
import { SloganTape } from "@/components/landing/slogan-tape";

const TITLE = "14 ngày hiểu da | SkinSense AI";
const DESCRIPTION =
  "Thử thách #14NgayHieuDa: mỗi ngày mở một ô, ghi lại làn da trong 30 giây. Miễn phí, không cần mua gì, không cần đăng ảnh mặt.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_PATH,
    siteName: "SkinSense AI",
    locale: "vi_VN",
    type: "website",
  },
};

export default function FourteenDayChallengePage() {
  return (
    <>
      <HeroSection />
      <SloganTape />
      <CalendarSection />
      <HowItWorksSection />
      <ReminderSection />
      <ShareWallSection />
      <PrivacySection />
      <FaqSection />
      <ClosingSection />
    </>
  );
}
