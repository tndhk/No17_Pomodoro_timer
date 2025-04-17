import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
};

// PWA設定の追加
export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  ...nextConfig,
});
