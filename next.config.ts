import type { NextConfig } from "next";

const repositoryName = "business-credit-system-enhancement-case-study";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: isGitHubPages ? `/${repositoryName}` : undefined,
  assetPrefix: isGitHubPages ? `/${repositoryName}/` : undefined
};

export default nextConfig;
