import type { NextConfig } from "next";

const imageHostnames = [
  "5.imimg.com",
  "www.jiomart.com",
  "cdn.mycdn.com",
 "incensecosmos.in",
 "encrypted-tbn0.gstatic.com",
 "cdn.dotpe.in",
 "m.media-amazon.com",
 "via.placeholder.com",
 "img.freepik.com",
 "www.shutterstock.com","giri.in"
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
