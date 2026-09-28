import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { DocsShell } from "@/components/docs-shell";
import { CodeLanguageProvider } from "@/components/code-language-store";
import { themeInitScript } from "@/components/theme";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vinyaas",
  description: "UI components installed into your project as source.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* beforeInteractive runs in the initial HTML, before React hydrates the tree. */}
        <Script id="vinyaas-theme" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="bg-background text-foreground h-full overflow-hidden font-sans">
        <DocsShell>
          <CodeLanguageProvider>{children}</CodeLanguageProvider>
        </DocsShell>
      </body>
    </html>
  );
}
