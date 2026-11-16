import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@psicoiris/ui', '@psicoiris/motion', '@psicoiris/database'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
