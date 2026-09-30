import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { DocsShell } from "@/components/docs-shell";
import { DocsStoreProvider } from "@/lib/store/provider";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
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
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Sarang Kumar", url: "https://github.com/SarangKumar" }],
  creator: "Sarang Kumar",
  publisher: siteName,
  keywords: [
    "Vinyaas",
    "React",
    "Tailwind CSS",
    "UI components",
    "component registry",
    "design system",
    "shadcn",
    "TypeScript",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    type: "website",
    locale: "en_US",
    siteName,
    url: siteUrl,
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
    title: siteName,
    description: siteDescription,
    images: ["/og.png"],
  },
  verification: {
    google: "IAk36o0wRdV4UaM6vJ7qh_d518L26eOemV5QjxpM0II",
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
