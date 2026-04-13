import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.popcon.store',
      },
      {
        protocol: 'https',
        hostname: 'cdn.popcon.com',
      },
      {
        protocol: 'https',
        hostname: 'imagelink.com',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  turbopack: {},
};

export default nextConfig;
