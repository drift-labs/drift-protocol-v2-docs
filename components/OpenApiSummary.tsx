import fs from "fs";
import path from "path";
import { Callout } from "nextra/components";

type OpenApiSpec = {
  openapi?: string;
  info?: { title?: string; version?: string; description?: string };
  tags?: Array<{ name: string; description?: string }>;
  paths?: Record<string, Record<string, { summary?: string; description?: string; tags?: string[] }>>;
};

const LOCAL_SPEC_PATH = path.join(process.cwd(), "data", "openapi", "data-api.json");
const FALLBACK_SPEC_PATH = "/Users/w/v2-teacher-1/source/api spec.json";

function stripHtml(value?: string) {
  if (!value) return value;
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function readSpec(): { spec?: OpenApiSpec; error?: string; sourcePath?: string } {
  const candidates = [LOCAL_SPEC_PATH, FALLBACK_SPEC_PATH];
  for (const candidate of candidates) {
    try {
      if (!fs.existsSync(candidate)) continue;
      const raw = fs.readFileSync(candidate, "utf8");
      return { spec: JSON.parse(raw), sourcePath: candidate };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }
  return { error: "OpenAPI spec not found." };
}

function getOperations(spec: OpenApiSpec) {
  const operations: Array<{
    method: string;
    path: string;
    summary?: string;
    description?: string;
    tags?: string[];
  }> = [];
  const paths = spec.paths ?? {};
  for (const [pathKey, methods] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      operations.push({
        method: method.toUpperCase(),
        path: pathKey,
        summary: stripHtml(operation.summary),
        description: stripHtml(operation.description),
        tags: operation.tags,
      });
    }
  }
  return operations;
}

export function OpenApiSummary() {
  const { spec, error, sourcePath } = readSpec();
  if (!spec || error) {
    return (
      <Callout type="warning">
        Unable to load OpenAPI spec. {error ?? "Unknown error."}
      </Callout>
    );
  }

  const operations = getOperations(spec);
  const tagMap = new Map<string, { description?: string }>();
  for (const tag of spec.tags ?? []) {
    tagMap.set(tag.name, { description: stripHtml(tag.description) });
  }
  for (const op of operations) {
    for (const tag of op.tags ?? []) {
      if (!tagMap.has(tag)) tagMap.set(tag, {});
    }
  }
  const tagEntries: Array<[string, { description?: string }]> = [];
  tagMap.forEach((meta, name) => {
    tagEntries.push([name, meta]);
  });

  return (
    <div>
      <p>
        <b>{spec.info?.title ?? "OpenAPI Spec"}</b>
        {spec.info?.version ? ` — ${spec.info.version}` : ""}
      </p>
      <p>
        Source: <code>{sourcePath}</code>
      </p>

      <h3>Tags</h3>
      <ul>
        {tagEntries.map(([name, meta]) => (
          <li key={name}>
            <b>{name}</b>
            {meta.description ? ` — ${meta.description}` : ""}
          </li>
        ))}
      </ul>

      <h3>Endpoints</h3>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Path</th>
            <th>Summary</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {operations.map((op) => (
            <tr key={`${op.method}:${op.path}`}>
              <td>
                <code>{op.method}</code>
              </td>
              <td>
                <code>{op.path}</code>
              </td>
              <td>{op.summary ?? op.description ?? "—"}</td>
              <td>{op.tags?.join(", ") ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
