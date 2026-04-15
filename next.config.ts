/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! ATTENTION !! Permet de déployer même s'il y a des erreurs de types
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permet de déployer même s'il y a des avertissements/erreurs de lint
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
