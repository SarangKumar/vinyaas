"use client";

import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/new-york/ui/drawer";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Separator } from "@/registry/new-york/ui/separator";
import { Slider } from "@/registry/new-york/ui/slider";
import { Switch } from "@/registry/new-york/ui/switch";

export function ShoppingFilterPreview() {
  return (
    <div className="border-border flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border p-3 text-left">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">Running shoes</p>
        <p className="text-muted-foreground text-xs">248 results · Men</p>
      </div>
      <Drawer>
        <DrawerTrigger>
          <Button variant="outline" size="sm">
            Filters
            <Badge variant="secondary" className="ml-1.5">
              4
            </Badge>
          </Button>
        </DrawerTrigger>
        <DrawerContent side="right" className="gap-0 p-0 sm:max-w-md">
          <DrawerHeader className="border-border border-b px-6 py-4">
            <DrawerTitle>Product filters</DrawerTitle>
            <DrawerDescription>
              Refine by brand, size, price, and delivery options.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Availability</p>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="drawer-shop-in-stock">In stock only</Label>
                <Switch id="drawer-shop-in-stock" defaultChecked />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="drawer-shop-free-ship">Free shipping</Label>
                <Switch id="drawer-shop-free-ship" />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Brand</p>
              <div className="flex items-center gap-2">
                <Checkbox id="drawer-brand-nike" defaultChecked />
                <Label htmlFor="drawer-brand-nike">Nike</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="drawer-brand-adidas" defaultChecked />
                <Label htmlFor="drawer-brand-adidas">Adidas</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="drawer-brand-hoka" />
                <Label htmlFor="drawer-brand-hoka">Hoka</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="drawer-brand-on" />
                <Label htmlFor="drawer-brand-on">On Running</Label>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">Max price</p>
                <span className="text-muted-foreground text-xs">$220</span>
              </div>
              <Slider defaultValue={220} min={20} max={300} step={10} />
            </div>
            <Separator />
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Size</p>
              <div className="flex flex-wrap gap-2">
                {["7", "8", "9", "10", "11", "12"].map((size) => (
                  <Badge
                    key={size}
                    variant={
                      size === "10" || size === "11" ? "default" : "outline"
                    }
                    className="cursor-default px-3 py-1"
                  >
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DrawerFooter className="border-border border-t px-6 py-4">
            <DrawerClose>
              <Button variant="outline" size="sm">
                Clear all
              </Button>
            </DrawerClose>
            <Button size="sm">Show 86 results</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export function AccountDrawerPreview() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="secondary" size="sm">
          Account
        </Button>
      </DrawerTrigger>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>Account settings</DrawerTitle>
          <DrawerDescription>
            Update profile details for your workspace.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="drawer-page-name">Display name</Label>
            <Input id="drawer-page-name" defaultValue="Sarang Kumar" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="drawer-page-email">Email</Label>
            <Input
              id="drawer-page-email"
              type="email"
              defaultValue="sarang@example.com"
            />
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DrawerClose>
          <Button size="sm">Save changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function NotificationDrawerPreview() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="outline" size="sm">
          Activity
        </Button>
      </DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Recent activity</DrawerTitle>
          <DrawerDescription>
            Review alerts and delivery preferences.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Order shipped</p>
              <p className="text-muted-foreground text-xs">2 minutes ago</p>
            </div>
            <Badge variant="secondary">#4821</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">Email me on delivery</span>
            <Switch defaultChecked aria-label="Email me on delivery" />
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline" size="sm">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
