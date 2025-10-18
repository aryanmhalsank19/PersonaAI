import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: undefined,
  experimental: {
    serverComponentsExternalPackages: []
  }
};

export default nextConfig;
