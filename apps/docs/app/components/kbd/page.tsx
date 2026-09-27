import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import { Kbd } from "@/registry/new-york/ui/kbd/kbd";

const usage = `import { Kbd } from "@/components/ui/kbd/kbd";

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
    id: "single-key",
    title: "Single key",
    description: "One key is one kbd element.",
    preview: <Kbd>Esc</Kbd>,
    code: `<Kbd>Esc</Kbd>`,
  },
  {
    id: "shortcut",
    title: "Shortcut",
    description: "Place keys next to each other for a shortcut.",
    preview: (
      <span className="inline-flex items-center gap-1 text-sm">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    ),
    code: `<span>
  <Kbd>⌘</Kbd> <Kbd>K</Kbd>
</span>`,
  },
  {
    id: "multiple-keys",
    title: "Multiple keys",
    description: "Write the modifier the way the platform shows it.",
    preview: (
      <span className="inline-flex items-center gap-1 text-sm">
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </span>
    ),
    code: `<span>
  <Kbd>Ctrl</Kbd> <Kbd>K</Kbd>
</span>`,
  },
];

export default async function KbdPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/kbd/kbd.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Kbd"
      description="A compact label for a keyboard key."
      overview={
        <p>
          Kbd renders a native <code>kbd</code> element. It displays a key. It
          does not listen for that key or become a button.
        </p>
      }
      install="vinyaas add kbd"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/kbd/kbd.tsx</code>. It imports <code>cn</code>{" "}
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
            The element is a native <code>kbd</code>. It is not focusable and
            does not add a role.
          </p>
          <ul className="list-disc pl-5">
            <li>The visible key label is the accessible text.</li>
            <li>
              Put a shortcut in the sentence around the keys, such as “Press ⌘
              K”.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <span className="inline-flex items-center gap-1 text-sm">
        Press <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </ComponentReference>
  );
}
