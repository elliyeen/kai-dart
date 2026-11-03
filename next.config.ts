import type { NextConfig } from "next";

// Build targets:
//  - GITHUB_PAGES=true      → static export under /kai-dart (existing Pages deployment)
//  - EXPORT_TARGET=cloudflare → static export at the site root (Cloudflare Pages preview/production)
//  - EXPORT_TARGET=cloudflare-dart → static export under /dart, merged into the www.elliyeen.com build (one prefix, applied once)
//  - default                → standalone server build (Docker)
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isCloudflare = process.env.EXPORT_TARGET === "cloudflare";
const isCloudflareDart = process.env.EXPORT_TARGET === "cloudflare-dart";
const prefix = isGitHubPages ? "/kai-dart" : isCloudflareDart ? "/dart" : "";

const nextConfig: NextConfig = {
  output: isGitHubPages || isCloudflare || isCloudflareDart ? "export" : "standalone",
  basePath: prefix,
  assetPrefix: prefix ? `${prefix}/` : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: prefix,
  },
};

export default nextConfig;
