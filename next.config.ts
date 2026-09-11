import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** بناء مستقل (server.js + الحد الأدنى من node_modules) للنشر عبر Docker على VPS */
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
