import type { NextConfig } from "next";

/**
 * The landing is served under /14-ngay-hieu-da so the main SkinSense site can
 * mount it with a single rewrite (Next.js multi-zones). Keep in sync with
 * PAGE_PATH in src/lib/campaign-config.ts.
 */
const BASE_PATH = "/14-ngay-hieu-da";

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  async redirects() {
    // Visiting this deployment's bare domain lands on the campaign page.
    return [{ source: "/", destination: BASE_PATH, basePath: false, permanent: false }];
  },
};

export default nextConfig;
