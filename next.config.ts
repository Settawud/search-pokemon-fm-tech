import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PokeAPI/**',
      },
    ],
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days cache
    deviceSizes: [640, 750, 828, 1080], // Smaller set for Pokemon images
  },
  // Enable compression
  compress: true,
  // Reduce JS bundle - modular imports for lucide-react
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
  // Experimental optimizations
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
