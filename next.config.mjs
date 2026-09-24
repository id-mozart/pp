/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // pptxgenjs (експорт дек у PPTX, лише в браузері) імпортує node:fs/https — у клієнтському бандлі це порожні модулі
  webpack(config, { isServer, webpack }) {
    if (!isServer) {
      config.resolve.fallback = { ...(config.resolve.fallback || {}), fs: false, https: false, http: false, path: false, os: false, crypto: false, stream: false, zlib: false };
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^node:/, (r) => { r.request = r.request.replace(/^node:/, ""); }));
    }
    return config;
  },
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
