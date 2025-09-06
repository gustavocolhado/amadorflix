/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
    // Configurações para melhorar a hidratação
    serverComponentsExternalPackages: ['bcrypt'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  // Configurações para melhorar a hidratação
  reactStrictMode: true,
  swcMinify: true,
  // Configurações para evitar problemas de hidratação
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Configurações de performance
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig 