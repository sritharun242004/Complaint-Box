/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActionsBodySizeLimit: '10mb',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  turbopack: {
    root: '.',
  },
};

export default nextConfig;
