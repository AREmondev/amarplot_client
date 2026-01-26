import { createRequire } from "module";
const require = createRequire(import.meta.url);
// const { i18n } = require("./next-i18next.config.js"); // Removed - not supported in App Router

/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n, // ❌ Removed - not supported in App Router

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "51.21.132.30",
      //   port: "",
      //   pathname: "/**",
      // },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    // COMMENTED OUT FOR DEVELOPMENT - REMOVE CSP BLOCKING
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    styledComponents: true,
  },

  reactStrictMode: true,
  output: "standalone",
  target: "server",

  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "@tanstack/react-query",
      "framer-motion",
      "date-fns",
    ],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
    webVitalsAttribution: ["CLS", "LCP"],
    optimizeServerReact: true,
    serverMinification: true,
    serverSourceMaps: false,
  },

  // COMMENTED OUT FOR DEVELOPMENT - REMOVE BLOCKING HEADERS
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "X-Frame-Options",
  //           value: "DENY",
  //         },
  //         {
  //           key: "X-Content-Type-Options",
  //           value: "nosniff",
  //         },
  //         {
  //           key: "Referrer-Policy",
  //           value: "origin-when-cross-origin",
  //         },
  //         {
  //           key: "Permissions-Policy",
  //           value: "camera=(), microphone=(), geolocation=*",
  //         },
  //       ],
  //     },
  //   ];
  // },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(process.cwd()),
    };

    return config;
  },

  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/health",
          destination: "/api/health-check",
        },
      ],
    };
  },

  compress: true,
  poweredByHeader: false,
  generateEtags: true,
};

export default nextConfig;
