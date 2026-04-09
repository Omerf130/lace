import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Point file-tracing to this project so Next.js doesn't walk up to a parent
  // directory that contains another package-lock.json.
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
