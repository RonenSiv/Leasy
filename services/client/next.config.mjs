/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['localhost'], // Add your image domains here
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*',
            },
        ];
    },
    webpack: (config) => {
        // Ignore .map files to avoid parse errors
        config.module.rules.push({
            test: /\.map$/,
            use: 'ignore-loader',
        });

        return config;
    },
};

export default nextConfig;
