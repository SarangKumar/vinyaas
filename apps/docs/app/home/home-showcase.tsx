import { Playground } from "@/app/home/playground";
import { PlaygroundSideRails } from "@/app/home/playground-side-skeletons";

/**
 * Below-the-fold homepage showcase + decorative side rails.
 * Loaded via next/dynamic so the hero can paint without waiting on the
 * showcase client graph (charts, companion, dnd-kit, etc.).
 *
 * Shell mirrors ui.shadcn.com: flex band + absolute rails at ≥2200px.
 */
export function HomeShowcase() {
  return (
    <div className="relative min-w-0">
      <div
        data-playground-shell
        className="bg-muted dark:bg-background relative flex w-full max-w-none flex-col gap-(--gap) overflow-hidden p-(--playground-pad) pb-0! [--gap:var(--playground-gap)] min-[1900px]:p-(--playground-pad-xl)! min-[1900px]:[--gap:var(--playground-gap-2xl)]! md:[--gap:var(--playground-gap-md)] lg:p-(--playground-pad-lg) lg:[--gap:var(--playground-gap-md)] xl:p-(--playground-pad-xl) xl:[--gap:var(--playground-gap-xl)]"
      >
        <PlaygroundSideRails />
        <Playground />
        <div
          aria-hidden="true"
          data-playground-blur
          className="from-background via-muted/80 dark:via-background/80 pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48 bg-linear-to-t to-transparent lg:h-80 xl:h-64"
        />
      </div>
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-1 px-5 pt-20 pb-10 text-center">
        <p className="text-muted-foreground pointer-events-auto text-sm">
          Made by{" "}
          <a
            href="https://github.com/SarangKumar"
            target="_blank"
            rel="noreferrer"
            className="text-primary focus-visible:ring-ring focus-visible:ring-offset-background inline underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Sarang Kumar
          </a>{" "}
          · 2026
        </p>
        <p className="text-muted-foreground text-xs">v1.3.1</p>
      </footer>
    </div>
  );
}
