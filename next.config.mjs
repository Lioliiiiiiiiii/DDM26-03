/** @type {import('next').NextConfig} */
const isGitHubPagesExport = process.env.GITHUB_PAGES === 'true' && process.env.NODE_ENV === 'production';
const pagesRepo = process.env.GITHUB_PAGES_REPO || process.env.GITHUB_REPOSITORY?.split('/')?.[1] || 'DDM26-03';
const pagesBasePath = `/${pagesRepo}`;

const nextConfig = {
  reactStrictMode: true,
  output: isGitHubPagesExport ? 'export' : undefined,
  trailingSlash: isGitHubPagesExport,
  images: {
    unoptimized: true
  },
  basePath: isGitHubPagesExport ? pagesBasePath : undefined,
  assetPrefix: isGitHubPagesExport ? `${pagesBasePath}/` : undefined
};

export default nextConfig;
