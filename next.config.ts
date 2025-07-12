import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle sql.js WASM file
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Handle fs module for sql.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    return config;
  },
};

export default nextConfig;
