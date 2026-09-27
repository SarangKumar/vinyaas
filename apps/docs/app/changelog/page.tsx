import { components, targetComponentCount } from "@/components/component-meta";
import { DocsArticle } from "@/components/docs-article";

const heading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

export default function ChangelogPage() {
  const v01 = components.filter(
    (component) => component.introducedIn === "0.1",
  );
  const v02 = components.filter(
    (component) => component.introducedIn === "0.2",
  );

  return (
    <DocsArticle title="Changelog" description="What Vinyaas has shipped.">
      <section className="flex flex-col gap-4">
        <h2 id="v0.1" className={heading}>
          v0.1
        </h2>
        <p className="text-body text-base leading-7">
          v0.1 is the foundation. It ships {v01.length} component.
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
            Released: {v01.map((component) => component.name).join(", ")}.
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
          v0.2 is the form-focused expansion. It adds {v02.length} components.
          Together with v0.1, the catalog has {components.length} of{" "}
          {targetComponentCount}.
        </p>
        <h3
          id="implemented"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Released
        </h3>
        <ul className="text-body list-disc pl-5 text-base leading-7">
          {v02.map((component) => (
            <li key={component.slug}>{component.name}</li>
          ))}
        </ul>
        <p className="text-body text-base leading-7">
          Component pages share one reference layout. An example with both
          sources can switch between TSX and JSX. Terminal commands stay bash. A
          plain HTML select is used where a menu is enough. A custom popup
          Select is not implemented.
        </p>
        <h3
          id="planned"
          className="text-foreground scroll-mt-8 text-base font-medium"
        >
          Planned
        </h3>
        <ul className="text-body list-disc pl-5 text-base leading-7">
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
