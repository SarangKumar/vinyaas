import type { Metadata } from "next";
import Link from "next/link";

import { DocsArticle } from "@/components/docs-article";
import {
  companionAnimationsPath,
  companionJsonPath,
  companionPath,
} from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { pageMetadata } from "@/lib/page-metadata";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = pageMetadata({
  title: "Companion Interactions",
  description:
    "Trigger → action → animation: how Vinyaas companions react to clicks, drops, theme changes, and more.",
  path: "/companion/interactions",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";
const linkClass = `text-primary underline underline-offset-4 ${focusRing}`;

const triggerTable = `| Trigger | Typical use |
| --- | --- |
| click / double_click | Happy, jump, wake |
| idle_timeout | Idle pulse, sleep, blink |
| drag_start / drop | Pick up, fall |
| cursor_nearby | Glow, follow |
| page_navigation | Greet on route change |
| theme_change | React to light/dark toggle |
| scroll / surface_action | Glance, perched click |
| manual | Host-only / reserved |`;

export default function CompanionInteractionsPage() {
  return (
    <DocsArticle
      title="Interactions"
      description="Companions are metadata-driven. Each interaction declares a trigger, an action, and usually an animation clip."
    >
      <section className="flex flex-col gap-4">
        <h2 id="model" className={sectionHeading}>
          Model
        </h2>
        <p className={body}>
          Declared in{" "}
          <Link href={companionJsonPath} className={linkClass}>
            companion.json
          </Link>
          . The host resolves the first eligible interaction for a trigger
          (cooldowns and unlocks apply), then runs the action against the
          animation map. See{" "}
          <Link href={companionAnimationsPath} className={linkClass}>
            Animations
          </Link>{" "}
          for clip roles.
        </p>
        <CodeBlock
          language="json"
          code={`{
  "id": "theme-shift",
  "description": "Glows when the site theme changes",
  "trigger": "theme_change",
  "action": "play_animation",
  "animation": "glow",
  "cooldown": 1800,
  "duration": 2000
}`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="triggers" className={sectionHeading}>
          Triggers
        </h2>
        <div className="border-border overflow-x-auto rounded-md border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Trigger</th>
                <th className="px-3 py-2 font-medium">Typical use</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {[
                ["click / double_click", "Happy, jump, wake"],
                ["idle_timeout", "Idle pulse, sleep, blink"],
                ["drag_start / drop", "Pick up, fall → puff"],
                ["cursor_nearby", "Glow, follow cursor"],
                ["page_navigation", "Greet after docs navigation"],
                ["theme_change", "React to light/dark toggle (Nyx)"],
                ["scroll / surface_action", "Glance, perched surface click"],
                ["manual", "Reserved for host-only calls"],
              ].map(([trigger, use]) => (
                <tr key={trigger} className="border-border border-t">
                  <td className="px-3 py-2 font-mono text-xs">{trigger}</td>
                  <td className="px-3 py-2">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="sr-only">{triggerTable}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="actions" className={sectionHeading}>
          Actions
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <code>play_animation</code> — play a named clip.
          </li>
          <li>
            <code>jump</code> — physics hop, often with celebrate/happy.
          </li>
          <li>
            <code>sleep</code> / <code>change_state</code> — doze or fall.
          </li>
          <li>
            <code>move</code> — drift (follow-cursor style).
          </li>
        </ul>
        <p className={body}>
          Try them live on the{" "}
          <Link href={companionPath} className={linkClass}>
            Companions
          </Link>{" "}
          page — spawn Nyx and toggle the theme to see <code>theme_change</code>
          .
        </p>
      </section>
    </DocsArticle>
  );
}
