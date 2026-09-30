import { describe, expect, it } from "vitest";

import { tsxToJsx } from "./tsx-to-jsx";

describe("tsxToJsx", () => {
  it("leaves plain JSX-compatible examples unchanged", () => {
    const source = `import { Button } from "@/components/ui/button";

export function SaveButton() {
  return <Button>Save</Button>;
}
`;

    expect(tsxToJsx(source)).toBe(source);
  });

  it("strips type-only imports, interfaces, and props annotations", () => {
    const source = `import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  ...props
}: ButtonProps) {
  return <button type="button" {...props} />;
}
`;

    const jsx = tsxToJsx(source);

    expect(jsx).not.toContain("import type");
    expect(jsx).not.toContain("type VariantProps");
    expect(jsx).not.toContain("interface ButtonProps");
    expect(jsx).not.toContain(": ButtonProps");
    expect(jsx).toContain('import { cva } from "class-variance-authority"');
    expect(jsx).toContain("export function Button({");
    expect(jsx).toContain("...props");
    expect(jsx).toContain("}) {");
  });
});
