import React from "react";
import { Callout } from "nextra/components";
import { generateDefinition, TSDoc } from "nextra/tsdoc";
import { SDKDocTabs, SDKTab } from "./SDKDocTabs";

type SDKDocProps = {
  children?: React.ReactNode;
};

const SDK_BASE_URL = "https://drift-labs.github.io/protocol-v2/sdk";
const JSDOC_LINK_RE = /{@link ([^}]*)}/g;

function sanitizeDocText(text?: string) {
  if (!text) return text;
  return text
    .replace(JSDOC_LINK_RE, "$1")
    // Prevent MDX expression parsing on stray braces.
    .replaceAll("{", "&#123;")
    .replaceAll("}", "&#125;");
}

function sanitizeTags(tags?: Record<string, string>) {
  if (!tags) return tags;
  const next: Record<string, string> = {};
  for (const [key, value] of Object.entries(tags)) {
    next[key] = sanitizeDocText(value) ?? value;
  }
  return next;
}

function sanitizeDefinition<T extends ReturnType<typeof generateDefinition>>(definition: T) {
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

function getTsDocLink(ts: { name: string; type?: SDKBlockProps["type"]; owner?: string }) {
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

type SDKBlockProps = {
  name: string;
  type?: "function" | "class" | "method" | "enum" | "variable" | "type";
  owner?: string;
  children?: React.ReactNode;
};

export function TypeScript(_props: SDKBlockProps) {
  return null;
}

export function Python(_props: { name: string; children?: React.ReactNode }) {
  return null;
}

export function Rust(_props: { name: string; children?: React.ReactNode }) {
  return null;
}

export function Api(_props: { name: string; children?: React.ReactNode }) {
  return null;
}

export function SDKDoc({ children }: SDKDocProps) {
  const tabs: Array<SDKTab> = [];

  const childArray = React.Children.toArray(children);
  const childTs = childArray.find(
    (child) => React.isValidElement(child) && child.type === TypeScript
  );
  const childPy = childArray.find(
    (child) => React.isValidElement(child) && child.type === Python
  );
  const childRust = childArray.find(
    (child) => React.isValidElement(child) && child.type === Rust
  );
  const childApi = childArray.find(
    (child) => React.isValidElement(child) && child.type === Api
  );

  if (childTs && React.isValidElement(childTs)) {
    const props = childTs.props as SDKBlockProps;
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

    tabs.push({
      label: "TypeScript",
      heading: `${displayType} ${displayName}`,
      content: (() => {
        try {
          const definition = generateDefinition({
            code,
            exportName,
          });
          return <TSDoc definition={sanitizeDefinition(definition)} />;
        } catch (error) {
          return (
            <Callout type="warning">
              TypeScript docs unavailable for <code className="nextra-code x:max-md:break-all">{props.name}</code>.
            </Callout>
          );
        }
      })(),
      link: getTsDocLink({
        name: props.name,
        type: tsType,
        owner: props.owner,
      }),
      example: props.children ? { content: props.children } : undefined,
    });
  }

  if (childPy && React.isValidElement(childPy)) {
    const props = childPy.props as { name: string; children?: React.ReactNode };
    tabs.push({
      label: "Python",
      placeholder: true,
      example: props.children ? { content: props.children } : undefined,
    });
  }

  if (childRust && React.isValidElement(childRust)) {
    const props = childRust.props as { name: string; children?: React.ReactNode };
    tabs.push({
      label: "Rust",
      placeholder: true,
      example: props.children ? { content: props.children } : undefined,
    });
  }

  if (childApi && React.isValidElement(childApi)) {
    const props = childApi.props as { name: string; children?: React.ReactNode };
    tabs.push({
      label: "API",
      placeholder: true,
      example: props.children ? { content: props.children } : undefined,
    });
  }

  if (tabs.length === 0) {
    return <SDKDocTabs tabs={[]} />;
  }

  return <SDKDocTabs tabs={tabs} />;
}
