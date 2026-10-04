import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/registry/new-york/ui/sidebar";

function DotIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 19V5M10 19V9M16 19v-6M22 19V7" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={className}
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M21 19a4.5 4.5 0 0 0-6-4" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

function BillingIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M8 14h4" />
    </svg>
  );
}

function StateBadge({ label }: { label: string }) {
  return <Badge variant="secondary">{label}</Badge>;
}

function BasicSidebar() {
  return (
    <SidebarProvider
      defaultOpen
      keyboardShortcut={false}
      className="border-border min-h-[280px] overflow-hidden rounded-md border"
    >
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-center px-2 py-1.5 group-data-[collapsible=icon]:px-0">
            <DotIcon className="text-sidebar-primary size-4" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <HomeIcon />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Projects">
                    <FolderIcon />
                    <span>Projects</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-[280px]">
        <div className="border-border flex items-center gap-2 border-b p-3">
          <SidebarTrigger />
          <p className="text-sm font-medium">Overview</p>
        </div>
        <div className="text-muted-foreground p-4 text-sm">
          Main content beside the sidebar.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function DashboardSidebar() {
  return (
    <SidebarProvider
      defaultOpen
      keyboardShortcut={false}
      className="border-border min-h-[360px] overflow-hidden rounded-md border"
    >
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-center px-2 py-1.5 group-data-[collapsible=icon]:px-0">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-md text-xs font-semibold">
              V
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <HomeIcon />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Analytics">
                    <ChartIcon />
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Projects">
                    <FolderIcon />
                    <span>Projects</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Team">
                    <UsersIcon />
                    <span>Team</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Billing" disabled>
                    <BillingIcon />
                    <span>Billing</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <SettingsIcon />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Account" className="h-12">
                <Avatar className="size-6">
                  <AvatarFallback>SK</AvatarFallback>
                </Avatar>
                <span className="truncate">Sarang Kumar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-h-[360px]">
        <header className="border-border flex items-center justify-between gap-3 border-b p-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div>
              <p className="text-sm font-medium">Dashboard</p>
              <p className="text-muted-foreground text-xs">
                Active navigation with account footer
              </p>
            </div>
          </div>
          <StateBadge label="Toggle to collapse" />
        </header>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          <div className="border-border rounded-md border p-3">
            <p className="text-sm font-medium">Revenue</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Main content stays beside the sidebar.
            </p>
          </div>
          <div className="border-border rounded-md border p-3">
            <p className="text-sm font-medium">Active users</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Collapse to keep icons and names discoverable.
            </p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function CollapsedSidebar() {
  return (
    <SidebarProvider
      defaultOpen={false}
      keyboardShortcut={false}
      className="border-border min-h-[280px] overflow-hidden rounded-md border"
    >
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-center px-2 py-1.5 group-data-[collapsible=icon]:px-0">
            <div className="border-border flex size-8 items-center justify-center rounded-md border text-xs font-semibold">
              A
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigate</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <HomeIcon />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Analytics">
                    <ChartIcon />
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <SettingsIcon />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-[280px]">
        <div className="border-border flex items-center gap-2 border-b p-3">
          <SidebarTrigger />
          <StateBadge label="Collapsed" />
        </div>
        <div className="text-muted-foreground p-4 text-sm">
          Icons remain visible. Labels stay available to assistive tech and
          tooltips.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function CompositionSidebar() {
  return (
    <SidebarProvider
      defaultOpen
      keyboardShortcut={false}
      className="border-border min-h-[300px] overflow-hidden rounded-md border"
    >
      <Sidebar>
        <SidebarHeader className="gap-3">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mx-2 group-data-[collapsible=icon]:mx-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
          >
            <span className="group-data-[collapsible=icon]:sr-only">
              Search
            </span>
            <DotIcon className="hidden size-4 group-data-[collapsible=icon]:block" />
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Guides</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Home">
                    <HomeIcon />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Introduction">
                    <BookMark />
                    <span>Introduction</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Components">
                    <FolderIcon />
                    <span>Components</span>
                    <Badge
                      variant="secondary"
                      className="ml-auto group-data-[collapsible=icon]:hidden"
                    >
                      New
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-[300px] p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <p className="text-sm">
            Custom header, badges, and link composition.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function BookMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 3h12v18l-6-3-6 3z" />
    </svg>
  );
}

export const usage = `import {
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
} from "@/components/ui/sidebar";

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function AppShell() {
  return (
    <SidebarProvider>
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
                    <HomeIcon />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="border-border flex items-center gap-2 border-b p-3">
          <SidebarTrigger />
          <p className="text-sm font-medium">Overview</p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
`;

export const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "A simple sidebar with navigation and a main content area.",
    preview: <BasicSidebar />,
    code: usage,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description:
      "Grouped navigation, an active item, main content, and an account footer.",
    preview: <DashboardSidebar />,
    code: `// See the Dashboard preview — groups, active item, footer account.`,
  },
  {
    id: "collapsed",
    title: "Collapsed",
    description:
      "Icon mode keeps controls usable. Labels stay discoverable via accessible names and tooltips.",
    preview: <CollapsedSidebar />,
    code: `<SidebarProvider defaultOpen={false}>...</SidebarProvider>`,
  },
  {
    id: "composition",
    title: "Composition",
    description:
      "Custom header/footer content and badges. Prefer asChild with anchors for routing.",
    preview: <CompositionSidebar />,
    code: `<SidebarMenuButton asChild>
  <a href="/components">Components</a>
</SidebarMenuButton>`,
  },
];

export const inPractice: ComponentInPractice = {
  description:
    "A compact application shell: toggle between expanded and collapsed desktop states, keep the inset content independent of routing.",
  preview: <DashboardSidebar />,
  code: usage,
};
