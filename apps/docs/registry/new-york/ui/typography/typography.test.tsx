import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Typography,
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "./typography";

describe("Typography", () => {
  it("renders semantic elements and forwards className", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Typography ref={ref} className="max-w-prose">
        <TypographyH1>Article</TypographyH1>
        <TypographyH2>Section</TypographyH2>
        <TypographyH3>Subsection</TypographyH3>
        <TypographyH4>Detail</TypographyH4>
        <TypographyLead>Lead copy</TypographyLead>
        <TypographyP>Body copy</TypographyP>
        <TypographyLarge>Large copy</TypographyLarge>
        <TypographySmall>Small copy</TypographySmall>
        <TypographyMuted>Muted copy</TypographyMuted>
        <TypographyBlockquote>Quoted copy</TypographyBlockquote>
        <TypographyList>
          <li>First item</li>
        </TypographyList>
      </Typography>,
    );

    expect(ref.current?.tagName).toBe("DIV");
    expect(ref.current).toHaveClass("max-w-prose", "gap-4");
    expect(
      screen.getByRole("heading", { level: 1, name: "Article" }),
    ).toHaveClass("text-3xl");
    expect(
      screen.getByRole("heading", { level: 2, name: "Section" }),
    ).toHaveClass("text-2xl");
    expect(
      screen.getByRole("heading", { level: 3, name: "Subsection" }),
    ).toHaveClass("text-xl");
    expect(
      screen.getByRole("heading", { level: 4, name: "Detail" }),
    ).toHaveClass("text-lg");
    expect(screen.getByText("Lead copy").tagName).toBe("P");
    expect(screen.getByText("Body copy")).toHaveClass("leading-7");
    expect(screen.getByText("Large copy")).toHaveClass("font-medium");
    expect(screen.getByText("Small copy").tagName).toBe("SMALL");
    expect(screen.getByText("Muted copy")).toHaveClass("text-muted-foreground");
    expect(screen.getByText("Quoted copy").tagName).toBe("BLOCKQUOTE");
    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
