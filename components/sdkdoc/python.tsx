import React from "react";
import { Callout } from "nextra/components";
import type { SDKTab } from "../SDKDocTabs";
import type { SDKBlockProps } from "./types";
import driftpy from "../../types/sdks/driftpy.json";

const PYTHONDOC_BASE_URL = "https://drift-labs.github.io/driftpy";
const PYTHONDOC_SECTION_BY_MODULE_PREFIX: Array<[string, string]> = [
  ["driftpy.drift_client", "clearing_house"],
  ["driftpy.drift_user", "clearing_house_user"],
];

type PythonArgument = {
  name: string;
  kind?: string | null;
  type?: string | null;
  required?: boolean;
  default?: string | null;
};

type PythonCallable = {
  name: string;
  is_async?: boolean;
  docstring?: string | null;
  arguments?: PythonArgument[];
  returns?: { type?: string | null } | null;
  signature?: string | null;
};

type PythonClass = {
  name: string;
  docstring?: string | null;
  methods?: PythonCallable[];
};

type PythonConstant = {
  name: string;
  docstring?: string | null;
  value?: string | number | boolean | null;
};

type PythonModule = {
  module: string;
  path?: string;
  docstring?: string | null;
  constants?: PythonConstant[];
  functions?: PythonCallable[];
  classes?: PythonClass[];
};

type PythonResolvedItem = {
  kind: "Module" | "Class" | "Function" | "Method" | "Constant";
  path: string;
  module: PythonModule;
  docs?: string | null;
  signature?: PythonCallable;
  classEntry?: PythonClass;
  constant?: PythonConstant;
};

const pythonData = driftpy as PythonModule[];

function normalizeName(name: string) {
  return name.trim();
}

function toModulePath(baseName: string) {
  const trimmed = baseName.trim();
  return trimmed.startsWith("driftpy.") ? trimmed : `driftpy.${trimmed}`;
}

function pickMostSpecific<T extends { path: string }>(items: T[]) {
  if (!items.length) return null;
  const sorted = [...items].sort((a, b) => a.path.length - b.path.length);
  return sorted[0];
}

function findModule(name: string) {
  const normalized = normalizeName(name);
  const full = toModulePath(normalized);
  const exact = pythonData.find((entry) => entry.module === full);
  if (exact) return exact;

  const suffixMatches = pythonData.filter(
    (entry) =>
      entry.module === normalized || entry.module.endsWith(`.${normalized}`),
  );
  return suffixMatches.sort((a, b) => a.module.length - b.module.length)[0];
}

function findClass(name: string) {
  const normalized = normalizeName(name);
  const matches: PythonResolvedItem[] = [];
  for (const module of pythonData) {
    for (const cls of module.classes ?? []) {
      const classPath = `${module.module}.${cls.name}`;
      if (
        cls.name === normalized ||
        classPath === normalized ||
        classPath.endsWith(`.${normalized}`)
      ) {
        matches.push({
          kind: "Class",
          path: classPath,
          module,
          docs: cls.docstring,
          classEntry: cls,
        });
      }
    }
  }
  return pickMostSpecific(matches);
}

function findFunction(name: string) {
  const normalized = normalizeName(name);
  const matches: PythonResolvedItem[] = [];
  for (const module of pythonData) {
    for (const fn of module.functions ?? []) {
      const fnPath = `${module.module}.${fn.name}`;
      if (
        fn.name === normalized ||
        fnPath === normalized ||
        fnPath.endsWith(`.${normalized}`)
      ) {
        matches.push({
          kind: "Function",
          path: fnPath,
          module,
          docs: fn.docstring,
          signature: fn,
        });
      }
    }
  }
  return pickMostSpecific(matches);
}

