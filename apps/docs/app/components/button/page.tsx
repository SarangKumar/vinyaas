import { readFile } from "node:fs/promises";
import path from "node:path";

import { ComponentReference } from "@/components/component-reference";
import { Button } from "@/registry/new-york/ui/button/button";

const usage = `import { Button } from "@/components/ui/button/button";

export function SaveButton() {
  return <Button>Save</Button>;
}
`;

export default async function ButtonPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/button/button.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Button"
      description="A button with variant and size styles."
      install="vinyaas add button"
      usage={usage}
      source={source}
    >
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </ComponentReference>
  );
}
