import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiRow } from "@/components/api-table";
import type {
  ComponentExample,
  ComponentInPractice,
} from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

import {
  BasicAlertDialogDemo,
  ControlledAlertDialogDemo,
  DashboardAlertDialogDemo,
  DestructiveAlertDialogDemo,
  InPracticeAlertDialogDemo,
} from "./alert-dialog-demos";

export const metadata: Metadata = componentPageMetadata("alert-dialog");

const usage = `import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

export function DeleteProjectDialog() {
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
`;

const api: ApiRow[] = [
  {
    prop: "open",
    type: "boolean",
    description: "Controlled open state.",
  },
  {
    prop: "defaultOpen",
    type: "boolean",
    defaultValue: "false",
    description: "Opens the dialog on first render when it is uncontrolled.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    description: "Called when the dialog opens or closes.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged onto the part with cn.",
  },
  {
    prop: "variant",
    type: 'ButtonProps["variant"]',
    description:
      "Available on AlertDialogAction and AlertDialogCancel. Cancel defaults to outline.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "A simple confirmation with Cancel and Continue.",
    preview: <BasicAlertDialogDemo />,
    code: `import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

export function BasicAlertDialog() {
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
`,
  },
  {
    id: "destructive",
    title: "Destructive action",
    description:
      "Use the destructive button variant when the confirm action is irreversible.",
    preview: <DestructiveAlertDialogDemo />,
    code: `import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

export function DestructiveAlertDialog() {
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
`,
  },
  {
    id: "controlled",
    title: "Controlled",
    description: "Drive open state from the parent when needed.",
    preview: <ControlledAlertDialogDemo />,
    code: `import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ControlledAlertDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
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
    </>
  );
}
`,
  },
  {
    id: "dashboard",
    title: "Projects table",
    description:
      "A dashboard row action that opens a destructive confirmation before deleting. Tight layouts use an icon trigger.",
    preview: <DashboardAlertDialogDemo />,
    code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ProjectsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Vinyaas</TableCell>
              <TableCell>Sarang</TableCell>
              <TableCell>
                <Badge variant="secondary">Active</Badge>
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      className="sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3"
                      aria-label="Delete Vinyaas"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="size-4 sm:hidden"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Vinyaas?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This removes the project and its deployments. This
                        action cannot be undone.
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
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
`,
  },
];

const inPracticeCode = `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

export function DeleteProjectRow() {
  return (
    <div className="border-border flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">vinyaas-web</p>
        <p className="text-muted-foreground text-xs">Production · us-east-1</p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button
            variant="destructive"
            size="icon-sm"
            className="sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3"
            aria-label="Delete vinyaas-web"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4 sm:hidden"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
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
`;

const inPractice: ComponentInPractice = {
  description:
    "A project row keeps the destructive action behind a confirmation. In tight layouts the trigger collapses to an icon; Cancel stays available and the badge names what will be removed.",
  preview: <InPracticeAlertDialogDemo />,
  code: { tsx: inPracticeCode, jsx: inPracticeCode },
};

export default async function AlertDialogPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/alert-dialog/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Alert Dialog"
      description="A modal confirmation for important or potentially destructive actions."
      overview={
        <>
          Alert Dialog is for irreversible confirmations—delete, discard, reset.
          Prefer Dialog when the surface needs a form or multi-step task.
        </>
      }
      install="vinyaas add alert-dialog"
      usage={usage}
      api={api}
      examples={examples}
      inPractice={inPractice}
      accessibility={
        <ul className="list-disc pl-5">
          <li>
            The panel is <code>role=&quot;alertdialog&quot;</code> and{" "}
            <code>aria-modal=&quot;true&quot;</code>, with title and description
            wired through <code>aria-labelledby</code> and{" "}
            <code>aria-describedby</code>.
          </li>
          <li>
            Focus moves to Cancel when the dialog opens; Tab cycles inside the
            panel.
          </li>
          <li>
            Escape cancels and returns focus to the trigger. Overlay clicks do
            not dismiss.
          </li>
          <li>
            Cancel and Action are keyboard-accessible buttons with clear
            focus-visible styles. Icon-only triggers need an accessible name.
          </li>
        </ul>
      }
      source={source}
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/alert-dialog/index.tsx</code> with{" "}
          <code>alert-dialog.css</code>. It depends on <code>button</code>.
        </p>
      }
    >
      <DestructiveAlertDialogDemo />
    </ComponentReference>
  );
}
