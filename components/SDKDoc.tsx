import React from "react";
import { generateDefinition, TSDoc } from "nextra/tsdoc";
import { SDKDocTabs } from "./SDKDocTabs";

type SDKDocProps = {
  children?: React.ReactNode;
};

const SDK_BASE_URL = "https://drift-labs.github.io/protocol-v2/sdk";

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
  const tabs: Array<{
    label: string;
    content?: React.ReactNode;
    placeholder?: boolean;
    link?: string;
    example?: { content?: React.ReactNode };
  }> = [];

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
      content: (
        <TSDoc
          definition={generateDefinition({
            code,
            exportName,
          })}
        />
      ),
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
