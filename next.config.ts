import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

// Для dev можна динамічно додавати allowedDevOrigins через NODE_ENV
if (process.env.NODE_ENV !== 'production') {
  ;(nextConfig.experimental as any) = {
    allowedDevOrigins: ['https://dzencode-tt-production.up.railway.app'],
  }
}

export default withNextIntl(nextConfig)
