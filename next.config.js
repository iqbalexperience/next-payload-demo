const withPayload = require('./withPayload')
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = withPayload({
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'https://nextjs-vercel.payloadcms.com',
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.NEXT_PUBLIC_S3_ENDPOINT
    ],
  },
}, {
  configPath: path.resolve(__dirname, './payload/payload.config.ts'),
})

module.exports = nextConfig