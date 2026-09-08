// Shared MDX-to-plain-markdown transform, used by both machine-readability
// outputs: the per-page mirrors (scripts/generateMarkdownPages.mjs) and the
// single-file corpus (scripts/generateLlmsFullTxt.mjs). It lives here for the
// same reason docsMeta.mjs does - so the two outputs cannot drift.
//
// The transform is conservative. Code fences and inline code spans are stashed
// untouched before anything else runs (so nothing inside them - including a
// literal "import" in a sample - is ever touched), then imports/exports and JSX
// comments are dropped, a short list of known Fumadocs components is unwrapped
// into markdown, and any other JSX-looking tag (PascalCase, e.g. <SDKDoc>,
// <AssetWeightsTable />) is stripped while its children's text is left in
// place. Ordinary lowercase HTML tags (<table>, <img>, <a>, <br>, ...) are left
// alone since they are already valid to embed in markdown.

// --- Stash fenced code blocks and inline code spans -------------------------
// Returns the text with each span replaced by a printable, collision-safe
// placeholder, plus the store to restore them from. Fences are stashed
// before inline spans so a fence's own backticks can't be mistaken for
// inline code. The sentinel is plain ASCII (not a NUL byte or other control
// character) so the generated script and its output stay ordinary text -
// a NUL byte makes git and other tooling treat the file as binary.
const STASH_SENTINEL = "MDSTASH-7f3a";

function stashCode(text) {
  const store = [];
  const stash = (s) => {
    const i = store.push(s) - 1;
    return `@@${STASH_SENTINEL}-${i}@@`;
  };
  let out = text.replace(/(```|~~~)[^\n]*\n[\s\S]*?\1/g, stash);
  out = out.replace(/`[^`\n]*`/g, stash);
  return { text: out, store };
}

function restoreCode(text, store) {
  const placeholder = new RegExp(`@@${STASH_SENTINEL}-(\\d+)@@`, "g");
  return text.replace(placeholder, (_, i) => store[Number(i)]);
}

// --- Unwrap known Fumadocs components into plain markdown -------------------
// The bold type label goes on its own blockquote line, followed by a blank
// blockquote line, then the Callout's content lines each prefixed with
// "> " - with each line's own leading indentation and any heading markers
// left intact, so a heading or a nested sub-list inside a Callout survives
// instead of being glued onto the label or flattened to one level.
function transformCallout(text) {
  return text.replace(/<Callout([^>]*)>([\s\S]*?)<\/Callout>/g, (_, attrs, inner) => {
    const typeMatch = attrs.match(/type=["']?([\w-]+)["']?/);
    const type = typeMatch ? typeMatch[1] : "note";
    const label = type.charAt(0).toUpperCase() + type.slice(1);

    const rawLines = inner.replace(/^\n+/, "").replace(/\n+$/, "").split(/\r?\n/);
    if (rawLines.length === 0 || (rawLines.length === 1 && rawLines[0].trim() === "")) {
      return "";
    }

    const quoted = rawLines.map((l) => (l.trim() ? `> ${l}` : ">"));
    return `${[`> **${label}:**`, ">", ...quoted].join("\n")}\n`;
  });
}

function transformCards(text) {
  return text.replace(/<Cards>([\s\S]*?)<\/Cards>/g, (_, inner) => {
    const cardRe = /<Cards\.Card\b([^>]*)\/?>/g;
    const items = [];
    let m;
    while ((m = cardRe.exec(inner))) {
      const attrs = m[1];
      const titleMatch = attrs.match(/title=["']([^"']*)["']/);
      const hrefMatch = attrs.match(/href=["']([^"']*)["']/);
      if (titleMatch && hrefMatch) {
        items.push(`- [${titleMatch[1]}](${hrefMatch[1]})`);
      }
    }
    return items.length ? `${items.join("\n")}\n` : "";
  });
}

function transformTabs(text) {
  let out = text.replace(/<Tabs\.Tab\b([^>]*)>/g, (_, attrs) => {
    const titleMatch = attrs.match(/title=["']([^"']*)["']/);
    return titleMatch ? `\n**${titleMatch[1]}**\n\n` : "\n";
  });
  out = out.replace(/<\/Tabs\.Tab>/g, "");
  out = out.replace(/<Tabs\b[^>]*>/g, "");
  out = out.replace(/<\/Tabs>/g, "");
  return out;
}

function transformSteps(text) {
  return text.replace(/<\/?Steps\b[^>]*>/g, "");
}

function transformImages(text) {
  return text.replace(/<img\b([^>]*?)\/?>(\s*<\/img>)?/g, (_, attrs) => {
    const srcMatch = attrs.match(/src=["']([^"']*)["']/);
    const altMatch = attrs.match(/alt=["']([^"']*)["']/);
    if (!srcMatch) return "";
    return `![${altMatch ? altMatch[1] : ""}](${srcMatch[1]})`;
  });
}

// Any remaining PascalCase JSX tag (custom component) that survived the
// specific transforms above: strip the tag markup only, so whatever text
// sits between an opening and closing tag (e.g. a stashed code-fence
// placeholder) is left exactly where it was.
function stripUnknownComponents(text) {
  return text.replace(/<\/?[A-Z][A-Za-z0-9.]*(?:\s[^<>]*)?\/?>/g, "");
}

function dropImportsAndExports(text) {
  return text
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return !(trimmed.startsWith("import ") || trimmed.startsWith("export "));
    })
    .join("\n");
}

function dropJsxComments(text) {
  return text.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
}

function collapseBlankLines(text) {
  return text.replace(/\n{3,}/g, "\n\n");
}

// --- Point internal links at the markdown mirrors ---------------------------
// A link like [Margin](/protocol/trading/margin) resolves to the HTML page, so
// an agent reading the markdown corpus falls out of it on the first hop. Only
// hrefs whose path matches a route that actually gets a mirror are rewritten;
// anything else (an excluded legal page, an asset, an external URL, a bare
// anchor) is left exactly as authored so we never point at a 404.
export function rewriteInternalLinks(text, mirroredRoutes) {
  return text.replace(/\]\((\/[^)\s]*)\)/g, (whole, href) => {
    const hashIdx = href.indexOf("#");
    const pathPart = hashIdx === -1 ? href : href.slice(0, hashIdx);
    const hash = hashIdx === -1 ? "" : href.slice(hashIdx);
    const route = pathPart.length > 1 ? pathPart.replace(/\/$/, "") : pathPart;
    if (!mirroredRoutes.has(route)) return whole;
    return `](${route}.md${hash})`;
  });
}

