import type { NextConfig } from "next";

const imageHostnames = [
  "5.imimg.com",
  "www.jiomart.com",
  "cdn.mycdn.com",
  // add more here
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageHostnames.map((host) => ({
      protocol: "https",
      hostname: host,
      pathname: "/**",
    })),
  },
};

export default nextConfig;
