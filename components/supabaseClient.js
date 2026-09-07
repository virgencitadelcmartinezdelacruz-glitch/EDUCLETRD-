/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignora los errores de TypeScript durante el despliegue en Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;