/** @type {import('next').NextConfig} */


const securityHeaders = [{key: 'X-XSS-Protection', value: '1; mode=block'}, {key: 'X-Content-Type-Options', value: 'nosniff'}];


const nextConfig = {
  reactStrictMode: true,
  distDir: 'build',
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ]
  }
}

module.exports = nextConfig
