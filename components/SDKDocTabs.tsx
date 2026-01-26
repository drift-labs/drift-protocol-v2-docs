"use client";

import { Callout, Tabs } from "nextra/components";

type SDKTab = {
  label: string;
  content?: React.ReactNode;
  placeholder?: boolean;
  link?: string;
  example?: { content?: React.ReactNode };
};

type SDKDocTabsProps = {
  tabs: SDKTab[];
};

function Placeholder({ label }: { label: string }) {
  return (
    <Callout type="info">
      Remote {label} docs URL not configured yet.
    </Callout>
  );
}

export function SDKDocTabs({ tabs }: SDKDocTabsProps) {
  if (!tabs.length) {
    return (
      <Callout type="warning">No SDK documentation sources provided.</Callout>
    );
  }

  return (
    <Tabs items={tabs.map(tab => tab.label)}>
      {tabs.map((tab) => (
        <Tabs.Tab key={tab.label} title={tab.label}>
          {tab.example ? (
            <div>
              {tab.example.content}
            </div>
          ) : null}
          {tab.content ?? (tab.placeholder ? <Placeholder label={tab.label} /> : null)}
          {tab.link ? (
            <div className="x:my-4">
              <a
                href={tab.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Reference ↗
              </a>
            </div>
          ) : null}
        </Tabs.Tab>
      ))}
    </Tabs>
  );
}
