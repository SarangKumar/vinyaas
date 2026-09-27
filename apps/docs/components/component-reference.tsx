import type { ReactNode } from "react";

/**
 * Shared layout for a component documentation page.
 * Live examples are children. Installation, usage, and source are text.
 */
export function ComponentReference({
  title,
  description,
  install,
  usage,
  source,
  children,
}: {
  title: string;
  description: string;
  install: string;
  usage: string;
  source: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">{title}</h1>
        <p>{description}</p>
      </header>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Example</h2>
        <div className="flex flex-wrap items-center gap-3">{children}</div>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Installation</h2>
        <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm">
          <code>{install}</code>
        </pre>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Usage</h2>
        <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm">
          <code>{usage}</code>
        </pre>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Source</h2>
        <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm">
          <code>{source}</code>
        </pre>
      </section>
    </article>
  );
}
