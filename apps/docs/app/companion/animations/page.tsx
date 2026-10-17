import type { Metadata } from "next";

import { DocsArticle } from "@/components/docs-article";
import { companionCatalog } from "@/components/companion/catalog";
import { CompanionSprite } from "@/components/companion/companion-sprite";
import { docsBodyClassName } from "@/components/docs-prose";
import { pageMetadata } from "@/lib/page-metadata";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table";

export const metadata: Metadata = pageMetadata({
  title: "Companion Animations",
  description:
    "Animation clips and interaction moves available to Vinyaas Companions, starting with Ember.",
  path: "/companion/animations",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = docsBodyClassName;

const CLIP_ROLES = [
  {
    id: "idle",
    summary:
      "Ambient loop while waiting. Fires after ~30s without interaction via idle_timeout.",
  },
  {
    id: "happy",
    summary:
      "Short reaction one-shot used by click, jump, nearby, and greet moves.",
  },
  {
    id: "blink",
    summary:
      "Quick eye-close. Occasional idle flicker once Bond 3 unlocks blink.",
  },
  {
    id: "celebrate",
    summary: "Joy burst with sparkles. Click once Bond 2 unlocks celebrate.",
  },
  {
    id: "dance",
    summary: "Side-to-side squash dance. Scroll the page (Bond 4+).",
  },
  {
    id: "surprise",
    summary: "Wide-eyed jump. Double-click (Bond 5+; after jump cools).",
  },
  {
    id: "glow",
    summary: "Brightened aura. Move the cursor nearby (Bond 4+).",
  },
  {
    id: "wiggle",
    summary:
      "Squash-and-stretch body wiggle. Click the surface it is perched on (Bond 4+).",
  },
  {
    id: "spin",
    summary: "Full rotate-in-place loop. Change docs pages (Bond 5+).",
  },
  {
    id: "sleep",
    summary:
      "Dozing loop when an idle_timeout sleep interaction wins (~30s idle, Bond 3+).",
  },
  {
    id: "fall",
    summary: "Loop while gravity runs after a non-fatal drop.",
  },
  {
    id: "cry",
    summary:
      "Tearful loop while held more than 70vh above a surface, and while falling after a fatal drop.",
  },
  {
    id: "puff",
    summary:
      "Death burst played when a fatal-height fall hits the surface beneath.",
  },
] as const;

export default function CompanionAnimationsPage() {
  const ember = companionCatalog.find((entry) => entry.meta.id === "ember");

  return (
    <DocsArticle
      title="Companion Animations"
      description="Clips and moves that drive the companion runtime. Ember is the reference species."
    >
      <section className="flex flex-col gap-4">
        <h2 id="clips" className={sectionHeading}>
          Animation clips
        </h2>
        <p className={body}>
          Each companion folder exposes clip ids under <code>animations</code>.
          The renderer picks a clip from runtime state or an interaction&apos;s{" "}
          <code>animation</code> field.
        </p>
        <Table className="min-w-[36rem]">
          <TableHeader>
            <TableRow>
              <TableHead>Clip</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Ember frames</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CLIP_ROLES.map((clip) => {
              const clipFrames =
                ember?.clips[clip.id as keyof typeof ember.clips];
              const frames = clipFrames ? clipFrames.frames.length : "—";
              return (
                <TableRow key={clip.id}>
                  <TableCell className="text-foreground align-top">
                    <code>{clip.id}</code>
                  </TableCell>
                  <TableCell className="text-muted-foreground align-top">
                    {clip.summary}
                  </TableCell>
                  <TableCell className="text-foreground align-top">
                    {frames}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {ember ? (
          <div className="flex flex-wrap items-end gap-6 pt-2">
            {CLIP_ROLES.map((clip) => {
              const frames = ember.clips[clip.id as keyof typeof ember.clips];
              if (!frames) {
                return null;
              }
              return (
                <div key={clip.id} className="flex flex-col items-center gap-2">
                  <CompanionSprite
                    name={`Ember ${clip.id}`}
                    frames={frames.frames}
                    fps={frames.fps}
                    size={72}
                  />
                  <span className="text-muted-foreground font-mono text-xs">
                    {clip.id}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="ember-moves" className={sectionHeading}>
          Ember moves (interactions)
        </h2>
        <p className={body}>
          Fully active moves are wired in the host. Locked moves unlock as Bond
          rises (localStorage). Manual-trigger moves need Bond 3+ and are still
          reserved for future UI.
        </p>
        <Table className="min-w-[40rem]">
          <TableHeader>
            <TableRow>
              <TableHead>Move</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Clip</TableHead>
              <TableHead>Host status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(ember?.meta.interactions ?? []).map((item) => {
              const active =
                item.trigger !== "manual" &&
                !["celebrate", "wake", "follow-cursor"].includes(item.id);
              return (
                <TableRow key={item.id}>
                  <TableCell className="text-foreground align-top">
                    <code>{item.id}</code>
                    <div className="text-muted-foreground mt-0.5 text-xs">
                      {item.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground align-top">
                    <code>{item.trigger}</code>
                  </TableCell>
                  <TableCell className="text-foreground align-top">
                    <code>{item.action}</code>
                  </TableCell>
                  <TableCell className="text-foreground align-top">
                    <code>{item.animation ?? "—"}</code>
                  </TableCell>
                  <TableCell className="text-muted-foreground align-top">
                    {active ? "Active" : "Defined / gated"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="lifecycle" className={sectionHeading}>
          Motion lifecycle
        </h2>
        <ol className={`${body} list-decimal space-y-2 pl-5`}>
          <li>Spawn from a companion card (one instance per type).</li>
          <li>
            Drag onto a surface. Hold more than 70vh above the surface beneath
            and it <code>cry</code>s while you still hold it; release and it
            keeps crying through the fall, then <code>puff</code>s on impact.
            While perched, the companion scrolls with its box and falls when
            that surface hits the top of the viewport.
          </li>
          <li>
            After ~30 seconds without interaction, <code>idle_timeout</code> may
            sleep or flicker.
          </li>
          <li>
            Double-click plays a eased jump using the <code>happy</code> clip.
          </li>
        </ol>
      </section>
    </DocsArticle>
  );
}
