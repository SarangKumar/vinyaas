"use client";

import { useState } from "react";
import type { ControlValues } from "@/components/component-demo";
import { Button } from "@/registry/new-york/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  type DrawerContentProps,
} from "@/registry/new-york/ui/drawer";

export function DrawerPreview({ values }: { values: ControlValues }) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Button type="button" variant="outline">
          Open drawer
        </Button>
      </DrawerTrigger>
      <DrawerContent side={values.side as DrawerContentProps["side"]}>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>
            This drawer slides in from the {(values.side as string) || "right"}.
          </DrawerDescription>
        </DrawerHeader>
        <div className="text-muted-foreground px-4 py-2 text-sm">
          Drawer content goes here.
        </div>
        <DrawerFooter>
          <Button type="button" onClick={() => setOpen(false)}>
            Done
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
