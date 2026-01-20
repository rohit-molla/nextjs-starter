import { routing } from './i18n/routing';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Add any other Next.js config options here
  images: {
    unoptimized: true,
  },
  experimental: {
    // This is often needed for newer Next.js versions on Replit
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
