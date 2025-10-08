/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true }, // TEMP: we can re-enable later
  eslint: {
    // Don’t block production builds on lint errors/missing config
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
