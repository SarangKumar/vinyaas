import { components, targetComponentCount } from "@/components/component-meta";
import { DocsArticle } from "@/components/docs-article";

const heading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function ChangelogPage() {
  const remaining = targetComponentCount - components.length;

  return (
    <DocsArticle
      title="Changelog"
      description="What Vinyaas has shipped, and what v0.2 still has left."
    >
      <section className="flex flex-col gap-4">
        <h2 id="v0.1" className={heading}>
          v0.1
        </h2>
        <p className="text-body text-base leading-7">
          v0.1 is the foundation. It is implemented in this repository.
        </p>
        <ul className="text-body list-disc pl-5 text-base leading-7">
          <li>
            A pnpm workspace with a docs app and the <code>@vinyaas/cli</code>{" "}
            package.
          </li>
          <li>
            A new-york registry. Each component is one installable JSON item.
            <code> vinyaas init</code> writes <code>components.json</code> and{" "}
            <code>lib/utils.ts</code>. <code>vinyaas add</code> copies that
            component&apos;s source.
          </li>
          <li>
            The first components: Button, Input, Textarea, and Label, plus the
            documentation site that renders them.
          </li>
          <li>Light and dark themes, stored in the browser.</li>
          <li>
            An installation flow that records the package manager for the
            session: npm, pnpm, yarn, or bun.
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="v0.2" className={heading}>
          v0.2
        </h2>
        <p className="text-body text-base leading-7">
          v0.2 targets {targetComponentCount} independently installable
          components, with forms as the main focus. {components.length} are
          implemented. {remaining} are still planned.
        </p>
        <h3
          id="implemented"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Implemented
        </h3>
        <ul className="text-body list-disc pl-5 text-base leading-7">
          <li>
            The catalog currently includes{" "}
            {components.map((component) => component.name).join(", ")}.
          </li>
          <li>
            The homepage is a showcase. The introduction lives at{" "}
            <code>/introduction</code>.
          </li>
          <li>
            Component pages share one reference layout. Examples use a preview
            and the complete source together.
          </li>
          <li>
            A component example that has both sources can switch between TSX and
            JSX in that snippet. Terminal commands stay bash, and the
            package-manager choice stays separate. Syntax highlighting is not
            included yet.
          </li>
          <li>
            Button matches Input at the default height and adds ghost,
            secondary, and link variants, plus icon sizes.
          </li>
          <li>
            Spinner, Badge, Table, Tooltip, Native Select, Toast, and Popover
            are source-installed components. The existing Select stays a native
            select. A custom popup Select is not implemented.
          </li>
        </ul>
        <h3
          id="planned"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Planned
        </h3>
        <ul className="text-body list-disc pl-5 text-base leading-7">
          <li>
            {remaining} more components so the catalog reaches{" "}
            {targetComponentCount}.
          </li>
          <li>
            Publishing this registry and CLI is separate from the work in the
            working tree.
          </li>
        </ul>
        <h3
          id="not-in-this-version"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Not in this version
        </h3>
        <ul className="text-body list-disc pl-5 text-base leading-7">
          <li>Syntax highlighting.</li>
          <li>A custom popup Select.</li>
          <li>Swipe-to-dismiss toasts.</li>
          <li>
            Theme CSS written into a consumer project by{" "}
            <code>vinyaas init</code>.
          </li>
        </ul>
      </section>
    </DocsArticle>
  );
}
