"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/new-york/ui/alert-dialog";

/**
 * Compact destructive confirmation for the homepage showcase.
 */
export function AlertDialogBlock() {
  return (
    <PlayBlock
      title="Alert Dialog"
      description="Confirm a destructive dashboard action before it runs."
    >
      <div className="border-border flex items-center justify-between gap-3 rounded-lg border p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">vinyaas-web</p>
          <p className="text-muted-foreground text-xs">
            Production · us-east-1
          </p>
        </div>
        <Badge variant="outline">Active</Badge>
      </div>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button type="button" variant="destructive" size="sm">
            Delete project
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete vinyaas-web?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the project and its deployments. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PlayBlock>
  );
}
