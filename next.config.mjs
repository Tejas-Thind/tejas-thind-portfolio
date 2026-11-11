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
  // Fewer parallel workers: on a low-memory machine the default pool gets
  // killed ("Jest worker ... exceeding retry limit").
  experimental: {
    cpus: 1,
    workerThreads: true,
  },
  async rewrites() {
    return [
      // /writing/<slug>.md serves the markdown copy for agents
      { source: "/writing/:slug.md", destination: "/writing/:slug/md" },
    ];
  },
}

export default nextConfig
