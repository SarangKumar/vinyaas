import Link from "next/link";

import { DocsArticle } from "@/components/docs-article";
import { focusRing } from "@/components/focus-ring";

export default function Home() {
  return (
    <DocsArticle
      title="Introduction"
      description="Vinyaas installs UI components into your project as source."
    >
      <div className="text-muted-foreground flex flex-col gap-4 text-sm leading-6">
        <p>
          <code className="font-mono">vinyaas init</code> creates{" "}
          <code className="font-mono">components.json</code> and{" "}
          <code className="font-mono">lib/utils.ts</code>. Components are then
          added from the registry with{" "}
          <code className="font-mono">vinyaas add</code>.
        </p>
        <p>
          <Link
            href="/installation"
            className={`text-foreground cursor-pointer rounded-sm underline ${focusRing}`}
          >
            Installation
          </Link>{" "}
          covers the project requirements. The current components are{" "}
          <Link
            href="/components/button"
            className={`text-foreground cursor-pointer rounded-sm underline ${focusRing}`}
          >
            Button
          </Link>{" "}
          and{" "}
          <Link
            href="/components/input"
            className={`text-foreground cursor-pointer rounded-sm underline ${focusRing}`}
          >
            Input
          </Link>
          .
        </p>
      </div>
    </DocsArticle>
  );
}
