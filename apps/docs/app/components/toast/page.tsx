import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  ActionToastDemo,
  DefaultToastDemo,
  ErrorToastDemo,
  InfoToastDemo,
  LoadingToastDemo,
  MultipleToastDemo,
  PromiseToastDemo,
  SuccessToastDemo,
  WarningToastDemo,
} from "./toast-demos";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("toast");

const usage = `import { Button } from "@/components/ui/button/button";
import { toast, Toaster } from "@/components/ui/toast/toast";

export function Notices() {
  return (
    <>
      <Toaster />
      <Button type="button" onClick={() => toast.add({ title: "Note saved" })}>
        Save
      </Button>
    </>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "title",
    type: "string",
    description: "The toast heading.",
  },
  {
    prop: "description",
    type: "string",
    description: "Optional supporting text.",
  },
  {
    prop: "type",
    type: '"default" | "success" | "info" | "warning" | "error" | "loading"',
    defaultValue: '"default"',
    description:
      "Visual status. loading stays until it is updated or dismissed.",
  },
  {
    prop: "duration",
    type: "number",
    defaultValue: "5000",
    description: "Automatic dismissal in milliseconds. Hover pauses the timer.",
  },
  {
    prop: "actionProps",
    type: "{ children, onClick }",
    description: "An action button. It does not dismiss the toast by itself.",
  },
  {
    prop: "position",
    type: "ToastPosition",
    defaultValue: '"bottom-right"',
    description: "Placement of the Toaster. One position applies to the stack.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "default",
    title: "Default",
    description: "toast.add creates a toast. Render Toaster once.",
    preview: <DefaultToastDemo />,
    code: `toast.add({ title: "Note saved" })`,
  },
  {
    id: "success",
    title: "Success",
    description:
      "A successful save uses the success status, an icon, and a description.",
    preview: <SuccessToastDemo />,
    code: `import { Button } from "@/components/ui/button/button";
import { toast } from "@/components/ui/toast/toast";

export function SaveProfile() {
  return (
    <Button
      type="button"
      onClick={() =>
        toast.add({
          title: "Changes saved",
          description: "The profile is up to date.",
          type: "success",
        })
      }
    >
      Save profile
    </Button>
  );
}
`,
  },
  {
    id: "info",
    title: "Info",
    description: "Info uses the muted surface.",
    preview: <InfoToastDemo />,
    code: `toast.add({ title: "Draft stored", type: "info" })`,
  },
  {
    id: "warning",
    title: "Warning",
    description: "Warning keeps the default surface and a stronger border.",
    preview: <WarningToastDemo />,
    code: `toast.add({ title: "Unsaved changes", type: "warning" })`,
  },
  {
    id: "error",
    title: "Error",
    description: "An error toast is an alert with a destructive treatment.",
    preview: <ErrorToastDemo />,
    code: `import { Button } from "@/components/ui/button/button";
import { toast } from "@/components/ui/toast/toast";

export function SaveAndFail() {
  return (
    <Button
      type="button"
      variant="destructive"
      onClick={() =>
        toast.add({
          title: "Could not save",
          description: "Check the connection and try again.",
          type: "error",
        })
      }
    >
      Save and fail
    </Button>
  );
}
`,
  },
  {
    id: "loading",
    title: "Loading",
    description:
      "A loading toast stays until update, dismiss, or a settled promise.",
    preview: <LoadingToastDemo />,
    code: `toast.add({ title: "Uploading", type: "loading" })`,
  },
  {
    id: "action",
    title: "Action",
    description: "An action button stays in the toast so the user can undo.",
    preview: <ActionToastDemo />,
    code: `import { Button } from "@/components/ui/button/button";
import { toast } from "@/components/ui/toast/toast";

export function DeleteFile() {
  return (
    <Button
      type="button"
      onClick={() =>
        toast.add({
          title: "File deleted",
          description: "notes.md was removed.",
          actionProps: {
            children: "Undo",
            onClick() {},
          },
        })
      }
    >
      Delete file
    </Button>
  );
}
`,
  },
  {
    id: "promise",
    title: "Promise",
    description:
      "toast.promise starts as loading and becomes success or error.",
    preview: <PromiseToastDemo />,
    code: `toast.promise(save(), {
  loading: { title: "Saving" },
  success: { title: "Saved" },
  error: { title: "Could not save" },
})`,
  },
  {
    id: "multiple",
    title: "Multiple",
    description: "Toasts stack. The newest sits nearest the screen edge.",
    preview: <MultipleToastDemo />,
    code: `toast.add({ title: "First" })
toast.add({ title: "Second", type: "info" })`,
  },
];

export default async function ToastPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/toast/toast.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Toast"
      description="A temporary notice."
      overview={
        <>
          <p>
            Render <code>Toaster</code> once, near the root of the page. Call{" "}
            <code>toast.add</code> from an event. Toasts stack in the chosen
            corner, fade in, and dismiss themselves after a duration. Each toast
            shows a status icon, a title, and an optional description.
          </p>
          <p>
            Swipe dismissal is not implemented. Hover pauses the timer. Escape
            dismisses the toast when focus is inside it. A toast does not take
            focus when it appears.
          </p>
        </>
      }
      install="vinyaas add toast"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/toast/toast.tsx</code>. It imports <code>cn</code>{" "}
          from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>. Mount{" "}
          <code>Toaster</code> yourself.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>
            Default, success, info, warning, and loading toasts use{" "}
            <code>role=&quot;status&quot;</code>. An error uses{" "}
            <code>role=&quot;alert&quot;</code>. A loading toast sets{" "}
            <code>aria-busy</code>.
          </p>
          <ul className="list-disc pl-5">
            <li>The dismiss control is a button named Dismiss.</li>
            <li>An action is a button and stays in tab order.</li>
            <li>Appearance does not move focus.</li>
          </ul>
        </>
      }
      source={source}
    >
      <DefaultToastDemo />
    </ComponentReference>
  );
}
