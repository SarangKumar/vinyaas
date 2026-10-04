import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Playground } from "@/app/home/playground";
import { PlaygroundSideRails } from "@/app/home/playground-side-skeletons";
import { focusRing } from "@/components/focus-ring";
import logo from "@/components/logo.png";

const primaryLink = `bg-primary text-primary-foreground inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium no-underline ${focusRing}`;
const secondaryLink = `border-border bg-background text-foreground hover:bg-muted inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium no-underline ${focusRing}`;
const creditLink = `text-primary inline underline underline-offset-4 ${focusRing}`;

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
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-16 pb-12 text-center sm:pt-20 sm:pb-14">
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
        <p className="text-muted-foreground mt-4 max-w-136 text-sm leading-6 sm:text-base sm:leading-7">
          A registry-driven component library for React and Tailwind CSS v4. Run{" "}
          <code className="font-mono text-[0.95em]">vinyaas init</code>, add the
          components you need, and keep the source in your project.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <Link href="/installation" className={primaryLink}>
            Get Started
          </Link>
          <Link href="/components" className={secondaryLink}>
            Components
          </Link>
        </div>
        <p className="text-muted-foreground mt-5 text-sm">
          Explore{" "}
          <Link href="/companion" className={creditLink}>
            Companions
          </Link>
          ,{" "}
          <Link href="/themes" className={creditLink}>
            Themes
          </Link>
          , and{" "}
          <Link href="/typeset" className={creditLink}>
            Typeset
          </Link>{" "}
          playgrounds.
        </p>
      </section>
      <div className="relative min-w-0">
        {/*
          Full-bleed showcase. Side rails are absolute outside the 1900px
          main band (shadcn pattern). Bottom fade sits above the cards;
          footer sits above the fade.
        */}
        <div
          data-playground-shell
          className="bg-muted dark:bg-background relative flex w-full max-w-none flex-col overflow-hidden p-(--playground-pad) pb-0! [--gap:var(--playground-gap)] min-[1900px]:p-(--playground-pad-xl)! min-[1900px]:[--gap:var(--playground-gap-2xl)]! md:[--gap:var(--playground-gap-md)] lg:p-(--playground-pad-lg) xl:p-(--playground-pad-xl) xl:[--gap:var(--playground-gap-xl)]"
        >
          <PlaygroundSideRails />
          <Playground />
          {/* Outer fades soft-mask the skeleton rails at the viewport edges */}
          <div
            aria-hidden="true"
            data-playground-side-fade="left"
            className="from-muted dark:from-background pointer-events-none absolute inset-y-0 left-0 z-[15] hidden w-28 bg-gradient-to-r to-transparent min-[2200px]:block"
          />
          <div
            aria-hidden="true"
            data-playground-side-fade="right"
            className="from-muted dark:from-background pointer-events-none absolute inset-y-0 right-0 z-15 hidden w-28 bg-linear-to-l to-transparent min-[2200px]:block"
          />
          <div
            aria-hidden="true"
            data-playground-blur
            className="from-background via-muted/80 dark:via-background/90 pointer-events-none absolute inset-x-0 bottom-0 z-20 h-54 bg-linear-to-t to-transparent lg:h-80 xl:h-64"
          />
        </div>
        <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-1 px-5 pt-20 pb-10 text-center">
          <p className="text-muted-foreground pointer-events-auto text-sm">
            Made by{" "}
            <a
              href="https://github.com/SarangKumar"
              target="_blank"
              rel="noreferrer"
              className={creditLink}
            >
              Sarang Kumar
            </a>{" "}
            · 2026
          </p>
          <p className="text-muted-foreground text-xs">v1.3.0</p>
        </footer>
      </div>
    </div>
  );
}
