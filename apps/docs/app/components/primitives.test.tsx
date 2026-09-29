import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ReactNode } from "react";

import { DocsStoreProvider } from "@/lib/store/provider";

import AvatarPage from "./avatar/page";
import BadgePage from "./badge/page";
import ButtonPage from "./button/page";
import CardPage from "./card/page";
import SpinnerPage from "./spinner/page";
import KbdPage from "./kbd/page";
import ProgressPage from "./progress/page";
import NativeSelectPage from "./native-select/page";
import PopoverPage from "./popover/page";
import SeparatorPage from "./separator/page";
import SkeletonPage from "./skeleton/page";
import SwitchPage from "./switch/page";
import TablePage from "./table/page";
import TabsPage from "./tabs/page";
import ToastPage from "./toast/page";
import TooltipPage from "./tooltip/page";
import AlertPage from "./alert/page";
import DialogPage from "./dialog/page";
import AccordionPage from "./accordion/page";
import BreadcrumbDocsPage from "./breadcrumb/page";
import ScrollAreaPage from "./scroll-area/page";
import SliderPage from "./slider/page";
import HoverCardPage from "./hover-card/page";
import MarkerPage from "./marker/page";
import DropdownMenuPage from "./dropdown-menu/page";
import InputPage from "./input/page";
import InputGroupPage from "./input-group/page";
import InputOTPPage from "./input-otp/page";
import FileUploadPage from "./file-upload/page";
import CommandPage from "./command/page";
import TypographyPage from "./typography/page";

function renderDocs(node: ReactNode) {
  return render(<DocsStoreProvider>{node}</DocsStoreProvider>);
}

const pages = [
  {
    load: ButtonPage,
    title: "Button",
    command: "npx vinyaas add button",
    api: "variant",
  },
  {
    load: InputPage,
    title: "Input",
    command: "npx vinyaas add input",
    api: "type",
  },
  {
    load: AvatarPage,
    title: "Avatar",
    command: "npx vinyaas add avatar",
    api: "src",
  },
  {
    load: ProgressPage,
    title: "Progress",
    command: "npx vinyaas add progress",
    api: "value",
  },
  {
    load: SkeletonPage,
    title: "Skeleton",
    command: "npx vinyaas add skeleton",
    api: "className",
  },
  {
    load: SeparatorPage,
    title: "Separator",
    command: "npx vinyaas add separator",
    api: "orientation",
  },
  {
    load: KbdPage,
    title: "Kbd",
    command: "npx vinyaas add kbd",
    api: "children",
  },
  {
    load: SwitchPage,
    title: "Switch",
    command: "npx vinyaas add switch",
    api: "onCheckedChange",
  },
  {
    load: TablePage,
    title: "Table",
    command: "npx vinyaas add table",
    api: "children",
  },
  {
    load: TabsPage,
    title: "Tabs",
    command: "npx vinyaas add tabs",
    api: "defaultValue",
  },
  {
    load: TooltipPage,
    title: "Tooltip",
    command: "npx vinyaas add tooltip",
    api: "delayDuration",
  },
  {
    load: NativeSelectPage,
    title: "Native Select",
    command: "npx vinyaas add native-select",
    api: "multiple",
  },
  {
    load: ToastPage,
    title: "Toast",
    command: "npx vinyaas add toast",
    api: "actionProps",
  },
  {
    load: BadgePage,
    title: "Badge",
    command: "npx vinyaas add badge",
    api: "variant",
  },
  {
    load: CardPage,
    title: "Card",
    command: "npx vinyaas add card",
    api: "className",
  },
  {
    load: SpinnerPage,
    title: "Spinner",
    command: "npx vinyaas add spinner",
    api: "label",
  },
  {
    load: PopoverPage,
    title: "Popover",
    command: "npx vinyaas add popover",
    api: "onOpenChange",
  },
  {
    load: AlertPage,
    title: "Alert",
    command: "npx vinyaas add alert",
    api: "variant",
  },
  {
    load: DialogPage,
    title: "Dialog",
    command: "npx vinyaas add dialog",
    api: "open",
  },
  {
    load: AccordionPage,
    title: "Accordion",
    command: "npx vinyaas add accordion",
    api: "type",
  },
  {
    load: BreadcrumbDocsPage,
    title: "Breadcrumb",
    command: "npx vinyaas add breadcrumb",
    api: "href",
  },
  {
    load: ScrollAreaPage,
    title: "Scroll Area",
    command: "npx vinyaas add scroll-area",
    api: "orientation",
  },
  {
    load: SliderPage,
    title: "Slider",
    command: "npx vinyaas add slider",
    api: "onValueChange",
  },
  {
    load: HoverCardPage,
    title: "Hover Card",
    command: "npx vinyaas add hover-card",
    api: "openDelay",
  },
  {
    load: MarkerPage,
    title: "Marker",
    command: "npx vinyaas add marker",
    api: "variant",
  },
  {
    load: DropdownMenuPage,
    title: "Dropdown Menu",
    command: "npx vinyaas add dropdown-menu",
    api: "align",
  },
  {
    load: InputGroupPage,
    title: "Input Group",
    command: "npx vinyaas add input-group",
    api: "className",
  },
  {
    load: InputOTPPage,
    title: "Input OTP",
    command: "npx vinyaas add input-otp",
    api: "length",
  },
  {
    load: FileUploadPage,
    title: "File Upload",
    command: "npx vinyaas add file-upload",
    api: "accept",
  },
  {
    load: CommandPage,
    title: "Command",
    command: "npx vinyaas add command",
    api: "value",
  },
  {
    load: TypographyPage,
    title: "Typography",
    command: "npx vinyaas add typography",
    api: "className",
  },
] as const;

