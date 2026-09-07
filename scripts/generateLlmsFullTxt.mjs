// Generates public/llms-full.txt: the entire documentation corpus as one
// plain-markdown file, for agents that would rather take a single fetch than
// crawl 107 pages. This is the llmstxt.org companion to llms.txt, which stays
// the small index of links.
//
// Page inclusion, ordering, and the MDX-to-markdown transform are the same
// ones the per-page mirrors use (scripts/lib/docsMeta.mjs and
// scripts/lib/mdxToMarkdown.mjs), so a page reads identically whether it is
// fetched on its own or found in here.
//
// Section names are emitted as bold labels in the contents list rather than as
// headings, so the only headings in the file belong to the pages themselves
// and each page's own H1/H2 hierarchy survives intact.
//
// Pages are separated by an 80-dash rule rather than the usual "---" because
// several pages use "---" as an ordinary horizontal rule in their own body; a
// splitter keying on "---" would cut those pages in half.

import { writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import {
  ROOT,
  collectIncludedPages,
  mirroredRoutes,
  sectionFor,
  frontmatterTitle,
  stripFrontmatter,
  loadSiteUrl,
} from "./lib/docsMeta.mjs";
import { transformBody, withCanonicalHeading } from "./lib/mdxToMarkdown.mjs";

const OUT_FILE = path.join(ROOT, "public", "llms-full.txt");

const SITE_NAME = "Velocity Protocol";
const SITE_SUMMARY =
  "Velocity is a decentralized, cross-margined perpetuals and spot trading protocol on Solana. These docs cover how to use the protocol, how it works under the hood, and how to build on it.";

const siteUrl = loadSiteUrl();

// Long enough not to collide with the "---" rules that appear inside page
// bodies, and still a valid markdown horizontal rule.
const PAGE_BREAK = "-".repeat(80);

const pages = collectIncludedPages();
const routes = mirroredRoutes(pages);

// Group into the same sections, in the same order, as llms.txt.
const sections = new Map(); // sectionTitle -> [{route, title, body}]
let skippedNoH1 = 0;

for (const { raw, relPath, route } of pages) {
  const title = frontmatterTitle(raw);
  const body = transformBody(stripFrontmatter(raw), routes);
  const withHeading = withCanonicalHeading(body, route, title, siteUrl);
  if (withHeading === null) {
    skippedNoH1++;
    continue;
  }

  const section = sectionFor(relPath);
  if (!sections.has(section)) sections.set(section, []);
  sections.get(section).push({ route, title, body: withHeading });
}

for (const entries of sections.values()) {
  entries.sort((a, b) => a.route.localeCompare(b.route));
}

// --- Render ------------------------------------------------------------------
const contents = [];
const bodies = [];

for (const [section, entries] of sections) {
  contents.push(`**${section}**`, "");
  for (const entry of entries) {
    contents.push(`- ${entry.title}: ${siteUrl}${entry.route}`);
    bodies.push(entry.body.trimEnd());
  }
  contents.push("");
}

const pageCount = bodies.length;

const out = [
  `# ${SITE_NAME}`,
  "",
  `> ${SITE_SUMMARY}`,
  "",
  `This file is the full text of all ${pageCount} documentation pages, concatenated.`,
  `Pages are separated by a line of 80 dashes, and each page then opens with its`,
  "own H1 followed by a `> Canonical:` line giving its URL. Split on either one.",
  `For the index of links instead, see ${siteUrl}/llms.txt. Any single page is`,
  "also served on its own as `<page-url>.md`.",
  "",
  "## Contents",
  "",
  ...contents,
  PAGE_BREAK,
  "",
  bodies.join(`\n\n${PAGE_BREAK}\n\n`),
].join("\n");

if (!existsSync(path.join(ROOT, "public"))) {
  mkdirSync(path.join(ROOT, "public"), { recursive: true });
}
writeFileSync(OUT_FILE, `${out.trimEnd()}\n`, "utf8");

const kb = Math.round(statSync(OUT_FILE).size / 1024);
console.log(
  `llms-full.txt: wrote ${pageCount} pages across ${sections.size} sections ` +
    `(${kb} KB) to ${path.relative(ROOT, OUT_FILE)}` +
    (skippedNoH1 ? ` (skipped ${skippedNoH1} page(s) with no H1)` : ""),
);
