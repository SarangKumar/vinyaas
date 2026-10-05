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

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

/**
 * Compact destructive confirmation for the homepage showcase.
 * Uses an icon trigger when the card is narrow; expands to a label on sm+.
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
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="outline">Active</Badge>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                className="sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3"
                aria-label="Delete vinyaas-web"
              >
                <span className="sm:hidden">
                  <TrashIcon />
                </span>
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete vinyaas-web?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes the project and its deployments. This action
                  cannot be undone.
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
        </div>
      </div>
    </PlayBlock>
  );
}
