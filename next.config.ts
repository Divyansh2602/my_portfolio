import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React <ViewTransition> integration — powers the shared-element morph
    // from a project panel into its case-study hero.
    viewTransition: true,
  },
};

export default nextConfig;
