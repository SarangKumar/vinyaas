"use client";

import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/registry/new-york/ui/navigation-menu";
import { Separator } from "@/registry/new-york/ui/separator";

/**
 * Docs preview boxes clip overflow, so menu demos reserve room for the open
 * panel below the triggers and start-align the menu so the panel never runs
 * past the right edge.
 */
export function MenuStage({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-demo-align="start"
      className="flex min-h-[32rem] w-full items-start justify-start sm:min-h-[26rem]"
    >
      {/* self-start: the preview stretches start-aligned demos; keep the menu at the top. */}
      <div className="max-w-full self-start">{children}</div>
    </div>
  );
}

function ListItem({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <NavigationMenuLink
      href={href}
      className="hover:bg-accent hover:text-accent-foreground flex h-auto flex-col items-start gap-1 rounded-md p-3 text-left font-normal no-underline transition-colors"
    >
      <span className="text-sm leading-none font-medium">{title}</span>
      <span className="text-muted-foreground line-clamp-2 text-sm leading-snug font-normal">
        {children}
      </span>
    </NavigationMenuLink>
  );
}

/** First preview on the docs page; mirrors the usage snippet exactly. */
export function BasicNavigationDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 md:grid-cols-2">
              <NavigationMenuLink href="/products/analytics">
                Analytics
              </NavigationMenuLink>
              <NavigationMenuLink href="/products/workspace">
                Workspace
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}

export function SimpleNavigationDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/components">Components</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function ProductMegaMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 md:grid-cols-[minmax(11rem,14rem)_minmax(12rem,16rem)]">
              <Card className="bg-muted/40 border-0 shadow-none">
                <CardHeader>
                  <Badge className="w-fit">Featured</Badge>
                  <CardTitle className="text-base">Vinyaas Analytics</CardTitle>
                  <CardDescription>
                    Charts, tables, and deploy insights for product teams.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button type="button" size="sm">
                    Explore analytics
                  </Button>
                </CardContent>
              </Card>
              <div className="grid gap-1">
                <ListItem href="/products/workspace" title="Workspace">
                  Projects, environments, and team access in one place.
                </ListItem>
                <ListItem href="/products/automation" title="Automation">
                  Trigger workflows when deploys succeed or fail.
                </ListItem>
                <ListItem href="/products/observability" title="Observability">
                  Logs, traces, and status without leaving the app.
                </ListItem>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="solutions">
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid min-w-[14rem] gap-1">
              <ListItem href="/solutions/startups" title="Startups">
                Ship a polished product UI without rebuilding primitives.
              </ListItem>
              <ListItem href="/solutions/enterprise" title="Enterprise">
                Accessible navigation for large product shells.
              </ListItem>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}

export function RichWorkspaceMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="workspace">
          <NavigationMenuTrigger>Workspace</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex min-w-[16rem] flex-col gap-4 sm:min-w-[20rem]">
              <div>
                <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                  Recent projects
                </p>
                <div className="grid gap-2">
                  {[
                    { name: "vinyaas-web", status: "Active" },
                    { name: "docs", status: "Review" },
                  ].map((project) => (
                    <Card key={project.name} size="sm" className="shadow-none">
                      <CardHeader className="p-0">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-sm">
                            {project.name}
                          </CardTitle>
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-xs">SK</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">Sarang</p>
                    <p className="text-muted-foreground truncate text-xs">
                      Opened docs 2h ago
                    </p>
                  </div>
                </div>
                <Button type="button" size="sm">
                  Create project
                </Button>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/activity">Activity</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}

export function DashboardNavigationDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/dashboard">Dashboard</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/analytics">Analytics</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem value="projects">
          <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid min-w-[10rem] gap-1">
                <p className="text-muted-foreground px-3 text-xs font-medium tracking-wide uppercase">
                  Browse
                </p>
                <NavigationMenuLink href="/projects">
                  All projects
                </NavigationMenuLink>
                <NavigationMenuLink href="/projects?status=active">
                  Active
                </NavigationMenuLink>
                <NavigationMenuLink href="/projects?status=archived">
                  Archived
                </NavigationMenuLink>
              </div>
              <div className="grid min-w-[11rem] gap-2">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Recent
                </p>
                <Card size="sm" className="shadow-none">
                  <CardHeader className="p-0">
                    <CardTitle className="text-sm">Marketing site</CardTitle>
                    <CardDescription>Updated 4h ago</CardDescription>
                  </CardHeader>
                </Card>
                <Card size="sm" className="shadow-none">
                  <CardHeader className="p-0">
                    <CardTitle className="text-sm">API gateway</CardTitle>
                    <CardDescription>Updated yesterday</CardDescription>
                  </CardHeader>
                </Card>
                <Button type="button" size="sm" className="justify-self-start">
                  Create project
                </Button>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}

export function DocsNavigationDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="components">
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid min-w-[8rem] gap-1">
                <p className="text-muted-foreground px-3 text-xs font-medium tracking-wide uppercase">
                  Inputs
                </p>
                <NavigationMenuLink href="/components/button">
                  Button
                </NavigationMenuLink>
                <NavigationMenuLink href="/components/input">
                  Input
                </NavigationMenuLink>
                <NavigationMenuLink href="/components/select">
                  Select
                </NavigationMenuLink>
              </div>
              <div className="grid min-w-[8rem] gap-1">
                <p className="text-muted-foreground px-3 text-xs font-medium tracking-wide uppercase">
                  Navigation
                </p>
                <NavigationMenuLink href="/components/tabs">
                  Tabs
                </NavigationMenuLink>
                <NavigationMenuLink href="/components/sidebar">
                  Sidebar
                </NavigationMenuLink>
                <NavigationMenuLink href="/components/navigation-menu">
                  Navigation Menu
                </NavigationMenuLink>
              </div>
              <div className="grid min-w-[8rem] gap-1">
                <p className="text-muted-foreground px-3 text-xs font-medium tracking-wide uppercase">
                  Feedback
                </p>
                <NavigationMenuLink href="/components/alert">
                  Alert
                </NavigationMenuLink>
                <NavigationMenuLink href="/components/dialog">
                  Dialog
                </NavigationMenuLink>
                <NavigationMenuLink href="/components/alert-dialog">
                  Alert Dialog
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs/installation">
            Installation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}

/** Site header composition for the In practice section. */
export function SiteHeaderNavigationDemo() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold tracking-tight">Vinyaas</p>
      <NavigationMenu className="max-w-full">
        <NavigationMenuList className="flex-wrap justify-start sm:justify-end">
          <NavigationMenuItem value="product">
            <NavigationMenuTrigger>Product</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-1 sm:grid-cols-2">
                <ListItem href="/products/analytics" title="Analytics">
                  Charts and deploy insights for product teams.
                </ListItem>
                <ListItem href="/products/workspace" title="Workspace">
                  Projects, environments, and team access.
                </ListItem>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/blog">Blog</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    </div>
  );
}
