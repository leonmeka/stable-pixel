await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["geist"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "0edda680dda92bfbba610c142aecfbb3.r2.cloudflarestorage.com",
        pathname: "/images/*",
      },
    ],
  },
};

export default config;
