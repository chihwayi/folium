import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Produces a self-contained .next/standalone/ output (server + only the
  // node_modules actually used) — the Docker image copies just that
  // instead of the full node_modules tree.
  output: "standalone",
};

export default nextConfig;
