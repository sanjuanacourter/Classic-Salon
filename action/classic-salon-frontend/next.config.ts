import type { NextConfig } from "next";

// Auto-deduce basePath/assetPrefix for GitHub Pages
const repoFull = process.env.GITHUB_REPOSITORY || ""; // owner/repo when on Actions
const owner = process.env.GITHUB_REPOSITORY_OWNER || repoFull.split("/")[0] || "";
const repo = repoFull.split("/")[1] || "";
const isUserIo = repo && owner && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;

// Allow explicit override from env, fallback to computed value on CI, empty locally
const computedBasePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined
  ? process.env.NEXT_PUBLIC_BASE_PATH
  : (repo ? (isUserIo ? "" : `/${repo}`) : "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {},
  },
  // Static export for GitHub Pages
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Base path/asset prefix for Pages
  basePath: computedBasePath || undefined,
  assetPrefix: computedBasePath || undefined,
};

export default nextConfig;




