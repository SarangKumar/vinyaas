"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
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
import { Label } from "@/registry/new-york/ui/label";
import { RangeSlider } from "@/registry/new-york/ui/slider";
import { Separator } from "@/registry/new-york/ui/separator";
import { Switch } from "@/registry/new-york/ui/switch";

export function FilterBlock() {
  const [price, setPrice] = useState<[number, number]>([80, 220]);

  return (
    <PlayBlock
      title="Storefront"
      description="Filter a product grid without leaving the listing."
    >
      <div className="border-border flex items-center justify-between gap-3 rounded-xl border p-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Trail runners</p>
          <p className="text-muted-foreground text-xs">
            186 results · $80–$220
          </p>
        </div>
        <Drawer>
          <DrawerTrigger>
            <Button type="button" variant="outline" size="sm">
              Filters
              <Badge variant="secondary" className="ml-1.5">
                3
              </Badge>
            </Button>
          </DrawerTrigger>
          <DrawerContent side="right" className="gap-0 p-0">
            <DrawerHeader className="border-border border-b px-6 py-4">
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>
                Price, brand, availability, and shipping.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-5 px-6 py-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>Price</Label>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    ${price[0]} – ${price[1]}
                  </span>
                </div>
                <RangeSlider
                  min={40}
                  max={320}
                  step={10}
                  value={price}
                  onValueChange={setPrice}
                  aria-label="Price"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="play-filter-stock">In stock</Label>
                <Switch id="play-filter-stock" defaultChecked />
              </div>
              <Separator />
              <div className="flex flex-col gap-2.5">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Brand
                </p>
                <div className="flex items-center gap-2">
                  <Checkbox id="play-brand-a" defaultChecked />
                  <Label htmlFor="play-brand-a">Salomon</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="play-brand-b" defaultChecked />
                  <Label htmlFor="play-brand-b">Brooks</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="play-brand-c" />
                  <Label htmlFor="play-brand-c">Altra</Label>
                </div>
              </div>
            </div>
            <DrawerFooter className="border-border border-t px-6 py-4">
              <DrawerClose>
                <Button type="button" variant="outline" size="sm">
                  Clear
                </Button>
              </DrawerClose>
              <Button type="button" size="sm">
                Apply
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { name: "Speedcross 6", price: "$140" },
          { name: "Ghost 16", price: "$140" },
          { name: "Lone Peak 8", price: "$155" },
          { name: "Aero Glide 2", price: "$160" },
        ].map((item) => (
          <div
            key={item.name}
            className="border-border bg-muted/30 flex flex-col gap-1 rounded-xl border p-3"
          >
            <div className="bg-secondary/80 mb-1 aspect-[4/3] rounded-lg" />
            <p className="truncate text-xs font-medium">{item.name}</p>
            <p className="text-muted-foreground text-xs">{item.price}</p>
          </div>
        ))}
      </div>
    </PlayBlock>
  );
}
