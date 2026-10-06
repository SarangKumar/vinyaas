"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
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

/**
 * Compact mega-menu showcase for the homepage masonry layout.
 */
export function NavigationMenuBlock() {
  return (
    <PlayBlock
      title="Navigation Menu"
      description="Rich panels with cards, badges, and actions—not just links."
    >
      <NavigationMenu className="max-w-full">
        <NavigationMenuList className="flex-wrap justify-start">
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3">
                <Card className="bg-muted/40 border-0 shadow-none">
                  <CardHeader className="p-0">
                    <Badge className="w-fit">New</Badge>
                    <CardTitle className="text-sm">Analytics</CardTitle>
                    <CardDescription>
                      Charts and deploy insights for product teams.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <NavigationMenuLink href="/products/workspace">
                  Workspace
                </NavigationMenuLink>
                <Button type="button" size="sm" className="justify-self-start">
                  Explore
                </Button>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    </PlayBlock>
  );
}
