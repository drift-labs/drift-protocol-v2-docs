const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  flexsearch: {
    codeblocks: false,
  },
  defaultShowCopyCode: true,
  latex: true,
});

const nextConfig = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return defaultPathMap;
  },
};

module.exports = withNextra({
  ...nextConfig,
  webpack: (
    config,
    {
      isServer,
      //  dev
    }
  ) => {
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
});
