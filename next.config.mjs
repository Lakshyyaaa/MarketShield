const BACKEND_URL = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/stocks/:path*',
        destination: `${BACKEND_URL}/api/stocks/:path*`,
      },
      {
        source: '/api/investment-guide/:path*',
        destination: `${BACKEND_URL}/api/investment-guide/:path*`,
      },
      {
        source: '/api/sebi/:path*',
        destination: `${BACKEND_URL}/api/sebi/:path*`,
      },
      {
        source: '/api/analyze',
        destination: `${BACKEND_URL}/api/analyze`,
      },
      {
        source: '/api/demo-cases',
        destination: `${BACKEND_URL}/api/demo-cases`,
      },
      {
        source: '/api/history',
        destination: `${BACKEND_URL}/api/history`,
      },
      {
        source: '/api/scam/:path*',
        destination: `${BACKEND_URL}/api/scam/:path*`,
      },
    ];
  },
};

export default nextConfig;
