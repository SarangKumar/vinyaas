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
    expect(screen.getByRole("heading", { name: "v1.2.0" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: "Component catalog" }),
    ).toHaveLength(2);
    expect(
      screen.getAllByRole("heading", { name: "Documentation" }).length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getAllByRole("heading", { name: "CLI" }).length,
    ).toBeGreaterThanOrEqual(3);
    expect(
      screen.getByRole("heading", { name: "Released" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Planned" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Installation" }),
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
    expect(document.body.textContent).toContain("v1.1.0 continues the catalog");
    expect(document.body.textContent).toContain(
      `v${currentVersion} focuses on installation clarity`,
    );
    expect(document.body.textContent).toContain("Framework-specific");
    expect(document.body.textContent).toContain("project-state onboarding");
    expect(document.body.textContent).toContain("create-app commands");
    expect(document.body.textContent).toContain("vinyaas init");
    expect(document.body.textContent).toContain("vinyaas list");
    expect(document.body.textContent).toContain("vinyaas search");
    expect(document.body.textContent).toContain("vinyaas info");
    expect(document.body.textContent).toContain("--json");
    expect(document.body.textContent).toContain("index.tsx");
    expect(document.body.textContent).toContain("Documentation and website");
    expect(document.body.textContent).toContain("/themes");
    expect(document.body.textContent).toContain("/typeset");
    expect(document.body.textContent).toContain("not a registry component");
    expect(document.body.textContent).toContain("Typeset");
    expect(document.body.textContent).toContain("curated presets");
    expect(document.body.textContent).not.toContain("/playground");
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
