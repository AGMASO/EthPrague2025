/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/1inch-api/:path*',
        destination: 'https://api.1inch.dev/:path*',
        basePath: false
      }
    ];
  }
};

export default nextConfig;
