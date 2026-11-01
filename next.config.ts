import type { NextConfig } from "next";

// Build targets:
//  - GITHUB_PAGES=true      → static export under /kai-dart (existing Pages deployment)
//  - EXPORT_TARGET=cloudflare → static export at the site root (Cloudflare Pages preview/production)
//  - default                → standalone server build (Docker)
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isCloudflare = process.env.EXPORT_TARGET === "cloudflare";

const nextConfig: NextConfig = {
  output: isGitHubPages || isCloudflare ? "export" : "standalone",
  basePath: isGitHubPages ? "/kai-dart" : "",
  assetPrefix: isGitHubPages ? "/kai-dart/" : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/kai-dart" : "",
  },
};

export default nextConfig;
