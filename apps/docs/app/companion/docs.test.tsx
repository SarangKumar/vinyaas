import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";
import { setCodeLanguage } from "@/lib/store/slices/code-language";
import { store } from "@/lib/store/store";

import CompanionInstallationPage from "./installation/page";
import CompanionConfigurationPage from "./configuration/page";
import CompanionCustomPage from "./custom/page";

function renderWithStore(ui: React.ReactElement) {
  store.dispatch(setCodeLanguage("jsx"));
  return render(<DocsStoreProvider>{ui}</DocsStoreProvider>);
}

describe("Companion docs pages", () => {
  it("marks companion CLI install as future", () => {
    renderWithStore(<CompanionInstallationPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Companion Installation" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("not available yet");
    expect(document.body.textContent).toContain("vinyaas companion add ember");
  });

  it("documents companion.json fields with Ember as an example", () => {
    renderWithStore(<CompanionConfigurationPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "companion.json" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Architecture" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Schema" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Animations" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Interactions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Personality" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Capabilities" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("personalityTraits");
    expect(document.body.textContent).toContain("capabilities");
    expect(document.body.textContent).toContain("interactions");
    expect(document.body.textContent).toContain("trigger resolver");
    expect(document.body.textContent).toContain("idle_timeout");
    expect(document.body.textContent).toContain("play_animation");
    expect(document.body.textContent).toContain("moodBias");
    expect(document.body.textContent).toContain('"id": "ember"');
  });

  it("outlines the custom companion authoring workflow", () => {
    renderWithStore(<CompanionCustomPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Custom Companion" }),
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain("not implemented yet");
    expect(document.body.textContent).toContain("companion.json");
    expect(document.body.textContent).toContain("Species vs instances");
  });
});
