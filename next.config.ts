import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Photo Sphere Viewer ships modern ESM that Next won't compile from
  // node_modules by default — opt it in so the 360° tour bundles cleanly.
  transpilePackages: [
    "@photo-sphere-viewer/core",
    "@photo-sphere-viewer/markers-plugin",
  ],
};

export default nextConfig;
