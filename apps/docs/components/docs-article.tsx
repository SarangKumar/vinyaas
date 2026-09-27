import type { ReactNode } from "react";

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
      className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-10"
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-muted-foreground text-base">{description}</p>
        ) : null}
      </header>
      {children}
    </article>
  );
}
