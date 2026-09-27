import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { DocsShell } from "@/components/docs-shell";

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
    >
      <body className="flex min-h-full flex-col font-sans">
        <DocsShell>{children}</DocsShell>
      </body>
    </html>
  );
}
