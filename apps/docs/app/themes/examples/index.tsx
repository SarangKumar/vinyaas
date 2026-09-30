"use client";

import type { ReactNode } from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york/ui/alert";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/new-york/ui/chart";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { Input } from "@/registry/new-york/ui/input";
import { Kbd } from "@/registry/new-york/ui/kbd";
import { Label } from "@/registry/new-york/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york/ui/native-select";
import { Progress } from "@/registry/new-york/ui/progress";
import { Separator } from "@/registry/new-york/ui/separator";
import { Switch } from "@/registry/new-york/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { Tooltip } from "@/registry/new-york/ui/tooltip";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

export type ThemeExample = {
  id: string;
  title: string;
  description?: string;
  preview: ReactNode;
};

const installTrend = [
  { week: "W1", installs: 120 },
  { week: "W2", installs: 168 },
  { week: "W3", installs: 154 },
  { week: "W4", installs: 210 },
  { week: "W5", installs: 198 },
  { week: "W6", installs: 246 },
];

const installConfig = {
  installs: { label: "Installs", color: "var(--primary)" },
} satisfies ChartConfig;

const registryHits = [
  { day: "Mon", hits: 42 },
  { day: "Tue", hits: 58 },
  { day: "Wed", hits: 51 },
  { day: "Thu", hits: 73 },
  { day: "Fri", hits: 66 },
  { day: "Sat", hits: 40 },
  { day: "Sun", hits: 35 },
];

const registryConfig = {
  hits: { label: "Hits", color: "var(--primary)" },
} satisfies ChartConfig;

/** Explicit height + min-w-0 keeps ResponsiveContainer inside the card. */
const chartFrame = "h-36 w-full min-w-0 max-w-full sm:h-40";

