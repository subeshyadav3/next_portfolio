/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/nextjs-portofolio',
  assetPrefix: '/nextjs-portofolio/',
};

module.exports = nextConfig;
