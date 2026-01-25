import "nextra-theme-docs/style.css";
import "../styles/theme.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import { Logo } from "../components/Logo";

export const metadata: Metadata = {
  title: {
    default: "Drift Protocol",
    template: "%s – Drift Protocol",
  },
  description:
    "Drift brings on-chain, cross-margined perpetual futures to Solana. Making futures DEXs the best way to trade.",
  openGraph: {
    title: "Drift Protocol",
    description:
      "Drift brings on-chain, cross-margined perpetual futures to Solana. Making futures DEXs the best way to trade.",
    images: ["/assets/Hw-EeD1Xigo3jzRru1jQ__driftoverview.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/Hw-EeD1Xigo3jzRru1jQ__driftoverview.png"],
  },
  icons: {
    icon: [
      { url: "/assets/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/favicon.png", type: "image/png" },
      {
        url: "/assets/favicon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/assets/favicon-dark.png",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

const logo = (
  <div className="nx-flex nx-items-center">
    <Link href="/protocol" className="nx-flex nx-items-center">
      <Logo />
    </Link>
  </div>
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageMap = await getPageMap();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Layout
          pageMap={pageMap}
          navbar={
            <Navbar
              logo={logo}
              logoLink={false}
              projectLink="https://github.com/drift-labs"
              chatLink="https://discord.com/invite/95kByNnDy5"
            >
            </Navbar>
          }
          sidebar={{
            defaultMenuCollapseLevel: 1,
            toggleButton: true,
          }}
          docsRepositoryBase="https://github.com/drift-labs/drift-protocol-v2-docs/tree/master"
          footer={
            <Footer>
              <a
                target="_blank"
                rel="noopener noreferrer"
                title="Drift Protocol Landing Page"
                href="https://www.drift.trade/"
              >
                <p>© {new Date().getFullYear()} Drift Protocol</p>
              </a>
            </Footer>
          }
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
