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
      className="text-body mx-auto flex w-full max-w-3xl flex-col gap-20 px-6 py-14"
    >
      <header className="flex flex-col gap-4">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        {description ? (
          <p className="text-body text-base leading-7">{description}</p>
        ) : null}
      </header>
      {children}
    </article>
  );
}
