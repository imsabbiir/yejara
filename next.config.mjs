/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    optimizeCss: false,
  },
    eslint:{
        ignoreDuringBuilds: true,
    },
    images: {
    domains: ["images.unsplash.com", "i.ibb.co", "i.ibb.co.com"],
  },
};

export default nextConfig;
