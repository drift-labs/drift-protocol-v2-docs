import nextra from "nextra";
import redirects from "./data/redirects"

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
        permanent: false,
      },
      {
        source: "/about-v2/:path*",
        destination: "/protocol/about-v3/:path*",
        permanent: false,
      },
      ...redirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: false,
      }))
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
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx'
    }
  }
};

export default withNextra(nextConfig);
