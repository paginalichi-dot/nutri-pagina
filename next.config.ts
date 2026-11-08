import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: {
    agentFeedback: true,
    authInterrupts: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  logging: {
    serverFunctions: false,
  },
  turbopack: {
    root: __dirname,
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
