import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@repo/supabase', '@repo/lib'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/jobs/by-type/:type',
        destination: '/jobs?job_type=:type',
        permanent: true,
      },
      {
        source: '/jobs/by-category/:category',
        destination: '/jobs?category=:category',
        permanent: true,
      },
      {
        source: '/jobs/by-country/:country',
        destination: '/jobs?location_country=:country',
        permanent: true,
      },
      {
        source: '/jobs/by-location-type/:loc',
        destination: '/jobs?location_type=:loc',
        permanent: true,
      },
      {
        source: '/jobs/by-language-level/:level',
        destination: '/jobs?korean_level=:level',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig
