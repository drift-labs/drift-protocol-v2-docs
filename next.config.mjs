import nextra from "nextra";

const withNextra = nextra({
  defaultShowCopyCode: true,
  latex: true,
});

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/protocol/",
        permanent: true,
      },
      {
        source: "/about-v2/:path*",
        destination: "/protocol/about-v3/:path*",
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        dns: false,
        tls: false,
      };
    }
    return config;
  },
};

export default withNextra(nextConfig);
