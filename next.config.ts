import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: ['192.168.1.36', 'localhost', '127.0.0.1'],
};

export default nextConfig;
