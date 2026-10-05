import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { focusRing } from "@/components/focus-ring";
import logo from "@/components/logo.png";

const primaryLink = `bg-primary text-primary-foreground inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium no-underline ${focusRing}`;
const secondaryLink = `border-border bg-background text-foreground hover:bg-muted inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium no-underline ${focusRing}`;

/**
 * Showcase is a separate client-heavy chunk (recharts, companion, dnd-kit, …).
 * Deferring it keeps the hero’s first paint off that graph.
 */
const HomeShowcase = dynamic(
  () =>
    import("@/app/home/home-showcase").then((module) => module.HomeShowcase),
  {
    loading: () => (
      <div
        aria-hidden="true"
        data-playground-loading
        className="bg-muted dark:bg-background min-h-[70vh] w-full"
      />
    ),
  },
);

export const metadata: Metadata = {
  title: "Vinyaas",
  description:
    "Composable React components you install as source. The v1.3.0 catalog covers forms, overlays, feedback, and product UI.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vinyaas",
    description:
      "Composable React components you install as source. v1.3.0 production catalog.",
    type: "website",
    url: "/",
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
    images: ["/og.png"],
  },
};

export default function Home() {
  return (
    <div className="flex w-full min-w-0 flex-col">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-14 pb-6 text-center sm:pt-16 sm:pb-8">
        <div
          data-home-brand
          className="border-border/80 bg-card/40 flex size-16 items-center justify-center rounded-2xl border shadow-[0_0_40px_-12px_#A7B3FF66] sm:size-20"
        >
          <Image
            src={logo}
            alt="Vinyaas"
            width={64}
            height={64}
            priority
            className="size-12 rounded-[0.9rem] sm:size-14"
          />
        </div>
        <p className="text-muted-foreground mt-5 text-sm font-medium tracking-[0.16em] uppercase">
          Vinyaas
        </p>
        <h1 className="text-foreground mt-4 max-w-full text-[clamp(1.875rem,8vw,3rem)] leading-[1.15] font-semibold tracking-tight text-balance sm:whitespace-nowrap">
          Build. Ship. Beautifully.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl text-base leading-7 text-balance text-pretty sm:max-w-2xl sm:text-lg sm:leading-8">
          A registry-driven component library for React and Tailwind CSS v4. Run{" "}
          <code className="font-mono text-[0.95em]">vinyaas init</code>, add the
          components you need, and keep the source in your project.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <Link href="/installation" className={primaryLink}>
            Get Started
          </Link>
          <Link href="/components" className={secondaryLink}>
            Components
          </Link>
        </div>
      </section>
      <HomeShowcase />
    </div>
  );
}
