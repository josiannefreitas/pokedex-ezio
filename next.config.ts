/** @type {import('next').NextConfig} */
const nextConfig = {
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com',
			},
		],
	},
}

export default nextConfig
