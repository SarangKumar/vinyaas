import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import type { ApiRow } from "@/components/api-table";
import { ComponentReference } from "@/components/component-reference";
import { componentPageMetadata } from "@/lib/page-metadata";

import { examples, inPractice, usage } from "./examples";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/new-york/ui/sidebar";

export const metadata: Metadata = componentPageMetadata("sidebar");

const api: ApiRow[] = [
  {
    prop: "open / defaultOpen / onOpenChange",
    type: "boolean | (open: boolean) => void",
    defaultValue: "defaultOpen = true",
    description:
      "SidebarProvider: controlled or uncontrolled expanded state on desktop.",
  },
  {
    prop: "openMobile / defaultOpenMobile / onOpenMobileChange",
    type: "boolean | (open: boolean) => void",
    description:
      "SidebarProvider: controlled or uncontrolled mobile drawer open state.",
  },
  {
    prop: "keyboardShortcut",
    type: "string | false",
    defaultValue: '"b"',
    description:
      "SidebarProvider: ⌘/Ctrl + key toggles the sidebar. Pass false to disable. Ignored inside inputs.",
  },
  {
    prop: "collapsible",
    type: '"icon" | "offcanvas" | "none"',
    defaultValue: '"icon"',
    description:
      "Sidebar: desktop collapse behavior. icon keeps a usable rail; offcanvas hides off-screen.",
  },
  {
    prop: "side",
    type: '"left" | "right"',
    defaultValue: '"left"',
    description:
      "Sidebar: which edge hosts the desktop rail and mobile drawer.",
  },
  {
    prop: "asChild",
    type: "boolean",
    defaultValue: "false",
    description:
      "SidebarMenuButton: merge styles onto a child element such as an anchor.",
  },
  {
    prop: "isActive",
    type: "boolean",
    defaultValue: "false",
    description: "SidebarMenuButton: marks the current navigation item.",
  },
  {
    prop: "tooltip",
    type: "ReactNode",
    description:
      "SidebarMenuButton: shown when collapsed on desktop. Also used as aria-label when it is a string.",
  },
  {
    prop: "useSidebar()",
    type: "{ state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar }",
    description:
      "Hook for reading and toggling sidebar state from descendants.",
  },
];

function PreviewIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      {children}
    </svg>
  );
}

function Preview() {
  return (
    <SidebarProvider
      defaultOpen
      keyboardShortcut={false}
      className="border-border min-h-[240px] w-full max-w-3xl overflow-hidden rounded-md border"
    >
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-center px-2 py-1.5 group-data-[collapsible=icon]:px-0">
            <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-6 items-center justify-center rounded-md text-[10px] font-semibold">
              A
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <PreviewIcon>
                      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
                    </PreviewIcon>
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Analytics">
                    <PreviewIcon>
                      <path d="M4 19V5M10 19V9M16 19v-6M22 19V7" />
                    </PreviewIcon>
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-[240px]">
        <div className="border-border flex items-center gap-2 border-b p-3">
          <SidebarTrigger />
          <p className="text-sm font-medium">Overview</p>
        </div>
        <div className="text-muted-foreground p-4 text-sm">
          Toggle the sidebar to switch between expanded and collapsed modes.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default async function SidebarPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/sidebar/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Sidebar"
      description="Composable dashboard sidebar with expanded, collapsed, and mobile navigation."
      overview={
        <>
          <p>
            Sidebar provides application-shell structure and behavior: a
            persistent desktop rail, an icon-collapsed mode, and a mobile
            navigation surface. You compose the navigation content — links,
            buttons, badges, headers, and footers.
          </p>
          <p>
            It intentionally does not own routing, page layouts, or a
            configuration-only <code>items</code> API. Use{" "}
            <code>SidebarMenuButton asChild</code> with your own anchors or
            framework links.
          </p>
          <p>
            Mobile navigation composes the existing Drawer primitive so Sheet
            can replace or wrap that surface later without rewriting the sidebar
            API. Install with <code>vinyaas add sidebar</code> or via{" "}
            <code>vinyaas add --catalog dashboard</code>.
          </p>
        </>
      }
      install="vinyaas add sidebar"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/sidebar/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>, depends on{" "}
          <code>clsx</code> and <code>tailwind-merge</code>, and pulls registry
          dependencies <code>drawer</code> and <code>tooltip</code>. Ensure your
          theme defines <code>--sidebar-*</code> tokens (aliased from core
          colors in the Vinyaas theme).
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <>
          <p>
            Sidebar navigation is a landmark (<code>nav</code> labelled
            &quot;Sidebar&quot;). Menu actions are native buttons or consumer
            links. There is no focus trap on the desktop rail.
          </p>
          <ul className="list-disc pl-5">
            <li>
              Tab reaches the trigger and menu controls. Enter activates links
              and buttons; Space activates button controls.
            </li>
            <li>
              Collapsed icon mode keeps items in the tab order. Labels stay in
              the accessibility tree (<code>sr-only</code> text and/or{" "}
              <code>aria-label</code> from string tooltips). Tooltips are not
              the only source of naming.
            </li>
            <li>
              Focus-visible rings use <code>--sidebar-ring</code> /{" "}
              <code>--ring</code> tokens.
            </li>
            <li>
              Mobile open state uses Drawer: Escape closes, focus moves into the
              surface, and focus returns to the trigger on close.
            </li>
            <li>
              Width transitions respect <code>prefers-reduced-motion</code> via{" "}
              <code>motion-reduce:transition-none</code>.
            </li>
            <li>
              Optional keyboard shortcut: ⌘/Ctrl+B (configurable; disable with{" "}
              <code>{`keyboardShortcut={false}`}</code>). It does not fire while
              typing in inputs.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <Preview />
    </ComponentReference>
  );
}
