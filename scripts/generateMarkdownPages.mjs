// Generates one clean, plain-markdown mirror per included docs page under
// public/, following the llmstxt.org convention of serving `<route>.md`
// alongside the HTML page (e.g. /protocol/trading/margin -> public/protocol/
// trading/margin.md). llms.txt (scripts/generateLlmsTxt.mjs) links to these
// files.
//
// Route mapping and page inclusion (hidden/WIP pages, the legal-and-
// regulations tree) come from scripts/lib/docsMeta.mjs and the MDX-to-markdown
// transform from scripts/lib/mdxToMarkdown.mjs, so this output and
// llms-full.txt cannot diverge.

import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import {
  ROOT,
  collectIncludedPages,
  mirroredRoutes,
  frontmatterTitle,
  stripFrontmatter,
  loadSiteUrl,
} from "./lib/docsMeta.mjs";
import { transformBody, withCanonicalHeading } from "./lib/mdxToMarkdown.mjs";

const PUBLIC_DIR = path.join(ROOT, "public");
const siteUrl = loadSiteUrl();

// --- Main --------------------------------------------------------------------
const pages = collectIncludedPages();
const routes = mirroredRoutes(pages);
let emitted = 0;
let skippedNoH1 = 0;

for (const { raw, route } of pages) {
  const body = transformBody(stripFrontmatter(raw), routes);
  const finalText = withCanonicalHeading(body, route, frontmatterTitle(raw), siteUrl);
  if (finalText === null) {
    skippedNoH1++;
    continue;
  }

  const outFile = path.join(PUBLIC_DIR, `${route}.md`);
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, finalText, "utf8");
  emitted++;
}

console.log(
  `markdown pages: wrote ${emitted} files under ${path.relative(ROOT, PUBLIC_DIR)}` +
    (skippedNoH1 ? ` (skipped ${skippedNoH1} page(s) with no H1)` : ""),
);
