import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { components, currentVersion } from "@/components/component-meta";

import ChangelogPage from "./page";

describe("Changelog", () => {
  it("renders the version headings and v1.0.0 catalog details", () => {
    render(<ChangelogPage />);

    const v01 = components.filter(
      (component) => component.introducedIn === "0.1",
    );
    const v10 = components.filter(
      (component) => component.introducedIn === "1.0.0",
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Changelog" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "v0.1" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "v1.0.0" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Component catalog" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Documentation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "CLI" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Released" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Planned" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`npx vinyaas add button card badge`),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain(
      `${components.length} components in total`,
    );
    expect(document.body.textContent).toContain(
      `the other ${v10.length} are introduced in ${currentVersion}`,
    );
    expect(document.body.textContent).toContain(
      `It ships ${v01.length} component`,
    );
    expect(v01.map((component) => component.slug)).toEqual(["button"]);
  });
});
