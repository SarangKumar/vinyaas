import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const portrait =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";

describe("Avatar", () => {
  it("renders an image with its accessible name", () => {
    render(
      <Avatar>
        <AvatarImage src={portrait} alt="Sarang Kumar" />
        <AvatarFallback>SK</AvatarFallback>
      </Avatar>,
    );

    const image = screen.getByRole("img", { name: "Sarang Kumar" });

    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("src", portrait);
    expect(screen.getByText("SK")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows the fallback and hides the image when the image fails", () => {
    render(
      <Avatar>
        <AvatarImage src="/missing.png" alt="Sarang Kumar" />
        <AvatarFallback>SK</AvatarFallback>
      </Avatar>,
    );

    fireEvent.error(screen.getByRole("img", { name: "Sarang Kumar" }));

    expect(screen.getByText("SK")).not.toHaveAttribute("aria-hidden");
    expect(screen.queryByRole("img", { name: "Sarang Kumar" })).toBeNull();
  });

  it("removes the fallback after the image loads", () => {
    render(
      <Avatar>
        <AvatarImage src={portrait} alt="Sarang Kumar" />
        <AvatarFallback>SK</AvatarFallback>
      </Avatar>,
    );

    fireEvent.load(screen.getByRole("img", { name: "Sarang Kumar" }));

    expect(screen.queryByText("SK")).toBeNull();
    expect(screen.getByRole("img", { name: "Sarang Kumar" })).not.toHaveClass(
      "sr-only",
    );
  });

  it("uses an empty alt for a decorative image and exposes fallback text only after an error", () => {
    render(
      <Avatar>
        <AvatarImage src="/missing.png" alt="" />
        <AvatarFallback>Guest</AvatarFallback>
      </Avatar>,
    );

    const image = document.querySelector("img");

    expect(image).toHaveAttribute("alt", "");
    expect(screen.getByText("Guest")).toHaveAttribute("aria-hidden", "true");

    fireEvent.error(image!);

    expect(screen.getByText("Guest")).not.toHaveAttribute("aria-hidden");
    expect(screen.queryByRole("img")).toBeNull();
    expect(image).toHaveAttribute("hidden");
  });

  it("exposes fallback content when there is no image", () => {
    render(
      <Avatar>
        <AvatarFallback>SK</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText("SK")).not.toHaveAttribute("aria-hidden");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("merges class names and forwards refs", () => {
    const rootRef = createRef<HTMLSpanElement>();
    const imageRef = createRef<HTMLImageElement>();
    const fallbackRef = createRef<HTMLSpanElement>();

    render(
      <Avatar ref={rootRef} className="size-12">
        <AvatarImage
          ref={imageRef}
          src={portrait}
          alt="Sarang Kumar"
          className="opacity-90"
        />
        <AvatarFallback ref={fallbackRef} className="text-sm">
          SK
        </AvatarFallback>
      </Avatar>,
    );

    expect(rootRef.current).toHaveClass("size-12", "rounded-full");
    expect(rootRef.current).not.toHaveClass("size-10");
    expect(imageRef.current).toHaveClass("object-cover", "opacity-90");
    expect(fallbackRef.current).toHaveClass("bg-muted", "text-sm");
  });
});
