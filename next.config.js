const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  flexsearch: {
    codeblocks: false,
  },
  defaultShowCopyCode: true,
  latex: true,
})

module.exports = withNextra();
