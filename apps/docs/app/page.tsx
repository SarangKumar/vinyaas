import Link from "next/link";

import { Playground } from "@/app/home/playground";
import { focusRing } from "@/components/focus-ring";
import { Badge } from "@/registry/new-york/ui/badge/badge";

const primaryLink = `bg-primary text-primary-foreground inline-flex h-9 items-center rounded-md px-4 text-sm font-medium no-underline ${focusRing}`;
const secondaryLink = `border-border bg-background text-foreground inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium no-underline ${focusRing}`;

export default function Home() {
  return (
    <div className="flex w-full min-w-0 flex-col">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6 px-5 pt-16 pb-12 sm:px-8">
        <Badge variant="secondary">v1.0.0</Badge>
        <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Build with Vinyaas
        </h1>
        <p className="text-body max-w-xl text-lg leading-8">
          Sign-in, billing, directories, and project tools composed from
          components you install as source.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/installation" className={primaryLink}>
            Get Started
          </Link>
          <Link href="/components" className={secondaryLink}>
            View Components
          </Link>
        </div>
      </section>
      <div className="relative min-w-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <Playground />
        </div>
        <div
          aria-hidden="true"
          className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t to-transparent [mask-image:linear-gradient(to_top,black,transparent)] backdrop-blur-sm"
        />
      </div>
      <footer className="relative z-10 -mt-4 flex flex-col items-center gap-1 px-5 pt-6 pb-16 text-center">
        <p className="text-muted-foreground text-sm">
          Made by Sarang Kumar · 2026
        </p>
        <p className="text-muted-foreground text-xs">Vinyaas v1.0.0</p>
      </footer>
    </div>
  );
}
