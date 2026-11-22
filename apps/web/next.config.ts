import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@psicoiris/ui',
    '@psicoiris/motion',
    '@psicoiris/database',
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
