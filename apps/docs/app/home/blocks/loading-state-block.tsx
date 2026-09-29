"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button";
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/registry/new-york/ui/marker";
import { Separator } from "@/registry/new-york/ui/separator";
import { Skeleton } from "@/registry/new-york/ui/skeleton";
import { Spinner } from "@/registry/new-york/ui/spinner";

export function LoadingStateBlock() {
  const [loading, setLoading] = useState(true);

  return (
    <PlayBlock
      title="Report preview"
      description="Skeleton and spinner while content loads."
    >
      <Marker role="status">
        <MarkerIcon>
          {loading ? (
            <Spinner label="" />
          ) : (
            <span className="bg-foreground size-1.5 rounded-full" />
          )}
        </MarkerIcon>
        <MarkerContent>
          {loading ? "Generating preview…" : "Preview ready"}
        </MarkerContent>
      </Marker>
      <Separator />
      <div className="flex min-w-0 items-center justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setLoading((current) => !current)}
        >
          {loading ? "Finish" : "Reload"}
        </Button>
      </div>
      {loading ? (
        <div className="grid min-w-0 gap-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-2 h-28 w-full" />
        </div>
      ) : (
        <div className="border-border bg-muted/40 grid min-w-0 gap-2 rounded-md border p-4">
          <p className="text-sm font-medium">Workspace summary</p>
          <p className="text-muted-foreground text-sm leading-6">
            1,284 signups this month. Peak day Wednesday with 148 new accounts.
          </p>
        </div>
      )}
    </PlayBlock>
  );
}
