"use client";

import { Check, Copy, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

// Points readers (and the agents they paste into) at the plain-markdown mirror
// of the page, generated at build time by scripts/generateMarkdownPages.mjs.
// The mirrors only exist after `next build` runs postbuild, so in `next dev`
// the fetch 404s and the button reports a failure rather than copying the
// site's HTML 404 body as if it were the page.
export function CopyMarkdownButton({ route }: { route: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const markdownHref = `${route}.md`;

  async function copy() {
    try {
      const res = await fetch(markdownHref);
      const body = await res.text();
      if (!res.ok || !body.startsWith("#")) throw new Error("no markdown mirror");
      await navigator.clipboard.writeText(body);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  const label =
    state === "copied" ? "Copied" : state === "failed" ? "Unavailable" : "Copy as Markdown";

  return (
    <div className="mb-4 flex items-center justify-end gap-2 text-xs">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy this page as Markdown"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-fd-border px-2 py-1",
          "text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground",
          state === "failed" && "text-fd-muted-foreground/60",
        )}
      >
        {state === "copied" ? (
          <Check className="size-3.5" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
        {label}
      </button>
      <a
        href={markdownHref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-fd-border px-2 py-1",
          "text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground",
        )}
      >
        <FileText className="size-3.5" aria-hidden />
        View as Markdown
      </a>
    </div>
  );
}
