import React from "react";
import fs from "node:fs";
import path from "node:path";
import { Callout } from "nextra/components";
import { generateDefinition, TSDoc } from "nextra/tsdoc";
import { SDKDocTabs, SDKTab } from "./SDKDocTabs";

type SDKDocProps = {
  children?: React.ReactNode;
};

const SDK_BASE_URL = "https://drift-labs.github.io/protocol-v2/sdk";
const PYTHON_DOCS_BASE_URL = "https://drift-labs.github.io/driftpy";
const JSDOC_LINK_RE = /{@link ([^}]*)}/g;
const PYTHON_API_PATH = path.join(
  process.cwd(),
  "public",
  "sdk",
  "python",
  "api.json"
);

type PythonSymbol = {
  fqn: string;
  kind: string | null;
  signature: string | null;
  summary: string | null;
  params: Array<{ name: string; type?: string; description?: string }>;
  returns: { type?: string; description?: string } | null;
};

type PythonApiIndex = {
  version: number;
  symbols: Record<string, PythonSymbol>;
};

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

let cachedPythonApiIndex: PythonApiIndex | null = null;
function getPythonApiIndex(): PythonApiIndex | null {
  if (cachedPythonApiIndex) return cachedPythonApiIndex;
  try {
    const raw = fs.readFileSync(PYTHON_API_PATH, "utf-8");
    cachedPythonApiIndex = JSON.parse(raw) as PythonApiIndex;
  } catch {
    cachedPythonApiIndex = null;
  }
  return cachedPythonApiIndex;
}

function getPythonDocLink(fqn: string) {
  if (fqn.startsWith("driftpy.drift_client")) {
    return `${PYTHON_DOCS_BASE_URL}/clearing_house/`;
  }
  if (fqn.startsWith("driftpy.drift_user")) {
    return `${PYTHON_DOCS_BASE_URL}/clearing_house_user/`;
  }
  if (fqn.startsWith("driftpy.accounts")) {
    return `${PYTHON_DOCS_BASE_URL}/accounts/`;
  }
  if (fqn.startsWith("driftpy.addresses")) {
    return `${PYTHON_DOCS_BASE_URL}/addresses/`;
  }
  return PYTHON_DOCS_BASE_URL;
}

function toPythonHeading(symbol: PythonSymbol) {
  const parts = symbol.fqn.split(".");
  const name = parts[parts.length - 1];
  const owner = parts.length >= 2 ? parts[parts.length - 2] : undefined;
  const isMethod =
    symbol.kind === "function" && owner && owner[0] === owner[0]?.toUpperCase();
  const displayName = isMethod ? `${owner}.${name}` : name;
  const displayKind = (() => {
    if (isMethod) return "Method";
    if (symbol.kind === "class") return "Class";
    if (symbol.kind === "attribute") return "Variable";
    return "Function";
  })();
  return `${displayKind} ${displayName}`;
}

function splitSignatureParams(paramsText: string) {
  const parts: string[] = [];
  let current = "";
  let depth = 0;
  for (let i = 0; i < paramsText.length; i += 1) {
    const ch = paramsText[i];
    if (ch === "(" || ch === "[" || ch === "{") depth += 1;
    if (ch === ")" || ch === "]" || ch === "}") depth -= 1;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts.filter(Boolean);
}

function parseSignature(signature?: string | null) {
  if (!signature) return { params: [], returns: null as PythonSymbol["returns"] };
  const openIdx = signature.indexOf("(");
  const closeIdx = signature.lastIndexOf(")");
  if (openIdx === -1 || closeIdx === -1 || closeIdx <= openIdx) {
    return { params: [], returns: null };
  }
  const paramsText = signature.slice(openIdx + 1, closeIdx).trim();
  const rawParams = paramsText ? splitSignatureParams(paramsText) : [];
  const params = rawParams
    .map((param) => {
      const [namePart, typePart] = param.split(":", 2);
      const name = namePart?.trim();
      if (!name || name === "self") return null;
      const type = typePart?.split("=", 1)[0]?.trim();
      return { name, type: type || undefined };
    })
    .filter(Boolean) as PythonSymbol["params"];
  const returnMatch = signature.match(/->\s*([^#]+)$/);
  const returns = returnMatch?.[1]?.trim()
    ? ({ type: returnMatch[1].trim(), description: undefined } satisfies PythonSymbol["returns"])
    : null;
  return { params, returns };
}

function PythonDoc({ symbol }: { symbol: PythonSymbol }) {
  const summary = sanitizeDocText(symbol.summary ?? undefined);
  const signature = sanitizeDocText(symbol.signature ?? undefined);
  const derived = parseSignature(signature ?? undefined);
  const params = symbol.params?.length ? symbol.params : derived.params;
  const returns = symbol.returns ?? derived.returns;
  return (
    <div className="x:mt-4 x:space-y-3">
      {signature ? null : null}
      {summary ? <p>{summary}</p> : null}
      {params?.length ? (
        <div>
          <div className="x:font-semibold">Parameters</div>
          <table className="x:mt-3 x:w-full x:border-separate x:border-spacing-0 x:overflow-hidden x:rounded-xl x:border x:border-neutral-800/60">
            <thead>
              <tr className="x:bg-neutral-900/50">
                <th className="x:w-56 x:py-2 x:px-4 x:text-left x:text-sm x:font-semibold">
                  Name
                </th>
                <th className="x:py-2 x:px-4 x:text-left x:text-sm x:font-semibold">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="x:divide-y x:divide-neutral-800/60">
              {params.map((param) => (
                <tr key={param.name}>
                  <td className="x:py-3 x:px-4 x:align-top">
                    <code className="nextra-code">{param.name}</code>
                  </td>
                  <td className="x:py-3 x:px-4 x:align-top">
                    {param.type ? (
                      <div className="x:text-sm">
                        Type: <code className="nextra-code">{param.type}</code>
                      </div>
                    ) : null}
                    {param.description ? (
                      <div className="x:mt-2 x:text-sm">{param.description}</div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {returns ? (
        <div>
          <div className="x:font-semibold">Returns</div>
          <div className="x:mt-2">
            {returns.type ? (
              <code className="nextra-code">{returns.type}</code>
            ) : null}
            {returns.description ? (
              <span>{returns.type ? ": " : ""}{returns.description}</span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
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
    const pythonApi = getPythonApiIndex();
    const symbol = pythonApi?.symbols?.[props.name];
    tabs.push({
      label: "Python",
      heading: symbol ? toPythonHeading(symbol) : undefined,
      content: symbol ? <PythonDoc symbol={symbol} /> : undefined,
      link: symbol ? getPythonDocLink(props.name) : undefined,
      placeholder: !symbol,
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
