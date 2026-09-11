import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * على استضافة Node.js (Hostinger / Vercel) يعمل `next start` مباشرة.
   * عند البناء داخل Docker نضبط STANDALONE=1 للحصول على حزمة مستقلة (server.js).
   */
  output: process.env.STANDALONE === "1" ? "standalone" : undefined,
  poweredByHeader: false,
};

export default nextConfig;