function findConstant(name: string) {
  const normalized = normalizeName(name);
  const matches: PythonResolvedItem[] = [];
  for (const module of pythonData) {
    for (const constant of module.constants ?? []) {
      const constantPath = `${module.module}.${constant.name}`;
      if (
        constant.name === normalized ||
        constantPath === normalized ||
        constantPath.endsWith(`.${normalized}`)
      ) {
        matches.push({
          kind: "Constant",
          path: constantPath,
          module,
          docs: constant.docstring,
          constant,
        });
      }
    }
  }
  return pickMostSpecific(matches);
}

function getOwnerHints(owner: string) {
  const trimmed = normalizeName(owner);
  const full = toModulePath(trimmed);
  const parts = full.split(".");
  return {
    raw: trimmed,
    full,
    className: parts[parts.length - 1] ?? trimmed,
  };
}

function findMethod(name: string, owner?: string) {
  const normalized = normalizeName(name);
  const matches: PythonResolvedItem[] = [];
  const ownerHints = owner ? getOwnerHints(owner) : null;

  for (const module of pythonData) {
    for (const cls of module.classes ?? []) {
      if (ownerHints) {
        const classPath = `${module.module}.${cls.name}`;
        const ownerMatches =
          ownerHints.raw === cls.name ||
          ownerHints.raw === classPath ||
          ownerHints.full === classPath ||
          classPath.endsWith(`.${ownerHints.raw}`) ||
          classPath.endsWith(`.${ownerHints.className}`);
        if (!ownerMatches) continue;
      }

      for (const method of cls.methods ?? []) {
        const methodPath = `${module.module}.${cls.name}.${method.name}`;
        if (
          method.name === normalized ||
          methodPath === normalized ||
          methodPath.endsWith(`.${normalized}`)
        ) {
          matches.push({
            kind: "Method",
            path: methodPath,
            module,
            docs: method.docstring,
            signature: method,
            classEntry: cls,
          });
        }
      }
    }
  }

  return pickMostSpecific(matches);
}

