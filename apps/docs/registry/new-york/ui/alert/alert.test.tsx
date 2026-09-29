import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from ".";

describe("Alert", () => {
  it("renders a default alert with a title and description", () => {
    render(
      <Alert>
        <AlertTitle>Deployment complete</AlertTitle>
        <AlertDescription>Production is running.</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole("alert");

    expect(alert).toHaveAttribute("data-variant", "default");
    expect(alert).toHaveClass("bg-muted", "text-foreground");
    expect(screen.getByText("Deployment complete").tagName).toBe("P");
    expect(screen.getByText("Production is running.").tagName).toBe("P");
  });

  it("uses the destructive palette without relying on color alone", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Your card was declined.</AlertDescription>
      </Alert>,
    );

    expect(screen.getByRole("alert")).toHaveClass(
      "bg-muted",
      "text-destructive",
      "border-destructive",
    );
    expect(screen.getByRole("alert")).not.toHaveClass("bg-destructive");
  });

  it("merges className and forwards native props", () => {
    render(
      <Alert id="notice" className="max-w-md">
        <AlertTitle>Saved</AlertTitle>
      </Alert>,
    );

    const alert = screen.getByRole("alert");

    expect(alert).toHaveAttribute("id", "notice");
    expect(alert).toHaveClass("max-w-md", "rounded-md");
  });
});
