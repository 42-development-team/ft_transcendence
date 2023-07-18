/** @type {import('next').NextConfig} */
const nextConfig = {
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
