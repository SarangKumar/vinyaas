import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
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
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("drawer");

const usage = `import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function FilterDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="outline">Filters</Button>
      </DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>
            Narrow the product list without leaving the page.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DrawerClose>
          <Button size="sm">Apply filters</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "open",
    type: "boolean",
    description: "Controlled open state.",
  },
  {
    prop: "defaultOpen",
    type: "boolean",
    description: "Initial open state when uncontrolled.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Called when the drawer opens or closes.",
  },
  {
    prop: "side",
    type: '"left" | "right" | "top" | "bottom"',
    defaultValue: '"right"',
    description: "On DrawerContent, sets the slide-in edge and layout.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto DrawerContent and layout sections.",
  },
];

const shoppingFilterCode = `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function ShopFilters() {
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
                <Label htmlFor="shop-in-stock">In stock only</Label>
                <Switch id="shop-in-stock" defaultChecked />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="shop-free-ship">Free shipping</Label>
                <Switch id="shop-free-ship" />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Brand</p>
              <div className="flex items-center gap-2">
                <Checkbox id="brand-nike" defaultChecked />
                <Label htmlFor="brand-nike">Nike</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="brand-adidas" defaultChecked />
                <Label htmlFor="brand-adidas">Adidas</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="brand-hoka" />
                <Label htmlFor="brand-hoka">Hoka</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="brand-on" />
                <Label htmlFor="brand-on">On Running</Label>
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
                    variant={size === "10" || size === "11" ? "default" : "outline"}
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
`;

const accountCode = `import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function AccountDrawer() {
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
            <Label htmlFor="drawer-name">Display name</Label>
            <Input id="drawer-name" defaultValue="Sarang Kumar" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="drawer-email">Email</Label>
            <Input
              id="drawer-email"
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
`;

const notificationCode = `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function NotificationDrawer() {
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
`;

function ShoppingFilterPreview() {
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

const examples: ComponentExample[] = [
  {
    id: "shop-filters",
    title: "Shopping filters",
    description:
      "A product listing opens a side panel for brand, size, price, and shipping.",
    preview: <ShoppingFilterPreview />,
    code: shoppingFilterCode,
  },
  {
    id: "account",
    title: "Account panel",
    description: "A left-side drawer for profile settings.",
    preview: (
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
    ),
    code: accountCode,
  },
  {
    id: "activity",
    title: "Order activity",
    description: "Shipment updates with a delivery preference toggle.",
    preview: (
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
    ),
    code: notificationCode,
  },
];

const inPractice: ComponentInPractice = {
  description:
    "A storefront product list keeps filters in a drawer so shoppers refine brand, size, and price without leaving the grid.",
  preview: <ShoppingFilterPreview />,
  code: { tsx: shoppingFilterCode, jsx: shoppingFilterCode },
};

export default async function DrawerPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/drawer/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Drawer"
      description="A panel that slides in from the edge of the screen."
      overview={
        <>
          <p>
            Drawer follows the same composition model as Dialog: pass one
            element to <code>DrawerTrigger</code>, then place content in{" "}
            <code>DrawerContent</code>. Use <code>side</code> to pick the edge.
            On phones the panel spans the full width up to <code>max-w-sm</code>
            ; on larger screens it caps at <code>sm:max-w-md</code>.
          </p>
          <p>
            Use drawers for shopping filters, account panels, and activity
            detail — not for short confirmations (prefer Dialog for those).
          </p>
        </>
      }
      install="vinyaas add drawer"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/drawer/index.tsx</code> and copy{" "}
          <code>drawer.css</code> beside it. The project needs <code>clsx</code>{" "}
          and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      inPractice={inPractice}
      api={api}
      accessibility={
        <ul className="list-disc pl-5">
          <li>
            The panel uses <code>role=&quot;dialog&quot;</code> and{" "}
            <code>aria-modal=&quot;true&quot;</code>.
          </li>
          <li>Escape closes the top-most drawer.</li>
          <li>
            Focus moves into the drawer and returns to the trigger on close.
          </li>
          <li>Background scrolling is locked while the drawer is open.</li>
        </ul>
      }
      source={source}
    >
      <ShoppingFilterPreview />
    </ComponentReference>
  );
}
