import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pagesでの静的サイトデプロイ用設定
  output: process.env.GITHUB_PAGES === 'true' ? 'export' : undefined,
  trailingSlash: process.env.GITHUB_PAGES === 'true',
  images: {
    unoptimized: process.env.GITHUB_PAGES === 'true'
  },
  basePath: process.env.GITHUB_PAGES === 'true' ? '/shojo_webpage' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/shojo_webpage/' : '',
  
  // Turbopack is enabled by default in Next.js 15 dev mode
  // For production builds, use webpack instead
};

export default nextConfig;