export const themeExamples: ThemeExample[] = [
  {
    id: "cli-installs",
    title: "CLI installs",
    description: "vinyaas add across the last six weeks.",
    preview: (
      <div className="grid min-w-0 gap-3">
        <div className="flex min-w-0 items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-2xl font-semibold tracking-tight tabular-nums">
              1,096
            </p>
            <p className="text-muted-foreground text-xs">
              +18% vs prior period
            </p>
          </div>
          <Badge variant="secondary">Registry</Badge>
        </div>
        <div className="min-w-0 overflow-hidden">
          <ChartContainer config={installConfig} className={chartFrame}>
            <LineChart data={installTrend} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="installs"
                type="monotone"
                stroke="var(--color-installs)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-installs)" }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    ),
  },
  {
    id: "registry-traffic",
    title: "Registry traffic",
    description: "Component JSON fetches this week.",
    preview: (
      <div className="grid min-w-0 gap-3">
        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          365
        </p>
        <p className="text-muted-foreground -mt-1 text-xs">Peak on Thursday</p>
        <div className="min-w-0 overflow-hidden">
          <ChartContainer config={registryConfig} className={chartFrame}>
            <BarChart data={registryHits} accessibilityLayer>
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="hits"
                fill="var(--color-hits)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    ),
  },
  {
    id: "workspace-access",
    title: "Workspace access",
    description: "Roles for people who ship the catalog.",
    preview: (
      <div className="grid gap-3">
        {[
          ["SK", "Sarang Kumar", "you@vinyaas.dev", "owner"],
          ["AL", "Ada Lovelace", "ada@engine.dev", "editor"],
          ["GH", "Grace Hopper", "grace@navy.dev", "viewer"],
        ].map(([initials, name, email, role]) => (
          <div key={email} className="flex min-w-0 items-center gap-2.5">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="text-[10px]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="text-muted-foreground truncate text-xs">{email}</p>
            </div>
            <NativeSelect
              aria-label={`${name} role`}
              defaultValue={role}
              className="w-23 shrink-0"
            >
              <NativeSelectOption value="owner">Owner</NativeSelectOption>
              <NativeSelectOption value="editor">Editor</NativeSelectOption>
              <NativeSelectOption value="viewer">Viewer</NativeSelectOption>
            </NativeSelect>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "privacy-toggles",
    title: "Docs privacy",
    description: "What analytics the playground may collect.",
    preview: (
      <div className="grid gap-4">
        {[
          {
            id: "priv-needed",
            title: "Essential",
            body: "Theme preference and package manager choice.",
            on: true,
          },
          {
            id: "priv-product",
            title: "Product analytics",
            body: "Anonymous which presets get tried most often.",
            on: false,
          },
          {
            id: "priv-error",
            title: "Error reporting",
            body: "Client exceptions from broken compositions.",
            on: true,
          },
        ].map((row) => (
          <div key={row.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">{row.title}</p>
              <p className="text-muted-foreground text-xs leading-5">
                {row.body}
              </p>
            </div>
            <Switch
              id={row.id}
              defaultChecked={row.on}
              aria-label={row.title}
              className="shrink-0"
            />
          </div>
        ))}
        <Button type="button" size="sm" className="w-full">
          Update privacy
        </Button>
      </div>
    ),
  },
  {
    id: "support-thread",
    title: "Support thread",
    description: "Init failed on a fresh Next app.",
    preview: (
      <div className="grid min-w-0 gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Dev from Lisbon</p>
            <p className="text-muted-foreground text-xs">#install-help</p>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="bg-muted max-w-[92%] rounded-lg px-3 py-2 text-sm">
            <code className="text-xs">vinyaas init</code> stops after writing{" "}
            <code className="text-xs">components.json</code>.
          </div>
          <div className="bg-primary text-primary-foreground ml-auto max-w-[92%] rounded-lg px-3 py-2 text-sm">
            Check Tailwind v4 PostCSS — we can paste the expected{" "}
            <code className="text-xs">@theme</code> block.
          </div>
        </div>
        <div className="flex min-w-0 gap-2">
          <Input
            aria-label="Reply"
            placeholder="Reply…"
            className="min-w-0 flex-1"
          />
          <Button type="button" size="sm" className="shrink-0">
            Send
          </Button>
        </div>
      </div>
    ),
  },
  {
    id: "create-workspace",
    title: "Create workspace",
    description: "Start a Vinyaas-backed design system repo.",
    preview: (
      <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
        <div className="xs:grid-cols-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" size="sm" className="w-full">
            GitHub
          </Button>
          <Button type="button" variant="outline" size="sm" className="w-full">
            Google
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-[0.65rem] tracking-wide uppercase">
            or
          </span>
          <Separator className="flex-1" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ws-name">Workspace name</Label>
          <Input id="ws-name" placeholder="northwind-ui" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ws-slug">Slug</Label>
          <Input id="ws-slug" placeholder="northwind" />
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="ws-public" />
          <Label htmlFor="ws-public" className="leading-5">
            Publish the registry index publicly
          </Label>
        </div>
        <Button type="submit" className="w-full">
          Create workspace
        </Button>
      </form>
    ),
  },
  {
    id: "ship-checklist",
    title: "Ship checklist",
    description: "Before tagging the docs release.",
    preview: (
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs">3 of 5 done</span>
          <Badge>v1.1</Badge>
        </div>
        <Progress aria-label="Ship progress" value={60} />
        <ul className="grid gap-2">
          {[
            ["ship-themes", "Themes playground scoped", true],
            ["ship-typeset", "Typeset Markdown examples", true],
            ["ship-seo", "Sitemap + metadata", true],
            ["ship-print", "Print from scroll position", false],
            ["ship-native", "NativeSelect overflow fix", false],
          ].map(([id, label, done]) => (
            <li key={id as string} className="flex items-start gap-2">
              <Checkbox
                id={id as string}
                defaultChecked={Boolean(done)}
                aria-label={label as string}
              />
              <Label htmlFor={id as string} className="leading-5">
                {label as string}
              </Label>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "component-table",
    title: "Hot components",
    description: "Most installed this week.",
    preview: (
      <div className="grid min-w-0 gap-3">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
          <Input
            aria-label="Filter components"
            placeholder="Filter…"
            className="min-w-0 flex-1"
          />
          <NativeSelect
            aria-label="Sort"
            defaultValue="installs"
            className="w-full sm:w-32"
          >
            <NativeSelectOption value="installs">Installs</NativeSelectOption>
            <NativeSelectOption value="name">Name</NativeSelectOption>
          </NativeSelect>
        </div>
        <div className="w-full min-w-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Adds</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Button", "Stable", "428"],
                ["Dialog", "Stable", "301"],
                ["Chart", "New", "186"],
                ["Drawer", "New", "142"],
              ].map(([name, status, adds]) => (
                <TableRow key={name}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>
                    <Badge variant={status === "New" ? "secondary" : "outline"}>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {adds}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: "release-channel",
    title: "Release channel",
    preview: (
      <Tabs defaultValue="stable">
        <TabsList className="w-full min-w-0">
          <TabsTrigger value="stable" className="flex-1">
            Stable
          </TabsTrigger>
          <TabsTrigger value="canary" className="flex-1">
            Canary
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stable" className="grid gap-3 pt-3">
          <Alert>
            <AlertTitle>v1.2.0 is current</AlertTitle>
            <AlertDescription>
              Themes and Typeset ship on the docs site — not as registry items.
            </AlertDescription>
          </Alert>
          <Button type="button" size="sm" variant="outline" className="w-fit">
            View changelog
          </Button>
        </TabsContent>
        <TabsContent value="canary" className="grid gap-3 pt-3">
          <p className="text-muted-foreground text-sm leading-6">
            Canary tracks unreleased playground polish. Toggle only on staging.
          </p>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="canary-opt">Opt into canary docs</Label>
            <Switch id="canary-opt" aria-label="Opt into canary docs" />
          </div>
        </TabsContent>
      </Tabs>
    ),
  },
  {
    id: "quick-jump",
    title: "Quick jump",
    preview: (
      <div className="grid min-w-0 gap-3">
        <div className="relative min-w-0">
          <Input
            aria-label="Jump to"
            placeholder="Jump to a page…"
            className="pr-14"
          />
          <span className="absolute top-1/2 right-2 -translate-y-1/2">
            <Kbd>⌘K</Kbd>
          </span>
        </div>
        <div className="grid gap-1">
          {[
            ["Themes playground", "Playground"],
            ["Typeset playground", "Playground"],
            ["vinyaas init", "CLI"],
            ["Chart docs", "Component"],
          ].map(([title, kind]) => (
            <button
              key={title}
              type="button"
              className="hover:bg-muted flex min-w-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm"
            >
              <span className="truncate">{title}</span>
              <Badge variant="outline" className="shrink-0">
                {kind}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "feedback",
    title: "Playground feedback",
    preview: (
      <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-1.5">
          <Label htmlFor="fb-area">Area</Label>
          <NativeSelect id="fb-area" defaultValue="themes">
            <NativeSelectOption value="themes">Themes</NativeSelectOption>
            <NativeSelectOption value="typeset">Typeset</NativeSelectOption>
            <NativeSelectOption value="print">Print / SEO</NativeSelectOption>
          </NativeSelect>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="fb-note">What felt off?</Label>
          <Textarea
            id="fb-note"
            rows={3}
            placeholder="Graphs overflowing, missing presets…"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm">
            Send feedback
          </Button>
          <Tooltip content="Opens GitHub discussions">
            <Button type="button" size="sm" variant="outline">
              Discuss
            </Button>
          </Tooltip>
        </div>
      </form>
    ),
  },
  {
    id: "token-diff",
    title: "Token diff",
    description: "Primary changed when Yellow is selected.",
    preview: (
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="border-border rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">Before</p>
            <p className="mt-1 truncate font-mono text-xs">oklch(0.21…)</p>
            <span className="bg-foreground mt-2 block h-8 rounded-md" />
          </div>
          <div className="border-border rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">After</p>
            <p className="mt-1 truncate font-mono text-xs">var(--primary)</p>
            <span className="bg-primary mt-2 block h-8 rounded-md" />
          </div>
        </div>
        <Alert>
          <AlertTitle>Scoped only</AlertTitle>
          <AlertDescription>
            Navbar and sidebar keep the site theme — only this playground
            subtree updates.
          </AlertDescription>
        </Alert>
      </div>
    ),
  },
  {
    id: "radius-lab",
    title: "Radius lab",
    description: "Same card under the selected radius token.",
    preview: (
      <div className="grid gap-3">
        <div className="border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border p-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">Preview surface</p>
            <p className="text-muted-foreground text-xs">
              Uses <code className="text-[0.7rem]">--radius</code>
            </p>
          </div>
          <Button type="button" size="sm">
            Action
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-[var(--radius)]">Badge</Badge>
          <Badge variant="outline" className="rounded-[var(--radius)]">
            Outline
          </Badge>
        </div>
      </div>
    ),
  },
  {
    id: "invite-editor",
    title: "Invite an editor",
    preview: (
      <div className="grid min-w-0 gap-3">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
          <Input
            aria-label="Email"
            type="email"
            placeholder="teammate@studio.dev"
            className="min-w-0 flex-1"
          />
          <NativeSelect
            aria-label="Role"
            defaultValue="editor"
            className="w-full sm:w-28"
          >
            <NativeSelectOption value="editor">Editor</NativeSelectOption>
            <NativeSelectOption value="viewer">Viewer</NativeSelectOption>
          </NativeSelect>
        </div>
        <Button type="button" size="sm" className="w-full sm:w-fit">
          Send invite
        </Button>
        <Separator />
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">You</p>
              <p className="text-muted-foreground text-xs">Full access</p>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0">
            Owner
          </Badge>
        </div>
      </div>
    ),
  },
  {
    id: "upload-token",
    title: "Upload tokens",
    preview: (
      <div className="grid gap-3">
        <div className="border-border flex min-w-0 items-center justify-between gap-3 rounded-lg border border-dashed p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">brand-tokens.css</p>
            <p className="text-muted-foreground text-xs">94 KB · mapping…</p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            58%
          </Badge>
        </div>
        <Progress aria-label="Upload" value={58} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline">
            Cancel
          </Button>
          <Button type="button" size="sm">
            Apply to playground
          </Button>
        </div>
      </div>
    ),
  },
  {
    id: "a11y-pass",
    title: "Accessibility pass",
    preview: (
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>AA</Badge>
          <Badge variant="secondary">Focus visible</Badge>
          <Badge variant="outline">Reduced motion</Badge>
        </div>
        <p className="text-muted-foreground text-sm leading-6">
          Contrast follows semantic tokens. Destructive actions use the
          destructive palette — never raw red.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm">
            Primary
          </Button>
          <Button type="button" size="sm" variant="destructive">
            Destructive
          </Button>
          <Button type="button" size="sm" variant="ghost">
            Ghost
          </Button>
        </div>
      </div>
    ),
  },
];