describe("composed examples", () => {
  it("renders badge and card examples", async () => {
    renderDocs(await BadgePage());
    expect(
      screen.getAllByRole("link", { name: "Documentation" }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Processing").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Claim offer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bookmark").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Beta").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ghost").length).toBeGreaterThan(0);

    renderDocs(await CardPage());
    expect(screen.getAllByText("Sarang Kumar").length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("button", { name: "Follow" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: "Manage subscription" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Enabled")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Recent activity")).toBeInTheDocument();
    expect(screen.getAllByText("v1.0.0").length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toContain(
      'from "@/components/ui/select"',
    );
  });

  it("renders docs polish: Card preview, Dialog Buttons, Hover Card external, Tabs Card, consolidated variants", async () => {
    const { unmount: unmountCard } = renderDocs(await CardPage());
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Message" }).length,
    ).toBeGreaterThan(0);
    unmountCard();

    const { unmount: unmountDialog } = renderDocs(await DialogPage());
    expect(
      screen.getByRole("heading", { name: "In practice" }),
    ).toBeInTheDocument();
    expect(
      [...document.querySelectorAll("code")].some((node) =>
        node.textContent?.includes('<Button variant="outline">Cancel</Button>'),
      ),
    ).toBe(true);
    unmountDialog();

    const { unmount: unmountHover } = renderDocs(await HoverCardPage());
    expect(
      screen.getByRole("heading", { name: "External link" }),
    ).toHaveAttribute("id", "external-link");
    expect(
      screen.getAllByRole("button", { name: /Vinyaas documentation/ }).length,
    ).toBeGreaterThan(0);
    expect(
      [...document.querySelectorAll("code")].some((node) =>
        node.textContent?.includes("External website"),
      ),
    ).toBe(true);
    unmountHover();

    const { unmount: unmountTabs } = renderDocs(await TabsPage());
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Notifications" }),
    ).toBeInTheDocument();
    unmountTabs();

    const { unmount: unmountToast } = renderDocs(await ToastPage());
    expect(screen.getByRole("heading", { name: "Types" })).toHaveAttribute(
      "id",
      "types",
    );
    expect(screen.getByRole("button", { name: "Success" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Error" })).toBeInTheDocument();
    unmountToast();

    const { unmount: unmountAlert } = renderDocs(await AlertPage());
    expect(screen.getByRole("heading", { name: "Variants" })).toHaveAttribute(
      "id",
      "variants",
    );
    expect(screen.getAllByText("Deployment complete").length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText("Payment failed").length).toBeGreaterThan(0);
    unmountAlert();

    const { unmount: unmountUpload } = renderDocs(await FileUploadPage());
    expect(screen.getByText("portrait.png")).toBeInTheDocument();
    expect(screen.getByText("standup-notes.mp3")).toBeInTheDocument();
    expect(screen.getByText("product-walkthrough.mp4")).toBeInTheDocument();
    unmountUpload();

    renderDocs(await NativeSelectPage());
    const selects = document.querySelectorAll("select");
    expect([...selects].some((node) => node.className.includes("pr-10"))).toBe(
      true,
    );
  });

  it("renders dropdown, breadcrumb separator, and kbd named-key examples", async () => {
    renderDocs(await DropdownMenuPage());
    expect(
      screen.getByRole("heading", { name: "Account menu" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Card actions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Table row actions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Project actions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "User actions" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sarang Kumar")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Actions for Aarav Sharma" }),
    ).toBeInTheDocument();

    renderDocs(await BreadcrumbDocsPage());
    expect(
      screen.getByRole("heading", { name: "Custom separator" }),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll('[aria-hidden="true"] svg').length,
    ).toBeGreaterThan(0);

    renderDocs(await KbdPage());
    expect(
      screen.getByRole("heading", { name: "Named keys" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Enter").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Esc").length).toBeGreaterThan(0);
    expect(document.body.textContent).toMatch(/visual only/i);
  });
  it("renders spinner action preview and marker separator feed", async () => {
    renderDocs(await SpinnerPage());
    expect(
      screen.getAllByRole("button", { name: "Save changes" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: "In a button" }),
    ).toHaveAttribute("id", "in-a-button");

    renderDocs(await MarkerPage());
    expect(screen.getByRole("heading", { name: "Separator" })).toHaveAttribute(
      "id",
      "separator",
    );
    expect(screen.getAllByText("Today").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Merged accessibility fixes for Dialog."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Published registry artifacts for Toast."),
    ).toBeInTheDocument();
  });
});

describe("new component pages", () => {
  it.each(pages)(
    "documents $title with progressive sections and In practice before API",
    async ({ load, title, command, api }) => {
      renderDocs(await load());

      expect(
        screen.getByRole("heading", { level: 1, name: title }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Overview" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Preview" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Installation" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Usage" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Examples" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "In practice" }),
      ).toHaveAttribute("id", "in-practice");
      expect(screen.getByRole("heading", { name: "API" })).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Accessibility" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Source" }),
      ).toBeInTheDocument();

      const headings = screen
        .getAllByRole("heading", { level: 2 })
        .map((node) => node.textContent);
      expect(headings.indexOf("In practice")).toBeGreaterThan(
        headings.indexOf("Examples"),
      );
      expect(headings.indexOf("API")).toBeGreaterThan(
        headings.indexOf("In practice"),
      );
      expect(headings.indexOf("Accessibility")).toBeGreaterThan(
        headings.indexOf("API"),
      );
      expect(headings.indexOf("Source")).toBeGreaterThan(
        headings.indexOf("Accessibility"),
      );

      expect(
        [...document.querySelectorAll("code")].some(
          (node) => node.textContent === command,
        ),
      ).toBe(true);
      expect(document.body.textContent).not.toMatch(
        /components\/ui\/[a-z0-9-]+\/(?!index\.tsx)[a-z0-9-]+\.tsx/,
      );
      const tables = document.querySelectorAll("table");

      expect(tables[tables.length - 1]).toHaveTextContent(api);
    },
  );
});
