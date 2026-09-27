import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AvatarPage from "./avatar/page";
import KbdPage from "./kbd/page";
import ProgressPage from "./progress/page";
import SelectPage from "./select/page";
import SeparatorPage from "./separator/page";
import SkeletonPage from "./skeleton/page";
import SwitchPage from "./switch/page";

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
] as const;

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
      expect(document.querySelector("table")).toHaveTextContent(api);
    },
  );
});
