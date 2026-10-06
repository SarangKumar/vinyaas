import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from ".";

describe("Pagination", () => {
  it("renders a labeled navigation landmark with page links", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/page/0" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/2">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/10">10</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/page/2" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "data-active",
      "",
    );
    expect(screen.getByRole("link", { name: "2" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(
      screen.getByRole("link", { name: "Go to previous page" }),
    ).toHaveAttribute("href", "/page/0");
    expect(
      screen.getByRole("link", { name: "Go to next page" }),
    ).toHaveAttribute("href", "/page/2");
    expect(screen.getByText("More pages")).toHaveClass("sr-only");
    expect(screen.getByText("…")).toHaveAttribute("aria-hidden", "true");
  });

  it("supports controlled button usage and disabled previous/next", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    const onPage = vi.fn();

    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled onClick={onPrevious} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive onClick={() => onPage(1)}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => onPage(2)}>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={onNext} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    const previous = screen.getByRole("button", {
      name: "Go to previous page",
    });
    expect(previous).toBeDisabled();
    fireEvent.click(previous);
    expect(onPrevious).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(onPage).toHaveBeenCalledWith(2);

    const next = screen.getByRole("button", { name: "Go to next page" });
    expect(next).toBeEnabled();
    fireEvent.click(next);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("keeps Tab order and focus-visible on page controls", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#prev" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#1">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#next" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    const previous = screen.getByRole("link", { name: "Go to previous page" });
    const page = screen.getByRole("link", { name: "1" });
    const next = screen.getByRole("link", { name: "Go to next page" });

    previous.focus();
    expect(previous).toHaveFocus();
    expect(previous.className).toContain("focus-visible:ring-2");

    page.focus();
    expect(page).toHaveFocus();

    next.focus();
    expect(next).toHaveFocus();

    fireEvent.keyDown(next, { key: "Tab" });
    expect(document.activeElement).not.toBe(previous);
  });

  it("marks disabled link previous as non-interactive", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/page/0" disabled />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    const previous = screen.getByRole("link", { name: "Go to previous page" });
    expect(previous).toHaveAttribute("aria-disabled", "true");
    expect(previous).toHaveAttribute("tabIndex", "-1");
    expect(previous).toHaveAttribute("href", "/page/0");
    expect(previous.className).toContain("pointer-events-none");
  });
});
