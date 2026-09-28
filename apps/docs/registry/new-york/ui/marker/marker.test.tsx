import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Marker, MarkerContent, MarkerIcon } from "./marker";

describe("Marker", () => {
  it("renders the default, border, and separator variants", () => {
    const { rerender } = render(
      <Marker>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>,
    );
    const marker = () => screen.getByText("Explored 4 files").parentElement;

    expect(marker()).toHaveAttribute("data-variant", "default");
    expect(marker()?.tagName).toBe("DIV");
    expect(marker()).toHaveClass("inline-flex");

    rerender(
      <Marker variant="border">
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>,
    );
    expect(marker()).toHaveAttribute("data-variant", "border");
    expect(marker()).toHaveClass("border-b");

    rerender(
      <Marker variant="separator">
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>,
    );
    expect(marker()).toHaveAttribute("data-variant", "separator");
    expect(marker()).toHaveClass("before:bg-border", "after:bg-border");
  });

  it("hides the icon and merges className", () => {
    render(
      <Marker className="max-w-sm" id="note">
        <MarkerIcon className="text-foreground">
          <svg />
        </MarkerIcon>
        <MarkerContent className="font-medium">Synced</MarkerContent>
      </Marker>,
    );

    const marker = document.getElementById("note");
    const icon = marker?.querySelector("[aria-hidden]");

    expect(marker).toHaveClass("max-w-sm");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass("text-foreground");
    expect(screen.getByText("Synced")).toHaveClass("font-medium");
  });

  it("forwards a status role and stays presentational otherwise", () => {
    render(
      <Marker role="status">
        <MarkerContent>Compacting conversation</MarkerContent>
      </Marker>,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Compacting conversation",
    );
  });

  it("keeps a link and a button as the interactive elements", () => {
    render(
      <>
        <Marker>
          <MarkerContent>
            <a href="/files">Explored 4 files</a>
          </MarkerContent>
        </Marker>
        <Marker aria-label="Synced">
          <MarkerIcon>
            <svg />
          </MarkerIcon>
        </Marker>
      </>,
    );

    expect(
      screen.getByRole("link", { name: "Explored 4 files" }),
    ).toHaveAttribute("href", "/files");
    expect(screen.getByLabelText("Synced").tagName).toBe("DIV");
  });
});
