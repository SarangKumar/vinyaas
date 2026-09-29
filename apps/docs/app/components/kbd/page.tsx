import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Kbd } from "@/registry/new-york/ui/kbd";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("kbd");

const usage = `import { Kbd } from "@/components/ui/kbd";

export function CommandShortcut() {
  return (
    <span>
      Press <Kbd>⌘</Kbd> <Kbd>K</Kbd>
    </span>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "children",
    type: "ReactNode",
    description: "The key label, such as a letter or symbol.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the kbd element with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "named-keys",
    title: "Named keys",
    description:
      "Use readable labels for Enter, Return, Space, and Escape. Kbd is visual only. It does not listen for those keys.",
    preview: (
      <span className="flex flex-wrap items-center gap-2 text-sm">
        <Kbd>Enter</Kbd>
        <Kbd>Return</Kbd>
        <Kbd>Space</Kbd>
        <Kbd>Esc</Kbd>
      </span>
    ),
    code: `<span className="flex flex-wrap gap-2">
  <Kbd>Enter</Kbd>
  <Kbd>Return</Kbd>
  <Kbd>Space</Kbd>
  <Kbd>Esc</Kbd>
</span>`,
  },
  {
    id: "arrows",
    title: "Arrow keys",
    description: "Show the four directions with arrow glyphs.",
    preview: (
      <span className="inline-flex items-center gap-1 text-sm">
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
        <Kbd>←</Kbd>
        <Kbd>→</Kbd>
      </span>
    ),
    code: `<span className="inline-flex gap-1">
  <Kbd>↑</Kbd>
  <Kbd>↓</Kbd>
  <Kbd>←</Kbd>
  <Kbd>→</Kbd>
</span>`,
  },
  {
    id: "command-k",
    title: "Command palette",
    description: "Document the macOS and Windows shortcuts for search.",
    preview: (
      <span className="flex flex-wrap items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </span>
      </span>
    ),
    code: `<span className="inline-flex gap-1">
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</span>
<span className="inline-flex gap-1">
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</span>`,
  },
  {
    id: "save",
    title: "Save shortcut",
    description: "A realistic modifier combination next to its action.",
    preview: (
      <span className="text-sm">
        Save with{" "}
        <span className="inline-flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </span>
      </span>
    ),
    code: `<span>
  Save with <Kbd>⌘</Kbd> <Kbd>S</Kbd>
</span>`,
  },
];

export default async function KbdPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/kbd/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Kbd"
      description="A compact label for a keyboard key."
      overview={
        <p>
          Kbd renders a native <code>kbd</code> element. It displays a key. It
          does not listen for that key or become a button. Pair it with real
          keyboard handlers elsewhere when the shortcut must work.
        </p>
      }
      install="vinyaas add kbd"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/kbd/index.tsx</code>. It imports <code>cn</code>{" "}
          from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>
            The element is presentational. Visible text is the accessible name.
            Do not rely on Kbd alone to expose a keyboard shortcut to assistive
            technology when the control needs one.
          </p>
        </>
      }
      source={source}
    >
      <span className="inline-flex items-center gap-1 text-sm">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </ComponentReference>
  );
}
