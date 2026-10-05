import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/campaign-config";
import { isGaConfigured } from "@/lib/tracking";

/**
 * Loads GA4 only once a real measurement id is set. When this page moves into
 * the main site, drop this component and reuse the site's existing GA4 tag.
 */
export function GaScript() {
  if (!isGaConfigured) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
