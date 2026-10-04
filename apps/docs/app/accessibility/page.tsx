import type { Metadata } from "next";

import { DocsArticle } from "@/components/docs-article";
import { pageMetadata } from "@/lib/page-metadata";
import {
  accessibilityContract,
  accessibilityTestConvention,
} from "@/registry/accessibility";

export const metadata: Metadata = pageMetadata({
  title: "Accessibility",
  description:
    "Vinyaas accessibility contract for registry components: keyboard, focus, ARIA, and related expectations.",
  path: "/accessibility",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

export default function AccessibilityPage() {
  return (
    <DocsArticle
      title="Accessibility"
      description="A concise release-wide contract for Vinyaas registry components. This is a checklist, not a runtime framework."
    >
      <section className="flex flex-col gap-4">
        <h2 id="contract" className={sectionHeading}>
          Contract
        </h2>
        <p className={body}>
          Apply these requirements when adding or changing installable UI under
          the registry. Prefer native HTML semantics before ARIA.
        </p>
        <ul className={`${body} list-disc space-y-3 pl-5`}>
          {accessibilityContract.map((item) => (
            <li key={item.id}>
              <strong>{item.title}.</strong> {item.requirement}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="testing" className={sectionHeading}>
          Testing convention
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          {accessibilityTestConvention.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
    </DocsArticle>
  );
}
