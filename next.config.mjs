/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      // Брендбук живе на /brand; /brand/logo — це тека з файлами, не сторінка.
      // Люди інтуїтивно набирають саме її, тож ведемо на брендбук.
      { source: "/brand/logo", destination: "/brand", permanent: false },
      { source: "/brand/logos", destination: "/brand", permanent: false },
      { source: "/brand/fonts", destination: "/brand", permanent: false },
      { source: "/logo", destination: "/brand", permanent: false },
      { source: "/brandbook", destination: "/brand", permanent: false },
    ];
  },
};

export default nextConfig;
