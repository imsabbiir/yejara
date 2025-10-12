/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    optimizeCss: false,
  },
    eslint:{
        ignoreDuringBuilds: true,
    },
    images:{
        domains: ['i.ibb.co'],
    }
};

export default nextConfig;
