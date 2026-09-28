import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("homepage", () => {
  it("shows a minimal centered hero and Pinterest masonry showcase", () => {
    render(<Home />);

    const hero = screen.getByRole("heading", {
      level: 1,
      name: "Build. Ship. Beautifully.",
    });

    expect(hero).toBeInTheDocument();
    expect(hero).toHaveClass(
      "font-semibold",
      "tracking-tight",
      "whitespace-nowrap",
    );
    expect(hero.className).toContain("text-[min(3rem,calc((100vw-3rem)/22))]");
    expect(hero.parentElement).toHaveClass("items-center", "text-center");
    expect(screen.getByText("Vinyaas")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute(
      "href",
      "/installation",
    );
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute(
      "href",
      "/components",
    );

    const credit = screen.getByRole("link", { name: "Sarang Kumar" });
    expect(credit).toHaveAttribute("href", "https://github.com/SarangKumar");
    expect(credit).toHaveClass("underline", "underline-offset-4");
    expect(screen.getByText(/Made by/)).toBeInTheDocument();
    expect(screen.getByText("v1.0.0")).toBeInTheDocument();
    expect(document.querySelector("[data-playground-blur]")).toBeTruthy();
    expect(document.querySelector("[data-playground-blur]")).toHaveClass(
      "bg-gradient-to-t",
      "from-background",
      "z-20",
    );
    expect(document.querySelector("footer")).toHaveClass("z-30");

    const shell = document.querySelector("[data-playground-shell]");
    expect(shell).toHaveClass(
      "bg-muted",
      "dark:bg-background",
      "relative",
      "w-full",
      "max-w-none",
      "overflow-hidden",
    );
    expect(shell?.className).toContain("p-(--playground-pad)");
    expect(shell?.className).toContain("lg:p-(--playground-pad-lg)");
    expect(shell?.className).toContain("xl:p-(--playground-pad-xl)");
    expect(shell?.className).toContain("min-[1900px]:p-(--playground-pad-xl)!");
    expect(shell?.className).toContain("[--gap:var(--playground-gap)]");
    expect(shell?.className).toContain("md:[--gap:var(--playground-gap-md)]");
    expect(shell?.className).toContain("xl:[--gap:var(--playground-gap-xl)]");
    expect(shell?.className).toContain(
      "min-[1900px]:[--gap:var(--playground-gap-2xl)]!",
    );

    expect(document.querySelector("[data-playground-layout]")).toBeNull();

    const playground = document.querySelector("[data-playground]");
    expect(playground).toHaveClass(
      "relative",
      "z-10",
      "columns-1",
      "md:columns-2",
      "lg:columns-3",
      "gap-(--gap)",
      "md:max-w-3xl",
      "2xl:max-w-[1900px]",
    );
    expect(playground?.className).toContain("min-[1400px]:columns-4!");
    expect(playground?.className).toContain("min-[1900px]:columns-5!");
    expect(playground?.className).not.toContain("grid-cols");

    const rails = document.querySelector("[data-playground-rails]");
    expect(rails).toHaveClass("hidden", "min-[2200px]:block", "absolute");
    expect(rails?.className).toContain("top-(--playground-pad)");
    expect(rails?.className).toContain("xl:top-(--playground-pad-xl)");
    expect(rails?.className).toContain(
      "min-[1900px]:top-(--playground-pad-xl)",
    );

    const leftRail = document.querySelector('[data-playground-side="left"]');
    const rightRail = document.querySelector('[data-playground-side="right"]');
    expect(leftRail).toHaveClass("absolute", "opacity-50");
    expect(rightRail).toHaveClass("absolute", "opacity-50");
    expect(leftRail?.className).toContain(
      "left-[calc(50%-950px-var(--rail-width)-var(--gap))]",
    );
    expect(rightRail?.className).toContain(
      "right-[calc(50%-950px-var(--rail-width)-var(--gap))]",
    );
    expect(
      document.querySelectorAll("[data-playground-skeleton]").length,
    ).toBeGreaterThan(0);
    expect(
      document.querySelector('[data-playground-side-fade="left"]'),
    ).toHaveClass("left-0", "bg-gradient-to-r", "min-[2200px]:block");
    expect(
      document.querySelector('[data-playground-side-fade="right"]'),
    ).toHaveClass("right-0", "bg-gradient-to-l", "min-[2200px]:block");

    expect(document.querySelector("[data-docs-frame]")).toBeNull();
    expect(document.querySelector("[data-play-block]")).toHaveAttribute(
      "data-slot",
      "card",
    );
    expect(document.querySelector("[data-play-block]")).toHaveClass(
      "mb-(--gap)",
      "break-inside-avoid",
      "w-full",
      "gap-6",
      "p-6",
      "bg-card",
    );

    expect(
      screen.getByRole("heading", { name: "Analytics" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Payment" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Profile" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Report preview" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Send feedback" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Notes thread" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Notifications" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Directory" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Documents" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Activity" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Feedback message" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Message" }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Search people" }), {
      target: { value: "Priya" },
    });
    expect(screen.getByText("1 people")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("textbox", { name: "Search documents" }),
      { target: { value: "invoice" } },
    );
    expect(screen.getByText("March invoice.pdf")).toBeInTheDocument();
    expect(screen.queryByText("Deploy notes.md")).toBeNull();
  });
});
