"use client";

import type { ControlValues } from "@/components/component-demo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/new-york/ui/accordion";

function AccordionItems() {
  return (
    <>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Vinyaas?</AccordionTrigger>
        <AccordionContent>
          Vinyaas copies each component into your project as source so you own
          every line of code.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it customizable?</AccordionTrigger>
        <AccordionContent>
          Yes. Every component is plain source code in your repo — edit it
          freely.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How do I install it?</AccordionTrigger>
        <AccordionContent>
          Run <code>vinyaas init</code>, then{" "}
          <code>vinyaas add &lt;component&gt;</code> for each component you
          need.
        </AccordionContent>
      </AccordionItem>
    </>
  );
}

export function AccordionPreview({ values }: { values: ControlValues }) {
  const type = (values.type as "single" | "multiple") || "single";
  const common = {
    disabled: values.disabled as boolean,
    className: "w-full max-w-md text-left",
  } as const;

  if (type === "multiple") {
    return (
      <Accordion
        key="multiple"
        type="multiple"
        defaultValue={["item-1"]}
        {...common}
      >
        <AccordionItems />
      </Accordion>
    );
  }
  return (
    <Accordion
      key={`single-${values.collapsible}`}
      type="single"
      collapsible={values.collapsible as boolean}
      defaultValue="item-1"
      {...common}
    >
      <AccordionItems />
    </Accordion>
  );
}
