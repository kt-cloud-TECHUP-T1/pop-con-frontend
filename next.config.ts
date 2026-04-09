import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // csv 데이터 기준
        hostname: 'popply.co.kr',
      },
      {
        protocol: 'https',
        // csv 데이터 기준
        hostname: 'cdn.popga.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'img1.newsis.com',
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
