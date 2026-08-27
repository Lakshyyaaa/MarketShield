/** @type {import('next').NextConfig} */
const nextConfig = {
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
        destination: 'http://127.0.0.1:8000/api/stocks/:path*',
      },
      {
        source: '/api/investment-guide/:path*',
        destination: 'http://127.0.0.1:8000/api/investment-guide/:path*',
      },
      {
        source: '/api/sebi/:path*',
        destination: 'http://127.0.0.1:8000/api/sebi/:path*',
      },
      {
        source: '/api/analyze',
        destination: 'http://127.0.0.1:8000/api/analyze',
      },
      {
        source: '/api/demo-cases',
        destination: 'http://127.0.0.1:8000/api/demo-cases',
      },
      {
        source: '/api/history',
        destination: 'http://127.0.0.1:8000/api/history',
      },
      {
        source: '/api/scam/:path*',
        destination: 'http://127.0.0.1:8000/api/scam/:path*',
      },
    ];
  },
};

export default nextConfig;
