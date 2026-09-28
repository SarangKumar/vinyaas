import type { Metadata } from "next";
import Link from "next/link";

import { Playground } from "@/app/home/playground";
import { PlaygroundSideRails } from "@/app/home/playground-side-skeletons";
import { focusRing } from "@/components/focus-ring";

const primaryLink = `bg-primary text-primary-foreground inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium no-underline ${focusRing}`;
const secondaryLink = `border-border bg-background text-foreground hover:bg-muted inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium no-underline ${focusRing}`;
const creditLink = `text-primary inline underline underline-offset-4 ${focusRing}`;

export const metadata: Metadata = {
  title: "Vinyaas",
  description:
    "Composable React components you install as source. Build forms, billing, directories, and product UI.",
  openGraph: {
    title: "Vinyaas",
    description: "Composable React components you install as source.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex w-full min-w-0 flex-col">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-16 pb-12 text-center sm:pt-20 sm:pb-14">
        <p className="text-muted-foreground text-sm font-medium tracking-[0.16em] uppercase">
          Vinyaas
        </p>
        <h1 className="text-foreground mt-4 max-w-full text-[min(3rem,calc((100vw-3rem)/22))] leading-[1.15] font-semibold tracking-tight whitespace-nowrap">
          Build interfaces with composable components.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-[34rem] text-sm leading-6 sm:text-base sm:leading-7">
          Accessible React primitives installed as source. Compose the product
          UI you need without a locked runtime.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <Link href="/installation" className={primaryLink}>
            Get Started
          </Link>
          <Link href="/components" className={secondaryLink}>
            Components
          </Link>
        </div>
      </section>
      <div className="relative min-w-0">
        {/*
          Full-bleed showcase. Side rails are absolute outside the 1900px
          main band (shadcn pattern). Bottom fade sits above the cards;
          footer sits above the fade.
        */}
        <div
          data-playground-shell
          className="bg-muted dark:bg-background relative flex w-full max-w-none flex-col overflow-hidden p-[var(--playground-pad)] pb-0! [--gap:var(--playground-gap)] min-[1900px]:p-[var(--playground-pad-xl)]! min-[1900px]:[--gap:var(--playground-gap-2xl)]! md:[--gap:var(--playground-gap-md)] lg:p-[var(--playground-pad-lg)] xl:p-[var(--playground-pad-xl)] xl:[--gap:var(--playground-gap-xl)]"
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
            className="from-muted dark:from-background pointer-events-none absolute inset-y-0 right-0 z-[15] hidden w-28 bg-gradient-to-l to-transparent min-[2200px]:block"
          />
          <div
            aria-hidden="true"
            data-playground-blur
            className="from-background via-muted/80 dark:via-background/80 pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48 bg-gradient-to-t to-transparent lg:h-80 xl:h-64"
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
          <p className="text-muted-foreground text-xs">v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}
