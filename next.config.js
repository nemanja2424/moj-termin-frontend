/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: false,
  
  // SEO optimizacije
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
      // Cache sitemaps
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      // Cache RSS feed
      {
        source: "/feed.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
          {
            key: "Content-Type",
            value: "application/xml",
          },
        ],
      },
    ];
  },

  // Kompresija za bolje performanse
  compress: true,

  // Slika optimizacija
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  // Minifikacija i optimizacija
  swcMinify: true,

  // Prebacivanje sa trailingSlash-a
  trailingSlash: false,

  // Preload specifičnih resursa
  experimental: {
    optimizePackageImports: ["react-toastify", "@fortawesome/react-fontawesome"],
  },

  // Redirect za SEO
  redirects: async () => {
    return [
      {
        source: "/preduzeca",
        destination: "/login-preduzeca",
        permanent: true,
      },
      {
        source: "/zakazivanje",
        destination: "/klijent",
        permanent: true,
      },
    ];
  },

  // Rewrite za poboljšanu navigaciju
  rewrites: async () => {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

module.exports = nextConfig;
