"use client";

import { Button } from "@/registry/new-york/ui/button";
import { Tooltip } from "@/registry/new-york/ui/tooltip";

export function BasicTooltip() {
  return (
    <Tooltip content="Saved locally">
      <Button type="button">Hint</Button>
    </Tooltip>
  );
}

export function KeyboardTooltip() {
  return (
    <Tooltip content="Saved locally">
      <Button type="button">Focus me</Button>
    </Tooltip>
  );
}

export function PositionTooltips() {
  return (
    <>
      <Tooltip content="Above the trigger" side="top">
        <Button type="button" variant="outline">
          Top
        </Button>
      </Tooltip>
      <Tooltip content="Below the trigger" side="bottom">
        <Button type="button" variant="outline">
          Bottom
        </Button>
      </Tooltip>
      <Tooltip content="Left of the trigger" side="left">
        <Button type="button" variant="outline">
          Left
        </Button>
      </Tooltip>
      <Tooltip content="Right of the trigger" side="right">
        <Button type="button" variant="outline">
          Right
        </Button>
      </Tooltip>
    </>
  );
}
