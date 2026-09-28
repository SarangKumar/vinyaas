import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
        {/* Sets the theme class before the body paints. React does not own this class during SSR. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-background text-foreground h-full overflow-hidden font-sans">
        <DocsShell>
          <CodeLanguageProvider>{children}</CodeLanguageProvider>
        </DocsShell>
      </body>
    </html>
  );
}
