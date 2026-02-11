"use client";

import { Callout, Tabs } from "nextra/components";

export type SDKTab = {
  label: string;
  description?: string;
  heading?: string;
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
    <Callout type="info">Remote {label} docs URL not configured yet.</Callout>
  );
}

export function SDKDocTabs({ tabs }: SDKDocTabsProps) {
  if (!tabs.length) {
    return (
      <Callout type="warning">No SDK documentation sources provided.</Callout>
    );
  }

  return (
    <Tabs items={tabs.map((tab) => tab.label)}>
      {tabs.map((tab) => (
        <Tabs.Tab key={tab.label} title={tab.label}>
          {tab.example ? <div>{tab.example.content}</div> : null}
          {tab.heading ? (
            <div className="x:mt-4 x:flex x:flex-wrap x:items-center x:gap-3">
              <code className="nextra-code x:max-md:break-all">
                {tab.heading}
              </code>
              {tab.link ? (
                <a href={tab.link} target="_blank" rel="noopener noreferrer">
                  Reference ↗
                </a>
              ) : null}
            </div>
          ) : null}
          {tab.description ? <i>{tab.description}</i> : null}
          {tab.content ??
            (tab.placeholder ? <Placeholder label={tab.label} /> : null)}
        </Tabs.Tab>
      ))}
    </Tabs>
  );
}
