import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  // GitHub Pagesでの静的サイトデプロイ用設定
  output: isGitHubPages ? 'export' : undefined,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: isGitHubPages
  },
  basePath: isGitHubPages ? '/shojo_webpage' : '',
  assetPrefix: isGitHubPages ? '/shojo_webpage/' : '',
  
  // Turbopack is enabled by default in Next.js 15 dev mode
  // For production builds, use webpack instead
};

export default nextConfig;
