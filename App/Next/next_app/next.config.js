/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    nextConfig,
    env: {
        FRONT_URL: process.env.NEXT_PUBLIC_URL_FRONT,
        BACK_URL: process.env.NEXT_PUBLIC_URL_BACK,
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
    devIndicators: {
        buildActivityPosition: 'bottom-right',
    }
}

module.exports = nextConfig
