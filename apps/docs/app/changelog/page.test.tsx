import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { components, currentVersion } from "@/components/component-meta";

import {
  changelogVersions,
  latestChangelogVersionId,
  resolveChangelogVersionId,
} from "./changelog-data";
import ChangelogPage from "./page";

const navigation = vi.hoisted(() => ({
  pathname: "/changelog",
  search: "",
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ replace: navigation.replace, push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

describe("changelog data", () => {
  it("defaults to the latest released version", () => {
    expect(latestChangelogVersionId).toBe("1.3.0");
    expect(resolveChangelogVersionId(undefined)).toBe("1.3.0");
    expect(resolveChangelogVersionId("nope")).toBe("1.3.0");
    expect(changelogVersions[0]?.id).toBe(latestChangelogVersionId);
  });

  it("lists known versions without gap or shadcn marketing copy", () => {
    const ids = changelogVersions.map((version) => version.id);
    expect(ids).toEqual(["1.3.0", "1.2.0", "1.1.0", "1.0.0", "0.1"]);
    const text = JSON.stringify(changelogVersions);
    expect(text).not.toMatch(/shadcn/i);
    expect(text).not.toContain("Not in this version");
    expect(text).not.toContain("Planned");
    expect(text).not.toContain("not implemented");
    expect(text).not.toContain("Remaining for later");
  });
});

describe("Changelog page", () => {
  beforeEach(() => {
    navigation.search = "";
    navigation.replace.mockReset();
  });

  it("selects the latest version by default and shows only that content", async () => {
    render(await ChangelogPage({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByRole("heading", { level: 1, name: "Changelog" }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Changelog version" }),
      ).toHaveTextContent("v1.3.0");
    });
    expect(screen.queryByPlaceholderText("Search versions…")).toBeNull();
    fireEvent.click(
      screen.getByRole("combobox", { name: "Changelog version" }),
    );
    expect(screen.getByPlaceholderText("Search versions…")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("heading", { name: "v1.3.0" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "v1.2.0" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "v0.1" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Added" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Improved" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("Resizable");
    expect(document.body.textContent).toContain("Drag & Drop");
    expect(document.body.textContent).toContain(`v${currentVersion}`);
    expect(document.body.textContent).not.toContain("ui.shadcn.com");
    expect(document.body.textContent).not.toContain("Not in this version");
    expect(screen.queryByRole("heading", { name: "Planned" })).toBeNull();
  });

  it("renders another version when selected via the query param", async () => {
    render(
      await ChangelogPage({
        searchParams: Promise.resolve({ v: "1.2.0" }),
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: "Changelog version" }),
      ).toHaveTextContent("v1.2.0");
    });
    expect(screen.getByRole("heading", { name: "v1.2.0" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "v1.3.0" })).toBeNull();
    expect(document.body.textContent).toContain("Companions");
    expect(document.body.textContent).toContain("companion.json");
    expect(document.body.textContent).not.toContain(
      "lays the foundation for application and dashboard",
    );
  });

  it("updates the URL when the version selector changes", async () => {
    render(await ChangelogPage({ searchParams: Promise.resolve({}) }));

    fireEvent.click(
      screen.getByRole("combobox", { name: "Changelog version" }),
    );
    fireEvent.click(screen.getByRole("option", { name: "v0.1" }));

    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith("/changelog?v=0.1", {
        scroll: false,
      });
    });
  });

  it("keeps historical catalog facts available in older versions", async () => {
    const v01 = components.filter(
      (component) => component.introducedIn === "0.1",
    );

    render(
      await ChangelogPage({
        searchParams: Promise.resolve({ v: "0.1" }),
      }),
    );

    expect(document.body.textContent).toContain(
      `It ships ${v01.length} component`,
    );
    expect(document.body.textContent).toContain("Button");
    expect(document.body.textContent).toContain("vinyaas init");
  });
});
