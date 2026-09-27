import Link from "next/link";

import { docsNav } from "@/components/docs-nav";
import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";
import { NewIndicator } from "@/components/new-indicator";

export default function ComponentsPage() {
  const components = docsNav.find((group) => group.title === "Components");

  return (
    <DocsArticle
      title="Components"
      description="Source components installed with the Vinyaas CLI."
    >
      <ul className="flex flex-col gap-4 text-base">
        {components?.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-label={item.isNew ? `${item.title}, new` : undefined}
              className={`text-foreground inline-flex cursor-pointer items-center rounded-sm underline ${focusRing}`}
            >
              {item.title}
              {item.isNew ? <NewIndicator /> : null}
            </Link>
          </li>
        ))}
      </ul>
    </DocsArticle>
  );
}
