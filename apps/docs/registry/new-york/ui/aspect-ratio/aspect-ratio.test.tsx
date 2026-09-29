import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AspectRatio } from ".";

describe("AspectRatio", () => {
  it("sets the ratio on the root and fills children", () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9} className="max-w-sm">
        <img src="/hero.png" alt="Hero" />
      </AspectRatio>,
    );

    const root = container.querySelector('[data-slot="aspect-ratio"]');

    expect(root).toHaveClass("relative", "w-full", "max-w-sm");
    expect(root).toHaveStyle({ aspectRatio: String(16 / 9) });
    expect(screen.getByRole("img", { name: "Hero" })).toBeInTheDocument();
  });

  it("supports a square ratio", () => {
    const { container } = render(
      <AspectRatio ratio={1}>
        <div>Square</div>
      </AspectRatio>,
    );

    expect(container.querySelector('[data-slot="aspect-ratio"]')).toHaveStyle({
      aspectRatio: "1",
    });
  });
});