// mirroredRoutes is the set of routes that will have a .md mirror; pass an
// empty set to leave internal links pointing at the HTML pages.
export function transformBody(rawBody, mirroredRoutes = new Set()) {
  const { text: stashed, store } = stashCode(rawBody);

  let out = stashed;
  out = dropJsxComments(out);
  out = dropImportsAndExports(out);
  out = transformCallout(out);
  out = transformCards(out);
  out = transformSteps(out);
  out = transformTabs(out);
  out = transformImages(out);
  out = stripUnknownComponents(out);
  out = rewriteInternalLinks(out, mirroredRoutes);
  out = collapseBlankLines(out);

  return restoreCode(out, store).trim();
}

// --- Canonical heading ------------------------------------------------------
// Puts the canonical-URL line right after the H1, so a page read on its own
// (as a mirror, or as one slice of llms-full.txt) still says where it came
// from. Titles live in frontmatter since the Fumadocs migration, so the H1 is
// synthesised from the title when the body has none. Returns null when there
// is neither an H1 nor a title to build one from.
export function withCanonicalHeading(body, route, title, siteUrl) {
  const lines = body.split(/\r?\n/);
  let h1Idx = lines.findIndex((l) => /^#\s+\S/.test(l));
  if (h1Idx === -1) {
    if (!title) return null;
    lines.unshift(`# ${title}`, "");
    h1Idx = 0;
  }

  const canonicalLine = `> Canonical: ${siteUrl}${route}`;
  const before = lines.slice(0, h1Idx + 1);
  const after = lines.slice(h1Idx + 1);
  // Skip a leading blank line in `after` so we don't end up with two blanks.
  while (after.length && after[0].trim() === "") after.shift();

  return [...before, "", canonicalLine, "", ...after].join("\n").trimEnd() + "\n";
}
