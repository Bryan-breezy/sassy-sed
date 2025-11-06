/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hrrjxgbrbynudymzoarw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/uploads/**',
    },
      {
        protocol: 'https',
        hostname: 'sassyproducts.co.ke',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}

export default nextConfig
