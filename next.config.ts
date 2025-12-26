import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {},
  // 1. API 요청을 우회시키는 rewrite 설정 추가
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://43.201.18.138:8080/api/:path*',
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  devIndicators: false,
};

export default nextConfig;
