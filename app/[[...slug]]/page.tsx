import { source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { CopyMarkdownButton } from "@/components/CopyMarkdownButton";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";

// Legal pages are deliberately left out of the machine-readable outputs, so
// they have no .md mirror to link to. Kept in step with EXCLUDED_DIRS in
// scripts/lib/docsMeta.mjs.
const NO_MARKDOWN_MIRROR = "/protocol/legal-and-regulations";

function hasMarkdownMirror(url: string) {
  return url !== NO_MARKDOWN_MIRROR && !url.startsWith(`${NO_MARKDOWN_MIRROR}/`);
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: "clerk", single: false }}
      editOnGithub={{
        owner: "velocity-exchange",
        repo: "velocity-docs",
        sha: "master",
        path: `content/${page.file.path}`,
      }}
    >
      {hasMarkdownMirror(page.url) ? (
        <CopyMarkdownButton route={page.url} />
      ) : null}
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description ? (
        <DocsDescription>{page.data.description}</DocsDescription>
      ) : null}
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const url = `${SITE_URL}${page.url}`;

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: url,
      // Advertise the plain-markdown mirror so an agent that lands on the HTML
      // page can find it without guessing the .md convention.
      ...(hasMarkdownMirror(page.url)
        ? { types: { "text/markdown": `${url}.md` } }
        : {}),
    },
  };
}
