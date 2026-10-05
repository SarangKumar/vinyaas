import { describe, expect, it } from "vitest";

import {
  componentCatalogs,
  getComponentCatalog,
  listComponentCatalogIds,
  plannedCatalogGaps,
} from "./catalogs";
import { themes } from "./registry";
import { serializeComponentCatalogIndex } from "./serialize";
import { validateComponentCatalogs } from "./validate";

const knownNames = new Set(
  Object.values(themes).flatMap((items) => items.map((item) => item.name)),
);

describe("component catalogs", () => {
  it("exposes the five named catalogs", () => {
    expect(listComponentCatalogIds()).toEqual([
      "form",
      "dashboard",
      "navigation",
      "feedback",
      "application",
    ]);
  });

  it("resolves known catalogs and rejects unknown ids", () => {
    expect(getComponentCatalog("form")?.id).toBe("form");
    expect(getComponentCatalog("FORM")?.components).toContain("button");
    expect(getComponentCatalog("missing")).toBeNull();
  });

  it("only references installable registry component ids", () => {
    const issues = validateComponentCatalogs(componentCatalogs, knownNames);
    expect(issues).toEqual([]);

    for (const catalog of componentCatalogs) {
      for (const componentId of catalog.components) {
        expect(knownNames.has(componentId)).toBe(true);
      }
    }
  });

  it("serializes catalog metadata without duplicating component details", () => {
    const index = serializeComponentCatalogIndex(componentCatalogs);

    expect(index.type).toBe("catalogs");
    expect(index.items).toHaveLength(componentCatalogs.length);

    for (const item of index.items) {
      expect(Object.keys(item).sort()).toEqual([
        "components",
        "description",
        "id",
        "name",
      ]);
      expect(Array.isArray(item.components)).toBe(true);
      expect(item.components.length).toBeGreaterThan(0);
    }
  });

  it("documents planned gaps separately from installable membership", () => {
    expect(plannedCatalogGaps.form).toContain("form");
    expect(getComponentCatalog("form")?.components).toContain("select");
    expect(plannedCatalogGaps.dashboard).not.toContain("data-table");
    expect(getComponentCatalog("dashboard")?.components).toContain(
      "data-table",
    );
    expect(getComponentCatalog("application")?.components).toContain(
      "data-table",
    );
    expect(plannedCatalogGaps.feedback).not.toContain("alert-dialog");
    expect(getComponentCatalog("feedback")?.components).toContain(
      "alert-dialog",
    );
    expect(getComponentCatalog("application")?.components).toContain(
      "alert-dialog",
    );
    expect(getComponentCatalog("dashboard")?.components).toContain("sidebar");
    expect(getComponentCatalog("navigation")?.components).toContain("sidebar");
    expect(getComponentCatalog("application")?.components).toContain("sidebar");
    expect(getComponentCatalog("dashboard")?.components).toContain("resizable");
    expect(getComponentCatalog("dashboard")?.components).toContain(
      "drag-and-drop",
    );
    expect(getComponentCatalog("dashboard")?.components).toContain(
      "pagination",
    );
    expect(getComponentCatalog("navigation")?.components).toContain(
      "pagination",
    );
    expect(getComponentCatalog("application")?.components).toContain(
      "pagination",
    );
    expect(getComponentCatalog("application")?.components).toContain(
      "resizable",
    );
    expect(getComponentCatalog("application")?.components).toContain(
      "drag-and-drop",
    );

    for (const [catalogId, gaps] of Object.entries(plannedCatalogGaps)) {
      const catalog = getComponentCatalog(catalogId);
      expect(catalog).not.toBeNull();

      for (const gap of gaps) {
        expect(catalog?.components.includes(gap)).toBe(false);
      }
    }
  });
});
