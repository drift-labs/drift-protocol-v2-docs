import type { Metadata } from "next";
import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "../../mdx-components";

export const generateStaticParams = generateStaticParamsFor("mdxPath");
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { mdxPath?: string[] };
}): Promise<Metadata> {
  const { metadata } = await importPage(params.mdxPath);
  return metadata;
}

export default async function Page({
  params,
}: {
  params: { mdxPath?: string[] };
}) {
  const { default: MDXContent, metadata, toc } = await importPage(
    params.mdxPath
  );
  const Wrapper = getMDXComponents().wrapper;

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent />
    </Wrapper>
  );
}
