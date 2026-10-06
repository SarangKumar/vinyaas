import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../button";
import {
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from ".";

describe("Empty", () => {
  it("renders title and description with status semantics", () => {
    render(
      <Empty>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Create your first project to begin.</EmptyDescription>
      </Empty>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /no projects yet/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/create your first project/i)).toBeInTheDocument();
  });

  it("renders an icon and actions", () => {
    render(
      <Empty>
        <EmptyIcon aria-hidden="true">
          <span data-testid="glyph">◇</span>
        </EmptyIcon>
        <EmptyTitle>No files</EmptyTitle>
        <EmptyDescription>Upload a file to get started.</EmptyDescription>
        <EmptyActions>
          <Button type="button">Upload</Button>
          <Button type="button" variant="outline">
            Learn more
          </Button>
        </EmptyActions>
      </Empty>,
    );

    expect(screen.getByTestId("glyph")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /learn more/i }),
    ).toBeInTheDocument();
  });

  it("supports compact sizing with quieter padding tokens", () => {
    render(
      <Empty size="sm">
        <EmptyTitle>Empty</EmptyTitle>
      </Empty>,
    );
    const root = screen.getByRole("status");
    expect(root).toHaveAttribute("data-size", "sm");
    expect(root.className).toMatch(/py-8|px-6|gap-3/);
  });

  it("uses readable description typography", () => {
    render(
      <Empty>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>Try another filter.</EmptyDescription>
      </Empty>,
    );
    expect(screen.getByText(/try another filter/i).className).toMatch(
      /text-sm|leading-6/,
    );
  });
});
