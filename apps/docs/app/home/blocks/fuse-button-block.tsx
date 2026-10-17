"use client";

import { useState } from "react";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { FuseButton } from "@/registry/new-york/ui/fuse-button";

/**
 * Project settings danger zone — the use case the fuse exists for: the burn
 * is the undo window on an irreversible action, so the card shows what is
 * about to be destroyed and what happens once it fires.
 */
export function FuseButtonBlock() {
  const [burning, setBurning] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <PlayBlock
      title="Danger zone"
      description="Deleting is permanent. The fuse burns for five seconds, so a misclick can still be taken back."
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">acme-web</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Production · 14 deploys this week
          </p>
        </div>
        <Badge variant={deleted ? "destructive" : "secondary"}>
          {deleted ? "Deleted" : "Live"}
        </Badge>
      </div>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground min-w-0 flex-1 text-sm">
          {deleted
            ? "Domains released. Backups are kept for 30 days."
            : burning
              ? "Press again to keep the project."
              : "Removes the project, its domains, and every build log."}
        </p>
        {deleted ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setDeleted(false)}
          >
            Restore
          </Button>
        ) : (
          <FuseButton
            variant="destructive"
            size="sm"
            active={burning}
            undoLabel="Undo"
            onActivate={() => setBurning(true)}
            onFire={() => {
              setBurning(false);
              setDeleted(true);
            }}
            onUndo={() => setBurning(false)}
          >
            Delete project
          </FuseButton>
        )}
      </div>
    </PlayBlock>
  );
}
