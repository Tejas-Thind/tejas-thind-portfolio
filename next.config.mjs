/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // /writing/<slug>.md serves the markdown copy for agents
      { source: "/writing/:slug.md", destination: "/writing/:slug/md" },
    ];
  },
}

export default nextConfig
