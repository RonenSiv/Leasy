/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            "micromark-factory-space": false, // Prevent bundling issues with micromark
        };
        return config;
    },
};

export default nextConfig;
