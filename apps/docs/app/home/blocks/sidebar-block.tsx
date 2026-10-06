"use client";

import type { CSSProperties } from "react";

import { PlayBlock } from "@/app/home/play-block";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/new-york/ui/sidebar";

function Mark({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="bg-sidebar-accent text-sidebar-accent-foreground flex size-4 items-center justify-center rounded-sm text-[10px] font-semibold"
    >
      {label}
    </span>
  );
}

const demoShell =
  "border-border h-[240px] max-h-[240px] w-full min-h-0 overflow-hidden rounded-md border [&_[data-slot=sidebar-inner]]:rounded-l-md";

/**
 * Compact homepage Sidebar example — icon rail + inset content.
 */
export function SidebarBlock() {
  return (
    <PlayBlock
      title="Sidebar"
      description="Toggle expanded and collapsed navigation."
    >
      <SidebarProvider
        defaultOpen={false}
        keyboardShortcut={false}
        className={demoShell}
        style={
          {
            "--sidebar-width": "11rem",
            "--sidebar-width-icon": "3rem",
          } as CSSProperties
        }
      >
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="border-border flex size-8 shrink-0 items-center justify-center rounded-md border text-xs font-semibold">
                V
              </div>
              <span className="truncate text-sm font-medium group-data-[collapsible=icon]:hidden">
                Vinyaas
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Home">
                      <Mark label="H" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Projects">
                      <Mark label="P" />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Mark label="S" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="min-h-0 overflow-hidden">
          <div className="border-border flex items-center gap-2 border-b p-2.5">
            <SidebarTrigger />
            <p className="text-sm font-medium">Workspace</p>
          </div>
          <p className="text-muted-foreground p-3 text-sm">Main content</p>
        </SidebarInset>
      </SidebarProvider>
    </PlayBlock>
  );
}
