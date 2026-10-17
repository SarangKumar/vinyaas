// @vitest-environment node
/**
 * Overlay content portals into `document.body`. With `defaultOpen` it renders
 * on the first pass, which on a prerendered page happens on the server — where
 * there is no document. Each of these crashed a `next build` before the guard.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const cases = [
  [
    "HoverCard",
    <HoverCard defaultOpen key="hover-card">
      <HoverCardTrigger>
        <span>@johndoe</span>
      </HoverCardTrigger>
      <HoverCardContent>John Doe</HoverCardContent>
    </HoverCard>,
  ],
  [
    "Popover",
    <Popover defaultOpen key="popover">
      <PopoverTrigger>
        <button type="button">Open</button>
      </PopoverTrigger>
      <PopoverContent>Panel</PopoverContent>
    </Popover>,
  ],
  [
    "DropdownMenu",
    <DropdownMenu defaultOpen key="dropdown-menu">
      <DropdownMenuTrigger>
        <button type="button">Open</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  ],
  [
    "Select",
    <Select defaultOpen key="select">
      <SelectTrigger>
        <SelectValue placeholder="Pick one" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="one">One</SelectItem>
      </SelectContent>
    </Select>,
  ],
] as const;

describe("server rendering overlays with defaultOpen", () => {
  it("has no document to portal into", () => {
    expect(typeof document).toBe("undefined");
  });

  for (const [name, element] of cases) {
    it(`renders ${name} without reaching for document`, () => {
      expect(() => renderToStaticMarkup(element)).not.toThrow();
    });
  }
});
