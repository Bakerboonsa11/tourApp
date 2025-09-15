import type { NextConfig } from "next";
import createNextIintlPlugin from "next-intl/plugin";
// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};
const withNextIntl=createNextIintlPlugin()

module.exports = withNextIntl(nextConfig);
