/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		FRONT_URL: process.env.NEXT_PUBLIC_URL_FRONT,
		BACK_URL: process.env.NEXT_PUBLIC_URL_BACK,
	},
	reactStrictMode: false,
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
		],
		domains: ['res.cloudinary.com'],
	},
	devIndicators: {
		buildActivityPosition: 'bottom-right',
	},
	webpack: (config) => {
		config.externals = {
		  bufferutil: 'bufferutil',
		  'utf-8-validate': 'utf-8-validate',
		};
		return config;
	}
};

module.exports = nextConfig;

