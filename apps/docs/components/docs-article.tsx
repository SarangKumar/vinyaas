import type { ReactNode } from "react";

import { docsMutedBodyClassName } from "@/components/docs-prose";

export function DocsArticle({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <article
      data-docs-article
      className="text-foreground mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10"
    >
      <header className="flex flex-col gap-3 sm:gap-4">
        <h1 className="text-foreground text-[clamp(1.75rem,5.5vw,1.875rem)] font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className={`${docsMutedBodyClassName} text-pretty`}>
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </article>
  );
}
