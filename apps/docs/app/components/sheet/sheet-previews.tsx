"use client";

import { useState } from "react";
import type { ControlValues } from "@/components/component-demo";
import { Button } from "@/registry/new-york/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetSide,
} from "@/registry/new-york/ui/sheet";

export function SheetPreview({ values }: { values: ControlValues }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button type="button" variant="outline">
          Open sheet
        </Button>
      </SheetTrigger>
      <SheetContent
        side={values.side as SheetSide}
        showCloseButton={values.showCloseButton as boolean}
      >
        <SheetHeader>
          <SheetTitle>Sheet title</SheetTitle>
          <SheetDescription>
            This sheet slides in from the {(values.side as string) || "right"}.
          </SheetDescription>
        </SheetHeader>
        <div className="text-muted-foreground px-6 py-4 text-sm">
          Sheet content goes here.
        </div>
        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