function renderDocParagraphs(text?: string | null) {
  if (!text) return null;
  const paragraphs = text
    .split("\n\n")
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean);

  if (!paragraphs.length) return null;

  return (
    <div>
      {paragraphs.map((paragraph, index) => (
        <p key={`python-doc-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
}

function renderSignatureTable(args: PythonArgument[]) {
  const displayArgs = args.filter(
    (arg) => arg.name !== "self" && arg.name !== "cls",
  );
  if (!displayArgs.length) return null;

  return (
    <table className="x:mt-4 x:w-full x:text-sm">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        {displayArgs.map((arg) => (
          <tr key={arg.name}>
            <td>
              <code className="nextra-code">{arg.name}</code>
            </td>
            <td>
              <code className="nextra-code">{arg.type ?? "Any"}</code>
            </td>
            <td>{arg.required ? "Yes" : "No"}</td>
            <td>
              <code className="nextra-code">{arg.default ?? "-"}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderSignatureCallout(signature?: string | null, isAsync?: boolean) {
  if (!signature) return null;
  const prefix = isAsync ? "async " : "";
  return (
    <table className="x:mt-4 x:w-full x:text-sm">
      <thead>
        <tr>
          <th>Signature</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code className="nextra-code">
              {prefix}
              {signature}
            </code>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function renderReturnTable(output?: string | null) {
  if (!output) return null;
  return (
    <table className="x:mt-4 x:w-full x:text-sm">
      <thead>
        <tr>
          <th>Returns</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code className="nextra-code">{output}</code>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function renderClassMethodsTable(methods?: PythonCallable[]) {
  if (!methods?.length) return null;
  return (
    <table className="x:mt-4 x:w-full x:text-sm">
      <thead>
        <tr>
          <th>Method</th>
          <th>Async</th>
          <th>Signature</th>
        </tr>
      </thead>
      <tbody>
        {methods.map((method) => (
          <tr key={method.name}>
            <td>
              <code className="nextra-code">{method.name}</code>
            </td>
            <td>{method.is_async ? "Yes" : "No"}</td>
            <td>
              <code className="nextra-code">
                {method.signature ?? `${method.name}(...)`}
              </code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderConstantValueTable(constant?: PythonConstant) {
  if (!constant) return null;
  if (constant.value === undefined || constant.value === null) return null;
  return (
    <table className="x:mt-4 x:w-full x:text-sm">
      <thead>
        <tr>
          <th>Constant</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code className="nextra-code">{constant.name}</code>
          </td>
          <td>
            <code className="nextra-code">{String(constant.value)}</code>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function renderModuleOverview(module: PythonModule) {
  const classCount = module.classes?.length ?? 0;
  const functionCount = module.functions?.length ?? 0;
  const constantCount = module.constants?.length ?? 0;

  return (
    <table className="x:mt-4 x:w-full x:text-sm">
      <thead>
        <tr>
          <th>Classes</th>
          <th>Functions</th>
          <th>Constants</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{classCount}</td>
          <td>{functionCount}</td>
          <td>{constantCount}</td>
        </tr>
      </tbody>
    </table>
  );
}

function getPythonDocLink(path: string) {
  const section = PYTHONDOC_SECTION_BY_MODULE_PREFIX.find(([prefix]) =>
    path.startsWith(prefix),
  )?.[1];
  if (section) {
    return `${PYTHONDOC_BASE_URL}/${section}/#${path}`;
  }
  return `${PYTHONDOC_BASE_URL}/#${path}`;
}

function resolvePythonItem(props: SDKBlockProps): PythonResolvedItem | null {
  const type = props.type ?? "function";
  switch (type) {
    case "module": {
      const module = findModule(props.name);
      if (!module) return null;
      return {
        kind: "Module",
        path: module.module,
        module,
        docs: module.docstring,
      };
    }
    case "class":
      return findClass(props.name);
    case "method":
      return findMethod(props.name, props.owner);
    case "constant":
      return findConstant(props.name);
    case "function":
    default:
      return findFunction(props.name);
  }
}

export function buildPythonTab(props: SDKBlockProps): SDKTab {
  const item = resolvePythonItem(props);
  if (!item) {
    return {
      label: "Python",
      content: (
        <Callout type="warning">
          Python docs unavailable for{" "}
          <code className="nextra-code x:max-md:break-all">{props.name}</code>.
        </Callout>
      ),
      example: props.children ? { content: props.children } : undefined,
    };
  }

  const signature = item.signature;
  const hasDocs = item.docs != null && item.docs !== "";
  const hasSignature =
    Boolean(signature?.signature) ||
    Boolean(signature?.arguments?.length) ||
    Boolean(signature?.returns?.type);
  const hasClassMethods =
    item.kind === "Class" && Boolean(item.classEntry?.methods?.length);
  const hasConstantValue =
    item.constant?.value !== undefined && item.constant?.value !== null;
  const hasModuleOverview = item.kind === "Module";

  if (
    !hasDocs &&
    !hasSignature &&
    !hasClassMethods &&
    !hasConstantValue &&
    !hasModuleOverview
  ) {
    return {
      label: "Python",
      content: (
        <Callout type="warning">
          Python docs unavailable for{" "}
          <code className="nextra-code x:max-md:break-all">{props.name}</code>.
        </Callout>
      ),
      example: props.children ? { content: props.children } : undefined,
    };
  }

  return {
    label: "Python",
    heading: `${item.kind} ${item.path}`,
    description: renderDocParagraphs(item.docs),
    link: getPythonDocLink(item.path),
    content: (
      <div>
        {signature
          ? renderSignatureCallout(signature.signature, signature.is_async)
          : null}
        {signature ? renderSignatureTable(signature.arguments ?? []) : null}
        {signature ? renderReturnTable(signature.returns?.type ?? null) : null}
        {item.kind === "Class" && item.classEntry
          ? renderClassMethodsTable(item.classEntry.methods)
          : null}
        {renderConstantValueTable(item.constant)}
        {item.kind === "Module" ? renderModuleOverview(item.module) : null}
      </div>
    ),
    example: props.children ? { content: props.children } : undefined,
  };
}
