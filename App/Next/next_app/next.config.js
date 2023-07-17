/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    nextConfig,
    env: {
        IP: process.env.LOCAL_IP,
        BACK_PORT: process.env.BACK_PORT,
        FRONT_PORT: process.env.FRONT_PORT,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.freepik.com',
                port: '',
                pathname: '/free-icon/**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/u/**',
            },
        ]
    },
} 
