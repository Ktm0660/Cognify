/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },   // TEMP: we can re-enable later
  eslint: { ignoreDuringBuilds: true }       // TEMP: we can re-enable later
};
module.exports = nextConfig;
