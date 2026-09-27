import { readFile } from "node:fs/promises";
import path from "node:path";

import { ComponentReference } from "@/components/component-reference";
import { Input } from "@/registry/new-york/ui/input/input";

const usage = `import { Input } from "@/components/ui/input/input";

export function EmailField() {
  return (
    <Input
      id="email"
      name="email"
      type="email"
      placeholder="name@example.com"
    />
  );
}
`;

export default async function InputPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/input/input.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Input"
      description="A text field that passes through native input attributes."
      install="vinyaas add input"
      usage={usage}
      source={source}
    >
      <div className="w-full max-w-sm">
        <Input aria-label="Email" type="email" placeholder="name@example.com" />
      </div>
    </ComponentReference>
  );
}
