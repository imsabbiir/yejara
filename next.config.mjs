/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint:{
        ignoreDuringBuilds: true,
    },
    images:{
        domains: ['i.ibb.co'],
    }
};

export default nextConfig;
