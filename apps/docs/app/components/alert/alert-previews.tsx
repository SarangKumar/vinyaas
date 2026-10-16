"use client";
import type { ControlValues } from "@/components/component-demo";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york/ui/alert";
export function AlertPreview({ values }: { values: ControlValues }) {
  return (
    <Alert
      variant={values.variant as "default" | "destructive"}
      className="max-w-md text-left"
    >
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  );
}
