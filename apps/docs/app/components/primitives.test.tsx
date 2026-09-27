import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AvatarPage from "./avatar/page";
import BadgePage from "./badge/page";
import CardPage from "./card/page";
import SpinnerPage from "./spinner/page";
import KbdPage from "./kbd/page";
import ProgressPage from "./progress/page";
import NativeSelectPage from "./native-select/page";
import PopoverPage from "./popover/page";
import SelectPage from "./select/page";
import SeparatorPage from "./separator/page";
import SkeletonPage from "./skeleton/page";
import SwitchPage from "./switch/page";
import TablePage from "./table/page";
import ToastPage from "./toast/page";
import TooltipPage from "./tooltip/page";

const pages = [
  {
    load: AvatarPage,
    title: "Avatar",
    command: "npx @vinyaas/cli add avatar",
    api: "src",
  },
  {
    load: ProgressPage,
    title: "Progress",
    command: "npx @vinyaas/cli add progress",
    api: "value",
  },
  {
    load: SkeletonPage,
    title: "Skeleton",
    command: "npx @vinyaas/cli add skeleton",
    api: "className",
  },
  {
    load: SeparatorPage,
    title: "Separator",
    command: "npx @vinyaas/cli add separator",
    api: "orientation",
  },
  {
    load: KbdPage,
    title: "Kbd",
    command: "npx @vinyaas/cli add kbd",
    api: "children",
  },
  {
    load: SwitchPage,
    title: "Switch",
    command: "npx @vinyaas/cli add switch",
    api: "onCheckedChange",
  },
  {
    load: SelectPage,
    title: "Select",
    command: "npx @vinyaas/cli add select",
    api: "multiple",
  },
  {
    load: TablePage,
    title: "Table",
    command: "npx @vinyaas/cli add table",
    api: "children",
  },
  {
    load: TooltipPage,
    title: "Tooltip",
    command: "npx @vinyaas/cli add tooltip",
    api: "delayDuration",
  },
  {
    load: NativeSelectPage,
    title: "Native Select",
    command: "npx @vinyaas/cli add native-select",
    api: "multiple",
  },
  {
    load: ToastPage,
    title: "Toast",
    command: "npx @vinyaas/cli add toast",
    api: "actionProps",
  },
  {
    load: BadgePage,
    title: "Badge",
    command: "npx @vinyaas/cli add badge",
    api: "variant",
  },
  {
    load: CardPage,
    title: "Card",
    command: "npx @vinyaas/cli add card",
    api: "className",
  },
  {
    load: SpinnerPage,
    title: "Spinner",
    command: "npx @vinyaas/cli add spinner",
    api: "label",
  },
  {
    load: PopoverPage,
    title: "Popover",
    command: "npx @vinyaas/cli add popover",
    api: "onOpenChange",
  },
] as const;

describe("composed examples", () => {
  it("renders badge and card examples", async () => {
    render(await BadgePage());
    expect(
      screen.getAllByRole("link", { name: "Documentation" }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Processing").length).toBeGreaterThan(0);
    expect(screen.getByText("Claim offer")).toBeInTheDocument();
    expect(screen.getByText("Bookmark")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Ghost")).toBeInTheDocument();

    render(await CardPage());
    expect(screen.getAllByText("Sarah Johnson").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: "Save preferences" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
  });
});

describe("new component pages", () => {
  it.each(pages)(
    "documents $title with preview, install, and API",
    async ({ load, title, command, api }) => {
      render(await load());

      expect(
        screen.getByRole("heading", { level: 1, name: title }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Overview" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Preview" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "API" })).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Accessibility" }),
      ).toBeInTheDocument();
      expect(screen.getByText(command)).toBeInTheDocument();
      const tables = document.querySelectorAll("table");

      expect(tables[tables.length - 1]).toHaveTextContent(api);
    },
  );
});
