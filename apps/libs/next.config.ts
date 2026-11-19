import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is written to plain files in `out/`, which is what the host serves. There is no
  // server: no rewrites, no response headers set here, no server-rendered routes.
  output: "export",
  // The shared package is TypeScript source, not a build, so Next compiles it with the app.
  // The three.js packages are here for a different reason: React Three Fiber is a React renderer of
  // its own, and in a production build it has to be compiled against the same copy of React as the
  // app, or its reconciler bridges to nothing and the canvas is created but never drawn into.
  transpilePackages: ["@libsbio/shared", "three", "@react-three/fiber"],
  // The image optimiser is a server, and there is none.
  images: { unoptimized: true },
};

export default nextConfig;
