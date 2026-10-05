/**
 * The landing is its own small Next.js app served under /14-ngay-hieu-da
 * (basePath in next.config.ts). The main SkinSense site mounts it with one
 * rewrite (Next.js multi-zones), so nothing here touches the main site's code
 * or styles. Fonts, colour tokens ([data-campaign]) and challenge state live here.
 */
import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import { ChallengeProvider } from "@/components/challenge/challenge-provider";
import { DiarySheet } from "@/components/challenge/diary-sheet";
import { EarlyAccessPopup } from "@/components/landing/early-access-popup";
import { GaScript } from "@/components/landing/ga-script";
import { MobileStickyCta } from "@/components/landing/mobile-sticky-cta";
import { PageNotices } from "@/components/landing/page-notices";
import { PrintDiaryTemplate } from "@/components/landing/print-diary-template";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { SkinnieGuide } from "@/components/skinnie/skinnie-guide";
import { SITE_URL } from "@/lib/campaign-config";
import "./globals.css";

// Only three sans weights and one mono weight: on slow mobile networks every
// extra font file competes with the hero image (measured with Lighthouse).
// Tailwind's 500 falls back to 400, and 700 to 800, which reads the same here.
const beVietnam = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "600", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["vietnamese", "latin"],
  weight: ["700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi">
      <body>
        <div data-campaign className={`${beVietnam.variable} ${jetbrains.variable} relative min-h-dvh antialiased`}>
          <ChallengeProvider>
            <div className="relative z-[2] print:hidden">
              <PageNotices />
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
            </div>
            <SkinnieGuide />
            <MobileStickyCta />
            <DiarySheet />
            <EarlyAccessPopup />
            <PrintDiaryTemplate />
          </ChallengeProvider>
          <GaScript />
        </div>
      </body>
    </html>
  );
}
