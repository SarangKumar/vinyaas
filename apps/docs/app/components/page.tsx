import Link from "next/link";

import { docsNav } from "@/components/docs-nav";
import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";

export default function ComponentsPage() {
  const components = docsNav.find((group) => group.title === "Components");

  return (
    <DocsArticle
      title="Components"
      description="Source components installed with the Vinyaas CLI."
    >
      <ul className="flex flex-col gap-2 text-sm">
        {components?.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`text-foreground cursor-pointer rounded-sm underline ${focusRing}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </DocsArticle>
  );
}
