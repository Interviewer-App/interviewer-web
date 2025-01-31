/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['img.icons8.com'], // Add this line
    },
    webpack: (config) => {
        config.module.rules.push({
          test: /\.node/,
          use: 'raw-loader',
        });
     
        return config;
      },
};

export default nextConfig;
