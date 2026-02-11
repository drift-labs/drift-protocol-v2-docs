import React from "react";
import { Callout } from "nextra/components";
import { generateDefinition, TSDoc } from "nextra/tsdoc";
import type { SDKTab } from "../SDKDocTabs";
import type { SDKBlockProps } from "./types";

const SDK_BASE_URL = "https://drift-labs.github.io/protocol-v2/sdk";
const JSDOC_LINK_RE = /{@link ([^}]*)}/g;

function sanitizeDocText(text?: string) {
  if (!text) return text;
  return (
    text
      .replace(JSDOC_LINK_RE, "$1")
      // Prevent MDX expression parsing on stray braces.
      .replaceAll("{", "&#123;")
      .replaceAll("}", "&#125;")
  );
}

function sanitizeTags(tags?: Record<string, string>) {
  if (!tags) return tags;
  const next: Record<string, string> = {};
  for (const [key, value] of Object.entries(tags)) {
    next[key] = sanitizeDocText(value) ?? value;
  }
  return next;
}

function sanitizeDefinition<T extends ReturnType<typeof generateDefinition>>(
  definition: T,
) {
  if (!definition) return definition;
  const next = {
    ...definition,
    description: sanitizeDocText(definition.description),
    tags: sanitizeTags(definition.tags),
  } as T;

  if ("entries" in definition && Array.isArray(definition.entries)) {
    (next as T & { entries: typeof definition.entries }).entries =
      definition.entries.map((entry) => ({
        ...entry,
        description: sanitizeDocText(entry.description),
        tags: sanitizeTags(entry.tags),
      }));
  }

  return next;
}

function getTsDocLink(ts: {
  name: string;
  type?: SDKBlockProps["type"];
  owner?: string;
}) {
  const name = ts.name;
  switch (ts.type ?? "function") {
    case "class":
      return `${SDK_BASE_URL}/classes/${name}.html`;
    case "enum":
      return `${SDK_BASE_URL}/enums/${name}.html`;
    case "variable":
      return `${SDK_BASE_URL}/variables/${name}.html`;
    case "type":
      return `${SDK_BASE_URL}/types/${name}.html`;
    case "method":
      return ts.owner
        ? `${SDK_BASE_URL}/classes/${ts.owner}.html#method_${name}`
        : undefined;
    case "function":
    default:
      return `${SDK_BASE_URL}/functions/${name}.html`;
  }
}

export function buildTypeScriptTab(props: SDKBlockProps): SDKTab {
  const tsType = props.type ?? "function";
  const tsModule = "@drift-labs/sdk";
  let code: string | undefined;
  let exportName = props.name;
  const displayType = tsType.charAt(0).toUpperCase() + tsType.slice(1);
  const displayName =
    tsType === "method" && props.owner
      ? `${props.owner}.${props.name}`
      : props.name;

  if (tsType === "method") {
    if (props.owner) {
      const alias = `${props.owner}_${props.name}`;
      exportName = alias;
      code = `import { ${props.owner} } from '${tsModule}'; export type ${alias} = ${props.owner}['${props.name}']`;
    } else {
      code = `export { ${props.name} } from '${tsModule}'`;
    }
  } else {
    code = `export { ${props.name} } from '${tsModule}'`;
  }

  let definition;

  try {
    definition = sanitizeDefinition(
      generateDefinition({
        code,
        exportName,
      }),
    );
  } catch (error) {}

  return {
    label: "TypeScript",
    heading: `${displayType} ${displayName}`,
    description: definition?.description || null,
    content: definition ? (
      <TSDoc definition={definition} />
    ) : (
      <Callout type="warning">
        TypeScript docs unavailable for{" "}
        <code className="nextra-code x:max-md:break-all">{props.name}</code>.
      </Callout>
    ),
    link: getTsDocLink({
      name: props.name,
      type: tsType,
      owner: props.owner,
    }),
    example: props.children ? { content: props.children } : undefined,
  };
}
