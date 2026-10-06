"use client";

import { useState } from "react";

import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table";

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? "size-4"}
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

export function BasicAlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline">Show dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Confirm to continue. You can cancel if you changed your mind.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DestructiveAlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            project and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ControlledAlertDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open controlled
      </Button>
      <Badge variant="secondary">{open ? "Open" : "Closed"}</Badge>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Your edits will be lost if you leave this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction variant="destructive">Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const projects = [
  { id: "1", name: "Vinyaas", owner: "Sarang", status: "Active" },
  { id: "2", name: "Dashboard", owner: "Priya", status: "Review" },
  { id: "3", name: "Mobile App", owner: "Rahul", status: "Draft" },
] as const;

export function DashboardAlertDialogDemo() {
  const [deleted, setDeleted] = useState<string | null>(null);

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Projects</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects
                .filter((project) => project.id !== deleted)
                .map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell>{project.owner}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === "Active" ? "secondary" : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon-sm"
                            className="sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3"
                            aria-label={`Delete ${project.name}`}
                          >
                            <TrashIcon className="size-4 sm:hidden" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete {project.name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This removes the project and its deployments. This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <Badge variant="destructive">{project.name}</Badge>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => setDeleted(project.id)}
                            >
                              Delete project
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function InPracticeAlertDialogDemo() {
  return (
    <div className="border-border flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border p-3 text-left">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">vinyaas-web</p>
        <p className="text-muted-foreground text-xs">Production · us-east-1</p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            className="sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3"
            aria-label="Delete vinyaas-web"
          >
            <TrashIcon className="size-4 sm:hidden" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the project and its deployments. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Badge variant="destructive">vinyaas-web</Badge>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
