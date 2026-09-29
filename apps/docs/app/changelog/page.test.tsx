import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { components, currentVersion } from "@/components/component-meta";

import ChangelogPage from "./page";

describe("Changelog", () => {
  it("renders the version headings and catalog details", () => {
    render(<ChangelogPage />);

    const v01 = components.filter(
      (component) => component.introducedIn === "0.1",
    );
    const v10 = components.filter(
      (component) => component.introducedIn === "1.0.0",
    );
    const v11 = components.filter(
      (component) => component.introducedIn === "1.1.0",
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Changelog" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "v0.1" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "v1.0.0" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "v1.1.0" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: "Component catalog" }),
    ).toHaveLength(2);
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
      `The full catalog now has ${components.length} items`,
    );
    expect(document.body.textContent).toContain(
      `the other ${v10.length} were introduced in v1.0.0`,
    );
    expect(document.body.textContent).toContain(
      `v${currentVersion} continues the catalog`,
    );
    expect(document.body.textContent).toContain("Tabs");
    expect(document.body.textContent).toContain("Drawer");
    expect(document.body.textContent).toContain("Chart");
    expect(document.body.textContent).toContain("Aspect Ratio");
    expect(document.body.textContent).toContain("Attachment");
    expect(document.body.textContent).toContain("Tailwind support");
    expect(document.body.textContent).toContain("@theme");
    expect(v11.map((component) => component.slug)).toEqual([
      "aspect-ratio",
      "attachment",
      "chart",
      "drawer",
      "tabs",
    ]);
    expect(document.body.textContent).toContain(
      `It ships ${v01.length} component`,
    );
    expect(v01.map((component) => component.slug)).toEqual(["button"]);
  });
});
