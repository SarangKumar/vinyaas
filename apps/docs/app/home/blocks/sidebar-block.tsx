"use client";

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
        className="border-border min-h-[240px] w-full rounded-md border"
      >
        <Sidebar>
          <SidebarHeader>
            <div className="border-border flex size-8 items-center justify-center rounded-md border text-xs font-semibold">
              V
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
        <SidebarInset className="min-h-[160px]">
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
