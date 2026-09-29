import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { DocsShell } from "@/components/docs-shell";
import { DocsStoreProvider } from "@/lib/store/provider";
import { themeStorageKey } from "@/components/theme";
import { ThemeSync } from "@/components/theme-sync";

import "./globals.css";
import "./docs.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vinyaas.vercel.app"),
  title: {
    default: "Vinyaas",
    template: "%s · Vinyaas",
  },
  description:
    "Composable React UI components installed into your project as source.",
  openGraph: {
    title: "Vinyaas",
    description:
      "Composable React UI components installed into your project as source.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Vinyaas — composable React components installed as source",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinyaas",
    description:
      "Composable React UI components installed into your project as source.",
    images: ["/og.png"],
  },
};

/**
 * Theme class comes from the cookie the toggle writes.
 * ThemeSync reconciles localStorage after mount. There is no inline script,
 * so the server and the first client paint share the same class string.
 */
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const stored = (await cookies()).get(themeStorageKey)?.value;
  const themeClass = stored === "dark" ? "dark" : "";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased${themeClass ? ` ${themeClass}` : ""}`}
    >
      <body className="bg-background text-foreground h-full overflow-hidden font-sans">
        <ThemeSync />
        <DocsShell>
          <DocsStoreProvider>{children}</DocsStoreProvider>
        </DocsShell>
      </body>
    </html>
  );
}
