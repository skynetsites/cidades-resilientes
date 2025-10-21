/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: isProd ? '/cidades-resilientes' : '',
  assetPrefix: isProd ? '/cidades-resilientes/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
