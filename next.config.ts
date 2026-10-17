import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons', 'framer-motion'],
  },
  headers: async () => [
    {
      source: '/Harmonia-mobile.apk',
      headers: [
        {
          key: 'Content-Type',
          value: 'application/vnd.android.package-archive',
        },
        {
          key: 'Content-Disposition',
          value: 'attachment; filename="Harmonia-mobile.apk"',
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400',
        },
      ],
    },
    {
      source: '/releases/:file*.apk',
      headers: [
        {
          key: 'Content-Type',
          value: 'application/vnd.android.package-archive',
        },
        {
          key: 'Content-Disposition',
          value: 'attachment',
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/:all*(svg|jpg|png|webp|avif|mp4)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}

export default nextConfig
