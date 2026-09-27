import Link from "next/link";

import {
  componentHref,
  components,
  targetComponentCount,
} from "@/components/component-meta";
import { focusRing } from "@/components/focus-ring";
import { InstallCommand } from "@/components/install-command";
import { cliCommands } from "@/components/package-managers";
import { HomeOverlays } from "@/app/home-overlays";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar/avatar";
import { Button } from "@/registry/new-york/ui/button/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox/checkbox";
import { Input } from "@/registry/new-york/ui/input/input";
import { Kbd } from "@/registry/new-york/ui/kbd/kbd";
import { Label } from "@/registry/new-york/ui/label/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/registry/new-york/ui/native-select/native-select";
import { Progress } from "@/registry/new-york/ui/progress/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york/ui/radio-group/radio-group";
import { Separator } from "@/registry/new-york/ui/separator/separator";
import { Skeleton } from "@/registry/new-york/ui/skeleton/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table/table";
import { Switch } from "@/registry/new-york/ui/switch/switch";
import { Textarea } from "@/registry/new-york/ui/textarea/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/new-york/ui/accordion/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/new-york/ui/alert/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york/ui/breadcrumb/breadcrumb";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog/dialog";
import { ScrollArea } from "@/registry/new-york/ui/scroll-area/scroll-area";

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";

const primaryLink = `bg-primary text-primary-foreground inline-flex h-9 items-center rounded-md px-4 text-sm font-medium no-underline ${focusRing}`;
const secondaryLink = `border-border bg-background text-foreground inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium no-underline ${focusRing}`;

export default function Home() {
  return (
    <article
      data-docs-article
      className="text-body mx-auto flex w-full max-w-3xl flex-col gap-16 px-6 py-14"
    >
      <header className="flex flex-col gap-4">
        <p className="text-foreground text-sm font-medium">Vinyaas</p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Accessible components, installed as source.
        </h1>
        <p className="max-w-2xl text-base leading-7">
          Vinyaas copies each component into your project. You own that source,
          style it with Tailwind, and compose native elements. There is no
          runtime package to upgrade.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/components" className={primaryLink}>
            Browse components
          </Link>
          <Link href="/installation" className={secondaryLink}>
            Installation
          </Link>
        </div>
      </header>

      <section className="flex flex-col gap-6">
        <h2 id="components" className={sectionHeading}>
          Components
        </h2>
        <p className="max-w-2xl text-base leading-7">
          Each component installs on its own. The catalog has{" "}
          {components.length} components.
        </p>
        <div className="border-border flex flex-col gap-6 rounded-md border px-6 py-8">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Save</Button>
            <Button variant="outline">Cancel</Button>
            <span className="inline-flex items-center gap-1">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/avatars/portrait.svg" alt="Sarang Kumar" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Progress
            aria-label="Components in the v0.2 catalog"
            value={components.length}
            max={targetComponentCount}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Ada Lovelace</TableCell>
                <TableCell>Writer</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <HomeOverlays />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 id="forms" className={sectionHeading}>
          Forms
        </h2>
        <p className="max-w-2xl text-base leading-7">
          v0.2 is focused on forms. Buttons and fields share one height, type
          size, border, and focus ring, so a label, an input, and a button sit
          on the same line.
        </p>
        <form className="border-border grid max-w-sm gap-4 rounded-md border px-6 py-8">
          <div className="grid gap-2">
            <Label htmlFor="home-name">Name</Label>
            <Input id="home-name" placeholder="Ada Lovelace" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="home-note">Note</Label>
            <Textarea id="home-note" rows={3} placeholder="Write a note" />
          </div>
          <fieldset className="grid gap-2">
            <legend className="text-foreground text-sm font-medium">
              Contact
            </legend>
            <RadioGroup
              defaultValue="email"
              aria-label="Contact"
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="home-email" value="email" />
                <Label htmlFor="home-email">Email</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="home-sms" value="sms" />
                <Label htmlFor="home-sms">SMS</Label>
              </div>
            </RadioGroup>
          </fieldset>
          <div className="grid gap-2">
            <Label htmlFor="home-region">Region</Label>
            <NativeSelect id="home-region" defaultValue="in">
              <NativeSelectOptGroup label="Asia">
                <NativeSelectOption value="in">India</NativeSelectOption>
              </NativeSelectOptGroup>
              <NativeSelectOption value="us">United States</NativeSelectOption>
            </NativeSelect>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="home-plan">Plan</Label>
            <NativeSelect id="home-plan" defaultValue="pro">
              <NativeSelectOption value="free">Free</NativeSelectOption>
              <NativeSelectOption value="pro">Pro</NativeSelectOption>
            </NativeSelect>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="home-alerts">Alerts</Label>
            <Switch id="home-alerts" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="home-updates" />
            <Label htmlFor="home-updates">Send updates</Label>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-6">
        <h2 id="library" className={sectionHeading}>
          Library
        </h2>
        <div className="grid gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/introduction">Docs</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Card</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Alert>
            <AlertTitle>Deployment complete</AlertTitle>
            <AlertDescription>
              Production is now running the latest build.
            </AlertDescription>
          </Alert>
          <div className="flex flex-wrap items-start gap-4">
            <Accordion type="single" collapsible className="min-w-0 flex-1">
              <AccordionItem value="what">
                <AccordionTrigger>What is Vinyaas?</AccordionTrigger>
                <AccordionContent>
                  Components you install as source.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Dialog>
              <DialogTrigger>
                <Button variant="outline">Edit profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Update your public profile.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose>Close</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="h-24" aria-label="Component names">
            <ul className="grid gap-1">
              {components.map((component) => (
                <li key={component.slug} className="text-sm">
                  {component.name}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="installation" className={sectionHeading}>
          Installation
        </h2>
        <p className="max-w-2xl text-base leading-7">
          Initialize a project, then add the component you need. The CLI writes
          the source into your repository.
        </p>
        <InstallCommand commands={cliCommands("add button")} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="browse" className={sectionHeading}>
          Browse
        </h2>
        <p className="max-w-2xl text-base leading-7">
          <Link href="/components" className={`no-underline ${focusRing}`}>
            Open the component catalog
          </Link>
          .
        </p>
        <ul className="flex flex-wrap gap-2">
          {components.map((component) => (
            <li key={component.slug}>
              <Link
                href={componentHref(component.slug)}
                className={`border-border hover:bg-muted inline-flex rounded-md border px-3 py-1.5 text-sm no-underline ${focusRing}`}
              >
                {component.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
