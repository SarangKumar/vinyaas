import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

import {
  DashboardNavigationDemo,
  DocsNavigationDemo,
  ProductMegaMenuDemo,
  RichWorkspaceMenuDemo,
  SimpleNavigationDemo,
  SiteHeaderNavigationDemo,
} from "./navigation-menu-demos";

export const metadata: Metadata = componentPageMetadata("navigation-menu");

const usage = `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export function SiteNav() {
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
`;

const inPracticeCode = `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <p className="text-sm font-semibold tracking-tight">Vinyaas</p>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="product">
            <NavigationMenuTrigger>Product</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-1 sm:grid-cols-2">
                <NavigationMenuLink
                  href="/products/analytics"
                  className="flex h-auto flex-col items-start gap-1 p-3 font-normal"
                >
                  <span className="font-medium">Analytics</span>
                  <span className="text-muted-foreground text-sm font-normal">
                    Charts and deploy insights for product teams.
                  </span>
                </NavigationMenuLink>
                <NavigationMenuLink
                  href="/products/workspace"
                  className="flex h-auto flex-col items-start gap-1 p-3 font-normal"
                >
                  <span className="font-medium">Workspace</span>
                  <span className="text-muted-foreground text-sm font-normal">
                    Projects, environments, and team access.
                  </span>
                </NavigationMenuLink>
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
    </header>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "value",
    type: "string | null",
    description: "Controlled open item value on NavigationMenu.",
  },
  {
    prop: "defaultValue",
    type: "string | null",
    description: "Initial open item when uncontrolled.",
  },
  {
    prop: "onValueChange",
    type: "(value: string | null) => void",
    description: "Called when the open item changes.",
  },
  {
    prop: "value",
    type: "string",
    description:
      "Stable item id on NavigationMenuItem (recommended for triggers).",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the part with cn.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "simple",
    title: "Simple navigation",
    description: "Top-level links without panels.",
    preview: <SimpleNavigationDemo />,
    code: `import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function SimpleNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
`,
  },
  {
    id: "mega-menu",
    title: "Product mega menu",
    description:
      "Compose Card, Badge, Button, and links inside NavigationMenuContent.",
    preview: <ProductMegaMenuDemo />,
    code: usage,
  },
  {
    id: "workspace",
    title: "Rich workspace menu",
    description:
      "Recent projects, status badges, avatar activity, and a create action.",
    preview: <RichWorkspaceMenuDemo />,
    code: usage,
  },
  {
    id: "dashboard",
    title: "Dashboard navigation",
    description:
      "Dashboard links with a Projects panel for browse filters and recent cards.",
    preview: <DashboardNavigationDemo />,
    code: usage,
  },
  {
    id: "docs",
    title: "Documentation navigation",
    description:
      "Grouped component links across Inputs, Navigation, and Feedback.",
    preview: <DocsNavigationDemo />,
    code: usage,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A product header mixes a Product mega panel with top-level Docs, Pricing, and Blog links.",
  preview: <SiteHeaderNavigationDemo />,
  code: inPracticeCode,
};

export default async function NavigationMenuPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/navigation-menu/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Navigation Menu"
      description="A composable site navigation menu with rich mega-menu content panels."
      overview={
        <>
          <p>
            Navigation Menu is for site and product navigation with optional
            disclosure panels. Prefer it for marketing/docs headers and
            dashboard top bars. Prefer Dropdown Menu for action menus, and
            Sidebar or Sheet for mobile primary navigation.
          </p>
          <p>
            <code>NavigationMenuContent</code> is intentionally a composition
            surface. It is not restricted to navigation links and can contain
            arbitrary React content and other Vinyaas components.
          </p>
        </>
      }
      install="vinyaas add navigation-menu"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/navigation-menu/index.tsx</code> with{" "}
          <code>navigation-menu.css</code>.
        </p>
      }
      usage={usage}
      api={api}
      examples={examples}
      inPractice={inPractice}
      accessibility={
        <ul className="list-disc pl-5">
          <li>
            Root is a <code>nav</code>. Triggers expose{" "}
            <code>aria-expanded</code> and <code>aria-controls</code>.
          </li>
          <li>
            Content panels use <code>role=&quot;region&quot;</code> so nested
            cards, buttons, and links keep their native semantics.
          </li>
          <li>
            ArrowLeft/Right, Home, and End move across triggers. Enter/Space
            toggles a panel. Escape closes. Tab is not trapped.
          </li>
          <li>
            On narrow viewports, prefer Sidebar or Sheet for primary mobile
            navigation and keep Navigation Menu for denser desktop layouts.
          </li>
        </ul>
      }
      source={source}
    >
      <ProductMegaMenuDemo />
    </ComponentReference>
  );
}
