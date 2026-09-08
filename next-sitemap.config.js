/** @type {import('next-sitemap').IConfig} */
const siteUrl = 'https://docs.velocity.exchange'

module.exports = {
  // TODO(open-question): provisional hosted URL, confirm final docs domain.
  siteUrl,
  generateRobotsTxt: true,
  // The generated share-card images are one route per page. They are not pages,
  // so they stay out of the sitemap and out of the index.
  exclude: ['/og', '/og/*'],
  robotsTxtOptions: {
    // robots.txt is the first thing most crawlers fetch, so it is where an
    // agent has the best chance of discovering the markdown corpus. The
    // "LLM:" fields are ignored by ordinary crawlers, which skip unknown
    // directives.
    transformRobotsTxt: async (_config, robotsTxt) =>
      `${robotsTxt.trimEnd()}\n\n# LLMs\nLLM: ${siteUrl}/llms.txt\nLLM-Full: ${siteUrl}/llms-full.txt\n`,
  },
}
