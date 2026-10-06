import type { Metadata } from "next";

import { DocsArticle } from "@/components/docs-article";
import { companionCatalog } from "@/components/companion/catalog";
import { CompanionSprite } from "@/components/companion/companion-sprite";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Companion Animations",
  description:
    "Animation clips and interaction moves available to Vinyaas Companions, starting with Ember.",
  path: "/companion/animations",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";

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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="py-2 pr-3 font-medium">Clip</th>
                <th className="py-2 pr-3 font-medium">Role</th>
                <th className="py-2 font-medium">Ember frames</th>
              </tr>
            </thead>
            <tbody>
              {CLIP_ROLES.map((clip) => {
                const clipFrames =
                  ember?.clips[clip.id as keyof typeof ember.clips];
                const frames = clipFrames ? clipFrames.frames.length : "—";
                return (
                  <tr key={clip.id} className="border-border border-b">
                    <td className="py-3 pr-3 align-top">
                      <code>{clip.id}</code>
                    </td>
                    <td className="text-muted-foreground py-3 pr-3 align-top">
                      {clip.summary}
                    </td>
                    <td className="py-3 align-top">{frames}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="py-2 pr-3 font-medium">Move</th>
                <th className="py-2 pr-3 font-medium">Trigger</th>
                <th className="py-2 pr-3 font-medium">Action</th>
                <th className="py-2 pr-3 font-medium">Clip</th>
                <th className="py-2 font-medium">Host status</th>
              </tr>
            </thead>
            <tbody>
              {(ember?.meta.interactions ?? []).map((item) => {
                const active =
                  item.trigger !== "manual" &&
                  !["celebrate", "wake", "follow-cursor"].includes(item.id);
                return (
                  <tr key={item.id} className="border-border border-b">
                    <td className="py-3 pr-3 align-top">
                      <code>{item.id}</code>
                      <div className="text-muted-foreground mt-0.5 text-xs">
                        {item.description}
                      </div>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      <code>{item.trigger}</code>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      <code>{item.action}</code>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      <code>{item.animation ?? "—"}</code>
                    </td>
                    <td className="py-3 align-top">
                      {active ? "Active" : "Defined / gated"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
