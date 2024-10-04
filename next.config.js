await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "images.0edda680dda92bfbba610c142aecfbb3.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "0edda680dda92bfbba610c142aecfbb3.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default config;
