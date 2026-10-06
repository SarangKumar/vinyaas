import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsStoreProvider } from "@/lib/store/provider";

import AccordionPage from "./page";

function renderDocs(node: React.ReactNode) {
  return render(<DocsStoreProvider>{node}</DocsStoreProvider>);
}

describe("Accordion docs page", () => {
  it("shows a Subscription & Billing FAQ card in practice with the first item open", async () => {
    renderDocs(await AccordionPage());

    expect(
      screen.getByRole("heading", { name: "In practice" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Subscription & Billing")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Common questions about your account, plans, payments and cancellations.",
      ),
    ).toBeInTheDocument();

    const plans = screen.getByRole("button", {
      name: "What subscription plans do you offer?",
    });
    const billing = screen.getByRole("button", {
      name: "How does billing work?",
    });
    const cancel = screen.getByRole("button", {
      name: "How do I cancel my subscription?",
    });

    expect(plans).toHaveAttribute("aria-expanded", "true");
    expect(billing).toHaveAttribute("aria-expanded", "false");
    expect(cancel).toHaveAttribute("aria-expanded", "false");

    const panel = document.getElementById(plans.getAttribute("aria-controls")!);
    expect(panel).toHaveAttribute("data-state", "open");
    expect(
      within(panel!).getByText(/Starter, Pro, and Business/),
    ).toBeInTheDocument();

    expect(
      [...document.querySelectorAll("code")].some((node) =>
        node.textContent?.includes("BillingFaq"),
      ),
    ).toBe(true);
  });
});
