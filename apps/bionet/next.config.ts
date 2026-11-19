import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is written to plain files in `out/`, which is what the host serves. There is no
  // server: no rewrites, no response headers set here, no server-rendered routes.
  output: "export",
  // The shared package is TypeScript source, not a build, so Next compiles it with the app.
  transpilePackages: ["@libsbio/shared"],
  // The image optimiser is a server, and there is none.
  images: { unoptimized: true },
};

export default nextConfig;
