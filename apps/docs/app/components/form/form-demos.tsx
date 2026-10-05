"use client";

import { useState } from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york/ui/alert";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
} from "@/registry/new-york/ui/combobox";
import { DatePicker } from "@/registry/new-york/ui/date-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select";
import { Separator } from "@/registry/new-york/ui/separator";
import { Switch } from "@/registry/new-york/ui/switch";
import { Textarea } from "@/registry/new-york/ui/textarea";

const preferenceRowClassName =
  "border-border bg-muted/40 flex flex-row items-start gap-3 rounded-md border p-3";

const preferenceSwitchRowClassName =
  "border-border bg-muted/40 flex flex-row items-center justify-between gap-4 rounded-md border p-3";

export function BasicFormDemo() {
  return (
    <Card className="border-border w-full max-w-md">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update the name and email on your public account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <FormField name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Ada Lovelace" autoComplete="name" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="ada@example.com"
                  autoComplete="email"
                />
              </FormControl>
              <FormDescription>
                We will use this email for account notifications.
              </FormDescription>
            </FormItem>
          </FormField>
          <div className="flex justify-end pt-1">
            <Button type="submit">Save changes</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

export function SettingsFormDemo() {
  return (
    <Card className="border-border w-full max-w-md">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Control how your workspace looks and what you hear about.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <FormField name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input defaultValue="ada" autoComplete="username" />
              </FormControl>
              <FormDescription>
                Your public handle across the workspace.
              </FormDescription>
            </FormItem>
          </FormField>
          <FormField name="theme">
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select defaultValue="system">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>
          <Separator />
          <FormField name="updates">
            <FormItem className={preferenceRowClassName}>
              <FormControl>
                <Checkbox defaultChecked className="mt-0.5" />
              </FormControl>
              <div className="grid min-w-0 gap-1.5">
                <FormLabel className="leading-none">Product updates</FormLabel>
                <FormDescription>
                  Email me about new components and release notes.
                </FormDescription>
              </div>
            </FormItem>
          </FormField>
          <FormField name="mentions">
            <FormItem className={preferenceSwitchRowClassName}>
              <div className="grid min-w-0 gap-1">
                <FormLabel>Desktop mentions</FormLabel>
                <FormDescription>
                  Show a system notification when someone @mentions you.
                </FormDescription>
              </div>
              <FormControl>
                <Switch defaultChecked />
              </FormControl>
            </FormItem>
          </FormField>
          <div className="flex justify-end pt-1">
            <Button type="submit">Update preferences</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

export function ValidationFormDemo() {
  const [submitted, setSubmitted] = useState(true);
  const [email, setEmail] = useState("");
  const [workspace, setWorkspace] = useState("");

  const emailError =
    submitted && !email.trim()
      ? "Enter a work email to continue."
      : submitted && !email.includes("@")
        ? "Enter a valid email address."
        : undefined;
  const workspaceError =
    submitted && !workspace.trim()
      ? "Workspace name is required."
      : submitted && workspace.trim().length < 3
        ? "Use at least 3 characters."
        : undefined;

  return (
    <Card className="border-border w-full max-w-md">
      <CardHeader>
        <CardTitle>Create workspace</CardTitle>
        <CardDescription>
          Required fields show destructive labels and messages when invalid.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <FormField name="email" error={emailError}>
            <FormItem>
              <FormLabel>Work email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="workspace" error={workspaceError}>
            <FormItem>
              <FormLabel>Workspace</FormLabel>
              <FormControl>
                <Input
                  value={workspace}
                  onChange={(event) => setWorkspace(event.target.value)}
                  placeholder="vinyaas"
                />
              </FormControl>
              <FormDescription>
                Shown on invoices and invite links.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="text-muted-foreground text-xs">
              Submit again after fixing the fields.
            </p>
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

export function DisabledFormDemo() {
  return (
    <Card className="border-border w-full max-w-md">
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>
          These fields are managed by your organization administrator.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form>
          <FormField name="org" disabled>
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Input defaultValue="Vinyaas Labs" />
              </FormControl>
              <FormDescription>
                Contact billing to rename the organization.
              </FormDescription>
            </FormItem>
          </FormField>
          <FormField name="plan" disabled>
            <FormItem>
              <FormLabel>Plan</FormLabel>
              <Select defaultValue="pro" disabled>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>
          <FormField name="seats" disabled>
            <FormItem>
              <FormLabel>Seats</FormLabel>
              <FormControl>
                <Input defaultValue="24" inputMode="numeric" />
              </FormControl>
            </FormItem>
          </FormField>
        </Form>
      </CardContent>
    </Card>
  );
}

export function DashboardFiltersFormDemo() {
  return (
    <Card className="border-border w-full max-w-lg">
      <CardHeader className="pb-3">
        <CardTitle>Issue filters</CardTitle>
        <CardDescription>
          Combobox, Select, and Date Picker share the same field structure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField name="project">
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Combobox defaultValue="docs">
                  <FormControl>
                    <ComboboxTrigger placeholder="Select project" />
                  </FormControl>
                  <ComboboxContent searchPlaceholder="Search projects…">
                    <ComboboxItem value="docs">Documentation</ComboboxItem>
                    <ComboboxItem value="dashboard">Dashboard</ComboboxItem>
                    <ComboboxItem value="billing">Billing</ComboboxItem>
                  </ComboboxContent>
                </Combobox>
              </FormItem>
            </FormField>
            <FormField name="status">
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select defaultValue="open">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </FormField>
          </div>
          <FormField name="range">
            <FormItem>
              <FormLabel>Created after</FormLabel>
              <FormControl>
                <DatePicker
                  defaultValue={new Date(2026, 2, 1)}
                  placeholder="Pick a date"
                />
              </FormControl>
              <FormDescription>
                Inclusive — issues created on this day are included.
              </FormDescription>
            </FormItem>
          </FormField>
          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <Button type="reset" variant="ghost">
              Reset
            </Button>
            <Button type="submit">Apply filters</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" strokeLinecap="round" />
      <path d="M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}

export function WorkspaceSettingsInPracticeDemo() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("Vinyaas Design System");
  const [slug, setSlug] = useState("vinyaas");

  const nameError =
    submitted && !name.trim() ? "Workspace name is required." : undefined;
  const slugError =
    submitted && !/^[a-z0-9-]{3,}$/.test(slug)
      ? "Use lowercase letters, numbers, and hyphens (min 3)."
      : undefined;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Alert>
        <InfoIcon />
        <AlertTitle>SSO sync is pending</AlertTitle>
        <AlertDescription>
          Directory members will appear here after the identity provider
          finishes provisioning. You can still edit workspace details below.
        </AlertDescription>
      </Alert>

      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid min-w-0 gap-1">
              <CardTitle>Workspace settings</CardTitle>
              <CardDescription>
                Identity, visibility, ownership, and notification defaults for
                this workspace.
              </CardDescription>
            </div>
            <Badge variant="secondary">Pro</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Form
            id="workspace-settings-form"
            className="gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="border-border bg-muted/30 flex flex-col gap-4 rounded-md border p-4 sm:flex-row sm:items-center">
              <Avatar className="size-12">
                <AvatarFallback>VL</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 gap-1">
                <p className="text-sm font-medium">Vinyaas Labs</p>
                <p className="text-muted-foreground text-sm">
                  billing@vinyaas.dev · 24 seats
                </p>
              </div>
              <Button type="button" variant="outline" size="sm">
                Change logo
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField name="workspace-name" error={nameError}>
                <FormItem>
                  <FormLabel>Workspace name</FormLabel>
                  <FormControl>
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="slug" error={slugError}>
                <FormItem>
                  <FormLabel>URL slug</FormLabel>
                  <FormControl>
                    <Input
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      spellCheck={false}
                    />
                  </FormControl>
                  <FormDescription>
                    vinyaas.dev/
                    <span className="text-foreground">{slug || "…"}</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField name="owner">
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <Combobox defaultValue="ada">
                    <FormControl>
                      <ComboboxTrigger placeholder="Select owner" />
                    </FormControl>
                    <ComboboxContent searchPlaceholder="Search people…">
                      <ComboboxItem value="ada">Ada Lovelace</ComboboxItem>
                      <ComboboxItem value="grace">Grace Hopper</ComboboxItem>
                      <ComboboxItem value="alan">Alan Turing</ComboboxItem>
                    </ComboboxContent>
                  </Combobox>
                </FormItem>
              </FormField>
              <FormField name="region">
                <FormItem>
                  <FormLabel>Data region</FormLabel>
                  <Select defaultValue="us-east">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="us-east">US East</SelectItem>
                      <SelectItem value="eu-west">EU West</SelectItem>
                      <SelectItem value="ap-south">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField name="launch">
                <FormItem>
                  <FormLabel>Launch date</FormLabel>
                  <FormControl>
                    <DatePicker
                      defaultValue={new Date(2026, 3, 12)}
                      placeholder="Pick a date"
                    />
                  </FormControl>
                  <FormDescription>
                    Used for billing milestones and changelog cutoffs.
                  </FormDescription>
                </FormItem>
              </FormField>
              <FormField name="visibility">
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue="private"
                      className="border-border bg-muted/30 gap-3 rounded-md border p-3"
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          value="private"
                          id="visibility-private"
                          className="mt-0.5"
                        />
                        <div className="grid gap-1">
                          <Label htmlFor="visibility-private">Private</Label>
                          <p className="text-muted-foreground text-sm leading-5">
                            Only invited members can discover projects.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          value="public"
                          id="visibility-public"
                          className="mt-0.5"
                        />
                        <div className="grid gap-1">
                          <Label htmlFor="visibility-public">Public</Label>
                          <p className="text-muted-foreground text-sm leading-5">
                            Anyone with the link can view published docs.
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              </FormField>
            </div>

            <FormField name="summary">
              <FormItem>
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    defaultValue="Component library and design tokens for product teams."
                  />
                </FormControl>
                <FormDescription>
                  Shown on the organization directory and invite emails.
                </FormDescription>
              </FormItem>
            </FormField>

            <Separator />

            <div className="grid gap-3">
              <div>
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-muted-foreground text-sm">
                  Defaults for new members joining this workspace.
                </p>
              </div>
              <FormField name="security-alerts">
                <FormItem className={preferenceRowClassName}>
                  <FormControl>
                    <Checkbox defaultChecked className="mt-0.5" />
                  </FormControl>
                  <div className="grid min-w-0 gap-1.5">
                    <FormLabel className="leading-none">
                      Security alerts
                    </FormLabel>
                    <FormDescription>
                      Email owners when API keys are created or revoked.
                    </FormDescription>
                  </div>
                </FormItem>
              </FormField>
              <FormField name="weekly-digest">
                <FormItem className={preferenceSwitchRowClassName}>
                  <div className="grid min-w-0 gap-1">
                    <FormLabel>Weekly digest</FormLabel>
                    <FormDescription>
                      Monday summary of deploys, reviews, and empty queues.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch defaultChecked />
                  </FormControl>
                </FormItem>
              </FormField>
            </div>

            <Separator />

            <FormField name="invite">
              <FormItem>
                <FormLabel>Invite teammate</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="priya@company.com"
                    autoComplete="off"
                  />
                </FormControl>
                <FormDescription>
                  Sends a Pro seat invite. Billing updates on acceptance.
                </FormDescription>
              </FormItem>
            </FormField>
          </Form>
        </CardContent>
        <CardFooter className="border-border justify-between gap-3 border-t pt-4">
          <Button type="button" variant="ghost">
            Discard
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline">
              Invite later
            </Button>
            <Button type="submit" form="workspace-settings-form">
              Save workspace
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
